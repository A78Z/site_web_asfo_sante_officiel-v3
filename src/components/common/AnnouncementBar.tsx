import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, Megaphone, Briefcase } from 'lucide-react';
import { queryObjects } from '@/lib/parse';

export type AnnouncementCategory = 'info' | 'annonce' | 'recrutement';

export interface Announcement {
  id: string;
  category: AnnouncementCategory;
  label: string; // libellé court en majuscules, ex. « CANDIDATURE 2026 »
  message: string;
  link: string; // route interne de la page de l'annonce
  priority?: number; // plus grand = affiché en premier
  startDate?: string; // ISO — affichage à partir de
  endDate?: string; // ISO — affichage jusqu'à
}

/**
 * Annonces par défaut, utilisées tant que la classe Parse `Announcement`
 * est vide ou injoignable. Back-office : créer des objets `Announcement`
 * (fields: category, label, message, link, priority, startDate, endDate,
 * active) — ils remplacent automatiquement cette liste.
 */
const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'candidature-2026',
    category: 'annonce',
    label: 'Candidature 2026',
    message:
      "27e Grande Campagne Médicale : les villages du département de Podor sont invités à soumettre leur candidature pour accueillir la mission.",
    link: '/candidature',
    priority: 3,
  },
  {
    id: 'nouveau-president',
    category: 'info',
    label: 'Nouveau Président',
    message:
      "Le Dr Abdaramani Ndiaye devient le 21e Président de l'ASFO — découvrez son message de bienvenue.",
    link: '/president-message',
    priority: 2,
  },
  {
    id: 'benevoles',
    category: 'recrutement',
    label: 'Bénévoles',
    message:
      "L'ASFO recherche des professionnels de santé et des bénévoles pour ses prochaines missions au Fouta.",
    link: '/join',
    priority: 1,
  },
];

const CATEGORY_META: Record<AnnouncementCategory, { label: string; icon: React.ElementType }> = {
  info: { label: 'Info', icon: Info },
  annonce: { label: 'Annonce', icon: Megaphone },
  recrutement: { label: 'Recrutement', icon: Briefcase },
};

const ROTATION_MS = 5000;

const isCurrentlyVisible = (a: Announcement) => {
  const now = Date.now();
  if (a.startDate && now < Date.parse(a.startDate)) return false;
  if (a.endDate && now > Date.parse(a.endDate)) return false;
  return true;
};

const AnnouncementBar: React.FC = () => {
  const [items, setItems] = useState<Announcement[]>(
    FALLBACK_ANNOUNCEMENTS.filter(isCurrentlyVisible),
  );
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Back-office : les annonces actives de la classe Parse priment sur les défauts.
  useEffect(() => {
    let cancelled = false;
    queryObjects<Announcement & { objectId: string; active?: boolean }>('Announcement', {
      where: { active: true },
      order: '-priority',
      limit: 10,
    })
      .then(({ results }) => {
        const fresh = results
          .map((r) => ({ ...r, id: r.objectId }))
          .filter(isCurrentlyVisible);
        if (!cancelled && fresh.length > 0) setItems(fresh);
      })
      .catch(() => {
        /* classe absente ou API indisponible : on garde les défauts */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const goTo = useCallback((i: number) => setCurrent(i), []);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = setInterval(() => setCurrent((i) => (i + 1) % items.length), ROTATION_MS);
    return () => clearInterval(id);
  }, [paused, items.length]);

  if (items.length === 0) return null;
  const item = items[Math.min(current, items.length - 1)];
  const meta = CATEGORY_META[item.category] ?? CATEGORY_META.info;
  const Icon = meta.icon;

  return (
    <div
      className="relative z-[60] w-full border-b border-[#d5e5e0] bg-gradient-to-r from-[#e8f3ef] to-[#eef6f2]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Annonces"
    >
      <div className="mx-auto flex h-10 max-w-[1400px] items-center gap-3 px-4 sm:px-8">
        {/* Pastille catégorie */}
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-teal-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          <Icon className="h-3 w-3" aria-hidden="true" />
          {meta.label}
        </span>

        {/* Libellé + séparateur + message (tronqué) */}
        <p className="min-w-0 flex-1 truncate text-[13px] text-[#132a2e]">
          <span className="font-bold uppercase tracking-wide text-teal-800">{item.label}</span>
          <span className="mx-2 text-teal-800/30" aria-hidden="true">
            |
          </span>
          <span className="text-[#3d5a55]">{item.message}</span>
        </p>

        {/* Puces de rotation */}
        {items.length > 1 && (
          <div className="hidden items-center gap-1.5 md:flex" role="tablist" aria-label="Choisir une annonce">
            {items.map((a, i) => (
              <button
                key={a.id}
                role="tab"
                aria-selected={i === current}
                aria-label={`Annonce ${i + 1} : ${a.label}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-5 bg-teal-600' : 'w-1.5 bg-teal-600/30 hover:bg-teal-600/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bouton Lire */}
        <Link
          to={item.link}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-teal-600/50 bg-white px-3 py-1 text-xs font-semibold text-teal-700 transition-colors duration-200 hover:border-teal-600 hover:bg-teal-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Lire
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default AnnouncementBar;
