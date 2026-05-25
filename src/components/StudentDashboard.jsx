import React, { useState, useEffect } from 'react';
import { USTADZ_LIST, SURAH_LIST, MOCK_QURAN_TEXT, ALL_SURAHS } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  User, 
  BookOpen, 
  Clock, 
  Award, 
  Layers, 
  CheckCircle2, 
  PlusCircle,
  X,
  MessageSquare,
  AlertTriangle,
  XCircle,
  Bookmark
} from 'lucide-react';

const SuraAyahsMap = {
  1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
  11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111, 18: 110, 19: 98, 20: 135,
  21: 112, 22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88, 29: 69, 30: 60,
  31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85,
  41: 54, 42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18, 50: 45,
  51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29, 58: 22, 59: 24, 60: 13,
  61: 14, 62: 11, 63: 11, 64: 18, 65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44,
  71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42,
  81: 29, 82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20,
  91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11,
  101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3,
  111: 3, 112: 4, 113: 5, 114: 6
};

export default function StudentDashboard({ sessions, onAddSession, subView = 'dashboard', setView }) {
  const { user, profile } = useAuth();
  
  const todayDateStr = new Date().toISOString().split('T')[0];
  
  // Booking Form State
  const [ustadzId, setUstadzId] = useState('');
  const [date, setDate] = useState(todayDateStr);
  const [time, setTime] = useState('10:00');
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahStart, setAyahStart] = useState('1');
  const [ayahEnd, setAyahEnd] = useState('7');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Surah Ayah counts mapping and Dynamic toast state
  const [surahAyahCounts, setSurahAyahCounts] = useState(SuraAyahsMap);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  // Clear toast dynamically or auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Dynamically fetch Surah metadata on mount
  useEffect(() => {
    let active = true;
    const fetchSurahMetadata = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        if (response.ok) {
          const json = await response.json();
          if (json.code === 200 && json.data && active) {
            const counts = {};
            json.data.forEach(s => {
              counts[s.number] = s.numberOfAyahs;
            });
            setSurahAyahCounts(counts);
          }
        }
      } catch (err) {
        console.error("API fetch failed, falling back to local SuraAyahsMap:", err);
      }
    };

    fetchSurahMetadata();
    return () => {
      active = false;
    };
  }, []);

  // Handle selected Surah change: auto cap or reset Ayah inputs to match selected Surah bounds
  useEffect(() => {
    const maxAyahs = surahAyahCounts[surahNumber] || 7;
    const currentStart = parseInt(ayahStart, 10);
    const currentEnd = parseInt(ayahEnd, 10);

    if (isNaN(currentStart) || currentStart > maxAyahs || currentStart < 1) {
      setAyahStart('1');
    }
    if (isNaN(currentEnd) || currentEnd > maxAyahs || currentEnd < 1) {
      setAyahEnd(String(maxAyahs));
    }
  }, [surahNumber, surahAyahCounts]);

  // Dynamically loaded teachers list
  const [teachers, setTeachers] = useState([]);

  // Fetch teachers from Supabase public.users on mount
  useEffect(() => {
    let mounted = true;
    const fetchTeachers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, specialty')
          .eq('role', 'teacher');
        
        if (error) throw error;
        
        if (mounted) {
          if (data && data.length > 0) {
            setTeachers(data);
            setUstadzId(data[0].id);
          } else {
            // Fallback to mock list if no teachers in DB yet
            const formattedMock = USTADZ_LIST.map(u => ({
              id: u.id,
              full_name: u.name,
              specialty: u.specialty
            }));
            setTeachers(formattedMock);
            setUstadzId(formattedMock[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading teachers:", err);
        if (mounted) {
          // Robust graceful fallback
          const formattedMock = USTADZ_LIST.map(u => ({
            id: u.id,
            full_name: u.name,
            specialty: u.specialty
          }));
          setTeachers(formattedMock);
          setUstadzId(formattedMock[0].id);
        }
      }
    };

    fetchTeachers();
    return () => {
      mounted = false;
    };
  }, []);

  // Review Modal State
  const [selectedCompletedSession, setSelectedCompletedSession] = useState(null);
  const [modalSelectedWord, setModalSelectedWord] = useState(null);

  // Completed History & Modal API Integration States
  const [realCompletedSessions, setRealCompletedSessions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [modalQuranWords, setModalQuranWords] = useState([]);
  const [modalLoadingWords, setModalLoadingWords] = useState(false);

  // 1. Fetch completed session history joined with teacher profile and session_notes
  const fetchCompletedHistory = async () => {
    if (!user) return;
    try {
      setLoadingHistory(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, 
          schedule_time, 
          surah_number, 
          start_ayah, 
          end_ayah, 
          status, 
          notes,
          teacher:users!bookings_teacher_id_fkey(full_name), 
          session_notes(feedback, mistake_words)
        `)
        .eq('student_id', user.id)
        .eq('status', 'completed')
        .order('schedule_time', { ascending: false });

      if (error) throw error;
      setRealCompletedSessions(data || []);
    } catch (err) {
      console.error("Failed to load completed sessions history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchCompletedHistory();
  }, [user, sessions]);

  // 2. Dynamic Quran API Fetch when Modal triggers
  useEffect(() => {
    let active = true;
    const fetchModalQuranText = async () => {
      if (!selectedCompletedSession || !selectedCompletedSession.surah_number) {
        setModalQuranWords([]);
        return;
      }

      // Handle mock fallback
      if (selectedCompletedSession.id === 'mock-booking-id' || typeof selectedCompletedSession.surah_number !== 'number') {
        const mockWords = MOCK_QURAN_TEXT.words.map((w, idx) => ({
          id: `1-${idx}`,
          text: w.text,
          ayah: w.ayah,
          transliteration: w.transliteration,
          translation: w.translation
        }));
        setModalQuranWords(mockWords);
        return;
      }

      try {
        setModalLoadingWords(true);
        const surahNum = selectedCompletedSession.surah_number;
        const startA = selectedCompletedSession.start_ayah || 1;
        const endA = selectedCompletedSession.end_ayah || 7;

        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`);
        if (!response.ok) throw new Error("Failed to fetch Quranic verses");
        const json = await response.json();

        if (json.code === 200 && json.data?.ayahs) {
          const ayahs = json.data.ayahs;
          const filtered = ayahs.filter(a => a.numberInSurah >= startA && a.numberInSurah <= endA);

          const surahName = ALL_SURAHS[surahNum - 1] || `Surah #${surahNum}`;

          const tokenizedWords = [];
          filtered.forEach(ayah => {
            let cleanedText = ayah.text;
            if (surahNum !== 1 && surahNum !== 9 && cleanedText.startsWith("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")) {
              cleanedText = cleanedText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "").trim();
            }

            const words = cleanedText.split(/\s+/);
            words.forEach((wordStr, wordIdx) => {
              if (wordStr.trim() !== '') {
                tokenizedWords.push({
                  id: `${ayah.numberInSurah}-${wordIdx}`,
                  text: wordStr,
                  ayah: ayah.numberInSurah,
                  wordIndex: wordIdx,
                  transliteration: `Ayah ${ayah.numberInSurah}, Word ${wordIdx + 1}`,
                  translation: `Recitation element from Surah ${surahName}`
                });
              }
            });
          });

          if (active) {
            setModalQuranWords(tokenizedWords);
          }
        }
      } catch (err) {
        console.error("Modal Quran fetch failed:", err);
      } finally {
        if (active) {
          setModalLoadingWords(false);
        }
      }
    };

    fetchModalQuranText();
    return () => {
      active = false;
    };
  }, [selectedCompletedSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage("You must be authenticated to request a booking.");
      return;
    }
    if (!ustadzId) {
      setErrorMessage("Please select a teacher/ustadz.");
      return;
    }

    // Dynamic Validation Check
    const start = parseInt(ayahStart, 10);
    const end = parseInt(ayahEnd, 10);
    const maxAyahs = surahAyahCounts[surahNumber] || 7;

    if (isNaN(start) || start <= 0) {
      const msg = "Start Ayah must be a positive number greater than 0.";
      setErrorMessage(msg);
      showToast(msg, "error");
      return;
    }
    if (isNaN(end) || end > maxAyahs) {
      const msg = `End Ayah cannot exceed the maximum of ${maxAyahs} Ayahs for the selected Surah.`;
      setErrorMessage(msg);
      showToast(msg, "error");
      return;
    }
    if (start > end) {
      const msg = "Start Ayah must be less than or equal to End Ayah.";
      setErrorMessage(msg);
      showToast(msg, "error");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setIsSuccess(false);

    try {
      const scheduleTime = `${date}T${time}:00Z`;
      // 3. Insert into public.bookings
      const { error } = await supabase
        .from('bookings')
        .insert({
          student_id: user.id,
          teacher_id: ustadzId,
          schedule_time: scheduleTime,
          surah_number: parseInt(surahNumber, 10),
          start_ayah: parseInt(ayahStart, 10),
          end_ayah: parseInt(ayahEnd, 10),
          status: 'pending',
          notes: notes
        });

      if (error) throw error;

      // Action A: Notify teacher of new booking request
      try {
        const studentName = profile?.full_name || user.user_metadata?.full_name || user.email.split('@')[0];
        await supabase
          .from('notifications')
          .insert({
            user_id: ustadzId,
            title: "New Booking Request",
            message: `${studentName} has requested a Talaqqi session for Surah #${surahNumber}`
          });
      } catch (notifErr) {
        console.error("Failed to trigger booking notification:", notifErr);
      }

      // 4. Form Success & Reset
      setIsSuccess(true);
      setNotes('');
      showToast("Talaqqi recitation booking requested successfully!", "success");
      
      // Auto-refresh layout sessions
      if (onAddSession) {
        onAddSession();
      }

      // Auto reset success message
      setTimeout(() => {
        setIsSuccess(false);
      }, 4000);

    } catch (err) {
      console.error("Booking submission failed:", err);
      setErrorMessage(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter student sessions dynamically (strictly matches real user ID)
  const studentSessions = sessions.filter(s => s.studentId === user?.id);

  // Stats computation dynamically calculated from student's fetched real sessions
  const completedSessions = studentSessions.filter(s => s.status?.toLowerCase() === 'completed').length;
  const pendingSessions = studentSessions.filter(s => s.status?.toLowerCase() === 'pending').length;
  const totalQuranHours = completedSessions > 0 ? (completedSessions * 0.5).toFixed(1) : "0.0";
  const activeGoal = "Al-Mulk Memorization";

  // Sub-view Renders
  const isDashboardView = subView === 'dashboard';
  const isBookView = subView === 'book';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-emerald-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-700/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 via-emerald-600 to-emerald-900 opacity-90"></div>
        <div className="relative z-10 space-y-2 animate-fadeIn">
          <span className="bg-emerald-500/30 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Assalamu'alaikum
          </span>
          <h1 className="text-3xl font-extrabold m-0 text-white leading-tight">
            {profile?.full_name || user?.user_metadata?.full_name || "Ahmad Fauzi"}
          </h1>
          <p className="text-emerald-100 max-w-xl text-sm font-medium">
            "The best of you are those who learn the Qur'an and teach it." Let's continue your recitation journey today.
          </p>
        </div>
      </div>

      {/* 1. MY DASHBOARD ROUTE */}
      {isDashboardView && (
        <div className="space-y-8">
          {/* Stats Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:translate-y-[-2px] hover:shadow-md">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <BookOpen size={24} />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Total Quran Hours</span>
                <span className="text-xl font-bold text-slate-800">{totalQuranHours} hrs</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:translate-y-[-2px] hover:shadow-md">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Completed Talaqqi</span>
                <span className="text-xl font-bold text-slate-800">{completedSessions} sessions</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:translate-y-[-2px] hover:shadow-md">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <Clock size={24} />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Awaiting Action</span>
                <span className="text-xl font-bold text-slate-800">{pendingSessions} pending</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:translate-y-[-2px] hover:shadow-md">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Award size={24} />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Active Objective</span>
                <span className="text-sm font-bold text-slate-800 truncate block max-w-[140px]">{activeGoal}</span>
              </div>
            </div>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Recitation Sessions Schedule */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 m-0">Recitation Sessions Schedule</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Click completed cards to review teacher marks and word-by-word audits.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full w-max whitespace-nowrap">
                      {studentSessions.length} Sessions total
                    </span>
                    <button 
                      onClick={() => setView && setView('book-session')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/25 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>+ Book New Session</span>
                    </button>
                  </div>
                </div>

                {/* Session Card List */}
                <div className="space-y-4">
                  {studentSessions.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-400 space-y-3">
                      <span className="text-4xl block">📖</span>
                      <p className="text-sm font-bold text-slate-800 m-0">You don't have any recitation sessions yet.</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Click the "Book New Session" button above to schedule your first recitation with an Ustadz.
                      </p>
                    </div>
                  ) : (
                    studentSessions.map((sess) => {
                    const ustadzObj = USTADZ_LIST.find(u => u.name === sess.ustadzName);
                    const isPending = sess.status === 'Pending';
                    const isConfirmed = sess.status === 'Confirmed';
                    const isCompleted = sess.status === 'Completed';
                    const isCancelled = sess.status === 'Cancelled' || sess.status === 'cancelled';

                    return (
                      <div 
                        key={sess.id}
                        onClick={() => {
                          if (isCompleted) {
                            const realDetail = realCompletedSessions.find(r => r.id === sess.id);
                            setSelectedCompletedSession(realDetail || sess);
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isCompleted 
                            ? 'bg-emerald-50/10 border-slate-100 hover:bg-white hover:shadow-lg hover:border-emerald-400 hover:ring-4 hover:ring-emerald-500/5 cursor-pointer group' 
                            : 'bg-slate-50/50 border-slate-100'
                        }`}
                      >
                        {/* Avatar & Schedule Info */}
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={ustadzObj?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"}
                            alt={sess.ustadzName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                          />
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-slate-800 m-0 leading-tight group-hover:text-emerald-700 transition-colors">
                              {sess.ustadzName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400 font-semibold">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {sess.date}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {sess.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-lg w-max mt-1">
                              <BookOpen size={12} />
                              <span>Reciting: {sess.surah} (Ayahs {sess.ayahRange})</span>
                            </div>
                          </div>
                        </div>

                        {/* Status badges */}
                        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                          {isPending && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-amber-200">
                              Awaiting Approval
                            </span>
                          )}
                          {isConfirmed && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-emerald-200">
                              Confirmed Schedule
                            </span>
                          )}
                          {isCancelled && (
                            <span className="bg-rose-50 text-rose-600 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-rose-200">
                              DECLINED
                            </span>
                          )}
                          {isCompleted && (
                            <div className="flex flex-col items-end gap-1 text-right">
                              <span className="bg-blue-600 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-blue-700 shadow-sm shadow-blue-500/10 group-hover:bg-blue-700">
                                Completed & Evaluated
                              </span>
                              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1 group-hover:underline mt-0.5">
                                🔍 Click to view audit report
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                </div>
              </div>
            </div>

            {/* Right Column: Active Objectives */}
            <div className="lg:col-span-1 space-y-6">
              {/* Objective Banner */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider block m-0">My Memorization Goal</h4>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Assigned by Ustadz Hanan</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-xl flex items-center justify-center font-bold">
                      🏆
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-800 m-0">{activeGoal}</h5>
                      <span className="text-xs text-slate-400 font-semibold">Surah Al-Mulk (Ayah 1 to 30)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">Memorization Progress</span>
                      <span className="text-emerald-600">33%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-1/3"></div>
                    </div>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-500 bg-emerald-50/30 border border-emerald-100/30 p-3 rounded-2xl">
                  📚 <span className="font-bold text-slate-700">Next milestone</span>: Memorize Ayahs 11-20 by Friday, May 22nd. Focus on holding Ghunnah beats.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BOOK A SESSION ROUTE */}
      {isBookView && (
        <div className="max-w-2xl mx-auto animate-scaleUp">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 m-0">Book a Talaqqi Recitation</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Schedule a live recitation check with a qualified Ustadz</p>
            </div>

            {isSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Recitation booking requested successfully! You can track this under My Dashboard.</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <XCircle size={16} className="text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Ustadz selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Select Ustadz / Ustadzah</label>
                <select
                  value={ustadzId}
                  onChange={(e) => setUstadzId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  disabled={isSubmitting}
                >
                  {teachers.length === 0 ? (
                    <option value="" disabled>Loading Teachers...</option>
                  ) : (
                    teachers.map((ustadz) => (
                      <option key={ustadz.id} value={ustadz.id}>
                        {ustadz.full_name || ustadz.name} {ustadz.specialty ? `(${ustadz.specialty.split(' ')[0]})` : ''}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Pick Date</label>
                  <input
                    type="date"
                    required
                    min={todayDateStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Pick Time</label>
                  <input
                    type="time"
                    required
                    step="900"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Surah Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Select Surah</label>
                <select
                  value={surahNumber}
                  onChange={(e) => setSurahNumber(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  disabled={isSubmitting}
                >
                  {ALL_SURAHS.map((sName, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {idx + 1}. {sName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ayah inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">From Ayah</label>
                  <input
                    type="number"
                    min="1"
                    max={surahAyahCounts[surahNumber] || 7}
                    placeholder="Min: 1"
                    required
                    value={ayahStart}
                    onChange={(e) => setAyahStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">To Ayah</label>
                  <input
                    type="number"
                    min="1"
                    max={surahAyahCounts[surahNumber] || 7}
                    placeholder={`Max: ${surahAyahCounts[surahNumber] || 7}`}
                    required
                    value={ayahEnd}
                    onChange={(e) => setAyahEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Recitation Target / Notes</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Practicing Madd Tabee'ee and Ghunnah extensions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-600/25 active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <PlusCircle size={16} />
                Submit Talaqqi Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. INTERACTIVE RECITATION REVIEW MODAL */}
      {selectedCompletedSession && (() => {
        // Parse date and time from schedule_time or fallback
        let modalDate = selectedCompletedSession.date || '';
        let modalTime = selectedCompletedSession.time || '';
        if (selectedCompletedSession.schedule_time) {
          const dObj = new Date(selectedCompletedSession.schedule_time);
          modalDate = dObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          modalTime = dObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }

        // Parse Teacher profile name
        const teacherName = selectedCompletedSession.teacher?.full_name || selectedCompletedSession.ustadzName || 'Ustadz Abdul Somad';

        // Parse Surah target name
        const targetSurah = selectedCompletedSession.surah_number
          ? (ALL_SURAHS[selectedCompletedSession.surah_number - 1] || `Surah #${selectedCompletedSession.surah_number}`)
          : (selectedCompletedSession.surah || 'Al-Fatihah');

        // Verse range bounds
        const targetRange = selectedCompletedSession.surah_number
          ? `${selectedCompletedSession.start_ayah || 1} - ${selectedCompletedSession.end_ayah || 7}`
          : (selectedCompletedSession.ayahRange || '1-7');

        // Joined mistake coordinate arrays
        const mistakeWordsCoordinates = selectedCompletedSession.session_notes?.[0]?.mistake_words || [];

        // Dynamic advice comments
        const teacherAdvice = selectedCompletedSession.session_notes?.[0]?.feedback || selectedCompletedSession.evaluation?.feedback || "Alhamdulillah, recitation session completed successfully.";

        // Group modal words by Ayah number
        const modalAyahsMap = {};
        modalQuranWords.forEach(word => {
          if (!modalAyahsMap[word.ayah]) {
            modalAyahsMap[word.ayah] = [];
          }
          modalAyahsMap[word.ayah].push(word);
        });

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-100 shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative animate-scaleUp">
              {/* Close Button */}
              <button 
                onClick={() => {
                  setSelectedCompletedSession(null);
                  setModalSelectedWord(null);
                }}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div>
                <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50 inline-block">
                  Recitation Assessment Report
                </span>
                <h2 className="text-xl font-black text-slate-800 m-0 leading-snug mt-2">
                  Audit Feedback: Surah {targetSurah}
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Conducted with <span className="text-slate-600 font-bold">{teacherName}</span> on {modalDate} at {modalTime}.
                </p>
                <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100/50 px-2.5 py-0.5 rounded-lg w-max mt-2">
                  Target Range: Ayahs {targetRange}
                </div>
              </div>

              {/* Error Counter Badges */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-rose-50 border border-rose-100 px-4 py-3 rounded-2xl flex items-center gap-3">
                  <div className="p-2.5 bg-rose-500 rounded-xl text-white">
                    <XCircle size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block leading-none">Flagged Errors</span>
                    <span className="text-lg font-bold text-rose-700 leading-none mt-1 inline-block">
                      {mistakeWordsCoordinates.length || selectedCompletedSession.evaluation?.minorErrors || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quran Word Map Board */}
              <div className="bg-emerald-50/20 border border-emerald-100/40 rounded-3xl shadow-sm p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="flex justify-center mb-6">
                  <div className="border border-emerald-600/10 rounded-full px-5 py-1 bg-emerald-50 text-emerald-800 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <Bookmark size={10} className="fill-emerald-800" />
                    <span>Interactive Mushaf Word Board</span>
                  </div>
                </div>

                {modalLoadingWords ? (
                  <div className="flex flex-col items-center justify-center p-8 space-y-2">
                    <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Loading Quran text...</span>
                  </div>
                ) : (
                  /* Arabic word container */
                  <div 
                    className="quran-text text-right text-2xl md:text-3xl leading-[2] md:leading-[2.3] flex flex-col gap-6 select-none p-4 max-w-xl mx-auto border border-emerald-800/10 rounded-2xl bg-white shadow-inner"
                    style={{ direction: 'rtl' }}
                  >
                    {Object.keys(modalAyahsMap).sort((a, b) => Number(a) - Number(b)).map((ayahNum) => (
                      <div 
                        key={ayahNum}
                        className="flex flex-wrap gap-x-4 gap-y-3 justify-start pb-3 border-b border-emerald-800/5 last:border-0 last:pb-0"
                      >
                        {modalAyahsMap[ayahNum].map((word) => {
                          const isMistake = mistakeWordsCoordinates.includes(word.id);
                          const bgStyle = isMistake
                            ? "bg-red-200 text-red-900 rounded-md border-red-300 font-bold shadow-sm shadow-red-500/10 transition-colors"
                            : "hover:bg-slate-50 text-slate-800 border-slate-200/10 hover:border-slate-200";

                          return (
                            <span 
                              key={word.id}
                              onClick={() => setModalSelectedWord(word)}
                              className={`px-2.5 py-1 border rounded-lg cursor-pointer transition-all inline-block text-center hover:scale-[1.05] active:scale-[0.95] ${bgStyle}`}
                            >
                              {word.text}
                            </span>
                          );
                        })}
                        {/* Premium Ayah End Ornament Indicator */}
                        <span className="text-emerald-700/50 font-serif font-extrabold text-xl self-center px-1.5 select-none">
                          ﴿{ayahNum}﴾
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-center text-[10px] text-slate-400 font-semibold mt-4">
                  💡 Tip: Click on any word in the Quran board above to inspect translation and pronunciation guide.
                </p>
              </div>

              {/* Word details inspector inside modal */}
              {modalSelectedWord && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 animate-fadeIn relative">
                  <button 
                    onClick={() => setModalSelectedWord(null)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="quran-text text-2xl font-bold text-emerald-800 leading-none">{modalSelectedWord.text}</span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 m-0">{modalSelectedWord.transliteration}</h5>
                      <span className="text-[10px] text-slate-400 font-semibold">Ayah {modalSelectedWord.ayah}</span>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200/50">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Translation</span>
                    <p className="text-xs text-slate-600 m-0 font-medium">"{modalSelectedWord.translation}"</p>
                  </div>
                </div>
              )}

              {/* Teacher's final text advice comments */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 md:p-6 space-y-3">
                <h3 className="text-sm font-bold text-slate-800 m-0 flex items-center gap-2">
                  <MessageSquare size={16} className="text-emerald-600" />
                  Ustadz's Advice & Recitation Guidance
                </h3>
                <div className="flex flex-col gap-2 bg-white rounded-2xl p-4 border border-slate-200/50 shadow-sm">
                  <span className="w-max text-[8px] uppercase tracking-widest font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded">
                    Teacher Portal Note
                  </span>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed italic m-0">
                    "{teacherAdvice}"
                  </p>
                </div>
              </div>

              {/* Footer close CTA */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setSelectedCompletedSession(null);
                    setModalSelectedWord(null);
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Dynamic Slide-in Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-white/95 backdrop-blur-md border border-slate-100 shadow-2xl rounded-2xl p-4 flex items-start gap-3 animate-slideIn">
          <div className={`p-2 rounded-xl text-white ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-slate-800 m-0 capitalize">{toast.type} Notification</h5>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
