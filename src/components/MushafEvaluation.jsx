import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_QURAN_TEXT, ALL_SURAHS } from '../data/mockData';
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
  const [loading, setLoading] = useState(true);
  const [quranWords, setQuranWords] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  
  // Track flagged mistake indexes strictly
  const [mistakeIndexes, setMistakeIndexes] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch booking context and Arabic text on mount
  useEffect(() => {
    let mounted = true;
    const loadSessionData = async () => {
      if (!activeSession?.id) {
        // Fallback for mock preview session
        setBookingData({
          id: 'mock-booking-id',
          studentName: activeSession?.studentName || "Ahmad Fauzi",
          studentAvatar: activeSession?.studentAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          surah: activeSession?.surah || "Al-Fatihah",
          surahNumber: 1,
          startAyah: 1,
          endAyah: 7
        });
        
        // Populate mock words
        const mockWords = MOCK_QURAN_TEXT.words.map((w, idx) => ({
          id: `1-${idx}`,
          text: w.text,
          ayah: w.ayah,
          transliteration: w.transliteration,
          translation: w.translation
        }));
        setQuranWords(mockWords);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Query specific booking details
        const { data: booking, error: dbError } = await supabase
          .from('bookings')
          .select('*, student:users!bookings_student_id_fkey(full_name)')
          .eq('id', activeSession.id)
          .single();

        if (dbError) throw dbError;

        const surahNum = booking.surah_number || 1;
        const startA = booking.start_ayah || 1;
        const endA = booking.end_ayah || 7;

        // Load Surah names
        const surahName = ALL_SURAHS[surahNum - 1] || `Surah #${surahNum}`;

        if (mounted) {
          setBookingData({
            id: booking.id,
            studentName: booking.student?.full_name || "Ahmad Fauzi",
            studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            surah: surahName,
            surahNumber: surahNum,
            startAyah: startA,
            endAyah: endA
          });
        }

        // Fetch Arabic Uthmani verses from standard public API
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`);
        if (!response.ok) throw new Error("Failed to fetch Quranic verses from API");
        const json = await response.json();
        
        if (json.code === 200 && json.data?.ayahs) {
          const ayahs = json.data.ayahs;
          // Filter within start & end bounds
          const filtered = ayahs.filter(a => a.numberInSurah >= startA && a.numberInSurah <= endA);
          
          // Tokenize into individual words
          const tokenizedWords = [];
          filtered.forEach(ayah => {
            const verseText = ayah.text;
            // Clean/remove Bismillah prefix if it is appended in API response but not requested (except Al-Fatihah first verse)
            let cleanedText = verseText;
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

          if (mounted) {
            setQuranWords(tokenizedWords);
          }
        }
      } catch (err) {
        console.error("Evaluation loading failed:", err);
        if (mounted) {
          setErrorMessage(err.message || "Failed to load classroom context.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSessionData();
    return () => {
      mounted = false;
    };
  }, [activeSession]);

  // Click handler to toggle mistake highlight status directly
  const handleWordClick = (wordId) => {
    setMistakeIndexes(prev => 
      prev.includes(wordId)
        ? prev.filter(id => id !== wordId)
        : [...prev, wordId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData) return;
    
    setSubmitting(true);
    setErrorMessage('');

    try {
      if (bookingData.id !== 'mock-booking-id') {
        // 1. Insert record into public.session_notes
        const { error: notesError } = await supabase
          .from('session_notes')
          .insert({
            booking_id: bookingData.id,
            mistake_words: mistakeIndexes,
            feedback: feedback || "Alhamdulillah, recitation session completed."
          });

        if (notesError) throw notesError;

        // 2. Update the booking status strictly to 'completed'
        const { error: bookingError } = await supabase
          .from('bookings')
          .update({ status: 'completed' })
          .eq('id', bookingData.id);

        if (bookingError) throw bookingError;
      }

      // 3. Trigger parent updates and redirection
      onSubmitEvaluation(bookingData.id, {
        minorErrors: mistakeIndexes.length,
        majorErrors: 0,
        feedback: feedback || "Alhamdulillah, recitation session completed."
      });

    } catch (err) {
      console.error("Failed to complete evaluation:", err);
      setErrorMessage(err.message || "Failed to submit evaluation results.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
          <span className="absolute text-2xl animate-pulse">🕌</span>
        </div>
        <div className="text-center space-y-1 animate-fadeIn">
          <h3 className="text-md font-bold text-slate-800 m-0">Synchronizing Recitation Board</h3>
          <p className="text-xs text-slate-400 font-semibold m-0">Retrieving Uthmani verses from stable public API...</p>
        </div>
      </div>
    );
  }

  if (errorMessage && !bookingData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-rose-100 rounded-3xl p-8 text-center shadow-xl space-y-6 animate-fadeIn">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
            <XCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800 m-0">System Disconnection</h2>
            <p className="text-xs text-slate-400 font-semibold">{errorMessage}</p>
          </div>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Group the tokenized words dynamically by Ayah number in-render
  const ayahsMap = {};
  quranWords.forEach(word => {
    if (!ayahsMap[word.ayah]) {
      ayahsMap[word.ayah] = [];
    }
    ayahsMap[word.ayah].push(word);
  });

  return (
    <div className="space-y-8">
      {/* Header Info Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={bookingData.studentAvatar} 
            alt={bookingData.studentName} 
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">
              Live Recitation Assessment
            </span>
            <h2 className="text-xl font-bold text-slate-800 m-0 leading-snug mt-1">
              Student: {bookingData.studentName}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-0.5">
              <span>Target: {bookingData.surah}</span>
              <span>•</span>
              <span>Ayahs {bookingData.startAyah} - {bookingData.endAyah}</span>
            </div>
          </div>
        </div>

        {/* Counter Badges */}
        <div className="flex gap-4">
          <div className="bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-rose-500 rounded-xl text-white">
              <XCircle size={18} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block leading-none">Flagged Errors</span>
              <span className="text-lg font-bold text-rose-700 leading-none mt-1 inline-block">{mistakeIndexes.length}</span>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-semibold">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Main Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mushaf Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-emerald-50/20 border border-emerald-100/40 rounded-3xl shadow-sm p-8 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Quran Top Emblem Header */}
            <div className="flex justify-center mb-8">
              <div className="border border-emerald-600/20 rounded-full px-6 py-1.5 bg-emerald-50 text-emerald-800 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Bookmark size={12} className="fill-emerald-800" />
                <span>{bookingData.surah} recitation board</span>
              </div>
            </div>

            {/* Quran Word-by-Word Area */}
            <div 
              className="quran-text text-right text-3xl md:text-4xl leading-[2.2] md:leading-[2.5] flex flex-col gap-6 select-none p-6 max-w-2xl mx-auto border border-emerald-800/10 rounded-2xl bg-white/70 backdrop-blur-sm shadow-inner"
              style={{ direction: 'rtl' }}
            >
              {Object.keys(ayahsMap).sort((a, b) => Number(a) - Number(b)).map((ayahNum) => (
                <div 
                  key={ayahNum}
                  className="flex flex-wrap gap-x-4 gap-y-4 justify-start pb-4 border-b border-emerald-800/5 last:border-0 last:pb-0"
                >
                  {ayahsMap[ayahNum].map((word) => {
                    const isMistake = mistakeIndexes.includes(word.id);
                    const bgStyle = isMistake
                      ? "bg-red-200 text-red-900 rounded-md border-red-300 font-bold shadow-sm shadow-red-500/10 transition-colors"
                      : "hover:bg-slate-100 text-slate-800 border-slate-200/20 hover:border-slate-300";

                    return (
                      <span 
                        key={word.id}
                        onClick={() => handleWordClick(word.id)}
                        className={`px-3 py-1.5 border rounded-xl cursor-pointer transition-all duration-200 inline-block text-center transform hover:scale-[1.05] active:scale-[0.95] ${bgStyle}`}
                      >
                        {word.text}
                      </span>
                    );
                  })}
                  {/* Premium Ayah End Ornament Indicator */}
                  <span className="text-emerald-700/50 font-serif font-extrabold text-2xl self-center px-2 select-none">
                    ﴿{ayahNum}﴾
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-xs text-slate-400 font-semibold flex items-center justify-center gap-1.5">
              <span>💡 Tip: Click on any Arabic word above directly to flag recitation mistakes/highlights.</span>
            </div>
          </div>
        </div>

        {/* Evaluation and Feedback Sidebar */}
        <div className="lg:col-span-1 space-y-6">
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
                  rows="5"
                  required
                  placeholder="Introduce tips, e.g. Be careful to recite the letters accurately with standard tajweed guidance."
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
                      <span>Complete Session</span>
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
