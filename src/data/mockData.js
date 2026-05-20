export const USTADZ_LIST = [
  {
    id: "u1",
    name: "Ustadz Abdul Somad, Lc., M.A.",
    rating: 4.9,
    reviews: 124,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    specialty: "Makharij & Tajweed Specialist",
    bio: "Graduate of Al-Azhar University, Cairo. 10+ years teaching Quranic recitation & Qira'at.",
    availability: ["Monday 09:00 - 12:00", "Wednesday 13:00 - 16:00", "Friday 15:00 - 18:00"]
  },
  {
    id: "u2",
    name: "Ustadz H. Hanan Attaki, Lc.",
    rating: 4.8,
    reviews: 98,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    specialty: "Hifz & Memorization Coach",
    bio: "Specializes in helping youth memorize the Quran with ease. Certified in Hafs 'an 'Asim.",
    availability: ["Tuesday 10:00 - 12:00", "Thursday 14:00 - 17:00", "Saturday 08:00 - 11:00"]
  },
  {
    id: "u3",
    name: "Ustadzah Dr. Amani Abuzahra",
    rating: 4.95,
    reviews: 145,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    specialty: "Female Tajweed & Tafsir Expert",
    bio: "Ph.D. in Islamic Studies. Certified in ten canonical Qira'at (recitations).",
    availability: ["Monday 14:00 - 17:00", "Wednesday 09:00 - 12:00", "Saturday 13:00 - 16:00"]
  },
  {
    id: "u4",
    name: "Ustadz Yusuf Mansur",
    rating: 4.7,
    reviews: 86,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    specialty: "Tahseen & Beautiful Recitation",
    bio: "Focuses on correcting general recitation errors and beautifying voice modulation.",
    availability: ["Tuesday 15:00 - 18:00", "Friday 08:00 - 11:00", "Sunday 09:00 - 12:00"]
  }
];

export const SURAH_LIST = [
  { id: "s1", name: "Al-Fatihah", ayahs: 7, type: "Meccan" },
  { id: "s2", name: "Al-Baqarah", ayahs: 286, type: "Medinan" },
  { id: "s3", name: "Ali 'Imran", ayahs: 200, type: "Medinan" },
  { id: "s4", name: "An-Nisa'", ayahs: 176, type: "Medinan" },
  { id: "s5", name: "Al-Ma'idah", ayahs: 120, type: "Medinan" },
  { id: "s6", name: "Al-An'am", ayahs: 165, type: "Meccan" },
  { id: "s7", name: "Al-A'raf", ayahs: 206, type: "Meccan" },
  { id: "s36", name: "Ya-Sin", ayahs: 83, type: "Meccan" },
  { id: "s67", name: "Al-Mulk", ayahs: 30, type: "Meccan" },
  { id: "s114", name: "An-Nas", ayahs: 6, type: "Meccan" }
];

export const DEFAULT_SESSIONS = [
  {
    id: "sess-1",
    studentId: "stud-1",
    studentName: "Ahmad Fauzi",
    studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    ustadzId: "u1",
    ustadzName: "Ustadz Abdul Somad, Lc., M.A.",
    date: "2026-05-20",
    time: "09:30",
    surah: "Al-Fatihah",
    ayahRange: "1-7",
    status: "Confirmed", // Pending, Confirmed, Completed, Cancelled
    notes: "Reviewing basic Makharij and connection of words.",
    evaluation: null
  },
  {
    id: "sess-2",
    studentId: "stud-2",
    studentName: "Siti Rahma",
    studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    ustadzId: "u3",
    ustadzName: "Ustadzah Dr. Amani Abuzahra",
    date: "2026-05-21",
    time: "14:00",
    surah: "Al-Mulk",
    ayahRange: "1-10",
    status: "Pending",
    notes: "Memorization check for Al-Mulk initial verses.",
    evaluation: null
  },
  {
    id: "sess-3",
    studentId: "stud-1",
    studentName: "Ahmad Fauzi",
    studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    ustadzId: "u2",
    ustadzName: "Ustadz H. Hanan Attaki, Lc.",
    date: "2026-05-18",
    time: "10:00",
    surah: "Al-Baqarah",
    ayahRange: "1-5",
    status: "Completed",
    notes: "Excellent initial recitation, minor tajweed slip on Madd.",
    evaluation: {
      minorErrors: 2,
      majorErrors: 0,
      feedback: "Alhamdulillah. Keep practicing the natural extension (Madd Tabee'ee) on Ayah 4. Pronunciation is very clean.",
      wordStates: {
        "word-3": "minor", // Tajweed
        "word-12": "minor"
      }
    }
  }
];

// Interactive Surah Al-Fatihah Word list for evaluation
export const MOCK_QURAN_TEXT = {
  surahName: "Al-Fatihah",
  ayahRange: "1-7",
  words: [
    // Ayah 1
    { id: "w1", text: "بِسْمِ", transliteration: "Bismi", translation: "In the name of", ayah: 1 },
    { id: "w2", text: "اللَّهِ", transliteration: "Allāhi", translation: "Allah", ayah: 1 },
    { id: "w3", text: "الرَّحْمَٰنِ", transliteration: "ar-Raḥmāni", translation: "the Most Gracious", ayah: 1 },
    { id: "w4", text: "الرَّحِيمِ", transliteration: "ar-Raḥīmi", translation: "the Most Merciful", ayah: 1 },
    
    // Ayah 2
    { id: "w5", text: "الْحَمْدُ", transliteration: "Al-ḥamdu", translation: "All praise", ayah: 2 },
    { id: "w6", text: "لِلَّهِ", transliteration: "lillāhi", translation: "is due to Allah", ayah: 2 },
    { id: "w7", text: "رَبِّ", transliteration: "Rabbi", translation: "Lord", ayah: 2 },
    { id: "w8", text: "الْعَالَمِينَ", transliteration: "al-ʿālamīna", translation: "of the worlds", ayah: 2 },
    
    // Ayah 3
    { id: "w9", text: "الرَّحْمَٰنِ", transliteration: "ar-Raḥmāni", translation: "the Most Gracious", ayah: 3 },
    { id: "w10", text: "الرَّحِيمِ", transliteration: "ar-Raḥīmi", translation: "the Most Merciful", ayah: 3 },
    
    // Ayah 4
    { id: "w11", text: "مَالِكِ", transliteration: "Māliki", translation: "Master", ayah: 4 },
    { id: "w12", text: "يَوْمِ", transliteration: "yawmi", translation: "of the Day", ayah: 4 },
    { id: "w13", text: "الدِّينِ", transliteration: "ad-dīni", translation: "of Judgment", ayah: 4 },
    
    // Ayah 5
    { id: "w14", text: "إِيَّاكَ", transliteration: "Iyyāka", translation: "You alone", ayah: 5 },
    { id: "w15", text: "نَعْبُدُ", transliteration: "naʿbudu", translation: "we worship", ayah: 5 },
    { id: "w16", text: "وَإِيَّاكَ", transliteration: "wa-iyyāka", translation: "and You alone", ayah: 5 },
    { id: "w17", text: "نَسْتَعِينُ", transliteration: "nastaʿīnu", translation: "we ask for help", ayah: 5 },
    
    // Ayah 6
    { id: "w18", text: "اهْدِنَا", transliteration: "Ihdinā", translation: "Guide us to", ayah: 6 },
    { id: "w19", text: "الصِّرَاطَ", transliteration: "aṣ-ṣirāṭa", translation: "the path", ayah: 6 },
    { id: "w20", text: "الْمُسْتَقِيمَ", transliteration: "al-mustaqīma", translation: "straight", ayah: 6 },
    
    // Ayah 7
    { id: "w21", text: "صِرَاطَ", transliteration: "Ṣirāṭa", translation: "The path of", ayah: 7 },
    { id: "w22", text: "الَّذِينَ", transliteration: "alladhīna", translation: "those whom", ayah: 7 },
    { id: "w23", text: "أَنْعَمْتَ", transliteration: "anʿamta", translation: "You have favored", ayah: 7 },
    { id: "w24", text: "عَلَيْهِمْ", transliteration: "ʿalayhim", translation: "upon them", ayah: 7 },
    { id: "w25", text: "غَيْرِ", transliteration: "ghayri", translation: "not of", ayah: 7 },
    { id: "w26", text: "الْمَغْضُوبِ", transliteration: "al-maghḍūbi", translation: "those who earned anger", ayah: 7 },
    { id: "w27", text: "عَلَيْهِمْ", transliteration: "ʿalayhim", translation: "upon them", ayah: 7 },
    { id: "w28", text: "وَلَا", transliteration: "wa-lā", translation: "nor", ayah: 7 },
    { id: "w29", text: "الضَّالِّينَ", transliteration: "aḍ-ḍāllīna", translation: "of those who go astray", ayah: 7 }
  ]
};

export const ALL_SURAHS = [
  "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa'", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra'", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya'", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara'", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba'", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiquun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba'", "An-Nazi'at", "'Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat",
  "Al-Qari'ah", "At-Takathur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kauthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];
