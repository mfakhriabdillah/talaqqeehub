import React, { useState } from 'react';
import { MOCK_QURAN_TEXT } from '../data/mockData';
import { 
  BookOpen, 
  ChevronRight, 
  Award, 
  AlertTriangle, 
  XCircle, 
  CheckCircle,
  Volume2,
  Bookmark,
  MessageSquare
} from 'lucide-react';

export default function MushafEvaluation({ activeSession, onSubmitEvaluation, onCancel }) {
  // If no session is active (direct click on page), mock a default one
  const session = activeSession || {
    id: "sess-1",
    studentName: "Ahmad Fauzi",
    studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    surah: "Al-Fatihah",
    ayahRange: "1-7"
  };

  // State to track word errors
  // e.g., { "w3": "minor", "w10": "major" }
  const [wordStates, setWordStates] = useState({});
  const [selectedWord, setSelectedWord] = useState(null); // Active word for modal
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  const setWordStatus = (wordId, status) => {
    setWordStates(prev => {
      const next = { ...prev };
      if (status === 'none') {
        delete next[wordId];
      } else {
        next[wordId] = status;
      }
      return next;
    });
    setSelectedWord(null); // close selection
  };

  // Count errors
  const minorErrorsCount = Object.values(wordStates).filter(v => v === 'minor').length;
  const majorErrorsCount = Object.values(wordStates).filter(v => v === 'major').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    setTimeout(() => {
      onSubmitEvaluation(session.id, {
        minorErrors: minorErrorsCount,
        majorErrors: majorErrorsCount,
        feedback: feedback || "Alhamdulillah, excellent effort in recitation. Focus on highlighted areas.",
        wordStates: wordStates
      });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header Info Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={session.studentAvatar} 
            alt={session.studentName} 
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">
              Live Recitation Assessment
            </span>
            <h2 className="text-xl font-bold text-slate-800 m-0 leading-snug mt-1">
              Student: {session.studentName}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-0.5">
              <span>Target: Surah {session.surah}</span>
              <span>•</span>
              <span>Ayahs {session.ayahRange}</span>
            </div>
          </div>
        </div>

        {/* Counter Badges */}
        <div className="flex gap-4">
          <div className="bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-xl text-white">
              <AlertTriangle size={18} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block leading-none">Minor Slips</span>
              <span className="text-lg font-bold text-amber-700 leading-none mt-1 inline-block">{minorErrorsCount}</span>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-rose-500 rounded-xl text-white">
              <XCircle size={18} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block leading-none">Major Mistakes</span>
              <span className="text-lg font-bold text-rose-700 leading-none mt-1 inline-block">{majorErrorsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mushaf Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-emerald-50/20 border border-emerald-100/40 rounded-3xl shadow-sm p-8 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Quran Top Emblem Header */}
            <div className="flex justify-center mb-8">
              <div className="border border-emerald-600/20 rounded-full px-6 py-1.5 bg-emerald-50 text-emerald-800 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Bookmark size={12} className="fill-emerald-800" />
                <span>Al-Fatihah recitation board</span>
              </div>
            </div>

            {/* Quran Word-by-Word Area */}
            <div className="quran-text text-right text-3xl md:text-4xl leading-[2.2] md:leading-[2.5] flex flex-wrap justify-center gap-x-5 gap-y-8 select-none p-4 max-w-2xl mx-auto border border-emerald-800/10 rounded-2xl bg-white/70 backdrop-blur-sm shadow-inner">
              {MOCK_QURAN_TEXT.words.map((word) => {
                const state = wordStates[word.id];
                let bgStyle = "hover:bg-slate-100 text-slate-800 border-slate-200/20 hover:border-slate-300";
                if (state === 'minor') {
                  bgStyle = "bg-amber-100 border-amber-300 text-amber-900 font-bold shadow-sm shadow-amber-500/10";
                } else if (state === 'major') {
                  bgStyle = "bg-rose-100 border-rose-300 text-rose-950 font-bold shadow-sm shadow-rose-500/10 animate-pulse";
                }

                return (
                  <span 
                    key={word.id}
                    onClick={() => handleWordClick(word)}
                    className={`px-3 py-1.5 border rounded-xl cursor-pointer transition-all duration-200 inline-block text-center transform hover:scale-[1.05] active:scale-[0.95] ${bgStyle}`}
                  >
                    {word.text}
                    {/* Tiny small Ayah indicator */}
                    {word.id === "w4" && <span className="text-[14px] text-emerald-600 font-sans border-2 border-emerald-600/30 rounded-full px-1.5 mx-1 font-extrabold select-none">١</span>}
                    {word.id === "w8" && <span className="text-[14px] text-emerald-600 font-sans border-2 border-emerald-600/30 rounded-full px-1.5 mx-1 font-extrabold select-none">٢</span>}
                    {word.id === "w10" && <span className="text-[14px] text-emerald-600 font-sans border-2 border-emerald-600/30 rounded-full px-1.5 mx-1 font-extrabold select-none">٣</span>}
                    {word.id === "w13" && <span className="text-[14px] text-emerald-600 font-sans border-2 border-emerald-600/30 rounded-full px-1.5 mx-1 font-extrabold select-none">٤</span>}
                    {word.id === "w17" && <span className="text-[14px] text-emerald-600 font-sans border-2 border-emerald-600/30 rounded-full px-1.5 mx-1 font-extrabold select-none">٥</span>}
                    {word.id === "w20" && <span className="text-[14px] text-emerald-600 font-sans border-2 border-emerald-600/30 rounded-full px-1.5 mx-1 font-extrabold select-none">٦</span>}
                    {word.id === "w29" && <span className="text-[14px] text-emerald-600 font-sans border-2 border-emerald-600/30 rounded-full px-1.5 mx-1 font-extrabold select-none">٧</span>}
                  </span>
                );
              })}
            </div>

            <div className="mt-8 text-center text-xs text-slate-400 font-semibold flex items-center justify-center gap-1.5">
              <span>💡 Tip: Click on any word above to audit and tag recitation accuracy/slips.</span>
            </div>
          </div>
        </div>

        {/* Evaluation and Feedback Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Word inspector / selector */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 m-0 flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-600" />
              Word Inspector
            </h3>

            {selectedWord ? (
              <div className="mt-4 space-y-4 animate-fadeIn">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1 relative">
                  <span className="quran-text text-3xl font-bold text-emerald-800 leading-none">{selectedWord.text}</span>
                  <p className="text-xs font-semibold text-slate-500 font-sans italic">{selectedWord.transliteration}</p>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase mt-2">English Translation</span>
                  <p className="text-xs text-slate-600 font-medium font-sans">"{selectedWord.translation}"</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tag Recitation Status</span>
                  
                  <button 
                    onClick={() => setWordStatus(selectedWord.id, 'none')}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer bg-white"
                  >
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span>No Error (Correct Recitation)</span>
                  </button>

                  <button 
                    onClick={() => setWordStatus(selectedWord.id, 'minor')}
                    className="w-full py-2.5 px-4 rounded-xl border border-amber-200 hover:border-amber-300 text-amber-800 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer bg-amber-50"
                  >
                    <AlertTriangle size={14} className="text-amber-500" />
                    <span>Minor Tajweed Slip (Madd, Ghunnah)</span>
                  </button>

                  <button 
                    onClick={() => setWordStatus(selectedWord.id, 'major')}
                    className="w-full py-2.5 px-4 rounded-xl border border-rose-200 hover:border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer bg-rose-50"
                  >
                    <XCircle size={14} className="text-rose-500" />
                    <span>Major Makhraj/Hifz Mistake</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-6 border-2 border-dashed border-slate-100 rounded-2xl text-center text-slate-400 text-xs font-semibold">
                Click a word in the recitation board to view definitions and tag recitation issues.
              </div>
            )}
          </div>

          {/* Feedback Form */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 m-0 flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-600" />
              General Comments
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Recitation Guidance / Advice</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Introduce tips for Al-Fatihah, e.g. Be careful to recite the letter Haa (ح) accurately in 'ar-Rahman'."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
