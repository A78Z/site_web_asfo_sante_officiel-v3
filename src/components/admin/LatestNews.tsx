import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ImageIcon, Plus } from 'lucide-react';

export interface NewsItem {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
}

interface Props {
  items: NewsItem[];
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const LatestNews: React.FC<Props> = ({ items }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h3 className="text-sm font-bold text-gray-800">Dernières actualités</h3>
        <Link
          to="/admin/news"
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-teal-700"
        >
          <Plus className="h-3 w-3" /> Publier
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {items.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Aucune actualité</div>
        )}
        {items.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50"
          >
            <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
              {n.imageUrl ? (
                <img src={n.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-gray-300" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">{n.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
                <Calendar className="h-3 w-3" /> {fmt(n.date)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="border-t border-gray-200 px-5 py-3">
          <Link to="/admin/news" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 transition hover:text-teal-700">
            Toutes les actualités <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default LatestNews;
