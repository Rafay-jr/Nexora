import React from 'react';
import { Users, AlertCircle } from 'lucide-react';

interface CapacityBadgeProps {
  maxParticipants: number;
  confirmedCount?: number;
  availableSeats?: number;
  isFull?: boolean;
}

const CapacityBadge: React.FC<CapacityBadgeProps> = ({
  maxParticipants,
  confirmedCount = 0,
  availableSeats,
  isFull
}) => {
  const seatsLeft = availableSeats !== undefined ? availableSeats : Math.max(0, maxParticipants - confirmedCount);
  const full = isFull !== undefined ? isFull : seatsLeft <= 0;

  if (full) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-950/90 text-red-400 border border-red-500/50 backdrop-blur-md shadow-md">
        <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
        <span>FULL (Waitlist Open)</span>
      </span>
    );
  }

  if (seatsLeft <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-950/90 text-amber-400 border border-amber-500/50 backdrop-blur-md shadow-md">
        <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>{seatsLeft} {seatsLeft === 1 ? 'Seat' : 'Seats'} Left</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-950/90 text-emerald-400 border border-emerald-500/50 backdrop-blur-md shadow-md">
      <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <span>{seatsLeft} / {maxParticipants} Seats Available</span>
    </span>
  );
};

export default CapacityBadge;
