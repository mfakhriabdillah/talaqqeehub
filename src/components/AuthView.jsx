import React, { useState } from 'react';
import { Mail, Lock, User, CheckCircle, GraduationCap, ShieldCheck } from 'lucide-react';

export default function AuthView({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('ahmad@talaqqihub.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Ahmad Fauzi');
  const [loading, setLoading] = useState(false);

  const handleQuickFill = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setEmail('ahmad@talaqqihub.com');
      setName('Ahmad Fauzi');
    } else {
      setEmail('ustadz.abdul@talaqqihub.com');
      setName('Ustadz Abdul Somad, Lc., M.A.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        id: role === 'student' ? 'stud-1' : 'u1',
        name: isLogin ? (role === 'student' ? 'Ahmad Fauzi' : 'Ustadz Abdul Somad, Lc., M.A.') : name,
        email: email,
        avatar: role === 'student' 
          ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        role: role
      });
    }, 1200);
  };

  return (
    <div className="min-height-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Decorative Top Accent */}
        <div className="bg-emerald-600 px-6 py-8 text-center text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 via-emerald-600 to-emerald-800 opacity-90"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight m-0 text-white font-sans flex items-center justify-center gap-2">
              <span className="text-emerald-200">✨</span> TalaqqeeHub
            </h1>
            <p className="text-emerald-100 text-xs mt-2 uppercase tracking-widest font-semibold">
              Quranic Recitation LMS Platform
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {/* Tab Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setIsLogin(true); handleQuickFill(role); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isLogin 
                  ? 'bg-white text-emerald-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                !isLogin 
                  ? 'bg-white text-emerald-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Switcher */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickFill('student')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    role === 'student'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap size={16} />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('teacher')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    role === 'teacher'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck size={16} />
                  Ustadz
                </button>
              </div>
            </div>

            {/* Quick Helper Label */}
            {isLogin && (
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Demo Creds loaded automatically:</span>
                <span className="font-semibold text-emerald-600 capitalize bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {role} Account
                </span>
              </div>
            )}

            {/* Name (Registration Only) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">Email Address</label>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-600 block">Password</label>
                {isLogin && (
                  <a href="#forgot" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 mt-6 cursor-pointer ${
                loading ? 'opacity-85 pointer-events-none' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>{isLogin ? 'Sign In Now' : 'Register Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Social Proof Note */}
          <div className="mt-8 text-center text-xs text-slate-400">
            Connecting Quran Scholars with Students around the world.
          </div>
        </div>
      </div>
    </div>
  );
}
