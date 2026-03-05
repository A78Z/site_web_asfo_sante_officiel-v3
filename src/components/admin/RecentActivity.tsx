import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  HeartHandshake,
  Newspaper,
  Mail,
  CreditCard,
  Megaphone,
} from 'lucide-react';

export interface Activity {
  id: string;
  type: 'candidature' | 'benevole' | 'newsletter' | 'message' | 'membre' | 'news';
  text: string;
  time: string;
}

const iconMap: Record<string, { icon: typeof FileText; bg: string; fg: string }> = {
  candidature: { icon: FileText, bg: 'bg-teal-50', fg: 'text-teal-600' },
  benevole: { icon: HeartHandshake, bg: 'bg-blue-50', fg: 'text-blue-600' },
  newsletter: { icon: Newspaper, bg: 'bg-purple-50', fg: 'text-purple-600' },
  message: { icon: Mail, bg: 'bg-red-50', fg: 'text-red-500' },
  membre: { icon: CreditCard, bg: 'bg-amber-50', fg: 'text-amber-600' },
  news: { icon: Megaphone, bg: 'bg-pink-50', fg: 'text-pink-600' },
};

interface Props {
  activities: Activity[];
}

const RecentActivity: React.FC<Props> = ({ activities }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <h3 className="text-sm font-bold text-gray-800">Activité récente</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {activities.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Aucune activité récente</div>
        )}
        {activities.map((a, i) => {
          const cfg = iconMap[a.type] ?? iconMap.candidature;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50"
            >
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                <Icon className={`h-4 w-4 ${cfg.fg}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700">{a.text}</p>
                <p className="mt-0.5 text-[11px] text-gray-400">{a.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
