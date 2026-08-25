import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Map, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-slate-800 text-slate-300 mt-auto backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-black text-xl mb-4">
              <div className="p-1.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg text-white">
                <Sparkles className="w-5 h-5 text-indigo-200" />
              </div>
              <span className="text-gradient">Nexora</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Centralized College Event Management Platform. Real-time schedules, event registrations, QR check-ins, gallery archives, and certificate distribution.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/events" className="hover:text-indigo-400 transition">Upcoming Events</Link></li>
              <li><Link to="/gallery" className="hover:text-indigo-400 transition">Media Gallery</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition">About Platform</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition">Contact Support</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-400 transition">Frequently Asked Questions</Link></li>
              <li><Link to="/sitemap" className="hover:text-white transition text-indigo-400 flex items-center gap-1"><Map className="w-3.5 h-3.5" /> HTML Sitemap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Event Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Technical Fests & Hackathons</li>
              <li>Cultural Nights & Fests</li>
              <li>Intercollegiate Sports Meets</li>
              <li>Workshops & Bootcamps</li>
              <li>Academic Seminars</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Contact College Desk</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>events@nexora.edu</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 11 2345 6789</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-4">
                Office Hours: Mon - Fri, 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Nexora College Event Information System. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link to="/sitemap" className="hover:text-slate-300">Sitemap</Link>
            <Link to="/faq" className="hover:text-slate-300">Help & Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
