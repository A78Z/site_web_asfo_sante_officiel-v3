import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  Award,
  Crown,
  Star,
  Users,
  CalendarDays,
  Search,
  LayoutGrid,
  History,
  BadgeCheck,
  ArrowRight,
  Heart,
  Mail,
  Stethoscope,
  Quote,
} from 'lucide-react';
import { presidents, PresidentProps } from '../components/about/MedicalTeam';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const PLACEHOLDER = '/photo-avatar-profil.png';

const CURRENT = {
  name: 'Dr Abdaramani Ndiaye',
  role: '21e Président de l’ASFO',
  photo: '/images/president-asfo.jpg',
};

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const initialsOf = (name: string) =>
  name
    .replace(/^(Dr\.?|Pr\.?)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

const hasPhoto = (p: PresidentProps) => p.imageUrl !== PLACEHOLDER;

const StatCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1600, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <span ref={ref}>
      {display.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
};

/* Portrait ou placeholder institutionnel à initiales */
const Portrait: React.FC<{ president: PresidentProps }> = ({ president }) => {
  if (hasPhoto(president)) {
    return (
      <img
        src={president.imageUrl}
        alt={`Portrait — ${president.name}`}
        loading="lazy"
        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-[#e8f6f1]">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#2fb391] to-[#178066] text-2xl font-bold text-white shadow-[0_12px_30px_-12px_rgba(23,128,102,0.6)]" style={poppins} aria-hidden="true">
        {initialsOf(president.name)}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

type PhotoFilter = 'tous' | 'avec' | 'sans';
type ViewMode = 'grille' | 'chrono';

const MedicalTeamPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');
  const [photoFilter, setPhotoFilter] = useState<PhotoFilter>('tous');
  const [view, setView] = useState<ViewMode>('grille');

  useEffect(() => {
    document.title = 'Notre Équipe Médicale | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return presidents.filter((p) => {
      if (photoFilter === 'avec' && !hasPhoto(p)) return false;
      if (photoFilter === 'sans' && hasPhoto(p)) return false;
      if (q && !normalize(`${p.name} ${p.specialty} ${p.role}`).includes(q)) return false;
      return true;
    });
  }, [query, photoFilter]);

  const presidentesCount = presidents.filter((p) => p.role.includes('Présidente')).length;

  const scrollTo = (id: string) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  return (
    <div className="bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-44 top-64 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[44%] top-8 hidden h-28 w-28 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10">
          <div>
            <motion.span
              {...fadeUp(0)}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm"
              style={poppins}
            >
              <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
              Leadership médical
            </motion.span>

            <motion.h1
              {...fadeUp(0.08)}
              className="mt-6 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl xl:text-6xl"
              style={poppins}
            >
              Les femmes et les hommes qui portent la{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
                mission de l'ASFO
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8">
              Des médecins, pharmaciens, responsables et bénévoles engagés au service des
              communautés — une continuité de leadership depuis 2000.
            </motion.p>

            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <button
                type="button"
                onClick={scrollTo('president-actuel')}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                Découvrir le Président actuel
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={scrollTo('historique')}
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                Voir toute l'équipe
              </button>
            </motion.div>
          </div>

          {/* Composition photo */}
          <motion.div {...fadeUp(0.15)} className="relative">
            <div className="grid grid-cols-3 grid-rows-3 gap-3.5">
              <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl border border-white/80 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.45)]">
                <img
                  src="/medicalteam.webp"
                  alt="L'équipe médicale de l'ASFO"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="row-span-2 overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img
                  src="/images/president-asfo.jpg"
                  alt="Dr Abdaramani Ndiaye, Président actuel"
                  className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img
                  src="/dr-oumou.webp"
                  alt="Dr Oumou Khairy Kane, 15e Présidente de l'ASFO"
                  className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
            <motion.div
              animate={reduce ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-4 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_20px_50px_-20px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:-left-8"
            >
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-lg font-extrabold text-teal-700" style={poppins}>21</p>
                  <p className="text-[11px] font-semibold text-gray-500">présidences</p>
                </div>
                <div className="h-9 w-px bg-teal-100" aria-hidden="true" />
                <div>
                  <p className="text-lg font-extrabold text-teal-700" style={poppins}>25+</p>
                  <p className="text-[11px] font-semibold text-gray-500">années</p>
                </div>
                <div className="h-9 w-px bg-teal-100" aria-hidden="true" />
                <div>
                  <p className="text-lg font-extrabold text-teal-700" style={poppins}>600+</p>
                  <p className="text-[11px] font-semibold text-gray-500">acteurs</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ PRÉSIDENT ACTUEL ════════════════ */}
      <section id="president-actuel" className="relative scroll-mt-28 pb-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.h2 {...fadeUp(0)} className="text-center text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>
            Le Président actuel
          </motion.h2>
          <motion.div
            {...fadeUp(0.1)}
            className="mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-[2rem] border-2 border-teal-200/60 bg-white/85 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.4)] backdrop-blur-sm md:grid-cols-[0.9fr_1.3fr]"
          >
            <div className="relative">
              <img
                src={CURRENT.photo}
                alt={`${CURRENT.name} — ${CURRENT.role}`}
                className="h-72 w-full object-cover object-top md:h-full"
              />
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md" style={poppins}>
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Président actuel
                </span>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 shadow-md backdrop-blur-sm" style={poppins}>
                  <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                  21e Présidence
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <h3 className="text-3xl font-extrabold text-gray-900" style={poppins}>{CURRENT.name}</h3>
              <p className="mt-1.5 text-lg font-semibold text-teal-700">{CURRENT.role}</p>
              <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
              <p className="mt-5 text-[15px] leading-7 text-gray-600 sm:text-base sm:leading-8">
                Le Dr Abdaramani Ndiaye conduit la 21e Présidence de l'ASFO, au service de la
                santé et des communautés du Fouta, dans la continuité des présidences engagées
                qui se succèdent depuis 2000.
              </p>
              <Link
                to="/president-message"
                className="mt-7 inline-flex w-fit items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                Lire le mot du Président
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ HISTORIQUE ════════════════ */}
      <section id="historique" className="relative overflow-hidden scroll-mt-28 pb-24">
        <div className="pointer-events-none absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-teal-100/30 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp(0)} className="mx-auto mb-10 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              Héritage de leadership
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl" style={poppins}>
              Nos Présidents à travers{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">l'Histoire</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Une continuité de leadership au service de la santé et des communautés.
            </p>
          </motion.div>

          {/* Barre de filtres */}
          <motion.div {...fadeUp(0.08)} className="mb-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_12px_35px_-20px_rgba(18,63,56,0.3)] backdrop-blur-sm lg:flex-row">
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" aria-hidden="true" />
              <label htmlFor="team-search" className="sr-only">Rechercher un membre</label>
              <input
                id="team-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un membre…"
                className="w-full rounded-full border border-teal-100 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50"
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filtres et affichage">
              {([['tous', 'Tous'], ['avec', 'Avec photo'], ['sans', 'Sans photo']] as [PhotoFilter, string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPhotoFilter(key)}
                  aria-pressed={photoFilter === key}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                    photoFilter === key
                      ? 'bg-gradient-to-r from-[#2fb391] to-[#178066] text-white shadow-[0_10px_25px_-12px_rgba(23,128,102,0.7)]'
                      : 'border border-teal-100 bg-white text-gray-600 hover:bg-teal-50'
                  }`}
                  style={poppins}
                >
                  {label}
                </button>
              ))}
              <span className="mx-1 hidden h-6 w-px bg-teal-100 sm:block" aria-hidden="true" />
              {([['grille', 'Grille', LayoutGrid], ['chrono', 'Chronologie', History]] as [ViewMode, string, React.ElementType][]).map(([key, label, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setView(key)}
                  aria-pressed={view === key}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                    view === key
                      ? 'bg-[#123f38] text-white shadow-md'
                      : 'border border-teal-100 bg-white text-gray-600 hover:bg-teal-50'
                  }`}
                  style={poppins}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Vue grille */}
          {view === 'grille' && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((president, i) => (
                    <motion.article
                      key={president.order}
                      layout={!reduce}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4), ease: 'easeOut' }}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)]"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <Portrait president={president} />
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-teal-800 shadow-sm backdrop-blur-sm" style={poppins}>
                          <CalendarDays className="h-3 w-3 text-teal-600" aria-hidden="true" />
                          {president.years}
                        </span>
                        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#2fb391] to-[#178066] text-sm font-bold text-white shadow-md" style={poppins}>
                          {president.order}
                        </span>
                        {president.order === 1 && (
                          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#123f38]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-100 backdrop-blur-sm" style={poppins}>
                            <Star className="h-3 w-3 fill-amber-300 text-amber-300" aria-hidden="true" />
                            Fondateur
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-base font-bold leading-snug text-gray-900" style={poppins}>{president.name}</h3>
                        <p className="mt-1 text-[13px] font-semibold text-teal-700">{president.role}</p>
                        <div className="mt-2.5 flex-1 space-y-1">
                          {president.specialty.split('\n').map((line) => (
                            <p key={line} className="text-[13px] leading-relaxed text-gray-600">{line}</p>
                          ))}
                        </div>
                        <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-teal-700" style={poppins}>
                          <Award className="h-3 w-3" aria-hidden="true" />
                          Ancien Président
                        </span>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
              {filtered.length === 0 && (
                <p className="mt-10 text-center text-gray-500">Aucun membre ne correspond à votre recherche.</p>
              )}
            </>
          )}

          {/* Vue chronologie */}
          {view === 'chrono' && (
            <ol className="relative mx-auto max-w-3xl border-l-2 border-teal-100 pl-0">
              {filtered.map((president, i) => (
                <motion.li
                  key={president.order}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3), ease: 'easeOut' }}
                  className="relative -ml-px flex items-center gap-4 rounded-2xl border border-transparent p-4 transition-colors duration-300 hover:border-teal-100 hover:bg-white/80"
                >
                  <span className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full border-2 border-white bg-teal-50 shadow-md ring-2 ring-teal-100">
                    {hasPhoto(president) ? (
                      <img src={president.imageUrl} alt="" className="h-full w-full object-cover object-top" />
                    ) : (
                      <span className="text-xs font-bold text-teal-700" style={poppins}>{initialsOf(president.name)}</span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600" style={poppins}>
                      {president.years}
                    </p>
                    <p className="truncate text-[15px] font-bold text-gray-900" style={poppins}>{president.name}</p>
                    <p className="text-xs text-gray-500">{president.role}</p>
                  </div>
                  <span className="flex-none text-lg font-extrabold text-teal-600/30" style={poppins}>
                    {String(president.order).padStart(2, '0')}
                  </span>
                </motion.li>
              ))}
              {/* Présidence en cours */}
              <motion.li
                {...fadeUp(0.1)}
                className="relative -ml-px flex items-center gap-4 rounded-2xl border border-teal-200/70 bg-gradient-to-r from-teal-50/80 to-white p-4 shadow-[0_15px_40px_-25px_rgba(18,63,56,0.35)]"
              >
                <span className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-teal-300">
                  <img src={CURRENT.photo} alt="" className="h-full w-full object-cover object-top" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600" style={poppins}>En exercice</p>
                  <p className="truncate text-[15px] font-bold text-gray-900" style={poppins}>{CURRENT.name}</p>
                  <p className="text-xs font-semibold text-teal-700">{CURRENT.role}</p>
                </div>
                <span className="inline-flex flex-none items-center gap-1 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white" style={poppins}>
                  <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                  Actuel
                </span>
              </motion.li>
            </ol>
          )}
        </div>
      </section>

      {/* ════════════════ STATISTIQUES ════════════════ */}
      <section className="relative pb-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-6 sm:gap-4 sm:px-8 lg:grid-cols-4 lg:px-10">
          {[
            { icon: Crown, value: 21, suffix: '', label: 'Présidences' },
            { icon: CalendarDays, value: 25, suffix: '+', label: "Années d'engagement" },
            { icon: Stethoscope, value: 600, suffix: '+', label: 'Professionnels' },
            { icon: Heart, value: presidentesCount, suffix: '', label: 'Présidentes' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeUp(0.05 + i * 0.07)}
              className="rounded-2xl border border-white/80 bg-white/80 px-5 py-6 text-center shadow-[0_15px_40px_-20px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                <stat.icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
              </span>
              <p className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>
                <StatCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════ CITATION ════════════════ */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.figure
            {...fadeUp(0)}
            className="mx-auto max-w-3xl rounded-3xl border border-white/80 bg-gradient-to-b from-white/95 to-teal-50/60 p-8 text-center shadow-[0_20px_50px_-28px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:p-10"
          >
            <Quote className="mx-auto h-10 w-10 -scale-x-100 text-teal-300/60" aria-hidden="true" />
            <blockquote className="mt-4 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-8" style={poppins}>
              Chaque présidence a contribué à construire une organisation plus forte, plus
              proche des populations et plus engagée pour la santé.
            </blockquote>
            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
          </motion.figure>
        </div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div
            {...fadeUp(0)}
            className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/60 p-10 text-center shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-14"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>
              Rejoignez celles et ceux qui font vivre la{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
                mission de l'ASFO
              </span>
              .
            </h2>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link
                to="/join"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Users className="h-5 w-5" aria-hidden="true" />
                Devenir bénévole
              </Link>
              <Link
                to="/join"
                className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Stethoscope className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Rejoindre l'équipe médicale
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Mail className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Contacter l'ASFO
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MedicalTeamPage;
