import React, { useState } from 'react';
import { 
  CheckSquare, 
  Award, 
  LogOut, 
  Bell, 
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

export default function TeacherLayout({ user, currentView, setView, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuItems = [
    { id: 'dashboard', label: 'Teacher Hub', icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Mobile Sidebar backdrop dimmer */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-45 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Teacher Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex transition-transform duration-300 ease-in-out`}>
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🕌</span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight m-0">TalaqqeeHub</h2>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block leading-none">
                Teacher Portal
              </span>
            </div>
          </div>
          {/* Close sidebar button on mobile */}
          <button 
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Teacher User Card */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
          <img 
            src={user?.avatar} 
            alt={user?.name} 
            className="w-10 h-10 rounded-full border-2 border-emerald-500/30 object-cover"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate m-0 leading-tight">{user?.name}</h4>
            <span className="text-xs text-emerald-400 font-medium capitalize flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Ustadz / Teacher
            </span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}

          {/* Simulated Route Guard Tester */}
          <div className="pt-4 border-t border-slate-800 mt-4">
            <button
              onClick={() => setView('book-session')}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-wider text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 transition-all cursor-pointer"
            >
              <span>⚠️ Test Route Guard</span>
            </button>
          </div>
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-slate-800 space-y-1 bg-slate-950/20">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          {/* Menu Trigger Hamburger button on Mobile */}
          <button 
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-slate-50 text-slate-600 rounded-lg transition-all border border-slate-100 cursor-pointer mr-3"
          >
            <Menu size={20} />
          </button>

          {/* Section Indicator */}
          <div className="flex-1 flex items-center gap-2">
            <span className="text-slate-400 text-sm font-medium hidden sm:inline">Pages</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-slate-800 text-sm font-bold capitalize">
              {currentView === 'dashboard' ? 'Teacher Hub' : currentView.replace('-', ' ')}
            </span>
          </div>

          {/* User Profile and Notifications */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>

            {/* Profile Menus */}
            <div className="flex items-center gap-2.5 border-l border-slate-100 pl-4">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-slate-800 m-0 leading-none">{user?.name}</p>
                <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 block">Ustadz</span>
              </div>
              <img 
                src={user?.avatar} 
                alt={user?.name} 
                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
