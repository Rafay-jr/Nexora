import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, Trash2, Check, X, Shield, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { NotificationItem } from '../../types';
import Modal from './Modal';
import { playClickSound } from '../../utils/soundEffects';

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      // Clean up legacy titles
      const cleaned = (res.data || []).map((n: NotificationItem) => ({
        ...n,
        title: n.title?.replace('EventSphere', 'Nexora'),
        message: n.message?.replace('EventSphere', 'Nexora')
      }));
      setNotifications(cleaned);
    } catch (err) {
      // quiet fail
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const handleNotificationClick = async (item: NotificationItem) => {
    playClickSound();
    setSelectedNotification(item);
    setIsOpen(false);

    if (!item.read_at) {
      try {
        await api.post(`/notifications/${item.id}/read`);
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read_at: new Date().toISOString() } : n));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const markAllAsRead = async () => {
    playClickSound();
    try {
      await Promise.all(
        notifications.filter(n => !n.read_at).map(n => api.post(`/notifications/${n.id}/read`))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: number) => {
    playClickSound();
    try {
      await api.delete(`/notifications/${id}`).catch(() => {});
      setNotifications(prev => prev.filter(n => n.id !== id));
      setSelectedNotification(null);
    } catch (err) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      setSelectedNotification(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          playClickSound();
          setIsOpen(!isOpen);
        }}
        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition relative"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 transition-all">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">Campus Notifications</h3>
              <span className="text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
                {unreadCount} new
              </span>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark All Read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-bold">No notifications available.</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer ${!item.read_at ? 'bg-blue-50/50 dark:bg-blue-950/40' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                        {!item.read_at && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shadow-sm"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{item.message}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Notification Detail & Management Modal Popup */}
      {selectedNotification && (
        <Modal
          isOpen={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
          title="Notification Details & Management"
        >
          <div className="space-y-6 p-2">
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/30">
                  Campus Alert
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 pt-1">{selectedNotification.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Received on: {new Date(selectedNotification.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Message Body</h4>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                {selectedNotification.message}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => deleteNotification(selectedNotification.id)}
                className="bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/40 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/60 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4 text-red-500" /> Delete Notification
              </button>

              <button
                onClick={() => setSelectedNotification(null)}
                className="bg-slate-900 text-white dark:bg-slate-800 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NotificationBell;
