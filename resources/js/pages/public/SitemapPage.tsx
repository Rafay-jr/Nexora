import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, ExternalLink, Calendar, FileText } from 'lucide-react';
import api from '../../services/api';

interface SitemapData {
  static_pages: { name: string; url: string }[];
  event_pages: { name: string; url: string }[];
}

const SitemapPage: React.FC = () => {
  const [data, setData] = useState<SitemapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/sitemap')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      <div className="text-center space-y-3">
        <div className="p-3.5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl w-fit mx-auto shadow-lg glow-indigo">
          <Map className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-100">Nexora HTML Sitemap</h1>
        <p className="text-xs text-slate-400">Complete navigation flow and active event URLs across the application</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading sitemap links...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-indigo-400" />
              Core Informational Pages
            </h3>
            <ul className="space-y-2.5 text-xs">
              {data?.static_pages.map((p, idx) => (
                <li key={idx}>
                  <Link to={p.url} className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    {p.name} ({p.url})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Active Event Listings ({data?.event_pages.length || 0})
            </h3>
            <ul className="space-y-2.5 text-xs max-h-80 overflow-y-auto">
              {data?.event_pages.map((e, idx) => (
                <li key={idx}>
                  <Link to={e.url} className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SitemapPage;
