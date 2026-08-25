import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Calendar, CheckSquare, FileText, Activity, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import api from '../../services/api';
import { AdminDashboardStats } from '../../types';
import TiltCard from '../../components/3d/TiltCard';
import ScrollReveal from '../../components/common/ScrollReveal';
import { playClickSound } from '../../utils/soundEffects';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center py-16 text-slate-500 font-bold">Loading admin operations control...</div>;

  const pendingCount = stats?.events_by_approval?.pending || 0;
  const approvedCount = stats?.events_by_approval?.approved || 0;
  const participantCount = stats?.users_by_role?.participant || 0;
  const organizerCount = stats?.users_by_role?.organizer || 0;

  return (
    <div className="space-y-8 relative z-10 font-sans pt-2 sm:pt-4">
      {/* Header Banner (Hero Control Room) */}
      <ScrollReveal direction="up">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glow-purple">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Shield className="w-4 h-4 text-amber-400" /> System Administrator Governance
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-poppins">Platform Operations Control</h1>
            <p className="text-xs text-slate-300">Approve event proposals, manage user accounts, moderate content, and view reports.</p>
          </div>

          {pendingCount > 0 && (
            <Link
              to="/admin/pending-approvals"
              onClick={() => playClickSound()}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition shadow-lg flex items-center gap-2 shrink-0"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Review Proposals ({pendingCount})</span>
            </Link>
          )}
        </div>
      </ScrollReveal>

      {/* Top: SRS Statistics Cards Grid (Perfect 4-Column Stretch Alignment) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
        <ScrollReveal direction="up" delay={0} className="h-full">
          <TiltCard maxTilt={8} className="h-full">
            <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md h-full flex flex-col justify-between space-y-2 hover:border-blue-500 transition-all duration-300">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Registered Users</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 font-poppins">{stats?.total_users || 0}</h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800/80">
                Participants: <strong className="text-blue-600 dark:text-blue-400">{participantCount}</strong> | Organizers: <strong className="text-purple-600 dark:text-purple-400">{organizerCount}</strong>
              </p>
            </div>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={80} className="h-full">
          <TiltCard maxTilt={8} className="h-full">
            <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md h-full flex flex-col justify-between space-y-2 hover:border-emerald-500 transition-all duration-300">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Events</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 font-poppins">{stats?.total_events || 0}</h3>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold pt-2 border-t border-slate-100 dark:border-slate-800/80">
                Approved: {approvedCount} Live Listings
              </p>
            </div>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={160} className="h-full">
          <TiltCard maxTilt={8} className="h-full">
            <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md h-full flex flex-col justify-between space-y-2 hover:border-amber-500 transition-all duration-300">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Proposals</p>
                <h3 className="text-3xl font-black text-amber-500 font-poppins">{pendingCount}</h3>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold pt-2 border-t border-slate-100 dark:border-slate-800/80">
                {pendingCount > 0 ? 'Requires Action' : 'All Clear'}
              </p>
            </div>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={240} className="h-full">
          <TiltCard maxTilt={8} className="h-full">
            <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md h-full flex flex-col justify-between space-y-2 hover:border-purple-500 transition-all duration-300">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Registrations</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 font-poppins">{stats?.total_registrations || 0}</h3>
              </div>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold pt-2 border-t border-slate-100 dark:border-slate-800/80">
                Confirmed Student Signups
              </p>
            </div>
          </TiltCard>
        </ScrollReveal>
      </div>

      {/* Admin Action Cards Grid (Symmetric 3-Column Equal-Height Alignment) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
        <ScrollReveal direction="up" delay={100} className="h-full">
          <TiltCard maxTilt={8} className="h-full">
            <Link
              to="/admin/pending-approvals"
              onClick={() => playClickSound()}
              className="block bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md hover:border-amber-500 transition-all duration-300 group h-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition font-poppins">Event Approval Queue</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Approve or reject event listings submitted by faculty organizers.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>View Queue ({pendingCount})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150} className="h-full">
          <TiltCard maxTilt={8} className="h-full">
            <Link
              to="/admin/users"
              onClick={() => playClickSound()}
              className="block bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md hover:border-blue-500 transition-all duration-300 group h-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition font-poppins">User & Role Governance</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Assign roles, suspend/reactivate accounts, and reset user credentials.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Manage Users ({stats?.total_users || 0})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} className="h-full">
          <TiltCard maxTilt={8} className="h-full">
            <Link
              to="/admin/reports"
              onClick={() => playClickSound()}
              className="block bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md hover:border-emerald-500 transition-all duration-300 group h-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition font-poppins">System Reports & Exports</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Export analytics for event participation, feedback trends, and certificates.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Export PDF Analytics</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </TiltCard>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default AdminDashboard;
