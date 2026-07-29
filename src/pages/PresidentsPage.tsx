import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Crown,
  FileClock,
  Filter,
  HandHeart,
  History,
  Landmark,
  MessageSquareQuote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';
import {
  presidents as formerPresidents,
  type PresidentProps,
} from '../components/about/MedicalTeam';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };
const PLACEHOLDER = '/photo-avatar-profil.png';

type PresidentRecord = PresidentProps & {
  isCurrent?: boolean;
  archivalOrderPending?: boolean;
};

type PhotoFilter = 'all' | 'with-photo' | 'without-photo';
type SortOrder = 'chronological' | 'reverse' | 'alphabetical';

const CURRENT_PRESIDENT: PresidentRecord = {
  name: 'Dr Abdaramani Ndiaye',
  role: '21e Président de l’ASFO',
  specialty: '',
  imageUrl: '/images/president-asfo.jpg',
  years: 'Depuis 2026',
  order: 21,
  isCurrent: true,
};

const allPresidentRecords: PresidentRecord[] = [
  ...formerPresidents.map((president) => ({
    ...president,
    archivalOrderPending: president.name === 'Dr Mamadou THIOYE',
  })),
  CURRENT_PRESIDENT,
];

const periodDefinitions = [
  { id: '2000-2005', label: '2000–2005', from: 2000, to: 2005 },
  { id: '2006-2010', label: '2006–2010', from: 2006, to: 2010 },
  { id: '2011-2015', label: '2011–2015', from: 2011, to: 2015 },
  { id: '2016-2020', label: '2016–2020', from: 2016, to: 2020 },
  { id: '2021-now', label: "2021–Aujourd'hui", from: 2021, to: 2099 },
] as const;

const governanceValues = [
  {
    icon: HandHeart,
    title: 'Engagement',
    text: 'Mettre les compétences et le temps au service de la mission sanitaire.',
  },
  {
    icon: History,
    title: 'Transmission',
    text: 'Préserver l’expérience acquise et préparer la génération suivante.',
  },
  {
    icon: ShieldCheck,
    title: 'Responsabilité',
    text: 'Porter la vision de l’association avec rigueur et continuité.',
  },
  {
    icon: Users,
    title: 'Service communautaire',
    text: 'Rester proche des populations et de leurs besoins de santé.',
  },
];

const institutionalPhases = [
  'Création de l’ASFO',
  'Premières présidences',
  'Structuration',
  'Expansion',
  'Modernisation',
  'Présidence actuelle',
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.58, delay, ease: 'easeOut' as const },
});

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const initialsOf = (name: string) =>
  name
    .replace(/^(Dr\.?|Pr\.?)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const hasPhoto = (president: PresidentRecord) => president.imageUrl !== PLACEHOLDER;

const startYearOf = (president: PresidentRecord) => {
  const match = president.years.match(/\d{4}/);
  return match ? Number(match[0]) : 9999;
};

const periodFor = (president: PresidentRecord) => {
  const year = startYearOf(president);
  return periodDefinitions.find((period) => year >= period.from && year <= period.to)?.id;
};

const CountUp: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1300, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion, value, visible]);

  return (
    <span ref={ref}>
      {display.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
};

const Portrait: React.FC<{
  president: PresidentRecord;
  eager?: boolean;
  className?: string;
}> = ({ president, eager = false, className = '' }) => {
  if (!hasPhoto(president)) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 via-white to-[#e4f4ef] ${className}`}
        aria-label={`Photo à venir pour ${president.name}`}
      >
        <div className="text-center">
          <span
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-[#2fb391] text-2xl font-black text-white shadow-[0_18px_40px_-20px_rgba(15,118,110,0.7)]"
            style={poppins}
            aria-hidden="true"
          >
            {initialsOf(president.name)}
          </span>
          <span className="mt-4 inline-flex rounded-full border border-teal-100 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
            Photo à venir
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={president.imageUrl}
      alt={`Portrait de ${president.name}`}
      loading={eager ? 'eager' : 'lazy'}
      className={`h-full w-full object-cover object-top ${className}`}
    />
  );
};

const PresidentsPage: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [photoFilter, setPhotoFilter] = useState<PhotoFilter>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('chronological');
  const [selectedPresident, setSelectedPresident] = useState<PresidentRecord | null>(null);

  useEffect(() => {
    document.title = 'Nos présidents | ASFO — Action Sanitaire pour le Fouta';
  }, []);

  const filteredPresidents = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    const records = allPresidentRecords.filter((president) => {
      if (photoFilter === 'with-photo' && !hasPhoto(president)) return false;
      if (photoFilter === 'without-photo' && hasPhoto(president)) return false;
      if (periodFilter !== 'all' && periodFor(president) !== periodFilter) return false;
      if (
        normalizedQuery &&
        !normalize(
          `${president.name} ${president.role} ${president.specialty} ${president.years}`,
        ).includes(normalizedQuery)
      ) {
        return false;
      }
      return true;
    });

    return records.sort((a, b) => {
      if (sortOrder === 'alphabetical') return a.name.localeCompare(b.name, 'fr');
      if (sortOrder === 'reverse') return startYearOf(b) - startYearOf(a);
      return startYearOf(a) - startYearOf(b);
    });
  }, [periodFilter, photoFilter, query, sortOrder]);

  useEffect(() => {
    if (!selectedPresident) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPresident(null);
      if (event.key === 'ArrowLeft') {
        const index = filteredPresidents.findIndex(
          (president) =>
            president.name === selectedPresident.name &&
            president.years === selectedPresident.years,
        );
        if (index > 0) setSelectedPresident(filteredPresidents[index - 1]);
      }
      if (event.key === 'ArrowRight') {
        const index = filteredPresidents.findIndex(
          (president) =>
            president.name === selectedPresident.name &&
            president.years === selectedPresident.years,
        );
        if (index >= 0 && index < filteredPresidents.length - 1) {
          setSelectedPresident(filteredPresidents[index + 1]);
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredPresidents, selectedPresident]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const selectPeriod = (id: string) => {
    setPeriodFilter(id);
    requestAnimationFrame(() => scrollTo('presidents-gallery'));
  };

  const selectedIndex = selectedPresident
    ? filteredPresidents.findIndex(
        (president) =>
          president.name === selectedPresident.name &&
          president.years === selectedPresident.years,
      )
    : -1;

  return (
    <div className="overflow-hidden bg-gradient-to-b from-white via-[#f4fbfa] to-white text-slate-900">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-teal-100/50 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-48 top-40 h-[460px] w-[460px] rounded-full bg-cyan-50/80 blur-[120px]" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.62, ease: 'easeOut' }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/85 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur"
              style={poppins}
            >
              <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
              Organisation &amp; gouvernance
            </span>
            <h1
              className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
              style={poppins}
            >
              Celles et ceux qui ont porté{' '}
              <span className="bg-gradient-to-r from-teal-700 to-[#2fb391] bg-clip-text text-transparent">
                l’ASFO
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Depuis sa création en 2000, l’ASFO a été dirigée par des femmes et des hommes
              engagés au service de la santé, de la solidarité et des communautés.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollTo('presidents-gallery')}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-[0_16px_36px_-18px_rgba(15,118,110,0.85)] transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                Découvrir les présidents
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link
                to="/president-message"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                Lire le mot du Président
                <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.68, delay: 0.08, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-2xl pb-12"
          >
            <div className="grid grid-cols-[1.25fr_0.75fr] gap-3 sm:gap-4">
              <figure className="relative row-span-2 aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_30px_75px_-34px_rgba(18,63,56,0.5)]">
                <Portrait president={CURRENT_PRESIDENT} eager />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent px-5 pb-5 pt-24 text-white sm:px-6 sm:pb-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                    Président actuel
                  </span>
                  <p className="mt-3 text-lg font-extrabold sm:text-xl" style={poppins}>
                    Dr Abdaramani Ndiaye
                  </p>
                  <p className="text-xs font-semibold text-teal-200 sm:text-sm">21e Président de l’ASFO</p>
                </figcaption>
              </figure>

              {[
                formerPresidents[0],
                formerPresidents.find((president) => president.order === 15),
              ].map(
                (president) =>
                  president && (
                    <figure
                      key={president.name}
                      className="group relative aspect-square overflow-hidden rounded-[1.5rem] border-4 border-white bg-white shadow-[0_22px_55px_-30px_rgba(18,63,56,0.45)]"
                    >
                      <Portrait
                        president={president}
                        className="transition duration-700 group-hover:scale-105"
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent p-3 pt-10 text-[10px] font-bold text-white sm:text-xs">
                        {president.name}
                      </figcaption>
                    </figure>
                  ),
              )}
            </div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-1 left-3 right-3 rounded-2xl border border-white/80 bg-white/95 px-4 py-4 shadow-[0_22px_55px_-26px_rgba(18,63,56,0.5)] backdrop-blur sm:left-7 sm:right-auto sm:px-5"
            >
              <div className="flex items-center justify-center gap-4 sm:gap-5">
                <div>
                  <p className="text-lg font-black text-teal-700" style={poppins}>21</p>
                  <p className="text-[10px] font-semibold text-slate-500 sm:text-[11px]">présidences</p>
                </div>
                <div className="h-9 w-px bg-teal-100" aria-hidden="true" />
                <div>
                  <p className="text-lg font-black text-teal-700" style={poppins}>Depuis 2000</p>
                  <p className="text-[10px] font-semibold text-slate-500 sm:text-[11px]">continuité</p>
                </div>
                <div className="h-9 w-px bg-teal-100" aria-hidden="true" />
                <p className="max-w-24 text-[10px] font-semibold leading-4 text-slate-500 sm:text-[11px]">
                  Une continuité institutionnelle
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Président actuel */}
      <section id="president-current" className="scroll-mt-28 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp()}
            className="grid overflow-hidden rounded-[2rem] border border-teal-100 bg-white shadow-[0_30px_80px_-46px_rgba(18,63,56,0.5)] lg:grid-cols-[0.82fr_1.18fr]"
          >
            <figure className="relative min-h-0">
              <Portrait
                president={CURRENT_PRESIDENT}
                className="aspect-[4/5] lg:aspect-auto lg:h-full"
              />
              <span
                className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-teal-700 px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg"
                style={poppins}
              >
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Président en exercice
              </span>
            </figure>
            <div className="flex flex-col items-start justify-center p-7 sm:p-10 lg:p-14">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
                Présidence actuelle
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
                Dr Abdaramani Ndiaye
              </h2>
              <p className="mt-2 text-lg font-bold text-teal-700">21e Président de l’ASFO</p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                Le Dr Abdaramani Ndiaye conduit la présidence actuelle dans la continuité de
                l’engagement de l’ASFO pour la santé, la solidarité et le service des communautés.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Président actuel', 'Depuis 2026', 'Continuité institutionnelle'].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800"
                  >
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
              <Link
                to="/president-message"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-[0_16px_36px_-18px_rgba(15,118,110,0.85)] transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                Lire le mot du Président
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rubriques */}
      <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Parcourir la gouvernance
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Trois regards sur l’histoire présidentielle
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <motion.article
              {...fadeUp(0.05)}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-[#fbfdfc] shadow-[0_22px_55px_-40px_rgba(18,63,56,0.5)] transition hover:-translate-y-1 hover:border-teal-200"
            >
              <div className="grid h-44 grid-cols-3 gap-1 overflow-hidden bg-teal-50">
                {[formerPresidents[0], formerPresidents[14], formerPresidents[20]].map((president) => (
                  <Portrait
                    key={president.name}
                    president={president}
                    className="transition duration-700 group-hover:scale-105"
                  />
                ))}
              </div>
              <div className="p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-slate-950" style={poppins}>
                  Galerie des présidents
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Portraits, fonctions et mandats documentés des présidences de l’ASFO.
                </p>
                <button
                  type="button"
                  onClick={() => scrollTo('presidents-gallery')}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  Explorer la galerie
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.article>

            <motion.article
              {...fadeUp(0.1)}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-[#fbfdfc] shadow-[0_22px_55px_-40px_rgba(18,63,56,0.5)] transition hover:-translate-y-1 hover:border-teal-200"
            >
              <div className="h-44 overflow-hidden bg-teal-50">
                <Portrait
                  president={CURRENT_PRESIDENT}
                  className="transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <MessageSquareQuote className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-slate-950" style={poppins}>
                  Le mot du Président
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Le message du Dr Abdaramani Ndiaye, 21e Président de l’ASFO.
                </p>
                <Link
                  to="/president-message"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  Lire le message
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.article>

            <motion.article
              {...fadeUp(0.15)}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-[#fbfdfc] shadow-[0_22px_55px_-40px_rgba(18,63,56,0.5)]"
            >
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50">
                <div className="relative">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-teal-100 text-teal-700 shadow-lg">
                    <History className="h-8 w-8" aria-hidden="true" />
                  </span>
                  <span className="absolute -right-5 -top-3 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-white text-teal-600 shadow">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
              <div className="p-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-100">
                  <FileClock className="h-3 w-3" aria-hidden="true" />
                  En préparation
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-slate-950" style={poppins}>
                  Passations
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Les archives de passation sont en cours de documentation. Aucune date ni photo
                  non vérifiée n’est publiée.
                </p>
                <span className="mt-5 inline-flex cursor-not-allowed items-center gap-2 text-sm font-bold text-slate-400" aria-disabled="true">
                  Voir les passations
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section id="presidents-gallery" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Héritage de leadership
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl lg:text-5xl" style={poppins}>
              Galerie institutionnelle des présidents
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Les informations affichées reprennent les noms, mandats, spécialités et portraits
              disponibles dans les données actuelles de l’ASFO.
            </p>
          </motion.div>

          <nav
            aria-label="Filtrer les présidences par période"
            className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-[0_16px_40px_-30px_rgba(18,63,56,0.4)] backdrop-blur"
          >
            <div className="flex min-w-max gap-1">
              <button
                type="button"
                onClick={() => selectPeriod('all')}
                aria-pressed={periodFilter === 'all'}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  periodFilter === 'all'
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-500 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                Toutes les périodes
              </button>
              {periodDefinitions.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => selectPeriod(period.id)}
                  aria-pressed={periodFilter === period.id}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                    periodFilter === period.id
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-500 hover:bg-teal-50 hover:text-teal-700'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </nav>

          <motion.div
            {...fadeUp(0.08)}
            className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_-32px_rgba(18,63,56,0.4)] md:grid-cols-[1fr_auto_auto]"
          >
            <div className="relative">
              <label htmlFor="president-search" className="sr-only">
                Rechercher un président
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" aria-hidden="true" />
              <input
                id="president-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un président..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdfc] pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
              />
            </div>
            <label className="relative">
              <span className="sr-only">Filtrer selon la disponibilité des photos</span>
              <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" aria-hidden="true" />
              <select
                value={photoFilter}
                onChange={(event) => setPhotoFilter(event.target.value as PhotoFilter)}
                className="h-12 w-full min-w-56 appearance-none rounded-xl border border-slate-200 bg-[#fbfdfc] pl-10 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
              >
                <option value="all">Tous les profils</option>
                <option value="with-photo">Présidents avec photo</option>
                <option value="without-photo">Archives à compléter</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Trier les présidents</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                className="h-12 w-full min-w-60 rounded-xl border border-slate-200 bg-[#fbfdfc] px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
              >
                <option value="chronological">Ordre chronologique</option>
                <option value="reverse">Chronologie inversée</option>
                <option value="alphabetical">Ordre alphabétique</option>
              </select>
            </label>
          </motion.div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-500" aria-live="polite">
              {filteredPresidents.length} profil{filteredPresidents.length > 1 ? 's' : ''} affiché{filteredPresidents.length > 1 ? 's' : ''}
            </p>
            {(query || photoFilter !== 'all' || periodFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setPhotoFilter('all');
                  setPeriodFilter('all');
                }}
                className="text-xs font-bold text-teal-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredPresidents.map((president, index) => (
                <motion.article
                  key={`${president.name}-${president.years}`}
                  layout={!reduceMotion}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.38, delay: Math.min(index * 0.035, 0.35) }}
                  className={`group flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_18px_48px_-34px_rgba(18,63,56,0.5)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_58px_-34px_rgba(18,63,56,0.55)] ${
                    president.isCurrent ? 'border-teal-300 ring-2 ring-teal-100' : 'border-slate-200'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-teal-50">
                    <Portrait
                      president={president}
                      className="transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur">
                      <CalendarDays className="h-3 w-3 text-teal-600" aria-hidden="true" />
                      {president.years}
                    </span>
                    {president.isCurrent ? (
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-teal-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                        <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                        Actuel
                      </span>
                    ) : president.archivalOrderPending ? (
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700 shadow">
                        <FileClock className="h-3 w-3" aria-hidden="true" />
                        Rang à confirmer
                      </span>
                    ) : (
                      <span
                        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-teal-700 text-xs font-black text-white shadow"
                        aria-label={`${president.order}${president.order === 1 ? 'er' : 'e'} Président`}
                      >
                        {president.order}
                      </span>
                    )}
                    {president.order === 1 && !president.isCurrent && (
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-slate-950/75 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                        <Star className="h-3 w-3 fill-amber-300 text-amber-300" aria-hidden="true" />
                        Fondateur
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-extrabold leading-snug text-slate-950" style={poppins}>
                      {president.name}
                    </h3>
                    <p className="mt-1 text-xs font-bold text-teal-700">
                      {president.archivalOrderPending ? "Ancien Président de l'ASFO" : president.role}
                    </p>
                    {president.specialty ? (
                      <div className="mt-3 flex-1 space-y-1">
                        {president.specialty.split('\n').map((line) => (
                          <p key={line} className="text-xs leading-5 text-slate-600">
                            {line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 flex-1 text-xs leading-5 text-slate-500">
                        Aucune spécialité publiée dans les données disponibles.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedPresident(president)}
                      className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-800 transition hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    >
                      Voir le profil
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {filteredPresidents.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <Search className="mx-auto h-7 w-7 text-slate-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-slate-600">
                Aucun président ne correspond à ces critères.
              </p>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50/70 p-5 text-sm leading-7 text-amber-900">
            <strong>Donnée à consolider :</strong> le mandat 2024–2025 du Dr Mamadou THIOYE
            est conservé comme archive historique. Son rang ordinal n’est pas réattribué afin de
            respecter la numérotation institutionnelle qui présente le Dr Abdaramani Ndiaye comme
            21e Président.
          </div>
        </div>
      </section>

      {/* Message du Président */}
      <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:px-8">
          <motion.figure
            {...fadeUp()}
            className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-white bg-teal-50 shadow-[0_28px_70px_-38px_rgba(18,63,56,0.5)]"
          >
            <Portrait president={CURRENT_PRESIDENT} className="aspect-[4/5]" />
          </motion.figure>
          <motion.div {...fadeUp(0.08)}>
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 ring-1 ring-teal-100">
              <MessageSquareQuote className="h-3.5 w-3.5" aria-hidden="true" />
              Le mot du Président
            </span>
            <h2 className="mt-5 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Une vision d’engagement, de solidarité et de santé pour tous
            </h2>
            <blockquote className="mt-6 border-l-4 border-teal-400 pl-6 text-lg leading-9 text-slate-600">
              « Ce site incarne une nouvelle étape dans notre volonté de rendre l’ASFO plus
              accessible, plus visible et plus proche des populations que nous servons depuis plus
              de deux décennies. »
            </blockquote>
            <div className="mt-6">
              <p className="font-extrabold text-slate-950" style={poppins}>Dr Abdaramani Ndiaye</p>
              <p className="text-sm font-semibold text-teal-700">21e Président de l’ASFO</p>
            </div>
            <Link
              to="/president-message"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              Lire le message complet
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Passations */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp()}
            className="grid items-center gap-8 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-teal-50/70 p-7 shadow-[0_24px_65px_-46px_rgba(18,63,56,0.5)] sm:p-10 lg:grid-cols-[auto_1fr_auto]"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
              <History className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl" style={poppins}>
                  Passations de service
                </h2>
                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-100">
                  En préparation
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Aucune date, aucun lieu et aucune photographie de passation ne sont actuellement
                documentés dans les données du projet. Cette section sera enrichie uniquement avec
                des archives vérifiées.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-400" aria-disabled="true">
              Archives à compléter
              <FileClock className="h-4 w-4" aria-hidden="true" />
            </span>
          </motion.div>
        </div>
      </section>

      {/* Frise */}
      <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Continuité institutionnelle
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              25 années de leadership au service de la mission
            </h2>
          </motion.div>
          <div className="relative mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0">
            <div className="absolute left-[8%] right-[8%] top-6 hidden h-px bg-teal-200 lg:block" aria-hidden="true" />
            {institutionalPhases.map((phase, index) => (
              <motion.div key={phase} {...fadeUp(index * 0.06)} className="relative text-center">
                <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-teal-700 text-sm font-black text-white shadow-lg" style={poppins}>
                  {index + 1}
                </span>
                <p className="mx-auto mt-3 max-w-32 text-xs font-bold leading-5 text-slate-700">
                  {phase}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700" style={poppins}>
              Continuité et transmission
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Une gouvernance fondée sur la continuité et le service
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {governanceValues.map((value, index) => (
              <motion.article
                key={value.title}
                {...fadeUp(index * 0.06)}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_48px_-38px_rgba(18,63,56,0.5)] transition hover:-translate-y-1 hover:border-teal-200"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <value.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-slate-950" style={poppins}>
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{value.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-teal-100 bg-gradient-to-r from-teal-50 via-white to-cyan-50 py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 text-center sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: Crown, value: 21, suffix: '', label: 'présidences' },
            { icon: Clock3, value: 2000, suffix: '', label: 'année de création' },
            { icon: Award, value: 25, suffix: '+', label: 'années d’engagement' },
          ].map((stat) => (
            <div key={stat.label}>
              <stat.icon className="mx-auto h-5 w-5 text-teal-600" aria-hidden="true" />
              <p className="mt-3 text-4xl font-black text-slate-950" style={poppins}>
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          {...fadeUp()}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-teal-100 bg-gradient-to-br from-white via-[#f4fbfa] to-teal-50 px-6 py-14 text-center shadow-[0_30px_80px_-52px_rgba(18,63,56,0.55)] sm:px-10 sm:py-16"
        >
          <div className="pointer-events-none absolute -left-24 -top-32 h-72 w-72 rounded-full bg-teal-100/60 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl">
            <Sparkles className="mx-auto h-8 w-8 text-teal-500" aria-hidden="true" />
            <h2 className="mt-5 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Une histoire de leadership au service de la santé.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Découvrez l’organisation de l’ASFO, son histoire et celles et ceux qui ont contribué
              à son développement.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                { to: '/about/historique', label: 'Découvrir l’histoire de l’ASFO', primary: true },
                { to: '/about/organisation', label: 'Voir l’organisation' },
                { to: '/president-message', label: 'Lire le mot du Président' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                    action.primary
                      ? 'bg-teal-700 text-white shadow-[0_16px_36px_-18px_rgba(15,118,110,0.85)] hover:bg-teal-800'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:text-teal-700'
                  }`}
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modal profil */}
      <AnimatePresence>
        {selectedPresident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="president-profile-title"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedPresident(null);
            }}
          >
            <motion.div
              key={`${selectedPresident.name}-${selectedPresident.years}`}
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedPresident(null)}
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                aria-label="Fermer le profil"
                autoFocus
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="grid md:grid-cols-[0.82fr_1.18fr]">
                <div className="relative min-h-72 bg-teal-50 md:min-h-[540px]">
                  <Portrait president={selectedPresident} className="absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-6 pt-24 text-white">
                    <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                      {selectedPresident.isCurrent
                        ? 'Président actuel'
                        : selectedPresident.archivalOrderPending
                          ? 'Archive historique'
                          : selectedPresident.role}
                    </span>
                  </div>
                </div>
                <div className="p-7 sm:p-10">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                    {selectedPresident.years}
                  </span>
                  <h2 id="president-profile-title" className="mt-3 text-3xl font-extrabold text-slate-950" style={poppins}>
                    {selectedPresident.name}
                  </h2>
                  <p className="mt-2 font-bold text-teal-700">
                    {selectedPresident.archivalOrderPending
                      ? "Ancien Président de l'ASFO"
                      : selectedPresident.role}
                  </p>

                  <dl className="mt-8 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-[#fbfdfc] px-5">
                    <div className="py-4">
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Mandat
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-800">
                        {selectedPresident.years}
                      </dd>
                    </div>
                    <div className="py-4">
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Fonction ou spécialité
                      </dt>
                      <dd className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">
                        {selectedPresident.specialty ||
                          'Information non publiée dans les données disponibles.'}
                      </dd>
                    </div>
                    {selectedPresident.archivalOrderPending && (
                      <div className="py-4">
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Numérotation
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-amber-800">
                          Rang ordinal à confirmer dans les archives institutionnelles.
                        </dd>
                      </div>
                    )}
                  </dl>

                  <p className="mt-6 text-sm leading-7 text-slate-600">
                    Aucune biographie détaillée ni réalisation de mandat vérifiée n’est disponible
                    pour ce profil. Ces informations seront ajoutées après validation des archives.
                  </p>

                  <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      disabled={selectedIndex <= 0}
                      onClick={() => {
                        if (selectedIndex > 0) {
                          setSelectedPresident(filteredPresidents[selectedIndex - 1]);
                        }
                      }}
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Précédent
                    </button>
                    <button
                      type="button"
                      disabled={selectedIndex < 0 || selectedIndex >= filteredPresidents.length - 1}
                      onClick={() => {
                        if (selectedIndex >= 0 && selectedIndex < filteredPresidents.length - 1) {
                          setSelectedPresident(filteredPresidents[selectedIndex + 1]);
                        }
                      }}
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PresidentsPage;
