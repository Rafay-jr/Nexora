import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, QrCode } from 'lucide-react';
import api from '../../services/api';
import { Registration } from '../../types';

const ManageRegistrationsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/organizer/events/${id}/registrations`)
      .then(res => setRegistrations(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-16 text-gray-500">Loading registrations list...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Link to="/organizer/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" /> Back to Organizer Suite
      </Link>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Event Registrations List ({registrations.length})
        </h1>

        {registrations.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">No registrants for this event yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">QR Token</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registrations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900">{r.student?.name}</td>
                    <td className="p-3 text-gray-600">{r.student?.email}</td>
                    <td className="p-3 text-gray-600">{r.student?.detail?.department || 'N/A'}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-indigo-700 font-bold">{r.qr_code_token}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRegistrationsPage;
