import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Bell, Check } from 'lucide-react';

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch initial notifications
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (!userId) return;

    // Subscribe to real-time INSERT changes for this user
    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New notification received:', payload.new);
          setNotifications(prev => [payload.new, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-full transition-colors cursor-pointer block outline-none"
      >
        <Bell size={18} className="text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 border border-white text-white rounded-full flex items-center justify-center text-[9px] font-black px-1 animate-pulse shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-scaleUp">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-rose-50 border border-rose-100 text-rose-700 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] text-emerald-600 hover:text-emerald-700 font-extrabold flex items-center gap-1 cursor-pointer transition-colors border-none bg-transparent outline-none"
              >
                <Check size={12} />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <span className="text-2xl block select-none">🔔</span>
                <p className="text-xs text-slate-400 font-bold uppercase m-0 leading-none">Inbox is clean</p>
                <p className="text-[10px] text-slate-400/70 font-semibold m-0 leading-none mt-1">No alerts or updates yet.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-3.5 transition-colors flex gap-2.5 items-start ${!notif.is_read ? 'bg-emerald-50/5 hover:bg-emerald-50/10' : 'hover:bg-slate-50/50'}`}
                >
                  {/* Status Indicator Dot */}
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${!notif.is_read ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`}></span>
                  
                  <div className="space-y-0.5 flex-1 text-left">
                    <h5 className="text-xs font-bold text-slate-800 m-0 leading-snug">{notif.title}</h5>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed m-0">{notif.message}</p>
                    <span className="text-[8px] text-slate-400 font-semibold block pt-0.5">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
