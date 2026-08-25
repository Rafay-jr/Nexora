import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

const faqs = [
  {
    q: "Do visitors need to create an account to browse events?",
    a: "No! Unregistered visitors can freely browse all public events, categories, search, media gallery, announcements, and sitemap without logging in."
  },
  {
    q: "How does the live venue capacity and waitlist work?",
    a: "Each event has a maximum seat limit. Nexora tracks available seats in real-time. When capacity reaches 0 (FULL), subsequent registrants are automatically placed on a prioritized waitlist queue. If an existing participant cancels, the top waitlisted student is automatically promoted!"
  },
  {
    q: "How do I check in on the day of an event?",
    a: "Registered participants receive a unique 3D ticket QR code token in their dashboard. Show this QR code to the event organizer at the entrance for instant check-in verification."
  },
  {
    q: "How do e-certificates work?",
    a: "After attending an event, organizers issue e-certificates to verified attendees. Participants can view and download their e-certificates directly from their participant dashboard."
  },
  {
    q: "How can faculty members become event organizers?",
    a: "Faculty members can register as organizers. New events created by organizers enter a 'Pending Approval' state and are reviewed by system administrators before going live."
  }
];

const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative z-10">
      <ScrollReveal direction="up">
        <div className="text-center space-y-3">
          <div className="p-3.5 bg-gradient-to-tr from-blue-600 to-purple-600 text-white rounded-2xl w-fit mx-auto shadow-lg glow-indigo">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">Frequently Asked Questions</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">Common questions about Nexora registrations, QR check-ins, and user roles</p>
        </div>
      </ScrollReveal>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <ScrollReveal key={idx} direction="up" delay={idx * 80}>
            <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                <span>{faq.q}</span>
                {openIndex === idx ? <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {openIndex === idx && (
                <div className="px-6 pb-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
