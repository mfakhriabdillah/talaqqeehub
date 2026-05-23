import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  CheckCircle, 
  GraduationCap, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Star,
  Eye,
  EyeOff,
  ChevronDown,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthView({ onLogin }) {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name, role);
      }
    } catch (err) {
      console.error("Authentication failed:", err);
      setError(err.message || "Invalid credentials or connection error.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans scroll-smooth">
      
      {/* 1. LEFT SIDE - EMERALD BRAND PANEL (Mobile Full-Screen Onboarding Splash) */}
      <div className="w-full md:w-1/2 bg-emerald-950 p-6 md:p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden h-[100dvh] md:h-screen md:min-h-screen">
        
        {/* Soft Circular Glow Background Decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-800 via-emerald-900 to-emerald-950 opacity-95"></div>
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-emerald-400/5 blur-3xl"></div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.png" alt="TalaqqeeHub Logo" className="w-10 h-10 object-contain rounded-xl border border-emerald-600/30 bg-emerald-950 shadow-md animate-fadeIn" />
          <span className="text-lg font-black tracking-tight text-white">TalaqqeeHub</span>
        </div>

        {/* Title, Copy & Feature Points Stack */}
        <div className="relative z-10 my-auto py-4 md:py-0 space-y-5 md:space-y-12">
          {/* Headline block */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4.5xl font-extrabold text-white leading-tight tracking-tighter m-0">
              Your Journey to Quranic Mastery Starts Here
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal max-w-md">
              A comprehensive Islamic learning platform designed to align verified tutors with eager students, practice live word-by-word reciting, and record memorization.
            </p>
          </div>

          {/* Three features list */}
          <div className="space-y-4 max-w-md">
            {[
              { icon: Users, text: "Connect with certified Ustadz globally" },
              { icon: GraduationCap, text: "Structured Hifz & Tajweed programs" },
              { icon: Star, text: "Live interactive evaluation sessions" }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="flex items-center gap-4 group cursor-default">
                  <div className="p-3 bg-emerald-800/40 rounded-2xl border border-emerald-700/30 text-emerald-400 group-hover:bg-emerald-700/50 group-hover:text-emerald-300 transition-all duration-300">
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-semibold text-emerald-100/90 group-hover:text-white transition-colors duration-300">
                    {feat.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Onboarding Scroll Down Arrow Action */}
        <div className="relative z-10 md:hidden flex flex-col items-center justify-center gap-1.5 mt-2 animate-bounce">
          <button 
            type="button"
            onClick={() => {
              document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-300 font-extrabold bg-emerald-900/50 hover:bg-emerald-900/80 px-4 py-2.5 rounded-full border border-emerald-700/30 shadow-lg cursor-pointer transition-all active:scale-95"
          >
            <span>Tap to Sign In</span>
            <ChevronDown size={14} className="text-emerald-400" />
          </button>
        </div>

        {/* Social / Trust Footer */}
        <div className="relative z-10 text-xs text-emerald-200/50 font-medium hidden md:block">
          Connecting Quran Scholars with Students around the world. © 2026 TalaqqeeHub.
        </div>
      </div>

      {/* 2. RIGHT SIDE - CREDENTIALS LOGIN PANEL */}
      <div id="login-section" className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 lg:p-16 min-h-[100dvh] md:min-h-screen">
        
        <div className="w-full max-w-md space-y-8 animate-scaleUp">
          
          {/* Tab Toggles (Sign In / Create Account) */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-xs mx-auto border border-slate-200/50">
            <button
              type="button"
              onClick={() => { setIsLogin(true); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                isLogin 
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/25' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                !isLogin 
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/25' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight m-0">
              {isLogin ? "Welcome back" : "Create your account"}
            </h3>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              {isLogin 
                ? "Enter your credentials to access your personal dashboard and recitation records."
                : "Register as a new student to begin your custom recitation pathways today."}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-3 animate-fadeIn text-rose-800 text-xs font-semibold">
              <ShieldAlert size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold m-0 text-slate-800">Authentication Error</p>
                <p className="text-rose-600/90 font-medium m-0 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection (Only visible in Register/Create Account mode) */}
            {!isLogin && (
              <div className="space-y-2 bg-slate-50 border border-slate-100 p-4 rounded-3xl animate-fadeIn">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Join TalaqqeeHub As</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      role === 'student'
                        ? 'border-emerald-600 bg-white text-emerald-700 shadow-md shadow-emerald-600/5'
                        : 'border-slate-200 bg-white/40 text-slate-500 hover:bg-white hover:text-slate-700'
                    }`}
                  >
                    <GraduationCap size={14} />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      role === 'teacher'
                        ? 'border-emerald-600 bg-white text-emerald-700 shadow-md shadow-emerald-600/5'
                        : 'border-slate-200 bg-white/40 text-slate-500 hover:bg-white hover:text-slate-700'
                    }`}
                  >
                    <ShieldCheck size={14} />
                    Ustadz (Teacher)
                  </button>
                </div>
              </div>
            )}

            {/* Name Input (Visible in Create Account mode) */}
            {!isLogin && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-bold text-slate-600 block">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ahmad Fauzi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm transition-all outline-none focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm transition-all outline-none focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {/* Password Input with Visibility Eye toggle */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-600 block">Password</label>
                {isLogin && (
                  <a href="#forgot" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm transition-all outline-none focus:ring-4 focus:ring-emerald-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-6 ${
                loading ? 'opacity-85 pointer-events-none' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
      
    </div>
  );
}
