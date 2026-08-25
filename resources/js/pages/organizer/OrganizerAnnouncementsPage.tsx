import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Megaphone, Send, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { Event } from '../../types';

const OrganizerAnnouncementsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const [eventId, setEventId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.get('/organizer/dashboard').then(res => setEvents(res.data.events || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await api.post('/organizer/announcements', {
        event_id: Number(eventId),
        title,
        message,
      });

      setMsg({ type: 'success', text: `Announcement broadcast sent to ${res.data.recipients_count} registered participants!` });
      setTitle('');
      setMessage('');
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to send announcement.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link to="/organizer/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" /> Back to Organizer Suite
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-600" />
            Send Event Announcement
          </h1>
          <p className="text-xs text-gray-500 mt-1">Send in-app notifications and schedule updates to registered participants.</p>
        </div>

        {msg && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {msg.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Select Event</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold"
            >
              <option value="">-- Select Event --</option>
              {events.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Announcement Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Venue Change Alert or Schedule Update"
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Message Content</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Detailed announcement text sent to student notifications..."
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-amber-700 transition shadow-sm text-xs disabled:opacity-50 mt-4 flex items-center justify-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Broadcasting...' : 'Broadcast Announcement'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizerAnnouncementsPage;
