import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, QrCode, Users, Award, Image, Megaphone, Edit, Calendar, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { Event } from '../../types';
import QRScannerModal from '../../components/qr/QRScannerModal';
import ScrollReveal from '../../components/common/ScrollReveal';
import TiltCard from '../../components/3d/TiltCard';
import { playClickSound } from '../../utils/soundEffects';

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Scanner modal state
  const [scannerEvent, setScannerEvent] = useState<{ id: number; title: string } | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/organizer/dashboard');
      setEvents(res.data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center py-16 text-slate-500 font-bold">Loading organizer dashboard...</div>;

  return (
    <div className="space-y-8 relative z-10">
      {/* Header Banner (Harmonious Theme Support) */}
      <ScrollReveal direction="up">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl border border-indigo-400/30 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glow-indigo">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" /> Faculty Organizer Workspace
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-poppins">
              Organizer Management Suite
            </h1>
            <p className="text-xs text-indigo-100">
              Manage event proposals, monitor registrations, scan QR codes, and issue certificates
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/organizer/events/create"
              onClick={() => playClickSound()}
              className="bg-white text-slate-900 font-extrabold text-xs px-5 py-3 rounded-2xl hover:bg-slate-100 transition shadow-lg flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" /> Create Event Proposal
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScrollReveal direction="up" delay={50}>
          <TiltCard maxTilt={8}>
            <Link
              to="/organizer/media/upload"
              onClick={() => playClickSound()}
              className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md hover:border-purple-500 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                <Image className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-poppins">Upload Gallery Media</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add photos & videos to fest archives</p>
              </div>
            </Link>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <TiltCard maxTilt={8}>
            <Link
              to="/organizer/certificates/upload"
              onClick={() => playClickSound()}
              className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md hover:border-emerald-500 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-poppins">Issue E-Certificates</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Distribute certificates for attendees</p>
              </div>
            </Link>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <TiltCard maxTilt={8}>
            <Link
              to="/organizer/announcements"
              onClick={() => playClickSound()}
              className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md hover:border-amber-500 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-poppins">Send Announcement</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Broadcast update to event registrants</p>
              </div>
            </Link>
          </TiltCard>
        </ScrollReveal>
      </div>

      {/* Events Table (High usability flat & crisp) */}
      <ScrollReveal direction="up" delay={200}>
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-slate-100 flex justify-between items-center bg-slate-50 dark:bg-slate-950/60 font-poppins">
            <span>My Events ({events.length})</span>
          </div>

          {events.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 font-bold">No events created yet. Click "Create Event Proposal" above to start.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Event Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4">Registrations</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {events.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{e.title}</td>
                      <td className="p-4 capitalize text-slate-600 dark:text-slate-400 font-semibold">{e.category}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 font-semibold">{new Date(e.event_date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${e.approval_status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' : e.approval_status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30' : 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30'}`}>
                          {e.approval_status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                        {e.registrations_count || 0} / {e.max_participants}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            playClickSound();
                            setScannerEvent({ id: e.id, title: e.title });
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1 shadow-md text-xs"
                          title="Scan Attendance"
                        >
                          <QrCode className="w-3.5 h-3.5" /> Scan QR
                        </button>
                        <Link
                          to={`/organizer/events/${e.id}/registrations`}
                          onClick={() => playClickSound()}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-3 py-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition inline-flex items-center gap-1 text-xs"
                        >
                          <Users className="w-3.5 h-3.5" /> View List
                        </Link>
                        <Link
                          to={`/organizer/events/${e.id}/edit`}
                          onClick={() => playClickSound()}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2.5 py-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition inline-flex items-center text-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ScrollReveal>

      {scannerEvent && (
        <QRScannerModal
          isOpen={!!scannerEvent}
          onClose={() => setScannerEvent(null)}
          eventId={scannerEvent.id}
          eventTitle={scannerEvent.title}
          onSuccess={fetchDashboard}
        />
      )}
    </div>
  );
};

export default OrganizerDashboard;
