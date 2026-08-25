import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { Event } from '../../types';

const OrganizerMediaPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const [eventId, setEventId] = useState('');
  const [fileType, setFileType] = useState<'image' | 'video'>('image');
  const [fileUrl, setFileUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Technical Fests');
  const [department, setDepartment] = useState('');

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
      await api.post('/organizer/media/upload', {
        event_id: eventId ? Number(eventId) : null,
        file_type: fileType,
        file_url: fileUrl.trim(),
        caption,
        category,
        department,
        year: 2026,
      });

      setMsg({ type: 'success', text: 'Media item uploaded to campus gallery successfully!' });
      setFileUrl('');
      setCaption('');
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to upload media.' });
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
            <Image className="w-6 h-6 text-purple-600" />
            Upload Gallery Photo / Video
          </h1>
          <p className="text-xs text-gray-500 mt-1">Publish media to the public college fest gallery archives.</p>
        </div>

        {msg && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {msg.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Media Type</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as 'image' | 'video')}
                className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                <option value="image">Photo / Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Gallery Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                <option value="Technical Fests">Technical Fests</option>
                <option value="Cultural Events">Cultural Events</option>
                <option value="Sports Meets">Sports Meets</option>
                <option value="Workshops and Seminars">Workshops and Seminars</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Associated Event (Optional)</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold"
            >
              <option value="">-- Standalone Campus Media --</option>
              {events.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Image / Video URL</label>
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              required
              placeholder="https://images.unsplash.com/... or media path"
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Caption / Title</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Brief photo caption..."
                className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science Board"
                className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-purple-700 transition shadow-sm text-xs disabled:opacity-50 mt-4 flex items-center justify-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            {loading ? 'Uploading Media...' : 'Publish Media to Gallery'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizerMediaPage;
