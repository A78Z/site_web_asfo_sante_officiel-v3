import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  Info,
  Users,
  Megaphone,
  Radio,
  FileText,
  School,
  MapPin,
  ArrowRight,
  ClipboardList,
  Presentation,
  MessagesSquare,
  HeartPulse,
  Baby,
  Apple,
  Brain,
  ShieldPlus,
  Search,
  Handshake,
  ClipboardCheck,
  ArrowLeftRight,
  Quote,
  Building2,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from 'lucide-react';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

/* ------------------------------------------------------------------ */
/* Compteur                                                             */
/* ------------------------------------------------------------------ */

const StatCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setDisplay(value); return; }
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
  return <span ref={ref}>{display.toLocaleString('fr-FR')}{suffix}</span>;
};

/* ------------------------------------------------------------------ */
/* Données (contenu existant, inchangé)                                 */
/* ------------------------------------------------------------------ */

const METHODS = [
  {
    icon: MessagesSquare,
    title: 'Causeries éducatives',
    description: "Sessions interactives et participatives avec les communautés locales pour favoriser l'échange de connaissances et l'adoption de bonnes pratiques",
    image: '/causeries.jpg',
    tag: 'Échange & proximité',
  },
  {
    icon: Presentation,
    title: 'Supports pédagogiques',
    description: "Projections vidéos, distribution de brochures et utilisation d'outils visuels adaptés aux contextes locaux pour faciliter la compréhension",
    image: '/supports-pedagogiques.jpg',
    tag: 'Outils adaptés',
  },
  {
    icon: Handshake,
    title: 'Relais communautaires',
    description: "Formation et accompagnement des acteurs locaux pour assurer la continuité des messages de sensibilisation et renforcer l'autonomie des communautés",
    image: '/relais-communautaires.jpg',
    tag: 'Ancrage durable',
  },
];

const TOPICS = [
  { icon: ShieldPlus, title: 'Hygiène et lutte contre les pathologies infectieuses', description: "éducation sur les mesures d'hygiène individuelle et collective pour prévenir et limiter la propagation des maladies infectieuses telles que: les parasitoses, les IST/VIH et les MTN", image: '/hygiene-prevention-maladie.jpg' },
  { icon: HeartPulse, title: 'Prévenir / Vivre avec une maladie chronique : diabète, HTA...', description: " Étude des moyens de prévention, d’adaptation et de suivi au quotidien pour améliorer la qualité de vie des personnes atteintes de maladies chroniques telles que le diabète ou l’hypertension artérielle.", image: '/sante-maternelle-infantile.jpg' },
  { icon: Baby, title: 'Santé maternelle et infantile', description: " Évaluation des facteurs influençant la santé de la mère et de l’enfant, de la grossesse au développement postnatal, ainsi que des interventions pour améliorer leur bien-être.", image: '/sante-mentale-bien-etre.jpg' },
  { icon: Brain, title: 'Santé mentale et bien-être', description: 'Exploration des déterminants de la santé mentale et des approches communautaires ou médicales visant à promouvoir le bien-être psychologique des individues', image: '/prevention-sida.jpg' },
  { icon: Apple, title: 'Nutrition et hygiène alimentaire', description: 'Recommandations pour une alimentation saine et équilibrée afin de prévenir ou de vivre avec une maladie chronique : diabète, hypertension artérielle (HTA), etc.', image: '/Nutrition-hygiene-alimentaire.jpg' },
];

const RELAY_POINTS = [
  { icon: MapPin, title: 'Proximité avec les populations', text: 'Des acteurs issus des communautés, présents au quotidien.' },
  { icon: Megaphone, title: 'Diffusion des messages de prévention', text: 'Un relais fiable de l’information sanitaire en langue locale.' },
  { icon: Handshake, title: 'Accompagnement avant et après', text: 'Une continuité assurée en amont et à la suite des campagnes.' },
  { icon: ArrowLeftRight, title: 'Remontée des besoins du terrain', text: 'Un lien direct entre les populations et les équipes de l’ASFO.' },
];

const JOURNEY = [
  { icon: Search, title: 'Identification des besoins', text: 'Écouter le terrain pour cibler les priorités sanitaires.' },
  { icon: ClipboardList, title: 'Préparation des supports', text: 'Concevoir des outils pédagogiques adaptés au contexte.' },
  { icon: Users, title: 'Mobilisation communautaire', text: 'Impliquer relais, autorités locales et populations.' },
  { icon: Megaphone, title: 'Sensibilisation sur le terrain', text: 'Causeries, projections et échanges au plus près des gens.' },
  { icon: ClipboardCheck, title: 'Suivi et évaluation', text: 'Mesurer l’impact et pérenniser les bonnes pratiques.' },
];

const FORMATS = [
  { icon: MessagesSquare, label: 'Causeries de proximité' },
  { icon: Radio, label: 'Radios communautaires' },
  { icon: FileText, label: 'Supports imprimés' },
  { icon: Users, label: 'Animations de groupe' },
  { icon: School, label: 'Sensibilisation dans les établissements' },
  { icon: Handshake, label: 'Relais locaux' },
];

const IMPACT = [
  { icon: Users, value: 5000, suffix: '+', label: 'Personnes sensibilisées' },
  { icon: Megaphone, value: 30, suffix: '+', label: 'Campagnes réalisées' },
  { icon: Handshake, value: 100, suffix: '+', label: 'Relais formés' },
];

const GALLERY = [
  { src: '/causeries.jpg', label: 'Causerie éducative avec la communauté' },
  { src: '/sensibilisation.jpg', label: 'Séance de sensibilisation publique' },
  { src: '/sensibilisation-radios.jpg', label: 'Sensibilisation via la radio communautaire' },
  { src: '/sante-maternelle-infantile.jpg', label: 'Sensibilisation des femmes et des mères' },
  { src: '/supports-pedagogiques.jpg', label: 'Supports pédagogiques distribués' },
  { src: '/relais-communautaires.jpg', label: 'Formation des relais communautaires' },
];

const NAV = [
  { id: 'methodes', label: 'Méthodes d’intervention' },
  { id: 'relais', label: 'Relais communautaires' },
  { id: 'thematiques', label: 'Thématiques abordées' },
  { id: 'parcours', label: 'Parcours d’une campagne' },
  { id: 'impact', label: 'Notre impact' },
];

/* ------------------------------------------------------------------ */
/* Lightbox galerie                                                     */
/* ------------------------------------------------------------------ */

const GalleryLightbox: React.FC<{ items: typeof GALLERY; index: number; onClose: () => void; onNavigate: (i: number) => void }> = ({ items, index, onClose, onNavigate }) => {
  const reduce = useReducedMotion();
  const it = items[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [index, items.length, onClose, onNavigate]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[70] flex flex-col bg-[#02120e]/95 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Photo ${index + 1} sur ${items.length}`} onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6" onClick={(e) => e.stopPropagation()}>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold tabular-nums" style={poppins}>{index + 1} / {items.length}</span>
        <button type="button" onClick={onClose} aria-label="Fermer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"><X className="h-5 w-5" aria-hidden="true" /></button>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 sm:px-16" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => onNavigate((index - 1 + items.length) % items.length)} aria-label="Précédente" className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:left-6"><ChevronLeft className="h-6 w-6" aria-hidden="true" /></button>
        <AnimatePresence mode="wait">
          <motion.img key={it.src} initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }} transition={{ duration: 0.28 }} src={it.src} alt={it.label}
            drag={reduce ? false : 'x'} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
            onDragEnd={(_, info) => { if (info.offset.x < -70) onNavigate((index + 1) % items.length); else if (info.offset.x > 70) onNavigate((index - 1 + items.length) % items.length); }}
            className="max-h-full max-w-full cursor-grab rounded-2xl object-contain shadow-2xl active:cursor-grabbing" />
        </AnimatePresence>
        <button type="button" onClick={() => onNavigate((index + 1) % items.length)} aria-label="Suivante" className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:right-6"><ChevronRight className="h-6 w-6" aria-hidden="true" /></button>
      </div>
      <div className="px-4 py-4 text-center sm:px-6" onClick={(e) => e.stopPropagation()}>
        <p className="text-base font-semibold text-white" style={poppins}>{it.label}</p>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const AwarenessPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [headerH, setHeaderH] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => { document.title = 'Campagnes de sensibilisation | ASFO - Action Sanitaire pour le Fouta'; }, []);

  useEffect(() => {
    const el = document.getElementById('site-header');
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  return (
    <div className="bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-44 top-64 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[44%] top-8 hidden h-28 w-28 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8">
          <div>
            <motion.span {...fadeUp(0)} className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              Informer pour mieux prévenir
            </motion.span>
            <motion.h1 {...fadeUp(0.08)} className="mt-6 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl xl:text-6xl" style={poppins}>
              Campagnes de{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">sensibilisation</span>
            </motion.h1>
            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8">
              Éduquer, prévenir et sauver des vies : au plus près des communautés, l'ASFO diffuse
              une information sanitaire claire et adaptée pour encourager des comportements
              favorables à la santé.
            </motion.p>
            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <button type="button" onClick={() => scrollTo('methodes')} className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Découvrir nos méthodes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link to="/archives" className="inline-flex items-center justify-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Voir nos campagnes
              </Link>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.15)} className="relative">
            <div className="grid grid-cols-3 grid-rows-3 gap-3.5">
              <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl border border-white/80 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.45)]">
                <img src="/causeries.jpg" alt="Causerie éducative de l'ASFO avec la communauté" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="row-span-2 overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src="/sensibilisation.jpg" alt="Séance de sensibilisation publique" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src="/sensibilisation-radios.jpg" alt="Sensibilisation via la radio communautaire" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            </div>
            <motion.div animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-6 -left-4 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_20px_50px_-20px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:-left-8">
              <div className="flex items-center gap-4">
                {[
                  { value: '5 000+', label: 'sensibilisées' },
                  { value: '30+', label: 'campagnes' },
                  { value: '100+', label: 'relais' },
                ].map((s, i) => (
                  <React.Fragment key={s.label}>
                    {i > 0 && <div className="h-9 w-px bg-teal-100" aria-hidden="true" />}
                    <div>
                      <p className="text-lg font-extrabold text-teal-700" style={poppins}>{s.value}</p>
                      <p className="text-[11px] font-semibold text-gray-500">{s.label}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ INTRODUCTION ════════════════ */}
      <section className="relative overflow-hidden pb-16">
        <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:gap-14 lg:px-8">
          <motion.div {...fadeUp(0)} className="min-w-0 self-start">
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Prévenir, informer et accompagner{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">durablement</span>
            </h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
            <p className="mt-6 text-[15px] leading-8 text-gray-700 sm:text-base sm:leading-9">
              ASFO mène régulièrement des <strong className="text-teal-700">campagnes de sensibilisation</strong> sur les
              pathologies les plus fréquentes en zones rurales, en insistant sur les{' '}
              <strong className="text-teal-700">mesures préventives</strong>. Notre approche participative et adaptée
              au contexte local permet d'atteindre efficacement les populations et de favoriser{' '}
              <strong className="text-gray-900">l'adoption de comportements favorables à la santé</strong>.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.12)} className="self-start rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-7 shadow-[0_20px_50px_-28px_rgba(18,63,56,0.35)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700" style={poppins}>Notre approche</p>
            <ul className="mt-5 space-y-3.5">
              {[
                { icon: Users, text: 'Participative, avec les communautés' },
                { icon: MapPin, text: 'Adaptée au contexte local' },
                { icon: ShieldPlus, text: 'Centrée sur la prévention' },
                { icon: Handshake, text: 'Portée par des relais formés' },
              ].map((r) => (
                <li key={r.text} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-teal-100 bg-white"><r.icon className="h-4 w-4 text-teal-600" aria-hidden="true" /></span>
                  <span className="text-sm font-semibold text-gray-800" style={poppins}>{r.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ NAVIGATION STICKY ════════════════ */}
      <div className="sticky z-40 border-y border-teal-100/70 bg-white/85 backdrop-blur-md" style={{ top: headerH }}>
        <nav aria-label="Sections de la page" className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {NAV.map((n) => (
            <button key={n.id} type="button" onClick={() => scrollTo(n.id)} className="flex-none rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}>
              {n.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ════════════════ MÉTHODES D'INTERVENTION ════════════════ */}
      <section id="methodes" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-teal-100/30 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Presentation className="h-3.5 w-3.5" aria-hidden="true" />
              Nos méthodes d'intervention
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Des approches adaptées pour un{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">impact maximal</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {METHODS.map((m, i) => (
              <motion.article key={m.title} {...fadeUp(0.06 + i * 0.08)} className="group flex flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_65px_-25px_rgba(18,63,56,0.45)]">
                <div className="relative h-52 overflow-hidden">
                  <img src={m.image} alt={`${m.title} — méthode de sensibilisation de l'ASFO`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/60 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-sm"><m.icon className="h-5 w-5 text-teal-600" aria-hidden="true" /></span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-teal-50 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-teal-700" style={poppins}>{m.tag}</span>
                  <h3 className="mt-3 text-xl font-bold text-gray-900" style={poppins}>{m.title}</h3>
                  <div className="mt-2 h-1 w-10 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
                  <p className="mt-4 flex-1 text-[14.5px] leading-7 text-gray-600">{m.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ RÔLE DES RELAIS ════════════════ */}
      <section id="relais" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="pointer-events-none absolute inset-0 bg-teal-50/40" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-44 top-10 h-[400px] w-[400px] rounded-full bg-teal-100/40 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <motion.div {...fadeUp(0)} className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_25px_60px_-28px_rgba(18,63,56,0.4)]">
            <img src="/relais-communautaires.jpg" alt="Relais communautaires formés par l'ASFO" loading="lazy" className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105 lg:h-full" />
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="min-w-0">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Handshake className="h-3.5 w-3.5" aria-hidden="true" />
              Acteurs de terrain
            </span>
            <h2 className="mt-6 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl" style={poppins}>
              Le rôle essentiel des{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">relais communautaires</span>
            </h2>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {RELAY_POINTS.map((p) => (
                <li key={p.title} className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_15px_40px_-25px_rgba(18,63,56,0.3)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)]"><p.icon className="h-4 w-4 text-white" aria-hidden="true" /></span>
                  <p className="mt-3 text-[14px] font-bold text-gray-900" style={poppins}>{p.title}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">{p.text}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ THÉMATIQUES ════════════════ */}
      <section id="thematiques" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <ShieldPlus className="h-3.5 w-3.5" aria-hidden="true" />
              Thématiques abordées
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Les principaux enjeux de{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">santé publique</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((t, i) => (
              <motion.article key={t.title} {...fadeUp(0.05 + i * 0.06)} className="group flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)]">
                <div className="relative h-48 overflow-hidden">
                  <img src={t.image} alt={`${t.title} — thématique de sensibilisation`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/60 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-sm"><t.icon className="h-5 w-5 text-teal-600" aria-hidden="true" /></span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-base font-bold leading-snug text-gray-900" style={poppins}>{t.title}</h3>
                  <div className="mt-2 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] opacity-60" aria-hidden="true" />
                  <p className="mt-3 flex-1 text-[13px] leading-relaxed text-gray-600">{t.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PARCOURS D'UNE CAMPAGNE ════════════════ */}
      <section id="parcours" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="pointer-events-none absolute -right-40 top-10 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
              Parcours d'une campagne
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              De l'écoute du terrain à{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">l'évaluation</span>
            </h2>
          </motion.div>

          <ol className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-2">
            <div className="absolute left-6 top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-teal-200 via-teal-300 to-teal-200 lg:left-[10%] lg:right-[10%] lg:top-6 lg:h-px lg:w-[80%] lg:bg-gradient-to-r" aria-hidden="true" />
            {JOURNEY.map((step, i) => (
              <motion.li key={step.title} {...fadeUp(0.08 + i * 0.09)} className="relative flex items-start gap-4 lg:w-1/5 lg:flex-col lg:items-center lg:text-center">
                <span className={`z-10 flex h-12 w-12 flex-none items-center justify-center rounded-2xl border shadow-sm ${i === JOURNEY.length - 1 ? 'border-teal-500 bg-gradient-to-br from-[#2fb391] to-[#178066] text-white' : 'border-teal-200 bg-white text-teal-600'}`}>
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="lg:mt-3 lg:px-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600/80" style={poppins}>Étape {i + 1}</p>
                  <p className="text-[15px] font-bold text-gray-900" style={poppins}>{step.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{step.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>

          {/* Formats d'intervention */}
          <motion.div {...fadeUp(0.1)} className="mt-16">
            <h3 className="text-center text-lg font-bold text-gray-900 sm:text-xl" style={poppins}>Nos formats d'intervention</h3>
            <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-3">
              {FORMATS.map((f) => (
                <span key={f.label} className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white" style={poppins}>
                  <f.icon className="h-4 w-4 text-teal-600" aria-hidden="true" />
                  {f.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ NOTRE IMPACT ════════════════ */}
      <section id="impact" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-8 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] sm:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>Notre impact</h2>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-gray-700 sm:text-base">
                Ces actions permettent d'<strong className="text-teal-700">éduquer, prévenir et sauver des vies</strong>,
                tout en renforçant la <strong className="text-teal-700">responsabilisation communautaire</strong> face aux
                enjeux sanitaires et l'adoption de comportements favorables à la santé.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
              {IMPACT.map((s, i) => (
                <motion.div key={s.label} {...fadeUp(0.06 + i * 0.08)} className="rounded-2xl border border-white/80 bg-white px-6 py-8 text-center shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] transition-all duration-300 hover:-translate-y-1">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_12px_30px_-10px_rgba(23,128,102,0.6)]"><s.icon className="h-6 w-6 text-white" aria-hidden="true" /></span>
                  <p className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl" style={poppins}><StatCounter value={s.value} suffix={s.suffix} /></p>
                  <p className="mt-1.5 text-sm font-medium text-gray-600">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ GALERIE TERRAIN ════════════════ */}
      <section className="relative overflow-hidden pb-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mb-10 text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
              La sensibilisation en images
            </span>
            <h2 className="mt-6 text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>Nos actions sur le terrain</h2>
          </motion.div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {GALLERY.map((g, i) => {
              const feat = i === 0;
              return (
                <motion.button key={g.src} type="button" {...fadeUp(0.04 + i * 0.06)} onClick={() => setLightbox(i)} aria-label={`Agrandir : ${g.label}`}
                  className={`group relative overflow-hidden rounded-2xl border border-white/80 shadow-[0_15px_40px_-25px_rgba(18,63,56,0.3)] transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 ${feat ? 'col-span-2 row-span-2' : ''}`}>
                  <div className={feat ? 'aspect-square sm:aspect-auto sm:h-full' : 'aspect-square'}>
                    <img src={g.src} alt={g.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/85 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                  <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"><ZoomIn className="h-4 w-4" aria-hidden="true" /></span>
                  <p className={`absolute inset-x-0 bottom-0 p-3 font-semibold leading-snug text-white ${feat ? 'text-sm' : 'text-[12px]'}`} style={poppins}>{g.label}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ CITATION ════════════════ */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.figure {...fadeUp(0)} className="mx-auto max-w-3xl rounded-3xl border border-white/80 bg-gradient-to-b from-white/95 to-teal-50/60 p-8 text-center shadow-[0_20px_50px_-28px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:p-10">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50"><Megaphone className="h-5 w-5 text-teal-600" aria-hidden="true" /></span>
            <Quote className="mx-auto mt-4 h-8 w-8 -scale-x-100 text-teal-300/60" aria-hidden="true" />
            <blockquote className="mt-3 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-8" style={poppins}>
              Sensibiliser aujourd'hui, c'est prévenir les risques et protéger durablement les communautés.
            </blockquote>
            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
          </motion.figure>
        </div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/60 p-10 text-center shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>
              Vous souhaitez organiser une campagne de{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">sensibilisation</span> avec l'ASFO ?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Collectivités, associations, établissements et partenaires peuvent solliciter l'ASFO
              pour mener des actions adaptées aux besoins de leur communauté.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link to="/candidature" className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Megaphone className="h-5 w-5" aria-hidden="true" />
                Proposer une campagne
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Mail className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Contacter l'ASFO
              </Link>
              <Link to="/about/partenaires" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Building2 className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Devenir partenaire
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ LIGHTBOX ════════════════ */}
      <AnimatePresence>
        {lightbox !== null && (
          <GalleryLightbox items={GALLERY} index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AwarenessPage;
