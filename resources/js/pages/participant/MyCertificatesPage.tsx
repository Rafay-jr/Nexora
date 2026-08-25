import React, { useState, useEffect } from 'react';
import { Award, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { Certificate } from '../../types';
import AchievementConfetti3D from '../../components/3d/AchievementConfetti3D';
import TiltCard from '../../components/3d/TiltCard';
import ScrollReveal from '../../components/common/ScrollReveal';
import { playClickSound } from '../../utils/soundEffects';

const MyCertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/participant/dashboard');
        const certs = res.data.certificates || [];
        setCertificates(certs);
        if (certs.length > 0) {
          setShowConfetti(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = (cert: Certificate) => {
    playClickSound();
    const content = `====================================================\nNEXORA OFFICIAL COLLEGE E-CERTIFICATE\n====================================================\n\nCertificate Code: ${cert.certificate_code}\nIssued To: Student Participant\nEvent: ${cert.event?.title || 'College Event'}\nIssue Date: ${new Date(cert.issue_date).toLocaleDateString()}\n\nStatus: Officially Verified by Department Chair.\n====================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Certificate_${cert.certificate_code}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      <AchievementConfetti3D trigger={showConfetti} />

      <ScrollReveal direction="up">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Verified Achievements
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">My E-Certificates</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Official verified digital credentials for attended college events</p>
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="text-center py-16 text-slate-500 font-bold">Loading certificates...</div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm font-bold shadow-md">
          No e-certificates issued yet. Certificates are published after event completion and attendance verification.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {certificates.map((cert, idx) => (
            <ScrollReveal key={cert.id} direction="up" delay={idx * 100}>
              <TiltCard maxTilt={10}>
                <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl space-y-4 relative overflow-hidden group hover:border-amber-400 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl glow-purple">
                      <Award className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">CODE: {cert.certificate_code}</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition">{cert.event?.title || 'Event Achievement'}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                  </div>

                  <button
                    onClick={() => handleDownload(cert)}
                    className="w-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs py-3 rounded-2xl hover:bg-amber-600 transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <Download className="w-4 h-4" /> Download Official Credential
                  </button>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificatesPage;
