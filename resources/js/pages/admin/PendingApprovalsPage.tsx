import React, { useState, useEffect } from 'react';
import { CheckSquare, XCircle, Calendar, MapPin, Users, Tag, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { Event } from '../../types';
import ScrollReveal from '../../components/common/ScrollReveal';
import { playClickSound } from '../../utils/soundEffects';

const PendingApprovalsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPendingEvents = async () => {
    try {
      const res = await api.get('/admin/pending-events');
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const handleApprove = async (id: number) => {
    playClickSound();
    try {
      await api.post(`/admin/events/${id}/approve`);
      setMessage({ type: 'success', text: 'Event proposal approved! It is now live on the public directory.' });
      fetchPendingEvents();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to approve event.' });
    }
  };

  const handleReject = async (id: number) => {
    playClickSound();
    const reason = prompt('Please specify a rejection reason for the organizer:', 'Proposal requires further administrative review.');
    if (!reason) return;

    try {
      await api.post(`/admin/events/${id}/reject`, { reason });
      setMessage({ type: 'success', text: 'Event proposal rejected.' });
      fetchPendingEvents();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to reject event.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      <ScrollReveal direction="up">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 font-poppins">Pending Event Proposals ({events.length})</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Review event proposals submitted by faculty organizers before publishing them to campus</p>
        </div>
      </ScrollReveal>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30' : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-500 font-bold">Loading pending proposals...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm font-bold shadow-md">
          No pending event proposals awaiting review.
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event, idx) => (
            <ScrollReveal key={event.id} direction="up" delay={idx * 100}>
              <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                    {event.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Date: {new Date(event.event_date).toLocaleDateString()}</span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 font-poppins">{event.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Organized by: <strong className="text-slate-800 dark:text-slate-200">{event.organizer?.name}</strong> ({event.organizer?.detail?.department || 'Faculty Staff'})
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {event.description}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-semibold"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {event.venue}</span>
                    <span className="flex items-center gap-1 font-semibold"><Users className="w-3.5 h-3.5 text-blue-500" /> {event.max_participants} Capacity</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApprove(event.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <CheckSquare className="w-4 h-4" /> Approve Proposal
                    </button>
                    <button
                      onClick={() => handleReject(event.id)}
                      className="bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/40 hover:bg-red-100 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4 text-red-500" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovalsPage;
