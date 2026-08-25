import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Modal from '../common/Modal';
import { QrCode, Sparkles } from 'lucide-react';

interface QRCodeDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  qrToken: string;
  studentName: string;
}

const QRCodeDisplayModal: React.FC<QRCodeDisplayModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  qrToken,
  studentName
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="3D Digital Check-in Ticket">
      <div className="text-center space-y-4">
        <p className="text-sm font-bold text-slate-900">{eventTitle}</p>
        <p className="text-xs text-slate-500">Holder: <strong className="text-indigo-600">{studentName}</strong></p>

        {/* 3D Flip Ticket Container */}
        <div
          onClick={() => setFlipped(!flipped)}
          className="perspective-1000 my-4 cursor-pointer group inline-block w-full max-w-xs"
        >
          <div className={`relative transition-all duration-700 preserve-3d p-6 glass-card rounded-3xl border border-indigo-200/80 shadow-xl ${flipped ? 'rotate-y-180' : ''}`}>
            {/* Front Side */}
            <div className="backface-hidden space-y-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 inline-block shadow-inner">
                <QRCodeSVG value={qrToken} size={180} level="H" includeMargin={true} />
              </div>
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Click ticket to view token code
              </p>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 glass-dark rounded-3xl p-6 flex flex-col justify-center items-center text-white space-y-3 border border-indigo-400/30">
              <QrCode className="w-10 h-10 text-indigo-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-300">Unique Verification Code</h4>
              <p className="font-mono text-sm font-black tracking-widest text-amber-400 bg-indigo-950/80 px-3 py-1.5 rounded-lg border border-indigo-500/40">
                {qrToken}
              </p>
              <p className="text-[10px] text-slate-300">Scan at event entrance</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900">
          <p className="font-mono font-bold tracking-wider">{qrToken}</p>
          <p className="text-[11px] text-indigo-700 mt-1">Present this 3D QR pass at the hall entrance for instant entry confirmation.</p>
        </div>
      </div>
    </Modal>
  );
};

export default QRCodeDisplayModal;
