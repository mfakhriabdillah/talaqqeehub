import React, { useState } from 'react';
import { DEFAULT_SESSIONS } from './data/mockData';
import AuthView from './components/AuthView';
import StudentLayout from './components/StudentLayout';
import TeacherLayout from './components/TeacherLayout';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import MushafEvaluation from './components/MushafEvaluation';
import { ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null); // null if logged out, otherwise { id, name, email, avatar, role }
  const [currentView, setView] = useState('dashboard');
  const [sessions, setSessions] = useState(DEFAULT_SESSIONS);
  const [activeSessionForEval, setActiveSessionForEval] = useState(null);

  // Authentication Handlers
  const handleLogin = (userData) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
    setActiveSessionForEval(null);
  };

  // Session State Modifiers
  const handleAddSession = (newSession) => {
    setSessions(prev => [newSession, ...prev]);
  };

  const handleAcceptSession = (sessionId) => {
    setSessions(prev => 
      prev.map(sess => 
        sess.id === sessionId ? { ...sess, status: 'Confirmed' } : sess
      )
    );
  };

  const handleDeclineSession = (sessionId) => {
    setSessions(prev => 
      prev.map(sess => 
        sess.id === sessionId ? { ...sess, status: 'Cancelled' } : sess
      )
    );
  };

  const handleStartEvaluation = (session) => {
    setActiveSessionForEval(session);
    setView('mushaf-evaluation');
  };

  const handleSubmitEvaluation = (sessionId, evaluationData) => {
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

  // 1. Authentication Check
  if (!user) {
    return <AuthView onLogin={handleLogin} />;
  }

  // 2. Simulated Route Guards check
  const isStudent = user.role === 'student';
  const isTeacher = user.role === 'teacher';

  const studentAllowedRoutes = ['dashboard', 'book-session'];
  const teacherAllowedRoutes = ['dashboard', 'mushaf-evaluation'];

  const isAccessDenied = 
    (isStudent && !studentAllowedRoutes.includes(currentView)) ||
    (isTeacher && !teacherAllowedRoutes.includes(currentView));

  // Access Denied Fallback UI
  if (isAccessDenied) {
    const LayoutWrapper = isStudent ? StudentLayout : TeacherLayout;
    return (
      <LayoutWrapper user={user} currentView={currentView} setView={setView} onLogout={handleLogout}>
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
                Your authenticated account (Role: <span className="text-slate-700 font-bold capitalize">{user.role}</span>) does not possess clearance to view the requested page (<span className="text-slate-700 font-bold font-mono">"{currentView}"</span>).
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setView('dashboard')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ArrowLeft size={14} />
                Return to Dashboard
              </button>
              <button
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
      <StudentLayout user={user} currentView={currentView} setView={setView} onLogout={handleLogout}>
        {currentView === 'dashboard' && (
          <StudentDashboard 
            sessions={sessions} 
            onAddSession={handleAddSession} 
            subView="dashboard"
          />
        )}
        {currentView === 'book-session' && (
          <StudentDashboard 
            sessions={sessions} 
            onAddSession={handleAddSession} 
            subView="book"
          />
        )}
      </StudentLayout>
    );
  }

  // 4. Render Teacher Dashboard with TeacherLayout
  if (isTeacher) {
    return (
      <TeacherLayout user={user} currentView={currentView} setView={setView} onLogout={handleLogout}>
        {currentView === 'dashboard' && (
          <TeacherDashboard 
            sessions={sessions} 
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
