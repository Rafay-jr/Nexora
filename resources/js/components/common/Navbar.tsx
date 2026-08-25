import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Sun, Moon, Shield, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import UserProfileDrawer from './UserProfileDrawer';
import { playClickSound } from '../../utils/soundEffects';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === 'admin';
  const isOrganizer = user?.role === 'organizer';

  // Specific role-based navigation rules
  const showAbout = !isAdmin && !isOrganizer;
  const showContact = !isAdmin && !isOrganizer;

  return (
    <>
      <div className="fixed top-3 left-0 right-0 z-[9900] px-4 sm:px-6 lg:px-8 pointer-events-none">
        <nav className="pointer-events-auto max-w-7xl mx-auto rounded-3xl bg-white/85 dark:bg-[#070a13]/85 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl backdrop-blur-2xl transition-all duration-300 px-6 py-2.5">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 font-black text-2xl tracking-wider group">
                <div className="p-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl text-white shadow-md glow-indigo group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-blue-200" />
                </div>
                <span className="text-gradient font-poppins">Nexora</span>
              </Link>

              <div className="hidden md:flex ml-10 space-x-6">
                <Link to="/events" className={`text-xs font-black uppercase tracking-wider transition ${isActive('/events') ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white'}`}>
                  Events
                </Link>
                <Link to="/gallery" className={`text-xs font-black uppercase tracking-wider transition ${isActive('/gallery') ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white'}`}>
                  Gallery
                </Link>

                {showAbout && (
                  <Link to="/about" className={`text-xs font-black uppercase tracking-wider transition ${isActive('/about') ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white'}`}>
                    About
                  </Link>
                )}

                {showContact && (
                  <Link to="/contact" className={`text-xs font-black uppercase tracking-wider transition ${isActive('/contact') ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white'}`}>
                    Contact
                  </Link>
                )}

                {!isAdmin && (
                  <Link to="/faq" className={`text-xs font-black uppercase tracking-wider transition ${isActive('/faq') ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white'}`}>
                    FAQ
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Direct Dashboard Shortcuts in Header */}
              {user && user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => playClickSound()}
                  className="flex items-center space-x-1.5 text-xs font-black text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/90 border border-amber-400 dark:border-amber-500/50 px-3.5 py-1.5 rounded-2xl hover:bg-amber-200 dark:hover:bg-amber-900/80 transition shadow-sm"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {user && user.role === 'organizer' && (
                <Link
                  to="/organizer/dashboard"
                  onClick={() => playClickSound()}
                  className="flex items-center space-x-1.5 text-xs font-black text-indigo-900 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/90 border border-indigo-300 dark:border-indigo-500/50 px-3.5 py-1.5 rounded-2xl hover:bg-indigo-200 dark:hover:bg-indigo-900/80 transition shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Organizer Suite</span>
                </Link>
              )}

              {user && user.role === 'participant' && (
                <Link
                  to="/participant/dashboard"
                  onClick={() => playClickSound()}
                  className="flex items-center space-x-1.5 text-xs font-black text-blue-900 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/90 border border-blue-300 dark:border-blue-500/50 px-3.5 py-1.5 rounded-2xl hover:bg-blue-200 dark:hover:bg-blue-900/80 transition shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">My Dashboard</span>
                </Link>
              )}

              {/* Theme Toggle Button */}
              <button
                onClick={() => {
                  playClickSound();
                  toggleTheme();
                }}
                className="p-2 rounded-2xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
              </button>

              {user ? (
                /* Profile Trigger Button */
                <button
                  onClick={() => {
                    playClickSound();
                    setIsDrawerOpen(true);
                  }}
                  className="flex items-center space-x-2.5 p-1 pr-3 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl transition group"
                  title="Open User Profile & Notifications Drawer"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-none">{user.name}</p>
                    <p className="text-[9px] uppercase font-black text-blue-600 dark:text-blue-400 tracking-wider leading-none mt-0.5">{user.role}</p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-xs font-black text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-white px-3 py-1.5 transition">
                    Sign In
                  </Link>
                  <Link to="/register" className="text-xs font-black text-white btn-neon-gradient px-4 py-1.5 rounded-2xl transition shadow-md">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* User Profile Slide-over Drawer Sidebar */}
      <UserProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default Navbar;
