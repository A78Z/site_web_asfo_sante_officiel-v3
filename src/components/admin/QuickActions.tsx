import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Megaphone,
  MapPin,
  ImagePlus,
  Mail,
  HeartHandshake,
  Newspaper,
} from 'lucide-react';

const actions = [
  { label: 'Publier actualité', path: '/admin/news', icon: Megaphone, color: 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100' },
  { label: 'Ajouter mission', path: '/admin/archives', icon: MapPin, color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' },
  { label: 'Ajouter photo', path: '/admin/gallery', icon: ImagePlus, color: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' },
  { label: 'Voir messages', path: '/admin/messages', icon: Mail, color: 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' },
  { label: 'Voir bénévoles', path: '/admin/benevoles', icon: HeartHandshake, color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100' },
  { label: 'Newsletter', path: '/admin/newsletter', icon: Newspaper, color: 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100' },
];

const QuickActions: React.FC = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-bold text-gray-800">Actions rapides</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={a.path}
                className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-xs font-semibold transition-all ${a.color}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{a.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
