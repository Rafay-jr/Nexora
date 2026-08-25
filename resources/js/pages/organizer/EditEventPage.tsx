import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { Event } from '../../types';

const EditEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    event_date: '',
    start_time: '',
    end_time: '',
    venue: '',
    max_participants: 50,
    status: 'active',
    cancellation_reason: '',
  });

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(res => {
        const e: Event = res.data;
        setFormData({
          title: e.title,
          description: e.description,
          category: e.category,
          event_date: e.event_date ? e.event_date.substring(0, 10) : '',
          start_time: e.start_time ? e.start_time.substring(0, 5) : '',
          end_time: e.end_time ? e.end_time.substring(0, 5) : '',
          venue: e.venue,
          max_participants: e.max_participants,
          status: e.status,
          cancellation_reason: e.cancellation_reason || '',
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.put(`/organizer/events/${id}`, formData);
      alert('Event updated successfully!');
      navigate('/organizer/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-500">Loading event data...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link to="/organizer/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" /> Back to Organizer Suite
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Edit & Manage Event</h1>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Max Capacity</label>
              <input
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {formData.status === 'cancelled' && (
            <div>
              <label className="block text-xs font-semibold text-red-700 mb-1">Reason for Cancellation</label>
              <input
                type="text"
                name="cancellation_reason"
                value={formData.cancellation_reason}
                onChange={handleChange}
                placeholder="Brief reason sent to registrants..."
                className="w-full px-3.5 py-2.5 text-xs border border-red-300 rounded-xl bg-red-50/30"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Event Date</label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition shadow-sm text-xs disabled:opacity-50 mt-4 flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Saving Changes...' : 'Save Event Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
