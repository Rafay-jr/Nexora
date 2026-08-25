import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, Clock, QrCode, Sparkles, CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react';
import api from '../../services/api';
import { Registration, Certificate, MediaGallery } from '../../types';
import { useAuth } from '../../context/AuthContext';
import QRCodeDisplayModal from '../../components/qr/QRCodeDisplayModal';
import ScrollReveal from '../../components/common/ScrollReveal';
import TiltCard from '../../components/3d/TiltCard';
import { playClickSound } from '../../utils/soundEffects';

const ParticipantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [savedMedia, setSavedMedia] = useState<MediaGallery[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedQr, setSelectedQr] = useState<{ token: string; title: string } | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/participant/dashboard');
      setRegistrations(res.data.registrations || []);
      setCertificates(res.data.certificates || []);

      const mediaRes = await api.get('/participant/saved-media');
      setSavedMedia(mediaRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const confirmedRegs = registrations.filter(r => r.status === 'confirmed');
  const waitlistRegs = registrations.filter(r => r.status === 'waitlist');

  return (
    <div className="space-y-8 relative z-10 font-sans">
      {/* Welcome Banner (Harmonious in Light & Dark mode) */}
      <ScrollReveal direction="up">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl border border-blue-400/30 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glow-indigo">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" /> Student Portal
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-poppins">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs text-blue-100">
              Department: <strong className="text-white">{user?.detail?.department || 'Student'}</strong> | Enrollment: <strong className="text-white">{user?.detail?.enrollment_no || 'N/A'}</strong>
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Top SRS Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ScrollReveal direction="up" delay={0}>
          <TiltCard maxTilt={10}>
            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-1">
              <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                <Calendar className="w-5 h-5" />
                <span className="text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-300">Active Registrations</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">{confirmedRegs.length}</h3>
            </div>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={60}>
          <TiltCard maxTilt={10}>
            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-1">
              <div className="flex justify-between items-center text-amber-500">
                <Clock className="w-5 h-5" />
                <span className="text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-300">Waitlist Queue</span>
              </div>
              <h3 className="text-3xl font-black text-amber-500">{waitlistRegs.length}</h3>
            </div>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={120}>
          <TiltCard maxTilt={10}>
            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-1">
              <div className="flex justify-between items-center text-emerald-500">
                <Award className="w-5 h-5" />
                <span className="text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-300">E-Certificates</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">{certificates.length}</h3>
            </div>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={180}>
          <TiltCard maxTilt={10}>
            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-1">
              <div className="flex justify-between items-center text-purple-500">
                <Bookmark className="w-5 h-5" />
                <span className="text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-300">Total History</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">{registrations.length}</h3>
            </div>
          </TiltCard>
        </ScrollReveal>
      </div>

      {/* My Registered Events Section */}
      <ScrollReveal direction="up" delay={100}>
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-poppins">My Registered Events</h3>
            <Link to="/participant/registrations" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Manage All ({registrations.length})
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-xs text-slate-500 font-bold">Loading registered events...</div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500 dark:text-slate-400 font-bold">
              You haven't registered for any upcoming events yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {registrations.slice(0, 4).map((reg) => (
                <div key={reg.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${reg.status === 'confirmed' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-300 dark:border-emerald-500/30' : 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-300 dark:border-amber-500/30'}`}>
                      {reg.status}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{reg.event?.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{new Date(reg.event?.event_date || '').toLocaleDateString()} • {reg.event?.venue}</p>
                  </div>

                  {reg.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        playClickSound();
                        setSelectedQr({ token: reg.qr_code_token, title: reg.event?.title || '' });
                      }}
                      className="btn-neon-gradient text-white p-2.5 rounded-xl shadow-md shrink-0"
                      title="View 3D QR Ticket"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Clean Timeline Section */}
      <ScrollReveal direction="up" delay={200}>
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-poppins">Recent Activity Timeline</h3>

          {registrations.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold py-4">No recent activity recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {registrations.slice(0, 3).map((reg) => (
                <div key={reg.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Registered for {reg.event?.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Token ID: {reg.qr_code_token}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{new Date(reg.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      {selectedQr && (
        <QRCodeDisplayModal
          isOpen={!!selectedQr}
          onClose={() => setSelectedQr(null)}
          eventTitle={selectedQr.title}
          qrToken={selectedQr.token}
          studentName={user?.name || ''}
        />
      )}
    </div>
  );
};

export default ParticipantDashboard;
