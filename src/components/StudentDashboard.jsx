import React, { useState } from 'react';
import { USTADZ_LIST, SURAH_LIST, MOCK_QURAN_TEXT } from '../data/mockData';
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

export default function StudentDashboard({ sessions, onAddSession, subView = 'dashboard' }) {
  // Booking Form State
  const [ustadzId, setUstadzId] = useState(USTADZ_LIST[0].id);
  const [date, setDate] = useState('2026-05-20');
  const [time, setTime] = useState('10:00');
  const [surah, setSurah] = useState('Al-Fatihah');
  const [ayahStart, setAyahStart] = useState('1');
  const [ayahEnd, setAyahEnd] = useState('7');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Review Modal State
  const [selectedCompletedSession, setSelectedCompletedSession] = useState(null);
  const [modalSelectedWord, setModalSelectedWord] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ustadz = USTADZ_LIST.find(u => u.id === ustadzId);
    
    const newSession = {
      id: `sess-${Date.now()}`,
      studentId: "stud-1",
      studentName: "Ahmad Fauzi",
      studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      ustadzId: ustadzId,
      ustadzName: ustadz ? ustadz.name : 'Unknown Ustadz',
      date: date,
      time: time,
      surah: surah,
      ayahRange: `${ayahStart}-${ayahEnd}`,
      status: 'Pending',
      notes: notes,
      evaluation: null
    };

    onAddSession(newSession);
    setIsSuccess(true);
    setNotes('');
    
    // Auto reset success message
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  // Stats computation
  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const pendingSessions = sessions.filter(s => s.status === 'Pending').length;
  const activeGoal = "Al-Mulk Memorization";

  // Filter student sessions for Ahmad Fauzi (stud-1)
  const studentSessions = sessions.filter(s => s.studentId === 'stud-1');

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
          <h1 className="text-3xl font-extrabold m-0 text-white leading-tight">Ahmad Fauzi</h1>
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
                <span className="text-xl font-bold text-slate-800">14.5 hrs</span>
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 m-0">Recitation Sessions Schedule</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Click completed cards to review teacher marks and word-by-word audits.
                    </p>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-max">
                    {studentSessions.length} Sessions total
                  </span>
                </div>

                {/* Session Card List */}
                <div className="space-y-4">
                  {studentSessions.map((sess) => {
                    const ustadzObj = USTADZ_LIST.find(u => u.name === sess.ustadzName);
                    const isPending = sess.status === 'Pending';
                    const isConfirmed = sess.status === 'Confirmed';
                    const isCompleted = sess.status === 'Completed';

                    return (
                      <div 
                        key={sess.id}
                        onClick={() => isCompleted && setSelectedCompletedSession(sess)}
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
                  })}
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

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Ustadz selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Select Ustadz / Ustadzah</label>
                <select
                  value={ustadzId}
                  onChange={(e) => setUstadzId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                >
                  {USTADZ_LIST.map((ustadz) => (
                    <option key={ustadz.id} value={ustadz.id}>
                      {ustadz.name} ({ustadz.specialty.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Pick Date</label>
                  <input
                    type="date"
                    required
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
                  value={surah}
                  onChange={(e) => setSurah(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                >
                  {SURAH_LIST.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.type})</option>
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
      {selectedCompletedSession && (
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
                Audit Feedback: Surah {selectedCompletedSession.surah}
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Conducted with <span className="text-slate-600 font-bold">{selectedCompletedSession.ustadzName}</span> on {selectedCompletedSession.date} at {selectedCompletedSession.time}.
              </p>
            </div>

            {/* Error Counter Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-100 px-4 py-3 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 bg-amber-500 rounded-xl text-white">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block leading-none">Minor Slips</span>
                  <span className="text-lg font-bold text-amber-700 leading-none mt-1 inline-block">
                    {selectedCompletedSession.evaluation?.minorErrors}
                  </span>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-100 px-4 py-3 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 bg-rose-500 rounded-xl text-white">
                  <XCircle size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block leading-none">Major Mistakes</span>
                  <span className="text-lg font-bold text-rose-700 leading-none mt-1 inline-block">
                    {selectedCompletedSession.evaluation?.majorErrors}
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

              {/* Arabic word container */}
              <div className="quran-text text-right text-2xl md:text-3xl leading-[2] md:leading-[2.3] flex flex-wrap justify-center gap-x-4 gap-y-6 select-none p-4 max-w-xl mx-auto border border-emerald-800/10 rounded-2xl bg-white shadow-inner">
                {MOCK_QURAN_TEXT.words.map((word) => {
                  const state = selectedCompletedSession.evaluation?.wordStates?.[word.id];
                  let bgStyle = "hover:bg-slate-50 text-slate-800 border-slate-200/10 hover:border-slate-200";
                  if (state === 'minor') {
                    bgStyle = "bg-amber-100 border-amber-300 text-amber-900 font-bold shadow-sm shadow-amber-500/10";
                  } else if (state === 'major') {
                    bgStyle = "bg-rose-100 border-rose-300 text-rose-950 font-bold shadow-sm shadow-rose-500/10";
                  }

                  return (
                    <span 
                      key={word.id}
                      onClick={() => setModalSelectedWord(word)}
                      className={`px-2.5 py-1 border rounded-lg cursor-pointer transition-all inline-block text-center hover:scale-[1.05] active:scale-[0.95] ${bgStyle}`}
                    >
                      {word.text}
                      {/* Tiny Ayah indicators */}
                      {word.id === "w4" && <span className="text-[12px] text-emerald-600 font-sans border border-emerald-600/30 rounded-full px-1 mx-1 font-bold">١</span>}
                      {word.id === "w8" && <span className="text-[12px] text-emerald-600 font-sans border border-emerald-600/30 rounded-full px-1 mx-1 font-bold">٢</span>}
                      {word.id === "w10" && <span className="text-[12px] text-emerald-600 font-sans border border-emerald-600/30 rounded-full px-1 mx-1 font-bold">٣</span>}
                      {word.id === "w13" && <span className="text-[12px] text-emerald-600 font-sans border border-emerald-600/30 rounded-full px-1 mx-1 font-bold">٤</span>}
                      {word.id === "w17" && <span className="text-[12px] text-emerald-600 font-sans border border-emerald-600/30 rounded-full px-1 mx-1 font-bold">٥</span>}
                      {word.id === "w20" && <span className="text-[12px] text-emerald-600 font-sans border border-emerald-600/30 rounded-full px-1 mx-1 font-bold">٦</span>}
                      {word.id === "w29" && <span className="text-[12px] text-emerald-600 font-sans border border-emerald-600/30 rounded-full px-1 mx-1 font-bold">٧</span>}
                    </span>
                  );
                })}
              </div>

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
                  "{selectedCompletedSession.evaluation?.feedback}"
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
      )}
    </div>
  );
}
