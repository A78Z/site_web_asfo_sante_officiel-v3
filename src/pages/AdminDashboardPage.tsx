import React, { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { queryObjects } from '../lib/parse';
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
  const [stats, setStats] = useState<StatData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [appRows, setAppRows] = useState<AppRow[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
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
        queryObjects('Candidatures', { limit: 0, count: true }),
        queryObjects('Candidatures', {
          where: { createdAt: { $gte: { __type: 'Date', iso: weekAgo } } },
          limit: 0,
          count: true,
        }),
        queryObjects('VolunteerRequests', { limit: 0, count: true }),
        queryObjects('VolunteerRequests', {
          where: { createdAt: { $gte: { __type: 'Date', iso: weekAgo } } },
          limit: 0,
          count: true,
        }),
        queryObjects('MemberRequests', { limit: 0, count: true }),
        queryObjects('MemberRequests', {
          where: { createdAt: { $gte: { __type: 'Date', iso: weekAgo } } },
          limit: 0,
          count: true,
        }),
        queryObjects('ContactMessages', { limit: 0, count: true }),
        queryObjects('ContactMessages', {
          where: { createdAt: { $gte: { __type: 'Date', iso: weekAgo } } },
          limit: 0,
          count: true,
        }),
        queryObjects('NewsletterSubscribers', { limit: 0, count: true }),
        queryObjects('NewsletterSubscribers', {
          where: { createdAt: { $gte: { __type: 'Date', iso: weekAgo } } },
          limit: 0,
          count: true,
        }),
        queryObjects('News', { where: { status: 'Publié' }, limit: 0, count: true }),
        queryObjects('News', {
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

      /* ── Monthly data (simulated distribution from totals) ── */
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const cm = new Date().getMonth();
      const monthly: MonthlyData[] = months.slice(0, cm + 1).map((m) => {
        const f = 0.3 + Math.random() * 0.7;
        return {
          month: m,
          candidatures: Math.round(((candAll.count ?? 0) * f) / (cm + 1)),
          benevoles: Math.round(((volAll.count ?? 0) * f) / (cm + 1)),
          messages: Math.round(((msgAll.count ?? 0) * f) / (cm + 1)),
          newsletter: Math.round(((nlAll.count ?? 0) * f) / (cm + 1)),
        };
      });
      setMonthlyData(monthly);

      /* ── Recent activity (merge latest from each class) ── */
      const [recentCand, recentVol, recentNl, recentMsg] = await Promise.all([
        queryObjects<Record<string, unknown>>('Candidatures', { order: '-createdAt', limit: 3 }),
        queryObjects<Record<string, unknown>>('VolunteerRequests', { order: '-createdAt', limit: 3 }),
        queryObjects<Record<string, unknown>>('NewsletterSubscribers', { order: '-createdAt', limit: 3 }),
        queryObjects<Record<string, unknown>>('ContactMessages', { order: '-createdAt', limit: 3 }),
      ]);

      const acts: Activity[] = [
        ...recentCand.results.map((r) => ({
          id: `c-${r.objectId}`,
          type: 'candidature' as const,
          text: `Nouvelle candidature village — ${(r as Record<string, unknown>).village || (r as Record<string, unknown>).villageName || 'village'}`,
          time: timeAgo(r.createdAt as string),
        })),
        ...recentVol.results.map((r) => ({
          id: `v-${r.objectId}`,
          type: 'benevole' as const,
          text: `Demande bénévole — ${(r as Record<string, unknown>).firstName || ''} ${(r as Record<string, unknown>).lastName || ''}`.trim(),
          time: timeAgo(r.createdAt as string),
        })),
        ...recentNl.results.map((r) => ({
          id: `n-${r.objectId}`,
          type: 'newsletter' as const,
          text: `Inscription newsletter — ${(r as Record<string, unknown>).email || ''}`,
          time: timeAgo(r.createdAt as string),
        })),
        ...recentMsg.results.map((r) => ({
          id: `m-${r.objectId}`,
          type: 'message' as const,
          text: `Message contact — ${(r as Record<string, unknown>).name || (r as Record<string, unknown>).email || ''}`,
          time: timeAgo(r.createdAt as string),
        })),
      ]
        .sort((a, b) => {
          const ta = a.time;
          const tb = b.time;
          if (ta.includes('instant')) return -1;
          if (tb.includes('instant')) return 1;
          return 0;
        })
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
      const latestNews = await queryObjects<Record<string, unknown>>('News', {
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <span className="ml-3 text-sm text-gray-500">Chargement du dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />
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
    </div>
  );
};

export default AdminDashboardPage;
