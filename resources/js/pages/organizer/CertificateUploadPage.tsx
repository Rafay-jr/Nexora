import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { Event, User } from '../../types';

const CertificateUploadPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [eventId, setEventId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [feePaid, setFeePaid] = useState(true);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.get('/organizer/dashboard').then(res => setEvents(res.data.events || []));
    api.get('/admin/users').then(res => setUsers(res.data.data ? res.data.data.filter((u: any) => u.role === 'participant') : []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      await api.post('/organizer/certificates/upload', {
        event_id: Number(eventId),
        student_id: Number(studentId),
        certificate_url: certificateUrl.trim(),
        fee_paid: feePaid,
      });

      setMsg({ type: 'success', text: 'E-Certificate issued successfully to participant!' });
      setCertificateUrl('');
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to upload certificate.' });
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
            <Award className="w-6 h-6 text-emerald-600" />
            Issue E-Certificate to Participant
          </h1>
          <p className="text-xs text-gray-500 mt-1">Upload certificate reference PDF URL for eligible verified attendees.</p>
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">Select Participant (Student)</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold"
            >
              <option value="">-- Select Student --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Certificate PDF URL / Storage Path</label>
            <input
              type="text"
              value={certificateUrl}
              onChange={(e) => setCertificateUrl(e.target.value)}
              required
              placeholder="e.g. /storage/certificates/cert_ai_workshop.pdf"
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="feePaid"
              checked={feePaid}
              onChange={(e) => setFeePaid(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <label htmlFor="feePaid" className="text-xs font-semibold text-gray-800">
              Certificate Fee Paid / Waived Verification
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 transition shadow-sm text-xs disabled:opacity-50 mt-4"
          >
            {loading ? 'Issuing Certificate...' : 'Issue E-Certificate'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CertificateUploadPage;
