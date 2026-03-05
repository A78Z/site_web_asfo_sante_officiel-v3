import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';

export interface AppRow {
  id: string;
  village: string;
  amicale: string;
  contact: string;
  status: string;
  date: string;
}

const statusCfg: Record<string, { bg: string; icon: typeof Clock }> = {
  'En attente': { bg: 'border-amber-200 bg-amber-50 text-amber-700', icon: Clock },
  'Acceptée': { bg: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: CheckCircle },
  'Validé': { bg: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: CheckCircle },
  'Refusée': { bg: 'border-red-200 bg-red-50 text-red-700', icon: XCircle },
  'Refusé': { bg: 'border-red-200 bg-red-50 text-red-700', icon: XCircle },
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

interface Props {
  rows: AppRow[];
}

const RecentApplications: React.FC<Props> = ({ rows }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h3 className="text-sm font-bold text-gray-800">Dernières candidatures</h3>
        <Link
          to="/admin/candidatures"
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 transition hover:text-teal-700"
        >
          Voir tout <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">Village</th>
              <th className="hidden px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 sm:table-cell">Amicale</th>
              <th className="hidden px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 md:table-cell">Contact</th>
              <th className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">Statut</th>
              <th className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, i) => {
              const cfg = statusCfg[r.status] ?? statusCfg['En attente'];
              const Icon = cfg.icon;
              return (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="transition-colors hover:bg-teal-50/20"
                >
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{r.village}</td>
                  <td className="hidden px-5 py-3 text-sm text-gray-600 sm:table-cell">{r.amicale}</td>
                  <td className="hidden px-5 py-3 text-sm text-gray-600 md:table-cell">{r.contact}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cfg.bg}`}>
                      <Icon className="h-3 w-3" /> {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">{fmt(r.date)}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="px-5 py-8 text-center text-sm text-gray-400">Aucune candidature récente</div>
      )}
    </div>
  );
};

export default RecentApplications;
