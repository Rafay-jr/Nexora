import React from 'react';

interface AmbientOrbCanvasProps {
  className?: string;
}

const AmbientOrbCanvas: React.FC<AmbientOrbCanvasProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* Orb 1: Indigo Top Right */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-glow" />
      {/* Orb 2: Purple Bottom Left */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      {/* Orb 3: Pink Center Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }} />
    </div>
  );
};

export default AmbientOrbCanvas;
