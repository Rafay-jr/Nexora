import React, { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, UserX, Edit, Trash2, Key, Search, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import ScrollReveal from '../../components/common/ScrollReveal';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import CustomSelect from '../../components/common/CustomSelect';
import { playClickSound } from '../../utils/soundEffects';

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'participant', label: 'Participant (Student)' },
  { value: 'organizer', label: 'Organizer (Staff)' },
  { value: 'admin', label: 'Administrator' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
];

const tableRoleOptions = [
  { value: 'participant', label: 'Participant' },
  { value: 'organizer', label: 'Organizer' },
  { value: 'admin', label: 'Administrator' },
];

const UserManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', username: '', email: '', mobile: '', department: '', enrollment_no: '' });

  const [passwordResetUser, setPasswordResetUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    playClickSound();
    if (userId === currentUser?.id) {
      alert('You cannot change your own admin role!');
      return;
    }

    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setMessage({ type: 'success', text: `User role updated to ${newRole}.` });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update user role.' });
    }
  };

  const handleStatusChange = async (userId: number, newStatus: string) => {
    playClickSound();
    if (userId === currentUser?.id) {
      alert('You cannot suspend your own admin account!');
      return;
    }

    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      setMessage({ type: 'success', text: `User status updated to ${newStatus}.` });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update user status.' });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    playClickSound();
    if (userId === currentUser?.id) {
      alert('You cannot delete your own admin account!');
      return;
    }

    if (!confirm('Are you sure you want to permanently delete this user account?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setMessage({ type: 'success', text: 'User account deleted permanently.' });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete user account.' });
    }
  };

  const openEditModal = (u: User) => {
    playClickSound();
    setEditingUser(u);
    setEditForm({
      name: u.name || '',
      username: u.username || '',
      email: u.email || '',
      mobile: u.detail?.mobile || '',
      department: u.detail?.department || '',
      enrollment_no: u.detail?.enrollment_no || '',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    playClickSound();

    try {
      await api.put(`/admin/users/${editingUser.id}/profile`, editForm);
      setMessage({ type: 'success', text: 'User profile updated successfully!' });
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update user profile.' });
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetUser) return;
    playClickSound();

    try {
      await api.post(`/admin/users/${passwordResetUser.id}/reset-password`, { password: newPassword });
      setMessage({ type: 'success', text: `Password reset successfully for ${passwordResetUser.name}.` });
      setPasswordResetUser(null);
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to reset password.' });
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.username.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesStatus = !statusFilter || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8 relative z-10 font-sans">
      <ScrollReveal direction="up">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 font-poppins">User & Role Governance</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Manage user roles, edit profiles, suspend accounts, and reset security credentials</p>
        </div>
      </ScrollReveal>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30' : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30'}`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter Bar (relative z-40 so dropdowns open OVER table) */}
      <ScrollReveal direction="up" delay={100} className="relative z-40">
        <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Search Keyword</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, username..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Role</label>
              <CustomSelect
                options={roleOptions}
                value={roleFilter}
                onChange={(val) => setRoleFilter(val)}
                placeholder="All Roles"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Status</label>
              <CustomSelect
                options={statusOptions}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                placeholder="All Statuses"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Users Table */}
      <ScrollReveal direction="up" delay={150} className="relative z-10">
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={6} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-bold text-sm">No users match your criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Department / Mobile</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            {u.name} {isSelf && <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold px-2 py-0.5 rounded-md border border-blue-300 dark:border-blue-500/30">YOU</span>}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">@{u.username} • {u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <CustomSelect
                            disabled={isSelf}
                            options={tableRoleOptions}
                            value={u.role}
                            onChange={(val) => handleRoleChange(u.id, val)}
                            className="w-36"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            disabled={isSelf}
                            onClick={() => handleStatusChange(u.id, u.status === 'active' ? 'suspended' : 'active')}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition disabled:opacity-50 ${
                              u.status === 'active'
                                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 hover:bg-red-50 hover:text-red-600'
                                : 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30 hover:bg-emerald-50 hover:text-emerald-600'
                            }`}
                          >
                            {u.status}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-semibold">
                          <div>{u.detail?.department || 'N/A'}</div>
                          <div className="text-[10px] text-slate-400">{u.detail?.mobile || 'No Mobile'}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(u)}
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition"
                              title="Edit User Profile"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                playClickSound();
                                setPasswordResetUser(u);
                              }}
                              className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white transition"
                              title="Reset Password"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={isSelf}
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition disabled:opacity-30"
                              title={isSelf ? 'Cannot delete own account' : 'Delete User Account'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Edit Profile Modal */}
      {editingUser && (
        <Modal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title={`Edit Profile: ${editingUser.name}`}
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile</label>
                <input
                  type="text"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  placeholder="+91..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  placeholder="CS Dept"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Enrollment No.</label>
                <input
                  type="text"
                  value={editForm.enrollment_no}
                  onChange={(e) => setEditForm({ ...editForm, enrollment_no: e.target.value })}
                  placeholder="EN2024..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-neon-gradient text-white font-bold text-xs py-3 rounded-xl shadow-md mt-2"
            >
              Save Profile Changes
            </button>
          </form>
        </Modal>
      )}

      {/* Password Reset Modal */}
      {passwordResetUser && (
        <Modal
          isOpen={!!passwordResetUser}
          onClose={() => setPasswordResetUser(null)}
          title={`Reset Password: ${passwordResetUser.name}`}
        >
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Set New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition"
            >
              Reset User Password
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserManagementPage;
