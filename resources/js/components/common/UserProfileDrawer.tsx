import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, User, Settings, Bell, LogOut, Shield, Award, Calendar, Trash2, Check, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { NotificationItem } from '../../types';
import { playClickSound } from '../../utils/soundEffects';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const fetchNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const res = await api.get('/notifications');
      const cleaned = (res.data || []).map((n: NotificationItem) => ({
        ...n,
        title: n.title?.replace('EventSphere', 'Nexora'),
        message: n.message?.replace('EventSphere', 'Nexora')
      }));
      setNotifications(cleaned);
    } catch (err) {
      // quiet
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const handleLogout = async () => {
    playClickSound();
    onClose();
    await logout();
    navigate('/login');
  };

  const markAllRead = async () => {
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
    } catch (err) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => {
          playClickSound();
          onClose();
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0b0f19] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-50 text-slate-900 dark:text-slate-100">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md glow-indigo">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{user.name}</h3>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">{user.role}</p>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 text-xs font-bold bg-slate-100/50 dark:bg-slate-950/40">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('profile');
              }}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              User Account
            </button>
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('notifications');
              }}
              className={`flex-1 py-3 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                activeTab === 'notifications'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'profile' ? (
              <div className="space-y-6">
                {/* User Info Details Box */}
                <div className="bg-slate-50 dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <p className="text-slate-500 dark:text-slate-400">Username: <strong className="text-slate-800 dark:text-slate-200">@{user.username}</strong></p>
                  <p className="text-slate-500 dark:text-slate-400">Email: <strong className="text-slate-800 dark:text-slate-200">{user.email}</strong></p>
                  <p className="text-slate-500 dark:text-slate-400">Department: <strong className="text-slate-800 dark:text-slate-200">{user.detail?.department || 'Student'}</strong></p>
                  <p className="text-slate-500 dark:text-slate-400">Enrollment: <strong className="text-slate-800 dark:text-slate-200">{user.detail?.enrollment_no || 'N/A'}</strong></p>
                </div>

                {/* Quick Navigation Links */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Account Actions</h4>

                  {user.role === 'participant' && (
                    <>
                      <Link
                        to="/participant/profile"
                        onClick={onClose}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition text-xs font-bold"
                      >
                        <Settings className="w-4 h-4 text-blue-500" />
                        <span>Profile & Security Settings</span>
                      </Link>

                      <Link
                        to="/participant/registrations"
                        onClick={onClose}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition text-xs font-bold"
                      >
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span>My Event Registrations</span>
                      </Link>

                      <Link
                        to="/participant/certificates"
                        onClick={onClose}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition text-xs font-bold"
                      >
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>My E-Certificates</span>
                      </Link>
                    </>
                  )}

                  {user.role === 'organizer' && (
                    <Link
                      to="/organizer/dashboard"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition text-xs font-bold"
                    >
                      <Shield className="w-4 h-4 text-indigo-500" />
                      <span>Organizer Suite Dashboard</span>
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition text-xs font-bold"
                    >
                      <Shield className="w-4 h-4 text-amber-500" />
                      <span>Platform Operations Control</span>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              /* Notifications Manager Tab */
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500">
                    {unreadCount} Unread Alerts
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark All Read
                    </button>
                  )}
                </div>

                {loadingNotifs ? (
                  <div className="text-center py-10 text-xs text-slate-500 font-bold">Loading alerts...</div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-500 font-bold">No campus notifications available.</div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-4 rounded-2xl border text-xs space-y-2 transition ${
                          !n.read_at
                            ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/30'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h5 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-blue-500" />
                            {n.title}
                          </h5>
                          <button
                            onClick={() => deleteNotification(n.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition"
                            title="Delete alert"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{n.message}</p>
                        <p className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer Exit / Logout */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/40 font-black text-xs py-3.5 rounded-2xl hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit / Logout Account</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfileDrawer;
