import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Shield,
  Loader2,
  MoreHorizontal,
  Eye,
    EyeOff,
    Pencil,
    Trash2,
    X,
    Mail,
    Phone,
    Calendar,
    Plus,
    CheckCircle,
    XCircle,
    RefreshCw,
    Save,
  } from 'lucide-react';
import { queryObjects, createObject, updateObject, deleteObject } from '../lib/parse';

const CLASS_NAME = 'AdminUsers';

interface AdminUser {
  objectId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-purple-50 text-purple-700 border-purple-200',
  Admin: 'bg-teal-50 text-teal-700 border-teal-200',
  'Éditeur': 'bg-blue-50 text-blue-700 border-blue-200',
  'Modérateur': 'bg-amber-50 text-amber-700 border-amber-200',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const active = status === 'Actif';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
      {active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {status}
    </span>
  );
};

const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Tous' | 'Actif' | 'Inactif'>('Tous');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState('Admin');
  const [formPassword, setFormPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await queryObjects<AdminUser>(CLASS_NAME, { order: '-createdAt', limit: 200, keys: 'name,email,phone,role,status,createdAt' });
      setUsers(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'Tous' || u.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    actifs: users.filter((u) => u.status === 'Actif').length,
    inactifs: users.filter((u) => u.status === 'Inactif').length,
  }), [users]);

  const handleDelete = async (id: string) => {
    const target = users.find((u) => u.objectId === id);
    if (target?.role === 'Super Admin') {
      alert('Impossible de supprimer un Super Admin.');
      setOpenMenu(null);
      return;
    }
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await deleteObject(CLASS_NAME, id);
      setUsers((prev) => prev.filter((u) => u.objectId !== id));
      setOpenMenu(null);
      if (selectedUser?.objectId === id) setSelectedUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const user = users.find((u) => u.objectId === id);
    if (!user) return;
    if (user.role === 'Super Admin' && user.status === 'Actif') {
      alert('Impossible de désactiver un Super Admin.');
      setOpenMenu(null);
      return;
    }
    const newStatus = user.status === 'Actif' ? 'Inactif' : 'Actif';
    try {
      await updateObject(CLASS_NAME, id, { status: newStatus });
      setUsers((prev) => prev.map((u) => u.objectId === id ? { ...u, status: newStatus } : u));
      if (selectedUser?.objectId === id) {
        setSelectedUser((prev) => prev ? { ...prev, status: newStatus } : prev);
      }
      setOpenMenu(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async () => {
    if (!formName || !formEmail) return;
    setSaving(true);
    try {
      if (!formPassword || formPassword.length < 8) {
        alert('Le mot de passe doit contenir au moins 8 caractères.');
        setSaving(false);
        return;
      }
      const safeRole = formRole === 'Super Admin' ? 'Admin' : formRole;
      await createObject(CLASS_NAME, { name: formName, email: formEmail, phone: formPhone, role: safeRole, status: 'Actif', password: formPassword });
      setShowAddForm(false);
      setFormName(''); setFormEmail(''); setFormPhone(''); setFormRole('Admin'); setFormPassword('');
      fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    { label: 'Total utilisateurs', value: stats.total, icon: Users, light: 'bg-teal-50 text-teal-700' },
    { label: 'Utilisateurs actifs', value: stats.actifs, icon: UserCheck, light: 'bg-emerald-50 text-emerald-700' },
    { label: 'Utilisateurs inactifs', value: stats.inactifs, icon: UserX, light: 'bg-red-50 text-red-700' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <span className="ml-3 text-sm text-gray-500">Chargement des utilisateurs...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez les comptes administrateurs ASFO</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchUsers} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" /> Actualiser
          </button>
          <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700">
            <Plus className="h-4 w-4" /> Ajouter un utilisateur
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }} className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.light}`}><Icon className="h-[18px] w-[18px]" /></div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Rechercher par nom, email, rôle..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100" />
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 p-1">
            {(['Tous', 'Actif', 'Inactif'] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${statusFilter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Nom</th>
                <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">Email</th>
                <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">Rôle</th>
                <th className="hidden px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sm:table-cell">Date création</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Statut</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filtered.map((u) => (
                  <motion.tr key={u.objectId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group transition-colors hover:bg-teal-50/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-xs font-bold text-white">
                          {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-500 md:hidden">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-4 md:table-cell"><span className="text-sm text-gray-600">{u.email}</span></td>
                    <td className="hidden px-5 py-4 lg:table-cell">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${roleColors[u.role] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        <Shield className="h-3 w-3" /> {u.role}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 sm:table-cell"><span className="text-sm text-gray-500">{fmt(u.createdAt)}</span></td>
                    <td className="px-5 py-4"><StatusBadge status={u.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block">
                        <button onClick={() => setOpenMenu(openMenu === u.objectId ? null : u.objectId)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {openMenu === u.objectId && (
                          <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                            <button onClick={() => { setSelectedUser(u); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50">
                              <Eye className="h-3.5 w-3.5" /> Voir profil
                            </button>
                            <button onClick={() => handleToggleStatus(u.objectId)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50">
                              {u.status === 'Actif' ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                              {u.status === 'Actif' ? 'Désactiver' : 'Activer'}
                            </button>
                            <div className="my-1 border-t border-gray-100" />
                            <button onClick={() => handleDelete(u.objectId)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50">
                              <Trash2 className="h-3.5 w-3.5" /> Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && !loading && (
          <div className="py-16 text-center">
            <Users className="mx-auto mb-4 h-10 w-10 text-gray-300" />
            <p className="font-medium text-gray-500">Aucun utilisateur trouvé</p>
            <p className="mt-1 text-sm text-gray-400">Essayez de modifier vos filtres</p>
          </div>
        )}
      </div>

      {/* User Detail Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Profil utilisateur</h2>
                <button onClick={() => setSelectedUser(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6">
                <div className="mb-6 flex flex-col items-center">
                  <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-2xl font-bold text-white">
                    {selectedUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${roleColors[selectedUser.role] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    <Shield className="h-3 w-3" /> {selectedUser.role}
                  </span>
                </div>
                <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium text-gray-900">{selectedUser.email}</p></div></div>
                  <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Téléphone</p><p className="text-sm font-medium text-gray-900">{selectedUser.phone || '—'}</p></div></div>
                  <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Créé le</p><p className="text-sm font-medium text-gray-900">{fmt(selectedUser.createdAt)}</p></div></div>
                </div>
                <div className="mt-6"><StatusBadge status={selectedUser.status} /></div>
                <div className="mt-8 flex gap-3">
                  <button onClick={() => handleToggleStatus(selectedUser.objectId)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700">
                    <Pencil className="h-4 w-4" /> {selectedUser.status === 'Actif' ? 'Désactiver' : 'Activer'}
                  </button>
                  <button onClick={() => { handleDelete(selectedUser.objectId); }} className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Add User Drawer */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Nouvel utilisateur</h2>
                <button onClick={() => setShowAddForm(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-5 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">Nom complet *</label>
                  <input value={formName} onChange={(e) => setFormName(e.target.value)} className={inputCls} placeholder="Ex: Mamadou Diallo" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">Email *</label>
                  <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className={inputCls} placeholder="Ex: mamadou@asfo-sante.org" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">Téléphone</label>
                  <input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} className={inputCls} placeholder="+221 77 000 00 00" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">Rôle</label>
                  <select value={formRole} onChange={(e) => setFormRole(e.target.value)} className={inputCls}>
                    <option value="Admin">Admin</option>
                    <option value="Éditeur">Éditeur</option>
                    <option value="Modérateur">Modérateur</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">Mot de passe</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={formPassword} onChange={(e) => setFormPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button onClick={handleAddUser} disabled={saving || !formName || !formEmail} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? 'Création...' : 'Créer le compte'}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsersPage;
