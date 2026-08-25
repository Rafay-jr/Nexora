import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { playClickSound } from '../../utils/soundEffects';

interface BackButtonProps {
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ label = 'Back', className = '' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    playClickSound();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 shadow-sm backdrop-blur-md ${className}`}
      title="Go back to previous page"
    >
      <ArrowLeft className="w-4 h-4 text-indigo-500" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
