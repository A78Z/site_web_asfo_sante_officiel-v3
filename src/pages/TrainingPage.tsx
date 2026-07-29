import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Award,
  Users,
  Target,
  GraduationCap,
  Brain,
  Stethoscope,
  Heart,
  Handshake,
  ArrowRight,
  Search,
  ClipboardList,
  Presentation,
  Wrench,
  UserCheck,
  ClipboardCheck,
  Building2,
  Mail,
  Sprout,
  ShieldPlus,
  Quote,
  Globe,
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

const INITIATIVES = [
  { title: 'Enseignements Post-Universitaires (EPU)', description: "Des sessions d'enseignement théorique adaptées à tous les professionnels et étudiants pour approfondir des thématiques clés en santé.", image: '/eup.jpg', icon: BookOpen, tag: 'Théorie' },
  { title: 'Ateliers de Formation Pratique', description: 'Des ateliers pratiques réguliers, comme le secourisme ou la technique de suture, pour développer des compétences directement applicables.', image: '/ateliers-formation-pratique.jpg', icon: Wrench, tag: 'Pratique' },
  { title: 'Renforcement des capacités des Acteurs Communautaires', description: "Accompagnement des agents communautaires lors des campagnes médicales avec des modules de sensibilisation et d'éducation sanitaire.", image: '/renforcement-capacites.jpg', icon: Users, tag: 'Communautaire' },
  { title: 'Sessions de sensibilisation et de formation en campagne', description: "Briefings techniques destinés aux bénévoles sur la chaîne de soins, la logistique, l'éthique humanitaire et la communication.", image: '/sessions-sensibilisation.jpg', icon: Target, tag: 'Terrain' },
  { title: 'Mentorat et encadrement sur le terrain', description: 'Accompagnement personnalisé par des médecins et pharmaciens expérimentés pour guider les jeunes volontaires en milieu rural.', image: '/mentorat-encadrement.jpg', icon: Brain, tag: 'Mentorat' },
  { title: "Journées scientifiques de l'ASFO", description: "Événements favorisant l'échange entre étudiants, professionnels et experts, et stimulant la recherche et l'innovation en santé.", image: '/journee-scientifique.png', icon: Award, tag: 'Recherche' },
  { title: 'Projets en collaboration avec des partenaires internationaux', description: 'Développement de partenariats pour offrir des bourses et des spécialisations médicales aux jeunes professionnels.', image: '/projets-collaboration.jpg', icon: Globe, tag: 'Partenariats' },
];

const AUDIENCES = [
  { icon: Stethoscope, title: 'Professionnels de santé', text: 'Médecins, pharmaciens, infirmiers en formation continue.' },
  { icon: GraduationCap, title: 'Étudiants', text: 'En médecine, pharmacie, odontologie et disciplines associées.' },
  { icon: Users, title: 'Agents communautaires', text: 'ASC, matrones, Badjénou Gokh au plus près des populations.' },
  { icon: Building2, title: 'Organisations & partenaires', text: 'Structures locales et partenaires engagés dans la santé.' },
];

const JOURNEY = [
  { icon: Search, title: 'Identification des besoins', text: 'Cerner les priorités de compétences sur le terrain.' },
  { icon: ClipboardList, title: 'Conception du programme', text: 'Bâtir des modules adaptés aux réalités locales.' },
  { icon: Presentation, title: 'Formation théorique', text: 'Transmettre les connaissances essentielles en santé.' },
  { icon: Wrench, title: 'Mise en pratique', text: 'Ateliers et gestes techniques directement applicables.' },
  { icon: UserCheck, title: 'Mentorat sur le terrain', text: 'Accompagnement personnalisé par des expérimentés.' },
  { icon: ClipboardCheck, title: 'Évaluation et suivi', text: 'Mesurer les acquis et pérenniser les compétences.' },
];

const OBJECTIVES = [
  { icon: ShieldPlus, title: 'Résilience locale', text: 'Renforcer la résilience locale face aux urgences sanitaires' },
  { icon: Stethoscope, title: 'Meilleure prise en charge', text: 'Favoriser une meilleure prise en charge des patients en zone enclavée' },
  { icon: Sprout, title: 'Culture de prévention', text: "Ancrer durablement une culture de prévention, d'hygiène et de service communautaire" },
];

const IMPACT = [
  { icon: Users, value: 500, suffix: '+', label: 'Professionnels formés', description: 'Médecins, infirmiers et agents de santé communautaire ayant bénéficié de nos programmes' },
  { icon: BookOpen, value: 50, suffix: '+', label: 'Sessions organisées', description: 'Formations théoriques et pratiques dispensées dans différentes localités' },
  { icon: GraduationCap, value: 20, suffix: '+', label: 'Localités couvertes', description: 'Zones rurales et urbaines touchées par nos programmes de formation' },
];

const GALLERY = [
  { src: '/ateliers-formation-pratique.jpg', label: 'Atelier de formation pratique' },
  { src: '/eup.jpg', label: 'Enseignement post-universitaire' },
  { src: '/mentorat-encadrement.jpg', label: 'Mentorat et encadrement sur le terrain' },
  { src: '/journee-scientifique.png', label: 'Journée scientifique de l’ASFO' },
  { src: '/renforcement-capacites.jpg', label: 'Renforcement des capacités communautaires' },
  { src: '/sessions-sensibilisation.jpg', label: 'Session de formation en campagne' },
];

const NAV = [
  { id: 'initiatives', label: 'Nos initiatives' },
  { id: 'publics', label: 'Publics concernés' },
  { id: 'parcours', label: 'Parcours de formation' },
  { id: 'objectifs', label: 'Objectifs et impact' },
  { id: 'resultats', label: 'Résultats concrets' },
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

const TrainingPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [headerH, setHeaderH] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => { document.title = 'Formations et renforcement des capacités | ASFO - Action Sanitaire pour le Fouta'; }, []);

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
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              Développer les compétences locales
            </motion.span>
            <motion.h1 {...fadeUp(0.08)} className="mt-6 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl xl:text-6xl" style={poppins}>
              Formations et{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">renforcement des capacités</span>
            </motion.h1>
            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8">
              Développer l'expertise locale pour un impact durable sur la santé communautaire —
              en formant les professionnels et en rendant les acteurs de terrain autonomes.
            </motion.p>
            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <button type="button" onClick={() => scrollTo('initiatives')} className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Découvrir nos initiatives
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link to="/join" className="inline-flex items-center justify-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Participer à une formation
              </Link>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.15)} className="relative">
            <div className="grid grid-cols-3 grid-rows-3 gap-3.5">
              <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl border border-white/80 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.45)]">
                <img src="/ateliers-formation-pratique.jpg" alt="Atelier de formation pratique de l'ASFO" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="row-span-2 overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src="/mentorat-encadrement.jpg" alt="Mentorat sur le terrain" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src="/eup.jpg" alt="Enseignement post-universitaire" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            </div>
            <motion.div animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-6 -left-4 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_20px_50px_-20px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:-left-8">
              <div className="flex items-center gap-4">
                {[
                  { value: '500+', label: 'formés' },
                  { value: '50+', label: 'sessions' },
                  { value: '20+', label: 'localités' },
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
              Former aujourd'hui pour renforcer durablement les{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">systèmes de santé</span>
            </h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
            <p className="mt-6 text-[15px] leading-8 text-gray-700 sm:text-base sm:leading-9">
              L'<strong className="text-teal-700">ASFO</strong> accorde une importance particulière à la{' '}
              <strong className="text-teal-700">formation continue et au renforcement des capacités</strong> des jeunes
              professionnels de santé. Nous croyons qu'un personnel médical bien formé est la clé d'un
              système de santé <strong className="text-gray-900">performant, durable et équitable</strong>, en particulier
              dans les zones rurales.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.12)} className="self-start rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-7 shadow-[0_20px_50px_-28px_rgba(18,63,56,0.35)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700" style={poppins}>Ce que nous visons</p>
            <ul className="mt-5 space-y-3.5">
              {[
                { icon: BookOpen, text: 'Transmission des compétences' },
                { icon: Sprout, text: 'Autonomie des acteurs locaux' },
                { icon: Heart, text: 'Amélioration de la qualité des soins' },
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

      {/* ════════════════ NOS INITIATIVES ════════════════ */}
      <section id="initiatives" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-teal-100/30 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Presentation className="h-3.5 w-3.5" aria-hidden="true" />
              Nos initiatives
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Nous avons mis en place plusieurs{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">initiatives</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Des programmes de formation adaptés aux besoins spécifiques des communautés.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INITIATIVES.map((it, i) => (
              <motion.article key={it.title} {...fadeUp(0.05 + i * 0.05)} className={`group flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)] ${i === 6 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                <div className="relative h-48 overflow-hidden">
                  <img src={it.image} alt={`${it.title} — initiative de formation de l'ASFO`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/60 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-sm"><it.icon className="h-5 w-5 text-teal-600" aria-hidden="true" /></span>
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>{it.tag}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-base font-bold leading-snug text-gray-900" style={poppins}>{it.title}</h3>
                  <div className="mt-2 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] opacity-60" aria-hidden="true" />
                  <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-gray-600">{it.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PUBLICS CONCERNÉS ════════════════ */}
      <section id="publics" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="pointer-events-none absolute inset-0 bg-teal-50/40" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-44 top-10 h-[400px] w-[400px] rounded-full bg-teal-100/40 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              Publics concernés
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              À qui s'adressent nos{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">formations ?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((a, i) => (
              <motion.div key={a.title} {...fadeUp(0.05 + i * 0.07)} className="rounded-3xl border border-white/80 bg-white/90 p-6 text-center shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)]">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_12px_30px_-10px_rgba(23,128,102,0.6)]"><a.icon className="h-6 w-6 text-white" aria-hidden="true" /></span>
                <h3 className="mt-4 text-base font-bold text-gray-900" style={poppins}>{a.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{a.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PARCOURS DE FORMATION ════════════════ */}
      <section id="parcours" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="pointer-events-none absolute -right-40 top-10 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
              Parcours de formation
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Du besoin identifié à la compétence{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">durable</span>
            </h2>
          </motion.div>

          <ol className="relative grid gap-8 lg:grid-cols-6 lg:gap-3">
            <div className="absolute left-6 top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-teal-200 via-teal-300 to-teal-200 lg:left-[8%] lg:right-[8%] lg:top-6 lg:h-px lg:w-[84%] lg:bg-gradient-to-r" aria-hidden="true" />
            {JOURNEY.map((step, i) => (
              <motion.li key={step.title} {...fadeUp(0.06 + i * 0.07)} className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:text-center">
                <span className={`z-10 flex h-12 w-12 flex-none items-center justify-center rounded-2xl border shadow-sm ${i === JOURNEY.length - 1 ? 'border-teal-500 bg-gradient-to-br from-[#2fb391] to-[#178066] text-white' : 'border-teal-200 bg-white text-teal-600'}`}>
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="lg:mt-3 lg:px-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600/80" style={poppins}>Étape {i + 1}</p>
                  <p className="text-[14px] font-bold text-gray-900" style={poppins}>{step.title}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">{step.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ════════════════ MENTORAT ════════════════ */}
      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0 bg-teal-50/40" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <motion.div {...fadeUp(0)} className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_25px_60px_-28px_rgba(18,63,56,0.4)]">
            <img src="/mentorat-encadrement.jpg" alt="Accompagnement des jeunes volontaires sur le terrain" loading="lazy" className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105 lg:h-full" />
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="min-w-0">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Brain className="h-3.5 w-3.5" aria-hidden="true" />
              Le mentorat au cœur
            </span>
            <h2 className="mt-6 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl" style={poppins}>
              Apprendre, pratiquer et être accompagné sur le{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">terrain</span>
            </h2>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                { icon: UserCheck, title: 'Accompagnement personnalisé', text: 'Un suivi individuel par des médecins et pharmaciens expérimentés.' },
                { icon: Handshake, title: 'Partage d’expérience', text: 'La transmission du savoir-faire entre générations de soignants.' },
                { icon: Sprout, title: 'Progression des compétences', text: 'Une montée en compétence concrète, geste après geste.' },
                { icon: Globe, title: 'Adaptation aux réalités locales', text: 'Des pratiques ajustées au contexte du milieu rural.' },
              ].map((p) => (
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

      {/* ════════════════ OBJECTIFS ET IMPACT ════════════════ */}
      <section id="objectifs" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              Objectifs et impact
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Autonomiser les acteurs de{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">première ligne</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Ces formations visent à <strong className="text-teal-700">autonomiser les acteurs de santé de première ligne</strong> et
              à améliorer la qualité des soins au sein des communautés rurales. En outillant les étudiants et les
              agents communautaires (ASC, matrones, Badjénou Gokh) sur des techniques simples mais vitales, l'ASFO contribue à :
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {OBJECTIVES.map((o, i) => (
              <motion.div key={o.title} {...fadeUp(0.06 + i * 0.08)} className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_12px_30px_-10px_rgba(23,128,102,0.6)]"><o.icon className="h-6 w-6 text-white" aria-hidden="true" /></span>
                <h3 className="mt-4 text-lg font-bold text-gray-900" style={poppins}>{o.title}</h3>
                <div className="mt-2 h-1 w-10 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
                <p className="mt-3 text-[14px] leading-7 text-gray-600">{o.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Citation */}
          <motion.figure {...fadeUp(0.12)} className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/80 bg-gradient-to-b from-white/95 to-teal-50/60 p-8 text-center shadow-[0_20px_50px_-28px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:p-10">
            <Quote className="mx-auto h-9 w-9 -scale-x-100 text-teal-300/60" aria-hidden="true" />
            <blockquote className="mt-3 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-8" style={poppins}>
              Le renforcement des compétences est un levier essentiel de notre impact durable sur le terrain.
            </blockquote>
            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
          </motion.figure>
        </div>
      </section>

      {/* ════════════════ RÉSULTATS CONCRETS ════════════════ */}
      <section id="resultats" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-8 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] sm:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm" style={poppins}>
                <Award className="h-3.5 w-3.5" aria-hidden="true" />
                Notre impact
              </span>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>Des résultats concrets</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
              {IMPACT.map((s, i) => (
                <motion.div key={s.label} {...fadeUp(0.06 + i * 0.08)} className="rounded-2xl border border-white/80 bg-white px-6 py-8 text-center shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] transition-all duration-300 hover:-translate-y-1">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_12px_30px_-10px_rgba(23,128,102,0.6)]"><s.icon className="h-6 w-6 text-white" aria-hidden="true" /></span>
                  <p className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl" style={poppins}><StatCounter value={s.value} suffix={s.suffix} /></p>
                  <p className="mt-1.5 text-base font-bold text-gray-900" style={poppins}>{s.label}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{s.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ GALERIE ════════════════ */}
      <section className="relative overflow-hidden pb-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mb-10 text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
              La formation en images
            </span>
            <h2 className="mt-6 text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>Nos formations sur le terrain</h2>
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

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/60 p-10 text-center shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>
              Renforçons ensemble les compétences au service des{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">communautés</span>.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Professionnels, étudiants, institutions et partenaires peuvent rejoindre ou soutenir les
              initiatives de formation de l'ASFO.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link to="/join" className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
                Participer à une formation
              </Link>
              <Link to="/about/partenaires" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Handshake className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Proposer un partenariat
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Mail className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Contacter l'ASFO
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

export default TrainingPage;
