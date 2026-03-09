import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Heart,
  CreditCard,
  Mail,
  Archive,
  TrendingUp,
  Loader2,
  RefreshCw,
  Newspaper,
  Stethoscope,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { queryObjects } from '../lib/parse';

interface ClassCount {
  label: string;
  value: number;
  icon: typeof Users;
  color: string;
  light: string;
}

const COLORS = ['#0d9488', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AdminStatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [counts, setCounts] = useState<ClassCount[]>([]);
  const [barData, setBarData] = useState<{ name: string; total: number }[]>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<
    { month: string; candidatures: number; benevoles: number; membres: number }[]
  >([]);

  /** Group an array of { createdAt } by month index (0–11) for the current year */
  const groupByMonth = (items: { createdAt: string }[]): number[] => {
    const year = new Date().getFullYear();
    const buckets = new Array(12).fill(0);
    for (const item of items) {
      const d = new Date(item.createdAt);
      if (d.getFullYear() === year) buckets[d.getMonth()]++;
    }
    return buckets;
  };

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      // Counts for all 6 classes
      const [candidatures, volunteers, members, messages, newsletter, missions] =
        await Promise.all([
          queryObjects('Candidatures', { limit: 0, count: true }),
          queryObjects('VolunteerRequests', { limit: 0, count: true }),
          queryObjects('MemberRequests', { limit: 0, count: true }),
          queryObjects('ContactMessages', { limit: 0, count: true }),
          queryObjects('NewsletterSubscribers', { limit: 0, count: true }),
          queryObjects('Missions', { limit: 0, count: true }),
        ]);

      const raw = [
        { label: 'Candidatures', value: candidatures.count ?? 0, icon: Heart, color: '#0d9488', light: 'bg-teal-50 text-teal-700' },
        { label: 'Bénévoles', value: volunteers.count ?? 0, icon: Users, color: '#3b82f6', light: 'bg-blue-50 text-blue-700' },
        { label: 'Cartes membres', value: members.count ?? 0, icon: CreditCard, color: '#f59e0b', light: 'bg-amber-50 text-amber-700' },
        { label: 'Messages', value: messages.count ?? 0, icon: Mail, color: '#ef4444', light: 'bg-red-50 text-red-700' },
        { label: 'Newsletter', value: newsletter.count ?? 0, icon: Newspaper, color: '#8b5cf6', light: 'bg-purple-50 text-purple-700' },
        { label: 'Missions', value: missions.count ?? 0, icon: Archive, color: '#ec4899', light: 'bg-pink-50 text-pink-700' },
      ];

      setCounts(raw);
      setBarData(raw.map((r) => ({ name: r.label, total: r.value })));
      setPieData(raw.filter((r) => r.value > 0).map((r) => ({ name: r.label, value: r.value })));

      // Real monthly data — fetch createdAt for the 3 main classes this year
      const year = new Date().getFullYear();
      const startOfYear = new Date(year, 0, 1).toISOString();
      const yearFilter = { where: { createdAt: { $gte: { __type: 'Date', iso: startOfYear } } }, keys: 'createdAt', limit: 1000 };

      const [candRows, volRows, memRows] = await Promise.all([
        queryObjects<{ createdAt: string }>('Candidatures', yearFilter),
        queryObjects<{ createdAt: string }>('VolunteerRequests', yearFilter),
        queryObjects<{ createdAt: string }>('MemberRequests', yearFilter),
      ]);

      const candByMonth = groupByMonth(candRows.results);
      const volByMonth = groupByMonth(volRows.results);
      const memByMonth = groupByMonth(memRows.results);

      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const currentMonth = new Date().getMonth();
      const monthly = monthNames.slice(0, currentMonth + 1).map((m, i) => ({
        month: m,
        candidatures: candByMonth[i],
        benevoles: volByMonth[i],
        membres: memByMonth[i],
      }));
      setMonthlyData(monthly);
    } catch (err) {
      console.error('Stats fetch error:', err);
      setFetchError('Impossible de charger les statistiques. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const totalCount = counts.reduce((s, c) => s + c.value, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="mt-1 text-sm text-gray-500">Vue d'ensemble de l'activité ASFO</p>
        </div>
        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Fetch Error */}
      {fetchError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {fetchError}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <span className="ml-3 text-sm text-gray-500">Chargement des statistiques...</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !fetchError && totalCount === 0 && counts.length > 0 && (
        <div className="py-16 text-center">
          <BarChart3 className="mx-auto mb-4 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-500">Aucune donnée disponible</p>
          <p className="mt-1 text-sm text-gray-400">Les statistiques apparaîtront lorsque des données seront enregistrées.</p>
        </div>
      )}

      {/* Stat cards + Charts */}
      {!loading && counts.length > 0 && (<>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {counts.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${c.light}`}>
                <Icon className="h-[18px] w-[18px]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="mt-0.5 text-xs text-gray-500">{c.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-xl border border-gray-200 bg-white p-5"
        >
          <h3 className="mb-4 text-sm font-bold text-gray-800">Répartition globale</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-xl border border-gray-200 bg-white p-5"
        >
          <h3 className="mb-4 text-sm font-bold text-gray-800">Distribution</h3>
          {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Legend
                formatter={(val) => <span className="text-xs text-gray-600">{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">Aucune donnée</div>
          )}
        </motion.div>
      </div>

      {/* Area chart */}
      {monthlyData.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="rounded-xl border border-gray-200 bg-white p-5"
      >
        <h3 className="mb-4 text-sm font-bold text-gray-800">Évolution mensuelle {new Date().getFullYear()}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: 12 }}
            />
            <Legend formatter={(val) => <span className="text-xs text-gray-600">{val}</span>} />
            <Area
              type="monotone"
              dataKey="candidatures"
              stackId="1"
              stroke="#0d9488"
              fill="#0d948830"
              name="Candidatures"
            />
            <Area
              type="monotone"
              dataKey="benevoles"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f630"
              name="Bénévoles"
            />
            <Area
              type="monotone"
              dataKey="membres"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b30"
              name="Membres"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
      )}
      </>)}
    </div>
  );
};

export default AdminStatisticsPage;
