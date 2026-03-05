import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle, Shield } from 'lucide-react';
import { queryObjects } from '../lib/parse';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true);
    setError('');

    try {
      const { results } = await queryObjects<{
        objectId: string;
        name: string;
        email: string;
        role: string;
        status: string;
        password: string;
      }>('AdminUsers', { where: { email, password }, limit: 1 });

      if (results.length === 0) {
        setError('Email ou mot de passe incorrect.');
        setLoading(false);
        return;
      }

      const user = results[0];
      if (user.status !== 'Actif') {
        setError('Ce compte est désactivé. Contactez un administrateur.');
        setLoading(false);
        return;
      }

      localStorage.setItem('asfo_admin', JSON.stringify({
        objectId: user.objectId,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: true,
      }));

      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Erreur de connexion. Vérifiez votre réseau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 shadow-lg shadow-teal-200">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ASFO Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Connectez-vous pour accéder au back-office</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@asfo-sante.org"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          ASFO — Action Sanitaire pour le Fouta &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
