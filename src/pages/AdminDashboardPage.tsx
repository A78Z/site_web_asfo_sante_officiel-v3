import React, { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { queryObjects, type ParseObject } from '../lib/parse';
import DashboardHeader from '../components/admin/DashboardHeader';
import DashboardStats, { type StatData } from '../components/admin/DashboardStats';
import DashboardCharts, {
  type MonthlyData,
  type PieData,
} from '../components/admin/DashboardCharts';
import RecentActivity, { type Activity } from '../components/admin/RecentActivity';
import RecentApplications, { type AppRow } from '../components/admin/RecentApplications';
import QuickActions from '../components/admin/QuickActions';
import LatestNews, { type NewsItem } from '../components/admin/LatestNews';
import {
  FileText,
  HeartHandshake,
  CreditCard,
  Mail,
  Newspaper,
  Megaphone,
  RefreshCw,
} from 'lucide-react';

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `il y a ${days}j`;
}

function oneWeekAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString();
}

const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [stats, setStats] = useState<StatData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [appRows, setAppRows] = useState<AppRow[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

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

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setFetchError('');

    /** Safe query wrapper — returns fallback on failure instead of throwing */
    const safeQuery = async <T = ParseObject>(
      className: string,
      params?: Parameters<typeof queryObjects>[1],
    ): Promise<{ results: T[]; count?: number }> => {
      try {
        return await queryObjects<T>(className, params);
      } catch (err) {
        console.warn(`Dashboard: query ${className} failed`, err);
        return { results: [] as T[], count: 0 };
      }
    };

    try {
      const weekAgo = oneWeekAgo();

      const [
        candAll,
        candWeek,
        volAll,
        volWeek,
        memAll,
        memWeek,
        msgAll,
        msgWeek,
        nlAll,
        nlWeek,
        newsAll,
        newsWeek,
      ] = await Promise.all([
        safeQuery('Candidatures', { limit: 0, count: true }),
        safeQuery('Candidatures', {
          where: { createdAt: { $gte: { __type: 'Date', iso: weekAgo } } },
          limit: 0,
          count: true,
        }),
        safeQuery('VolunteerRequests', { limit: 0, count: true }),
        safeQuery('VolunteerRequests', {
          where: { createdAt: { $gte: { __type: 'Date', iso: weekAgo } } },
          limit: 0,
          count: true,
        }),
        safeQuery('MemberRequests', { limit: 0, count: true }),
        safeQuery('MemberRequests', {
          where: { createdAt: { $gte: { __type: 'Date', iso: weekAgo } } },
          limit: 0,
          count: true,
        }),
        safeQuery('ContactMessages', { limit: 0, count: true }),
        safeQuery('ContactMessages', {
          where: { createdAt: { $gte: { __type: 'Date', iso: weekAgo } } },
          limit: 0,
          count: true,
        }),
        safeQuery('NewsletterSubscribers', { limit: 0, count: true }),
        safeQuery('NewsletterSubscribers', {
          where: { createdAt: { $gte: { __type: 'Date', iso: weekAgo } } },
          limit: 0,
          count: true,
        }),
        safeQuery('News', { where: { status: 'Publié' }, limit: 0, count: true }),
        safeQuery('News', {
          where: {
            status: 'Publié',
            createdAt: { $gte: { __type: 'Date', iso: weekAgo } },
          },
          limit: 0,
          count: true,
        }),
      ]);

      const rawStats: StatData[] = [
        {
          label: 'Candidatures villages',
          value: candAll.count ?? 0,
          weekDelta: candWeek.count ?? 0,
          icon: FileText,
          color: 'text-teal-600',
          lightBg: 'bg-teal-50',
        },
        {
          label: 'Demandes bénévoles',
          value: volAll.count ?? 0,
          weekDelta: volWeek.count ?? 0,
          icon: HeartHandshake,
          color: 'text-blue-600',
          lightBg: 'bg-blue-50',
        },
        {
          label: 'Cartes membres',
          value: memAll.count ?? 0,
          weekDelta: memWeek.count ?? 0,
          icon: CreditCard,
          color: 'text-amber-600',
          lightBg: 'bg-amber-50',
        },
        {
          label: 'Messages reçus',
          value: msgAll.count ?? 0,
          weekDelta: msgWeek.count ?? 0,
          icon: Mail,
          color: 'text-red-500',
          lightBg: 'bg-red-50',
        },
        {
          label: 'Abonnés newsletter',
          value: nlAll.count ?? 0,
          weekDelta: nlWeek.count ?? 0,
          icon: Newspaper,
          color: 'text-purple-600',
          lightBg: 'bg-purple-50',
        },
        {
          label: 'Actualités publiées',
          value: newsAll.count ?? 0,
          weekDelta: newsWeek.count ?? 0,
          icon: Megaphone,
          color: 'text-pink-600',
          lightBg: 'bg-pink-50',
        },
      ];
      setStats(rawStats);

      /* ── Pie data ── */
      setPieData(rawStats.filter((s) => s.value > 0).map((s) => ({ name: s.label, value: s.value })));

      /* ── Real monthly data — fetch createdAt for 4 classes this year ── */
      const year = new Date().getFullYear();
      const startOfYear = new Date(year, 0, 1).toISOString();
      const yearFilter = { where: { createdAt: { $gte: { __type: 'Date', iso: startOfYear } } }, keys: 'createdAt', limit: 1000 };

      const [candRows2, volRows2, msgRows2, nlRows2] = await Promise.all([
        safeQuery<{ createdAt: string }>('Candidatures', yearFilter),
        safeQuery<{ createdAt: string }>('VolunteerRequests', yearFilter),
        safeQuery<{ createdAt: string }>('ContactMessages', yearFilter),
        safeQuery<{ createdAt: string }>('NewsletterSubscribers', yearFilter),
      ]);

      const candByMonth = groupByMonth(candRows2.results);
      const volByMonth = groupByMonth(volRows2.results);
      const msgByMonth = groupByMonth(msgRows2.results);
      const nlByMonth = groupByMonth(nlRows2.results);

      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const cm = new Date().getMonth();
      const monthly: MonthlyData[] = monthNames.slice(0, cm + 1).map((m, i) => ({
        month: m,
        candidatures: candByMonth[i],
        benevoles: volByMonth[i],
        messages: msgByMonth[i],
        newsletter: nlByMonth[i],
      }));
      setMonthlyData(monthly);

      /* ── Recent activity (merge latest from each class) ── */
      const [recentCand, recentVol, recentNl, recentMsg] = await Promise.all([
        safeQuery<Record<string, unknown>>('Candidatures', { order: '-createdAt', limit: 3 }),
        safeQuery<Record<string, unknown>>('VolunteerRequests', { order: '-createdAt', limit: 3 }),
        safeQuery<Record<string, unknown>>('NewsletterSubscribers', { order: '-createdAt', limit: 3 }),
        safeQuery<Record<string, unknown>>('ContactMessages', { order: '-createdAt', limit: 3 }),
      ]);

      const acts: Activity[] = [
        ...recentCand.results.map((r) => ({
          id: `c-${r.objectId}`,
          type: 'candidature' as const,
          text: `Nouvelle candidature village — ${(r as Record<string, unknown>).village || (r as Record<string, unknown>).villageName || 'village'}`,
          time: timeAgo(r.createdAt as string),
          _ts: new Date(r.createdAt as string).getTime(),
        })),
        ...recentVol.results.map((r) => ({
          id: `v-${r.objectId}`,
          type: 'benevole' as const,
          text: `Demande bénévole — ${(r as Record<string, unknown>).firstName || ''} ${(r as Record<string, unknown>).lastName || ''}`.trim(),
          time: timeAgo(r.createdAt as string),
          _ts: new Date(r.createdAt as string).getTime(),
        })),
        ...recentNl.results.map((r) => ({
          id: `n-${r.objectId}`,
          type: 'newsletter' as const,
          text: `Inscription newsletter — ${(r as Record<string, unknown>).email || ''}`,
          time: timeAgo(r.createdAt as string),
          _ts: new Date(r.createdAt as string).getTime(),
        })),
        ...recentMsg.results.map((r) => ({
          id: `m-${r.objectId}`,
          type: 'message' as const,
          text: `Message contact — ${(r as Record<string, unknown>).name || (r as Record<string, unknown>).email || ''}`,
          time: timeAgo(r.createdAt as string),
          _ts: new Date(r.createdAt as string).getTime(),
        })),
      ]
        .sort((a, b) => b._ts - a._ts)
        .slice(0, 8);
      setActivities(acts);

      /* ── Recent candidatures for table ── */
      const candRows = recentCand.results.slice(0, 5).map((r) => ({
        id: r.objectId as string,
        village: ((r as Record<string, unknown>).village || (r as Record<string, unknown>).villageName || '—') as string,
        amicale: ((r as Record<string, unknown>).amicale || (r as Record<string, unknown>).associationName || '—') as string,
        contact: ((r as Record<string, unknown>).contact || (r as Record<string, unknown>).phone || '—') as string,
        status: ((r as Record<string, unknown>).status || 'En attente') as string,
        date: r.createdAt as string,
      }));
      setAppRows(candRows);

      /* ── Latest news ── */
      const latestNews = await safeQuery<Record<string, unknown>>('News', {
        where: { status: 'Publié' },
        order: '-createdAt',
        limit: 4,
      });
      setNewsItems(
        latestNews.results.map((n) => ({
          id: n.objectId as string,
          title: (n.title as string) || '',
          imageUrl:
            (n.coverImage as { url?: string })?.url ||
            (n.imageUrl as string) ||
            '',
          date: n.createdAt as string,
        })),
      );
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      setFetchError(`Erreur de chargement : ${msg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="space-y-6">
      {/* Header + refresh */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1"><DashboardHeader /></div>
        <button
          type="button"
          onClick={fetchAll}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          style={{ touchAction: 'manipulation' }}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Actualiser</span>
        </button>
      </div>

      {/* Error banner */}
      {fetchError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {fetchError}
        </div>
      )}

      {/* Inline loader */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <span className="ml-3 text-sm text-gray-500">Chargement du dashboard…</span>
        </div>
      )}

      {/* Dashboard content */}
      {!loading && !fetchError && (
        <>
          <DashboardStats stats={stats} />

          {/* Charts */}
          <DashboardCharts monthlyData={monthlyData} pieData={pieData} />

          {/* Two-column layout: Activity + Quick Actions | Candidatures + News */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <QuickActions />
              <RecentActivity activities={activities} />
            </div>
            <div className="space-y-6 lg:col-span-2">
              <RecentApplications rows={appRows} />
              <LatestNews items={newsItems} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
