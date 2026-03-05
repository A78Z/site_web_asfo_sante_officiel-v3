import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  HeartHandshake,
  CreditCard,
  Mail,
  Newspaper,
  Megaphone,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

export interface StatData {
  label: string;
  value: number;
  weekDelta: number;
  icon: typeof FileText;
  color: string;
  lightBg: string;
}

const defaultStats: StatData[] = [
  { label: 'Candidatures villages', value: 0, weekDelta: 0, icon: FileText, color: 'text-teal-600', lightBg: 'bg-teal-50' },
  { label: 'Demandes bénévoles', value: 0, weekDelta: 0, icon: HeartHandshake, color: 'text-blue-600', lightBg: 'bg-blue-50' },
  { label: 'Cartes membres', value: 0, weekDelta: 0, icon: CreditCard, color: 'text-amber-600', lightBg: 'bg-amber-50' },
  { label: 'Messages reçus', value: 0, weekDelta: 0, icon: Mail, color: 'text-red-500', lightBg: 'bg-red-50' },
  { label: 'Abonnés newsletter', value: 0, weekDelta: 0, icon: Newspaper, color: 'text-purple-600', lightBg: 'bg-purple-50' },
  { label: 'Actualités publiées', value: 0, weekDelta: 0, icon: Megaphone, color: 'text-pink-600', lightBg: 'bg-pink-50' },
];

interface Props {
  stats?: StatData[];
}

const DashboardStats: React.FC<Props> = ({ stats = defaultStats }) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((s, i) => {
        const Icon = s.icon;
        const trend = s.weekDelta > 0 ? 'up' : s.weekDelta < 0 ? 'down' : 'flat';
        const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
        const trendColor =
          trend === 'up'
            ? 'text-emerald-600 bg-emerald-50'
            : trend === 'down'
              ? 'text-red-500 bg-red-50'
              : 'text-gray-400 bg-gray-50';

        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.lightBg}`}>
                <Icon className={`h-[18px] w-[18px] ${s.color}`} />
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${trendColor}`}>
                <TrendIcon className="h-3 w-3" />
                {s.weekDelta !== 0 ? `${s.weekDelta > 0 ? '+' : ''}${s.weekDelta}` : '—'}
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{s.value.toLocaleString('fr-FR')}</p>
            <p className="mt-0.5 text-[11px] text-gray-500">{s.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
