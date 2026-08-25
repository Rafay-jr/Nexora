import React from 'react';
import { ShieldCheck, Target, Users, Sparkles } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 relative z-10">
      <ScrollReveal direction="up">
        <div className="text-center space-y-3">
          <div className="p-3.5 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl w-fit mx-auto shadow-lg glow-indigo text-white">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100">About Nexora</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover, Participate and Celebrate Every College Event. Centralized platform eliminating paper noticeboards and mismanaged student registrations.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100}>
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-8 shadow-md dark:shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Background & Problem Statement</h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Colleges frequently organize technical hackathons, cultural fests, academic seminars, and athletic meets. Previously, details were circulated via paper noticeboards or informal group messages leading to missed announcements, low turnout, scheduling conflicts, and paper-heavy registrations.
          </p>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong>Nexora</strong> resolves these issues by serving as an authenticated digital hub with real-time slot availability, 3D interactive check-in validation, e-certificates, and role-based permissions for students, faculty organizers, and system administrators.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <ScrollReveal direction="up" delay={150}>
          <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Real-Time Access</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Live seating limits, automatic waitlists, and instant schedule updates across browsers.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
            <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Paperless Process</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">System-generated QR code check-ins and direct e-certificate issuance.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={250}>
          <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Role Governance</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Separated Visitor, Participant, Organizer, and Admin operational permissions.</p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default AboutPage;
