import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Heart,
  Users,
  Stethoscope,
  Baby,
  Eye,
  Brain,
  Smile,
  Bone,
  Activity,
  Scissors,
  FlaskConical,
  ScanLine,
  Radio,
  BookOpen,
  FileText,
  MessageCircle,
  ArrowRight,
  MapPin,
  Ambulance,
  ClipboardCheck,
  Pill,
  UserCheck,
  Quote,
  Microscope,
  HeartPulse,
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
  const formatted = value >= 1000 ? `${Math.round(display / 1000)}K` : display.toLocaleString('fr-FR');
  return <span ref={ref}>{formatted}{suffix}</span>;
};

/* ------------------------------------------------------------------ */
/* Données (services existants, inchangés — icônes médicales dédiées)   */
/* ------------------------------------------------------------------ */

interface Service {
  title: string;
  description: string;
  image: string;
  icon: React.ElementType;
  audience?: string;
}

const MEDICAL: Service[] = [
  { title: 'Médecine générale', description: 'Consultations et soins pour tous les patients de 15 à 65 ans', image: '/medecin-general.webp', icon: Stethoscope, audience: '15 à 65 ans' },
  { title: 'Pédiatrie', description: 'Soins spécialisés pour enfants âgés de 0 à 15 ans', image: '/pediatrie.webp', icon: Baby, audience: '0 à 15 ans' },
  { title: 'Ophtalmologie', description: "Prise en charge des maladies de l'œil et des troubles de la vision", image: '/ophtalmologie.webp', icon: Eye },
  { title: 'Psychiatrie', description: 'Prise en charge de la santé mentale et du bien-être psychologique', image: '/psychiatrie.jpg', icon: Brain },
  { title: 'Chirurgie dentaire', description: 'Prise en charge des affections bucco-dentaires et soins dentaires', image: '/dentaire.jpg', icon: Smile },
  { title: 'Gériatrie', description: 'Soins adaptés aux personnes âgées et à leurs besoins spécifiques', image: '/geriatrie.webp', icon: Bone, audience: 'Personnes âgées' },
  { title: 'Gynéco-Obstétrique', description: 'Santé maternelle, reproductive et suivi des grossesses', image: '/gynecologie.webp', icon: Activity, audience: 'Santé maternelle' },
  { title: 'Circoncisions', description: 'Circoncision dans un cadre médical sécurisé et professionnel', image: '/circoncision.webp', icon: Scissors },
];

const DIAGNOSTIC: (Service & { benefit: string })[] = [
  { title: 'Biologie', description: 'Aide au dépistage et diagnostic par analyses biologiques', image: '/biologie.webp', icon: FlaskConical, benefit: 'Un diagnostic précis pour orienter chaque prise en charge.' },
  { title: 'Imagerie', description: "Orientation et diagnostic par techniques d'imagerie médicale", image: '/imagerie.JPG', icon: ScanLine, benefit: 'Visualiser pour mieux traiter, au plus près du terrain.' },
];

const AWARENESS: Service[] = [
  { title: 'Santé communautaire', description: 'Promotion de la santé nutritionnelle et des bonnes pratiques', image: '/sante-communautaire.webp', icon: Users },
  { title: 'Sensibilisation publique', description: 'Sessions interactives avec la population en langue locale', image: '/sensibilisation.jpg', icon: MessageCircle },
  { title: 'Radios communautaires', description: 'Sensibilisation via les radios locales pour une portée étendue', image: '/sensibilisation-radios.jpg', icon: Radio },
  { title: 'Consultations éducatives', description: 'Sensibilisation personnalisée lors des consultations médicales', image: '/sensibilisation-consultation.jpg', icon: BookOpen },
  { title: 'Documentation santé', description: "Distribution de flyers et supports d'information adaptés", image: '/Distribution-de-flyers.jpg', icon: FileText },
];

const JOURNEY = [
  { icon: UserCheck, title: 'Accueil et orientation', text: 'Chaque patient est accueilli puis dirigé vers le bon service.' },
  { icon: Stethoscope, title: 'Consultation', text: 'Un professionnel de santé examine et écoute le patient.' },
  { icon: Microscope, title: 'Diagnostic', text: 'Analyses biologiques et imagerie précisent la prise en charge.' },
  { icon: Pill, title: 'Traitement ou prescription', text: 'Soins, médicaments essentiels ou orientation adaptée.' },
  { icon: HeartPulse, title: 'Suivi et sensibilisation', text: 'Conseils, prévention et suivi pour une santé durable.' },
];

const NAV = [
  { id: 'services-medicaux', label: 'Services médicaux' },
  { id: 'services-diagnostiques', label: 'Services diagnostiques' },
  { id: 'sensibilisation', label: 'Sensibilisation' },
  { id: 'parcours', label: 'Parcours du patient' },
  { id: 'impact', label: 'Notre impact' },
];

const IMPACT = [
  { icon: Users, value: 250000, suffix: '+', label: 'Patients consultés' },
  { icon: MapPin, value: 192, suffix: '+', label: 'Localités sillonnées' },
  { icon: Heart, value: 600, suffix: '+', label: 'Acteurs engagés' },
];

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const ConsultationsPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [headerH, setHeaderH] = useState(0);

  useEffect(() => { document.title = 'Consultations médicales | ASFO - Action Sanitaire pour le Fouta'; }, []);

  useEffect(() => {
    const el = document.getElementById('site-header');
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

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
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              Soins de qualité pour tous
            </motion.span>
            <motion.h1 {...fadeUp(0.08)} className="mt-6 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl xl:text-6xl" style={poppins}>
              Consultations{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">médicales</span>
            </motion.h1>
            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8">
              Des soins de qualité accessibles à tous grâce à nos caravanes médicales gratuites,
              à travers les régions les plus reculées du Sénégal.
            </motion.p>
            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <button type="button" onClick={() => scrollTo('services-medicaux')} className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Découvrir les spécialités
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link to="/archives" className="inline-flex items-center justify-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Voir nos missions
              </Link>
            </motion.div>
          </div>

          {/* Composition photo */}
          <motion.div {...fadeUp(0.15)} className="relative">
            <div className="grid grid-cols-3 grid-rows-3 gap-3.5">
              <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl border border-white/80 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.45)]">
                <img src="/medecin-general.webp" alt="Consultation de médecine générale lors d'une caravane ASFO" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="row-span-2 overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src="/pediatrie.webp" alt="Consultation pédiatrique" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src="/ophtalmologie.webp" alt="Examen ophtalmologique" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            </div>
            <motion.div
              animate={reduce ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-4 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_20px_50px_-20px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:-left-8"
            >
              <div className="flex items-center gap-4">
                {[
                  { value: '250K+', label: 'patients' },
                  { value: '192+', label: 'localités' },
                  { value: '600+', label: 'acteurs' },
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

      {/* ════════════════ INTRODUCTION + IMPACT ════════════════ */}
      <section className="relative overflow-hidden pb-16">
        <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:gap-14 lg:px-8">
          <motion.div {...fadeUp(0)} className="min-w-0 self-start">
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Des soins accessibles au plus près des{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">communautés</span>
            </h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
            <p className="mt-6 text-[15px] leading-8 text-gray-700 sm:text-base sm:leading-9">
              Depuis plus de deux décennies, <strong className="text-teal-700">ASFO</strong> organise des{' '}
              <strong className="text-teal-700">caravanes médicales gratuites</strong> à travers plusieurs
              localités du Sénégal. Ces actions permettent d'offrir un accès aux soins de santé à des
              milliers de personnes issues de zones rurales ou défavorisées, contribuant ainsi à{' '}
              <strong className="text-gray-900">réduire les inégalités en matière de santé</strong>.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.12)} className="self-start rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-7 shadow-[0_20px_50px_-28px_rgba(18,63,56,0.35)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700" style={poppins}>Notre impact</p>
            <p className="mt-3 text-[14px] leading-7 text-gray-600">
              À travers ces missions, nous affirmons notre volonté de servir la nation et de promouvoir
              l'engagement citoyen — pour agir efficacement contre les inégalités de santé.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {IMPACT.map((s) => (
                <div key={s.label} className="rounded-2xl border border-teal-100 bg-white px-2 py-4 text-center">
                  <s.icon className="mx-auto h-4 w-4 text-teal-600" aria-hidden="true" />
                  <p className="mt-2 text-lg font-extrabold text-gray-900 sm:text-xl" style={poppins}><StatCounter value={s.value} suffix={s.suffix} /></p>
                  <p className="mt-0.5 text-[10.5px] leading-tight text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
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

      {/* ════════════════ SERVICES MÉDICAUX ════════════════ */}
      <section id="services-medicaux" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-teal-100/30 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
              Services médicaux
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Les activités de la campagne{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">médicale</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Une équipe pluridisciplinaire offrant une gamme complète de soins adaptés aux besoins locaux.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {MEDICAL.map((s, i) => {
              const highlight = i < 4; // 1re ligne mise en avant
              return (
                <motion.article
                  key={s.title}
                  {...fadeUp(0.05 + i * 0.05)}
                  className={`group flex flex-col overflow-hidden rounded-2xl border bg-white/85 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 ${
                    highlight
                      ? 'border-teal-200/70 shadow-[0_22px_50px_-25px_rgba(18,63,56,0.4)] hover:shadow-[0_30px_65px_-25px_rgba(18,63,56,0.5)]'
                      : 'border-white/80 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)]'
                  }`}
                >
                  <div className={`relative overflow-hidden ${highlight ? 'h-52' : 'h-44'}`}>
                    <img src={s.image} alt={`${s.title} — service médical de l'ASFO`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/55 via-transparent to-transparent" aria-hidden="true" />
                    <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-sm"><s.icon className="h-5 w-5 text-teal-600" aria-hidden="true" /></span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-gray-900" style={poppins}>{s.title}</h3>
                    {s.audience && (
                      <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-700" style={poppins}>{s.audience}</span>
                    )}
                    <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-gray-600">{s.description}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ SERVICES DIAGNOSTIQUES ════════════════ */}
      <section id="services-diagnostiques" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="pointer-events-none absolute inset-0 bg-teal-50/40" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-44 top-10 h-[400px] w-[400px] rounded-full bg-teal-100/40 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
              Services diagnostiques
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Un diagnostic{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">au service du soin</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {DIAGNOSTIC.map((s, i) => (
              <motion.article
                key={s.title}
                {...fadeUp(0.08 + i * 0.09)}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-[0_22px_55px_-28px_rgba(18,63,56,0.4)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 sm:flex-row"
              >
                <div className="relative h-52 overflow-hidden sm:h-auto sm:w-2/5">
                  <img src={s.image} alt={`${s.title} — service diagnostique de l'ASFO`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col justify-center p-7 sm:w-3/5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)]"><s.icon className="h-5 w-5 text-white" aria-hidden="true" /></span>
                  <h3 className="mt-4 text-xl font-bold text-gray-900" style={poppins}>{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-gray-600">{s.description}</p>
                  <p className="mt-4 flex items-start gap-2 rounded-xl border border-teal-100 bg-teal-50/60 p-3 text-[13px] leading-relaxed text-gray-700">
                    <ClipboardCheck className="mt-0.5 h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
                    {s.benefit}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ SENSIBILISATION ════════════════ */}
      <section id="sensibilisation" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              Sensibilisation et éducation
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Une santé{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">construite ensemble</span>
            </h2>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr] lg:gap-6">
            {/* Grande carte à gauche */}
            <motion.article {...fadeUp(0.05)} className="group relative overflow-hidden rounded-3xl border border-white/80 shadow-[0_25px_60px_-28px_rgba(18,63,56,0.4)]">
              <img src={AWARENESS[0].image} alt={`${AWARENESS[0].title} — action de l'ASFO`} loading="lazy" className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02120e]/90 via-[#02120e]/25 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white" style={poppins}>
                  {React.createElement(AWARENESS[0].icon, { className: 'h-3.5 w-3.5', 'aria-hidden': true })}
                  Sensibilisation
                </span>
                <h3 className="mt-3 text-2xl font-bold text-white" style={poppins}>{AWARENESS[0].title}</h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-teal-50/85">{AWARENESS[0].description}</p>
              </div>
            </motion.article>

            {/* Grille à droite */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {AWARENESS.slice(1).map((s, i) => (
                <motion.article
                  key={s.title}
                  {...fadeUp(0.08 + i * 0.06)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img src={s.image} alt={`${s.title} — action de l'ASFO`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-sm"><s.icon className="h-4 w-4 text-teal-600" aria-hidden="true" /></span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-bold text-gray-900" style={poppins}>{s.title}</h3>
                    <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-gray-600">{s.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ PARCOURS DU PATIENT ════════════════ */}
      <section id="parcours" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="pointer-events-none absolute -right-40 top-10 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Parcours du patient
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Le déroulement d'une{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">prise en charge</span>
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
        </div>
      </section>

      {/* ════════════════ NOTRE IMPACT ════════════════ */}
      <section id="impact" className="relative overflow-hidden scroll-mt-32 py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-8 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] sm:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>Notre impact</h2>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-gray-700 sm:text-base">
                À travers ces missions, nous affirmons notre volonté de <strong className="text-teal-700">servir la nation</strong>,
                de renforcer la solidarité et de promouvoir l'<strong className="text-teal-700">engagement et la participation
                citoyens</strong>. Le soutien de nos partenaires, allié à l'implication des structures locales,
                nous permet d'agir efficacement <strong className="text-gray-900">contre les inégalités en matière de santé</strong>.
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

      {/* ════════════════ CITATION ════════════════ */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.figure {...fadeUp(0)} className="mx-auto max-w-3xl rounded-3xl border border-white/80 bg-gradient-to-b from-white/95 to-teal-50/60 p-8 text-center shadow-[0_20px_50px_-28px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:p-10">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50"><Stethoscope className="h-5 w-5 text-teal-600" aria-hidden="true" /></span>
            <Quote className="mx-auto mt-4 h-8 w-8 -scale-x-100 text-teal-300/60" aria-hidden="true" />
            <blockquote className="mt-3 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-8" style={poppins}>
              Des soins de qualité pour tous, au plus près des communautés.
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
              Vous souhaitez bénéficier ou soutenir une prochaine{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">mission médicale</span> ?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Découvrez les campagnes de l'ASFO, proposez une localité ou contribuez à rendre les
              soins accessibles aux populations.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link to="/missions/prochaine-campagne" className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Ambulance className="h-5 w-5" aria-hidden="true" />
                Voir les prochaines missions
              </Link>
              <Link to="/candidature" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Users className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Accueillir une caravane
              </Link>
              <Link to="/donate" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Heart className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Faire un don
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ConsultationsPage;
