import React, { useState } from 'react';
import { QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  eventTitle: string;
  onSuccess?: () => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onSuccess
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post('/organizer/attendance/scan', {
        event_id: eventId,
        qr_code_token: tokenInput.trim(),
      });

      setMessage({ type: 'success', text: `Attendance verified & marked for ${res.data.attendance?.student?.name || 'student'}!` });
      setTokenInput('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Verification failed. Invalid or expired token.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Organizer Attendance Scanner">
      <div className="space-y-4">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
          <QrCode className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
          <h4 className="font-bold text-gray-900 text-sm">{eventTitle}</h4>
          <p className="text-xs text-gray-600 mt-1">Scan or enter the participant's QR Token below.</p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleScanSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Enter QR Code Token</label>
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. QR-AB12345678"
              className="w-full text-center font-mono font-bold tracking-widest px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
          >
            {loading ? 'Verifying Token...' : 'Verify & Mark Attendance'}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default QRScannerModal;
