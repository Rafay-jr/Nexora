import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { playClickSound } from '../../utils/soundEffects';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">Contact Nexora Support</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Have questions regarding event registrations, certificates, or organizer access?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0b0f19]/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
            <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Email Us</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">events@nexora.edu</p>
          </div>
          <div className="bg-white dark:bg-[#0b0f19]/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
            <Phone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Call Helpdesk</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">+91 11 2345 6789</p>
          </div>
          <div className="bg-white dark:bg-[#0b0f19]/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
            <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Campus Office</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Student Activity Board Center, Main Block</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#0b0f19]/90 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Message Received!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Thank you for reaching out. Our campus desk will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Send a Message</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input type="text" required placeholder="Full Name" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input type="email" required placeholder="name@college.edu" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input type="text" required placeholder="Inquiry topic..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea rows={4} required placeholder="Write your query here..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
              </div>
              <button type="submit" className="btn-neon-gradient font-bold text-xs px-6 py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg glow-indigo flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
