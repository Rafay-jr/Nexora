import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Share2, Star, Download, Bookmark, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { Event, Feedback } from '../../types';
import { useAuth } from '../../context/AuthContext';
import CapacityBadge from '../../components/events/CapacityBadge';
import QRCodeDisplayModal from '../../components/qr/QRCodeDisplayModal';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Registration & QR Modal
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchEventDetail = async () => {
    try {
      const res = await api.get<Event>(`/events/${id}`);
      setEvent(res.data);

      if (user) {
        // Check user registration & bookmarks
        const [dashRes, bookRes] = await Promise.all([
          api.get('/participant/dashboard'),
          api.get('/participant/bookmarks')
        ]);

        const reg = dashRes.data.registrations?.find((r: any) => r.event_id === res.data.id && r.status === 'confirmed');
        if (reg) {
          setIsRegistered(true);
          setRegistrationId(reg.id);
          setQrToken(reg.qr_code_token);
        }

        const isBm = bookRes.data?.some((b: any) => b.event_id === res.data.id);
        setIsBookmarked(isBm);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setRegistering(true);
    setMessage(null);

    try {
      const res = await api.post('/participant/register-event', { event_id: event?.id });
      setMessage({ type: 'success', text: res.data.message });
      fetchEventDetail();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Registration failed.' });
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!registrationId) return;
    if (!confirm('Are you sure you want to cancel your registration?')) return;

    try {
      await api.post(`/participant/cancel-registration/${registrationId}`);
      setMessage({ type: 'success', text: 'Registration cancelled.' });
      setIsRegistered(false);
      setQrToken(null);
      fetchEventDetail();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to cancel registration.' });
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/participant/bookmark', { event_id: event?.id });
      setIsBookmarked(res.data.bookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCalendarDownload = async () => {
    if (!user) {
      const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event?.title}\nDESCRIPTION:${event?.description}\nLOCATION:${event?.venue}\nEND:VEVENT\nEND:VCALENDAR`;
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event?.title.replace(/\s+/g, '_')}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    try {
      const res = await api.post('/participant/calendar-sync', {
        event_id: event?.id,
        calendar_type: 'google'
      });

      const blob = new Blob([res.data.ics_content], { type: 'text/calendar;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event?.title.replace(/\s+/g, '_')}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${event?.title} on Nexora! ${event?.event_date}`;

    if (user) {
      try {
        await api.post('/participant/share-log', {
          event_id: event?.id,
          platform,
          share_message: text
        });
      } catch (err) { }
    }

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(event?.title || '')}&body=${encodeURIComponent(text + '\n' + url)}`;
    } else {
      navigator.clipboard.writeText(url);
      alert('Event link copied to clipboard!');
    }
  };

  if (loading) return <div className="text-center py-16 text-slate-400">Loading event details...</div>;
  if (!event) return <div className="text-center py-16 text-red-400 font-bold">Event not found or pending approval.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      <Link to="/events" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      <div className="glass-card rounded-3xl shadow-xl border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-500/40 px-3.5 py-1 rounded-full">
              {event.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-100 mt-3">{event.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Organized by <strong className="text-slate-200">{event.organizer?.name}</strong> ({event.organizer?.detail?.department})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmarkToggle}
              className={`p-3 rounded-2xl border transition ${isBookmarked ? 'bg-amber-950/80 border-amber-500/40 text-amber-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
              title="Save Event"
            >
              <Bookmark className="w-5 h-5 fill-current" />
            </button>
            <CapacityBadge
              maxParticipants={event.max_participants}
              confirmedCount={event.confirmed_registrations}
              availableSeats={event.available_seats}
              isFull={event.is_full}
            />
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/60 text-red-300 border border-red-500/40'}`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-slate-400 font-semibold">Date</p>
              <p className="font-bold text-slate-100">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-slate-400 font-semibold">Timing</p>
              <p className="font-bold text-slate-100">{event.start_time?.substring(0, 5)} - {event.end_time?.substring(0, 5)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-slate-400 font-semibold">Venue</p>
              <p className="font-bold text-slate-100 truncate">{event.venue}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Event Overview</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">{event.description}</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800 items-center justify-between">
          <div className="flex items-center gap-3">
            {isRegistered ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => qrToken && setQrToken(qrToken)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg glow-emerald"
                >
                  <CheckCircle className="w-4 h-4" /> View 3D QR Pass
                </button>
                <button
                  onClick={handleCancelRegistration}
                  className="bg-red-950/60 text-red-300 border border-red-500/40 font-bold text-xs px-4 py-3 rounded-2xl hover:bg-red-900/60 transition"
                >
                  Cancel Registration
                </button>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs px-7 py-3.5 rounded-2xl hover:opacity-90 transition shadow-xl glow-indigo uppercase tracking-wider disabled:opacity-50"
              >
                {registering ? 'Processing...' : event.is_full ? 'Join Waitlist Queue' : 'Register Now'}
              </button>
            )}

            <button
              onClick={handleCalendarDownload}
              className="bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs px-4 py-3 rounded-2xl hover:bg-slate-800 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              Add to Calendar (.ics)
            </button>
          </div>

          {/* Social Sharing */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share:</span>
            <button onClick={() => handleShare('whatsapp')} className="text-emerald-400 font-bold hover:underline">WhatsApp</button>
            <span className="text-slate-700">•</span>
            <button onClick={() => handleShare('email')} className="text-indigo-400 font-bold hover:underline">Email</button>
            <span className="text-slate-700">•</span>
            <button onClick={() => handleShare('copy')} className="text-slate-300 font-bold hover:underline">Copy Link</button>
          </div>
        </div>
      </div>

      {/* Peer Reviews Section */}
      <div className="glass-card rounded-3xl shadow-xl border border-white/10 p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-current" />
          Participant Reviews & Feedback ({event.feedback?.length || 0})
        </h3>

        {(!event.feedback || event.feedback.length === 0) ? (
          <p className="text-xs text-slate-400 py-4">No reviews submitted yet for this event.</p>
        ) : (
          <div className="space-y-4 divide-y divide-slate-800">
            {event.feedback.map(fb => (
              <div key={fb.id} className="pt-3 first:pt-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-200">{fb.student?.name || 'Anonymous Student'}</span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    {'★'.repeat(fb.rating)} ({fb.rating}/5)
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{fb.comments}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrToken && (
        <QRCodeDisplayModal
          isOpen={!!qrToken}
          onClose={() => setQrToken(null)}
          eventTitle={event.title}
          qrToken={qrToken}
          studentName={user?.name || 'Student'}
        />
      )}
    </div>
  );
};

export default EventDetailPage;
