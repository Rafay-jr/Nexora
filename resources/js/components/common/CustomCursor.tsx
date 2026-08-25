import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering interactive elements
      const target = e.target as HTMLElement;
      if (target && target.closest('a, button, input, select, textarea, [role="button"]')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    let animId: number;
    const updateTrail = () => {
      setTrail(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.2,
        y: prev.y + (pos.y - prev.y) * 0.2,
      }));
      animId = requestAnimationFrame(updateTrail);
    };
    animId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animId);
    };
  }, [pos.x, pos.y]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Sleek Custom 3D Sci-Fi Cursor Pointer Arrow */}
      <div
        className="fixed top-0 left-0 transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0px) scale(${isClicked ? 0.8 : isHovered ? 1.3 : 1})`,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]"
        >
          <path
            d="M3 3L10.5 21L13.5 13.5L21 10.5L3 3Z"
            fill="url(#cursor-gradient)"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="cursor-gradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="0.5" stopColor="#a855f7" />
              <stop offset="1" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Trailing Neon Aura Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full border border-indigo-400/50 transition-all duration-300 backdrop-blur-[1px] ${
          isHovered ? 'w-12 h-12 bg-indigo-500/10 border-indigo-400 ring-4 ring-indigo-500/20' : 'w-8 h-8'
        }`}
        style={{
          transform: `translate3d(${trail.x - (isHovered ? 24 : 16)}px, ${trail.y - (isHovered ? 24 : 16)}px, 0px)`,
          boxShadow: isHovered ? '0 0 20px rgba(168,85,247,0.5)' : '0 0 10px rgba(99,102,241,0.3)',
        }}
      />
    </div>
  );
};

export default CustomCursor;
