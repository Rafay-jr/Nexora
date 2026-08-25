import React from 'react';

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse shadow-md">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-24"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
      </div>
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4"></div>
      <div className="space-y-2 pt-1">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
      </div>
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800/80 w-full"></div>
      ))}
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-6 animate-pulse">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-2xl w-2/3"></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>
      <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
    </div>
  );
};
