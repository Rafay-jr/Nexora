import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, QrCode, AlertCircle, Trash2, CheckCircle2, Clock } from 'lucide-react';
import api from '../../services/api';
import { Registration } from '../../types';
import QRCodeDisplayModal from '../../components/qr/QRCodeDisplayModal';
import ScrollReveal from '../../components/common/ScrollReveal';
import { playClickSound } from '../../utils/soundEffects';

const MyRegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState<{ token: string; title: string } | null>(null);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get('/participant/dashboard');
      setRegistrations(res.data.registrations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (id: number) => {
    playClickSound();
    if (!confirm('Are you sure you want to cancel this event registration?')) return;
    try {
      await api.post(`/participant/cancel-registration/${id}`);
      fetchRegistrations();
    } catch (err) {
      alert('Failed to cancel registration.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      <ScrollReveal direction="up">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">My Event Registrations</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Manage your confirmed slots, access 3D QR check-in passes, and track history</p>
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="text-center py-16 text-slate-500 font-bold">Loading registrations...</div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm font-bold shadow-md">
          You haven't registered for any events yet.{' '}
          <Link to="/events" className="text-blue-600 dark:text-blue-400 underline ml-1">Browse Events</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg, idx) => (
            <ScrollReveal key={reg.id} direction="up" delay={idx * 80}>
              <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${reg.status === 'confirmed' ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' : 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30'}`}>
                      {reg.status}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Token: <code className="font-bold text-blue-600 dark:text-blue-400">{reg.qr_code_token}</code></span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{reg.event?.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-500" /> {new Date(reg.event?.event_date || '').toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {reg.event?.venue}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {reg.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        playClickSound();
                        setSelectedQr({ token: reg.qr_code_token, title: reg.event?.title || '' });
                      }}
                      className="btn-neon-gradient text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <QrCode className="w-4 h-4" /> 3D Pass QR
                    </button>
                  )}
                  {reg.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(reg.id)}
                      className="bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30 font-bold text-xs px-3.5 py-2.5 rounded-xl hover:bg-red-100 transition"
                      title="Cancel Registration"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {selectedQr && (
        <QRCodeDisplayModal
          isOpen={!!selectedQr}
          onClose={() => setSelectedQr(null)}
          eventTitle={selectedQr.title}
          qrToken={selectedQr.token}
          studentName=""
        />
      )}
    </div>
  );
};

export default MyRegistrationsPage;
