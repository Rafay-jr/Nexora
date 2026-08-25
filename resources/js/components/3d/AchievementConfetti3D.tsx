import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface AchievementConfetti3DProps {
  trigger?: boolean;
}

const AchievementConfetti3D: React.FC<AchievementConfetti3DProps> = ({ trigger = true }) => {
  useEffect(() => {
    if (trigger) {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b'],
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [trigger]);

  return null;
};

export default AchievementConfetti3D;
