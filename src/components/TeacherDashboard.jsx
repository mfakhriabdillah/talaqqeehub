import React from 'react';
import { USTADZ_LIST } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Hourglass, 
  Star, 
  Check, 
  X, 
  Volume2, 
  BookOpen, 
  Calendar, 
  Clock,
  Play
} from 'lucide-react';

export default function TeacherDashboard({ sessions, onAcceptSession, onDeclineSession, onStartEvaluation }) {
  const { user, profile } = useAuth();

  // Filter sessions: only show sessions that belong to the active logged-in teacher
  // Or show mock sessions if there are no database sessions associated with this teacher yet (for dashboard fullness)
  const hasRealTeacherSessions = sessions.some(s => s.ustadzId === user?.id);
  const teacherSessions = hasRealTeacherSessions 
    ? sessions.filter(s => s.ustadzId === user?.id)
    : sessions;

  const pendingRequests = teacherSessions.filter(s => s.status === 'Pending');
  const confirmedSessions = teacherSessions.filter(s => s.status === 'Confirmed');
  
  // Stats calculations
  const totalStudentsCount = 14;
  const ratingAvg = 4.9;
  const totalHoursTaught = 42.5;

  return (
    <div className="space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-700/30 via-slate-900 to-slate-950 opacity-90"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" 
            alt={profile?.full_name || "Ustadz Abdul Somad"} 
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
          />
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block border border-emerald-500/30">
              Welcome back, Ustadz
            </span>
            <h1 className="text-3xl font-extrabold m-0 text-white leading-tight">
              {profile?.full_name || user?.user_metadata?.full_name || "Ustadz Abdul Somad, Lc."}
            </h1>
            <p className="text-slate-400 max-w-xl text-xs font-medium">
              You have <span className="text-emerald-400 font-bold">{pendingRequests.length} pending recitation requests</span> requiring your confirmation today.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Active Students</span>
            <span className="text-xl font-bold text-slate-800">{totalStudentsCount} Students</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600">
            <Hourglass size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Total Recitation Hours</span>
            <span className="text-xl font-bold text-slate-800">{totalHoursTaught} hrs</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600">
            <Star size={24} className="fill-emerald-600" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Talaqqi Rating</span>
            <span className="text-xl font-bold text-slate-800">{ratingAvg} / 5.0</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incoming Requests Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800 m-0">Incoming Recitation Requests</h3>
              <p className="text-xs text-slate-400 font-semibold">Decide which student recitations to confirm and schedule</p>
            </div>
            <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full">
              {pendingRequests.length} pending
            </span>
          </div>

          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-400 space-y-2">
                <span className="text-3xl block">🎉</span>
                <p className="text-sm font-bold text-slate-800 m-0">No Pending Requests</p>
                <p className="text-xs text-slate-400">All student recitation requests have been resolved.</p>
              </div>
            ) : (
              pendingRequests.map((sess) => (
                <div 
                  key={sess.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={sess.studentAvatar} 
                        alt={sess.studentName} 
                        className="w-11 h-11 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 m-0 leading-tight">
                          {sess.studentName}
                        </h4>
                        <span className="text-xs text-slate-400 font-semibold block">Registered Student</span>
                      </div>
                    </div>

                    {/* Booking Date Details */}
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                        {sess.date} @ {sess.time}
                      </span>
                    </div>
                  </div>

                  {/* Recitation Targets */}
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Recitation Target</span>
                      <span className="font-bold text-slate-800 text-sm">Surah {sess.surah} (Ayahs {sess.ayahRange})</span>
                    </div>
                    {sess.notes && (
                      <div className="max-w-[200px] text-right">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Student Note</span>
                        <span className="text-slate-500 italic truncate block">"{sess.notes}"</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end pt-1">
                    <button
                      onClick={() => onDeclineSession(sess.id)}
                      className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <X size={14} />
                      Decline
                    </button>
                    <button
                      onClick={() => onAcceptSession(sess.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Check size={14} />
                      Confirm Schedule
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Confirmed / Active Schedule Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800 m-0">Confirmed Recitation Schedule</h3>
              <p className="text-xs text-slate-400 font-semibold">Upcoming sessions scheduled. Open to begin live evaluation.</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full">
              {confirmedSessions.length} active
            </span>
          </div>

          <div className="space-y-4">
            {confirmedSessions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-400 space-y-2">
                <span className="text-3xl block">📅</span>
                <p className="text-sm font-bold text-slate-800 m-0">No Confirmed Sessions</p>
                <p className="text-xs text-slate-400">Accept student booking requests to populate your schedule.</p>
              </div>
            ) : (
              confirmedSessions.map((sess) => (
                <div 
                  key={sess.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Student Details */}
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={sess.studentAvatar} 
                      alt={sess.studentName} 
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 m-0 leading-tight">
                        {sess.studentName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400 font-semibold mt-0.5">
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
                      <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-md w-max mt-1 flex items-center gap-1">
                        <BookOpen size={10} />
                        <span>Reciting: {sess.surah} ({sess.ayahRange})</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: CTA Button */}
                  <div className="flex items-center justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <button
                      onClick={() => onStartEvaluation(sess)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Play size={12} className="fill-white" />
                      Evaluate Recitation
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
