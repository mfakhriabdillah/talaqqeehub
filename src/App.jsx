import React, { useState, useEffect } from 'react';
import { DEFAULT_SESSIONS, ALL_SURAHS } from './data/mockData';
import AuthView from './components/AuthView';
import StudentLayout from './components/StudentLayout';
import TeacherLayout from './components/TeacherLayout';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import MushafEvaluation from './components/MushafEvaluation';
import { ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';

// Helper mapper to transform Supabase DB bookings to UI session objects
const mapDbBookingToSession = (booking, userRole, profilesMap = {}) => {
  let dateStr = "2026-05-20";
  let timeStr = "10:00";
  try {
    if (booking.schedule_time) {
      const d = new Date(booking.schedule_time);
      dateStr = d.toISOString().split('T')[0];
      timeStr = d.toISOString().split('T')[1].substring(0, 5);
    }
  } catch (e) {
    console.error("Error parsing schedule_time:", e);
  }

  // Restructure to read new integer columns (surah_number, start_ayah, end_ayah)
  let surahStr = "Al-Fatihah";
  let ayahStr = "1-7";

  if (booking.surah_number !== undefined && booking.surah_number !== null) {
    const sName = ALL_SURAHS[booking.surah_number - 1];
    surahStr = sName ? `${sName} (Surah #${booking.surah_number})` : `Surah #${booking.surah_number}`;
  } else if (booking.surah_range) {
    const match = booking.surah_range.match(/^([^(]+)\s*\(([^)]+)\)$/);
    if (match) {
      surahStr = match[1].trim();
    } else {
      surahStr = booking.surah_range;
    }
  }

  if (booking.start_ayah !== undefined && booking.start_ayah !== null && booking.end_ayah !== undefined && booking.end_ayah !== null) {
    ayahStr = `${booking.start_ayah}-${booking.end_ayah}`;
  } else if (booking.surah_range) {
    const match = booking.surah_range.match(/^([^(]+)\s*\(([^)]+)\)$/);
    if (match) {
      ayahStr = match[2].trim();
    }
  }

  const studentProfile = profilesMap[booking.student_id];
  const teacherProfile = profilesMap[booking.teacher_id];
  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Pending';

  return {
    id: booking.id,
    studentId: booking.student_id,
    studentName: studentProfile?.full_name || booking.student?.full_name || "Student Ahmad",
    studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    ustadzId: booking.teacher_id,
    ustadzName: teacherProfile?.full_name || booking.teacher?.full_name || "Ustadz Abdul Somad",
    date: dateStr,
    time: timeStr,
    surah: surahStr,
    ayahRange: ayahStr,
    status: capitalize(booking.status),
    notes: booking.notes || '',
    evaluation: booking.evaluation || null
  };
};

export default function App() {
  const { user, profile, loading, signOut } = useAuth();
  const [currentView, setView] = useState('dashboard');
  const [sessions, setSessions] = useState([]);
  const [activeSessionForEval, setActiveSessionForEval] = useState(null);

  // Supabase real bookings state
  const [realBookings, setRealBookings] = useState([]);
  const [profilesMap, setProfilesMap] = useState({});

  // Real-time bookings loader
  const loadBookings = async () => {
    if (!user || !profile) return;
    try {
      const isStudent = profile.role === 'student';
      let query = supabase.from('bookings').select('*');
      
      if (isStudent) {
        query = query.eq('student_id', user.id);
      } else {
        query = query.eq('teacher_id', user.id);
      }

      const { data: bookingsData, error: bookingsError } = await query.order('created_at', { ascending: false });
      if (bookingsError) throw bookingsError;

      if (bookingsData && bookingsData.length > 0) {
        // Gathering student and teacher profile details programmatically (Dual-strategy fallback)
        const userIds = [...new Set(bookingsData.flatMap(b => [b.student_id, b.teacher_id]))];
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, role')
          .in('id', userIds);

        if (!usersError && usersData) {
          const newMap = {};
          usersData.forEach(u => {
            newMap[u.id] = u;
          });
          setProfilesMap(prev => ({ ...prev, ...newMap }));
        }
        setRealBookings(bookingsData);
      } else {
        setRealBookings([]);
      }
    } catch (err) {
      console.error("Error loading real bookings from Supabase:", err);
    }
  };

  // Trigger bookings load on auth/profile changes
  useEffect(() => {
    if (user && profile) {
      loadBookings();
    } else {
      setRealBookings([]);
    }
  }, [user, profile]);

  // Combine real database bookings with local fallback mock sessions
  const mappedRealSessions = realBookings.map(b => mapDbBookingToSession(b, profile?.role, profilesMap));
  const combinedSessions = [...mappedRealSessions, ...sessions.filter(ds => {
    // Filter out mock sessions that share active IDs
    return !realBookings.some(rb => rb.id === ds.id);
  })];

  // Authentication Handlers
  const handleLogout = async () => {
    await signOut();
    setView('dashboard');
    setActiveSessionForEval(null);
  };

  // Session State Modifiers
  const handleAddSession = () => {
    loadBookings();
  };

  const handleAcceptSession = async (sessionId) => {
    const isRealDbBooking = typeof sessionId === 'string' && sessionId.length > 20;
    if (isRealDbBooking) {
      try {
        // Query student_id before update
        const { data: bookingData } = await supabase
          .from('bookings')
          .select('student_id')
          .eq('id', sessionId)
          .single();

        const { error } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', sessionId);
        if (error) throw error;

        // Action B: Notify student of booking confirmation
        if (bookingData?.student_id) {
          const teacherName = profile?.full_name || user.user_metadata?.full_name || user.email;
          await supabase
            .from('notifications')
            .insert({
              user_id: bookingData.student_id,
              title: "Booking Confirmed!",
              message: `Your Talaqqi session request has been accepted by ${teacherName}`
            });
        }

        await loadBookings();
      } catch (err) {
        console.error("Error accepting booking:", err);
      }
    } else {
      // Fallback for mock session
      setSessions(prev => 
        prev.map(sess => 
          sess.id === sessionId ? { ...sess, status: 'Confirmed' } : sess
        )
      );
    }
  };

  const handleDeclineSession = async (sessionId) => {
    const isRealDbBooking = typeof sessionId === 'string' && sessionId.length > 20;
    if (isRealDbBooking) {
      try {
        // Query student_id before update
        const { data: bookingData } = await supabase
          .from('bookings')
          .select('student_id')
          .eq('id', sessionId)
          .single();

        const { error } = await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', sessionId);
        if (error) throw error;

        // Action C: Notify student of booking cancellation
        if (bookingData?.student_id) {
          const teacherName = profile?.full_name || user.user_metadata?.full_name || user.email;
          await supabase
            .from('notifications')
            .insert({
              user_id: bookingData.student_id,
              title: "Booking Cancelled",
              message: `Your Talaqqi session request was declined or cancelled by ${teacherName}`
            });
        }

        await loadBookings();
      } catch (err) {
        console.error("Error declining booking:", err);
      }
    } else {
      // Fallback for mock session
      setSessions(prev => 
        prev.map(sess => 
          sess.id === sessionId ? { ...sess, status: 'Cancelled' } : sess
        )
      );
    }
  };

  const handleStartEvaluation = (session) => {
    setActiveSessionForEval(session);
    setView('mushaf-evaluation');
  };

  const handleSubmitEvaluation = (sessionId, evaluationData) => {
    loadBookings();
    setSessions(prev => 
      prev.map(sess => 
        sess.id === sessionId 
          ? { ...sess, status: 'Completed', evaluation: evaluationData } 
          : sess
      )
    );
    setActiveSessionForEval(null);
    setView('dashboard');
  };

  // 1. Session Loading Spinner View
  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
          <span className="absolute text-2xl animate-pulse">🕌</span>
        </div>
        <div className="text-center space-y-1.5 animate-fadeIn">
          <h2 className="text-lg font-extrabold tracking-tight text-white m-0 animate-pulse">TalaqqeeHub</h2>
          <p className="text-xs text-emerald-300/80 font-bold m-0 uppercase tracking-widest leading-none">Connecting Secure Session</p>
        </div>
      </div>
    );
  }

  // 2. Authentication Check
  if (!user) {
    return <AuthView />;
  }

  // Map Auth User and Profile to Layout format
  const activeUser = {
    id: user.id,
    name: profile?.full_name || user.user_metadata?.full_name || user.email,
    email: user.email,
    avatar: profile?.role === 'student' 
      ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: profile?.role
  };

  const isStudent = activeUser.role === 'student';
  const isTeacher = activeUser.role === 'teacher';

  const studentAllowedRoutes = ['dashboard', 'book-session'];
  const teacherAllowedRoutes = ['dashboard', 'mushaf-evaluation'];

  const isAccessDenied = 
    (isStudent && !studentAllowedRoutes.includes(currentView)) ||
    (isTeacher && !teacherAllowedRoutes.includes(currentView));

  // Access Denied Fallback UI
  if (isAccessDenied) {
    const LayoutWrapper = isStudent ? StudentLayout : TeacherLayout;
    return (
      <LayoutWrapper user={activeUser} currentView={currentView} setView={setView} onLogout={handleLogout}>
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-rose-100 rounded-3xl p-8 text-center shadow-xl space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center text-rose-600 mx-auto shadow-inner">
              <ShieldAlert size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800 m-0">Access Restrained</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-rose-50 text-rose-700 px-3 py-1 rounded-full border border-rose-100/50 inline-block mt-1">
                Route Guard Triggered
              </span>
              <p className="text-xs text-slate-400 font-semibold mt-3 max-w-sm mx-auto leading-relaxed">
                Your authenticated account (Role: <span className="text-slate-700 font-bold capitalize">{activeUser.role}</span>) does not possess clearance to view the requested page (<span className="text-slate-700 font-bold font-mono">"{currentView}"</span>).
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => setView('dashboard')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ArrowLeft size={14} />
                Return to Dashboard
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  // 3. Render Student Dashboard with StudentLayout
  if (isStudent) {
    return (
      <StudentLayout user={activeUser} currentView={currentView} setView={setView} onLogout={handleLogout}>
        {currentView === 'dashboard' && (
          <StudentDashboard 
            sessions={combinedSessions} 
            onAddSession={handleAddSession} 
            subView="dashboard"
            setView={setView}
          />
        )}
        {currentView === 'book-session' && (
          <StudentDashboard 
            sessions={combinedSessions} 
            onAddSession={handleAddSession} 
            subView="book"
            setView={setView}
          />
        )}
      </StudentLayout>
    );
  }

  // 4. Render Teacher Dashboard with TeacherLayout
  if (isTeacher) {
    return (
      <TeacherLayout user={activeUser} currentView={currentView} setView={setView} onLogout={handleLogout}>
        {currentView === 'dashboard' && (
          <TeacherDashboard 
            sessions={combinedSessions} 
            onAcceptSession={handleAcceptSession}
            onDeclineSession={handleDeclineSession}
            onStartEvaluation={handleStartEvaluation}
          />
        )}
        {currentView === 'mushaf-evaluation' && (
          <MushafEvaluation 
            activeSession={activeSessionForEval} 
            onSubmitEvaluation={handleSubmitEvaluation}
            onCancel={() => setView('dashboard')}
          />
        )}
      </TeacherLayout>
    );
  }

  return null;
}
