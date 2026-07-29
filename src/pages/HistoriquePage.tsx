import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Award,
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Flag,
  HandHeart,
  Heart,
  HeartHandshake,
  Images,
  Landmark,
  MapPin,
  Network,
  Quote,
  Rocket,
  ScrollText,
  Sparkles,
  Sprout,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import { archives } from '../data/archives';
import {
  historyMilestones,
  historyPeriods,
  type HistoryCategory,
} from '../data/history';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.62, delay, ease: 'easeOut' as const },
});

const categoryStyles: Record<
  HistoryCategory,
  { icon: React.ElementType; className: string }
> = {
  Création: { icon: Sprout, className: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  Mission: { icon: Stethoscope, className: 'bg-sky-50 text-sky-700 ring-sky-100' },
  Expansion: { icon: MapPin, className: 'bg-amber-50 text-amber-700 ring-amber-100' },
  Partenariat: { icon: HeartHandshake, className: 'bg-violet-50 text-violet-700 ring-violet-100' },
  Impact: { icon: Heart, className: 'bg-rose-50 text-rose-700 ring-rose-100' },
  Digitalisation: { icon: Rocket, className: 'bg-teal-50 text-teal-700 ring-teal-100' },
};

const archiveGallery = archives.slice(0, 6);

const stages = [
  {
    icon: Sprout,
    index: '01',
    title: 'Naissance',
    text: "Création à l'UCAD en 2000 par de jeunes professionnels de santé originaires du Fouta.",
  },
  {
    icon: MapPin,
    index: '02',
    title: 'Déploiement',
    text: 'Premières consultations gratuites à Matam, puis extension aux départements du Fouta.',
  },
  {
    icon: Landmark,
    index: '03',
    title: 'Reconnaissance',
    text: 'Structuration des partenariats et consolidation de la confiance des populations.',
  },
  {
    icon: Rocket,
    index: '04',
    title: 'Modernisation',
    text: 'Développement des outils numériques et du suivi médical pour mieux servir les patients.',
  },
];

const evolutionPoints = [
  {
    icon: Users,
    title: 'Un collectif engagé',
    text: "D'un groupe de jeunes professionnels à un réseau de plus de 600 bénévoles.",
  },
  {
    icon: Network,
    title: 'Une structure reconnue',
    text: "Une organisation accompagnée par l'UCAD, le COUD et le Ministère de l'Intérieur.",
  },
  {
    icon: MapPin,
    title: 'Un rayon d’action élargi',
    text: 'Des interventions développées dans le Fouta et à travers 192+ localités.',
  },
  {
    icon: Activity,
    title: 'Une action durable',
    text: 'Des missions gratuites, de la prévention et un suivi médical renforcé.',
  },
];

const progressPhases = [
  { label: 'Création', icon: Sprout },
  { label: 'Structuration', icon: Building2 },
  { label: 'Expansion', icon: MapPin },
  { label: 'Impact', icon: Heart },
  { label: 'Digitalisation', icon: Rocket },
  { label: 'Avenir', icon: Sparkles },
];

const CountUp: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / 1400, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
};

const HistoriquePage: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState(historyPeriods[0].label);
  const [selectedArchive, setSelectedArchive] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);

  const selectedMission = useMemo(
    () => (selectedArchive === null ? null : archiveGallery[selectedArchive]),
    [selectedArchive],
  );

  useEffect(() => {
    document.title = "Notre histoire | ASFO — Action Sanitaire pour le Fouta";
  }, []);

  useEffect(() => {
    if (selectedArchive === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedArchive(null);
      if (event.key === 'ArrowLeft') {
        setSelectedArchive((current) =>
          current === null ? null : (current - 1 + archiveGallery.length) % archiveGallery.length,
        );
      }
      if (event.key === 'ArrowRight') {
        setSelectedArchive((current) =>
          current === null ? null : (current + 1) % archiveGallery.length,
        );
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedArchive]);

  const scrollToPeriod = (label: string, targetYear: string) => {
    setActivePeriod(label);
    document.getElementById(`history-${targetYear}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const showPreviousArchive = () => {
    setSelectedArchive((current) =>
      current === null ? null : (current - 1 + archiveGallery.length) % archiveGallery.length,
    );
  };

  const showNextArchive = () => {
    setSelectedArchive((current) =>
      current === null ? null : (current + 1) % archiveGallery.length,
    );
  };

  return (
    <div className="overflow-hidden bg-[#f7faf9] text-slate-900">
      {/* Hero éditorial */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#f3fbf8] via-white to-[#f7faf9] py-16 sm:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute -left-40 -top-48 h-[520px] w-[520px] rounded-full bg-teal-200/25 blur-[110px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-40 top-20 h-[440px] w-[440px] rounded-full bg-amber-100/35 blur-[110px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700 shadow-sm backdrop-blur"
              style={poppins}
            >
              <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
              Depuis 2000
            </span>
            <h1
              className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.06] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
              style={poppins}
            >
              L’histoire de{' '}
              <span className="bg-gradient-to-r from-teal-700 to-[#2fb391] bg-clip-text text-transparent">
                l’ASFO
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Depuis l’an 2000, l’ASFO incarne l’engagement d’une jeunesse déterminée à
              transformer l’accès aux soins dans le Fouta sénégalais.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {['25+ années d’engagement', '192+ localités sillonnées', '600+ bénévoles'].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                    {item}
                  </span>
                ),
              )}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#chronologie"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(15,118,110,0.85)] transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Explorer la chronologie
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                to="/archives"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Voir les missions
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.72, delay: 0.08, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-2xl pb-8 sm:pb-12"
          >
            <div className="grid h-[420px] grid-cols-[1.35fr_0.85fr] grid-rows-2 gap-3 sm:h-[520px] sm:gap-4">
              <figure className="row-span-2 overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_30px_80px_-34px_rgba(15,75,68,0.5)]">
                <img
                  src="/last-mission.webp"
                  alt="Équipe de l’ASFO réunie pendant une mission médicale"
                  className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
                />
              </figure>
              <figure className="overflow-hidden rounded-[1.5rem] border-4 border-white bg-white shadow-[0_24px_60px_-32px_rgba(15,75,68,0.5)]">
                <img
                  src="/medicalteam.webp"
                  alt="Professionnels de santé engagés avec l’ASFO"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
              </figure>
              <figure className="overflow-hidden rounded-[1.5rem] border-4 border-white bg-white shadow-[0_24px_60px_-32px_rgba(15,75,68,0.5)]">
                <img
                  src="/mission.webp"
                  alt="Action sanitaire menée auprès des populations"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
              </figure>
            </div>

            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-1 left-4 rounded-2xl border border-white/80 bg-white/95 px-5 py-4 shadow-[0_22px_55px_-24px_rgba(15,75,68,0.55)] backdrop-blur sm:-bottom-2 sm:left-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <HandHeart className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-slate-900" style={poppins}>
                    20 000 consultations
                  </p>
                  <p className="text-xs text-slate-500">cap franchi dès 2018</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Introduction et synthèse */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16 lg:px-10">
          <motion.div {...fadeUp()}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700" style={poppins}>
              Aux origines d’une mission
            </span>
            <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl" style={poppins}>
              Une organisation née de l’engagement étudiant et tournée vers le terrain
            </h2>
            <div className="mt-7 max-w-3xl space-y-5 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
              <p>
                L’Action Sanitaire pour le Fouta voit le jour à l’Université Cheikh Anta Diop de
                Dakar en 2000, à l’initiative de jeunes professionnels de santé originaires du
                Fouta. Leur ambition est claire : rapprocher les soins des populations vivant dans
                les zones les plus éloignées.
              </p>
              <p>
                Reconnue par les autorités universitaires puis par le Ministère de l’Intérieur,
                l’association développe des missions médicales gratuites, des actions de
                prévention et des partenariats capables de prolonger durablement son impact.
              </p>
            </div>
          </motion.div>

          <motion.aside
            {...fadeUp(0.1)}
            className="rounded-[2rem] border border-teal-100 bg-white p-6 shadow-[0_28px_70px_-42px_rgba(15,75,68,0.45)] sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Flag className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-extrabold text-slate-950" style={poppins}>
                Repères fondateurs
              </h3>
            </div>
            <dl className="mt-6 divide-y divide-slate-100">
              {[
                ['Année de création', '2000'],
                ['Lieu de naissance', 'Université Cheikh Anta Diop de Dakar'],
                ['Mission initiale', 'Améliorer l’accès aux soins dans les zones reculées'],
                ['Ancrage historique', 'Le Fouta sénégalais'],
              ].map(([label, value]) => (
                <div key={label} className="py-4 first:pt-0 last:pb-0">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</dt>
                  <dd className="mt-1.5 text-sm font-semibold leading-6 text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </motion.aside>
        </div>
      </section>

      {/* Grandes étapes */}
      <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp()} className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700" style={poppins}>
              Les grandes étapes
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Un engagement qui grandit avec le terrain
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage, index) => (
              <motion.article
                key={stage.title}
                {...fadeUp(index * 0.07)}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-[#fbfdfc] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_24px_60px_-38px_rgba(15,75,68,0.5)]"
              >
                <span className="absolute right-5 top-4 text-5xl font-black text-slate-100 transition group-hover:text-teal-50" style={poppins}>
                  {stage.index}
                </span>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <stage.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="relative mt-6 text-lg font-extrabold text-slate-900" style={poppins}>
                  {stage.title}
                </h3>
                <p className="relative mt-3 text-sm leading-7 text-slate-600">{stage.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Chronologie */}
      <section id="chronologie" className="scroll-mt-28 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp()} className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700" style={poppins}>
              Chronologie
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl lg:text-5xl" style={poppins}>
              Plus de deux décennies d’action
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              Des premiers engagements aux outils de suivi actuels, chaque jalon prolonge la même
              mission d’accès aux soins.
            </p>
          </motion.div>

          <nav
            aria-label="Périodes de la chronologie"
            className="sticky top-20 z-20 mx-auto mt-10 max-w-4xl overflow-x-auto rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-[0_16px_40px_-28px_rgba(15,75,68,0.4)] backdrop-blur"
          >
            <div className="flex min-w-max gap-1">
              {historyPeriods.map((period) => {
                const isActive = activePeriod === period.label;
                return (
                  <button
                    key={period.label}
                    type="button"
                    onClick={() => scrollToPeriod(period.label, period.targetYear)}
                    aria-pressed={isActive}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                  >
                    {period.label}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="relative mx-auto mt-16 max-w-6xl">
            <div
              className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-teal-300 via-teal-200 to-transparent md:left-1/2"
              aria-hidden="true"
            />
            <div className="space-y-12 md:space-y-16">
              {historyMilestones.map((milestone, index) => {
                const category = categoryStyles[milestone.category];
                const Icon = category.icon;
                const isLeft = index % 2 === 0;
                return (
                  <motion.article
                    id={`history-${milestone.year}`}
                    key={milestone.year}
                    {...fadeUp(index * 0.04)}
                    className={`relative grid scroll-mt-40 grid-cols-[2.5rem_1fr] gap-5 md:grid-cols-2 md:gap-16 ${
                      isLeft ? '' : 'md:[&>div:last-child]:col-start-2'
                    }`}
                  >
                    <span
                      className="absolute left-5 top-8 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[#f7faf9] bg-teal-700 text-white shadow-lg md:left-1/2"
                      aria-hidden="true"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div
                      className={`col-start-2 min-w-0 md:col-auto ${
                        isLeft ? 'md:pr-4' : 'md:col-start-2 md:pl-4'
                      }`}
                    >
                      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-42px_rgba(15,75,68,0.45)] transition duration-300 hover:-translate-y-1 hover:border-teal-200 sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="text-4xl font-black tracking-tight text-teal-700 sm:text-5xl" style={poppins}>
                            {milestone.year}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ${category.className}`}>
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            {milestone.category}
                          </span>
                        </div>
                        <h3 className="mt-5 text-xl font-extrabold text-slate-950 sm:text-2xl" style={poppins}>
                          {milestone.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                          {milestone.description}
                        </p>
                        {milestone.image && (
                          <figure className="mt-6 overflow-hidden rounded-2xl bg-slate-100">
                            <img
                              src={milestone.image.src}
                              alt={milestone.image.alt}
                              loading="lazy"
                              className="h-48 w-full object-cover transition duration-700 hover:scale-[1.03]"
                            />
                            <figcaption className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
                              <Camera className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                              {milestone.image.caption}
                            </figcaption>
                          </figure>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="border-y border-teal-100 bg-gradient-to-r from-teal-50 via-white to-emerald-50 py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-6 text-center sm:px-8 lg:grid-cols-4 lg:px-10">
          {[
            { icon: Clock3, value: 25, suffix: '+', label: 'années d’engagement' },
            { icon: Activity, value: 20000, suffix: '', label: 'consultations dès 2018' },
            { icon: MapPin, value: 192, suffix: '+', label: 'localités sillonnées' },
            { icon: Users, value: 600, suffix: '+', label: 'bénévoles mobilisés' },
          ].map((stat) => (
            <div key={stat.label} className="relative px-4 lg:not-last:border-r lg:not-last:border-teal-100">
              <stat.icon className="mx-auto h-5 w-5 text-teal-600" aria-hidden="true" />
              <p className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl" style={poppins}>
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Citation */}
      <section className="bg-white py-20 sm:py-24">
        <motion.blockquote {...fadeUp()} className="mx-auto max-w-4xl px-6 text-center sm:px-8">
          <Quote className="mx-auto h-10 w-10 text-teal-200" aria-hidden="true" />
          <p className="mt-5 text-2xl font-extrabold leading-relaxed text-slate-900 sm:text-3xl sm:leading-relaxed" style={poppins}>
            « Chaque mission, chaque partenariat et chaque engagement bénévole a contribué à écrire
            l’histoire de l’ASFO. »
          </p>
          <div className="mx-auto mt-7 h-1 w-14 rounded-full bg-gradient-to-r from-teal-600 to-emerald-400" aria-hidden="true" />
        </motion.blockquote>
      </section>

      {/* Archives photo */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <motion.div {...fadeUp()} className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700" style={poppins}>
                Archives photographiques
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
                Des missions qui laissent une trace
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Une sélection issue des archives de missions actuellement disponibles sur le site.
              </p>
            </motion.div>
            <Link
              to="/archives"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900"
            >
              Toutes les archives
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archiveGallery.map((mission, index) => (
              <motion.button
                key={mission.id}
                {...fadeUp(index * 0.06)}
                type="button"
                onClick={() => setSelectedArchive(index)}
                className={`group relative overflow-hidden rounded-3xl bg-slate-200 text-left shadow-[0_20px_50px_-38px_rgba(15,75,68,0.6)] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-4 ${
                  index === 0 ? 'sm:row-span-2 sm:auto-rows-auto' : ''
                }`}
                aria-label={`Agrandir la photo de la mission ${mission.title}, ${mission.year}`}
              >
                <img
                  src={mission.imageUrl}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-slate-700 opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 group-focus:opacity-100">
                  <Images className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-200">{mission.year}</span>
                  <span className="mt-1 block text-lg font-extrabold" style={poppins}>
                    {mission.title}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Évolution de l'organisation */}
      <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <motion.figure {...fadeUp()} className="relative overflow-hidden rounded-[2rem] bg-slate-100 shadow-[0_30px_80px_-45px_rgba(15,75,68,0.55)]">
            <img
              src="/medicalteam.webp"
              alt="Équipe médicale mobilisée par l’ASFO"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/50 bg-slate-950/65 px-5 py-4 text-sm font-semibold text-white backdrop-blur">
              Une organisation portée par l’engagement de ses membres.
            </figcaption>
          </motion.figure>

          <motion.div {...fadeUp(0.1)}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700" style={poppins}>
              Une organisation en mouvement
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              De l’initiative étudiante à un réseau structuré
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              La croissance de l’ASFO s’est construite par étapes, sans perdre le lien direct avec
              les communautés ni l’esprit bénévole de ses débuts.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {evolutionPoints.map((point) => (
                <div key={point.title} className="rounded-2xl border border-slate-200 bg-[#fbfdfc] p-5">
                  <point.icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-extrabold text-slate-900" style={poppins}>
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{point.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Frise de progression */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp()} className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700" style={poppins}>
              Une progression continue
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl" style={poppins}>
              Une même mission, de nouveaux moyens d’agir
            </h2>
          </motion.div>
          <div className="relative mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0">
            <div className="absolute left-[8%] right-[8%] top-6 hidden h-px bg-teal-200 lg:block" aria-hidden="true" />
            {progressPhases.map((phase, index) => (
              <motion.div key={phase.label} {...fadeUp(index * 0.06)} className="relative text-center">
                <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#f7faf9] bg-teal-700 text-white shadow-lg">
                  <phase.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-xs font-extrabold text-slate-700 sm:text-sm" style={poppins}>
                  {phase.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 pb-20 sm:px-8 sm:pb-24 lg:px-10">
        <motion.div
          {...fadeUp()}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-700 via-[#0f766e] to-[#145b54] px-6 py-14 text-center shadow-[0_32px_80px_-42px_rgba(15,75,68,0.8)] sm:px-10 sm:py-16"
        >
          <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl">
            <Award className="mx-auto h-9 w-9 text-teal-200" aria-hidden="true" />
            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl" style={poppins}>
              L’histoire continue avec vous
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-teal-50/90">
              Rejoignez le mouvement et contribuez à écrire les prochains chapitres de cette
              aventure humanitaire.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              {[
                { to: '/join', label: 'Nous rejoindre', primary: true },
                { to: '/about/partenaires', label: 'Devenir partenaire' },
                { to: '/donate', label: 'Faire un don' },
                { to: '/archives', label: 'Découvrir les missions' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-700 ${
                    action.primary
                      ? 'bg-white text-teal-800 shadow-lg'
                      : 'border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20'
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

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMission && selectedArchive !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo de la mission ${selectedMission.title}`}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm sm:p-8"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setSelectedArchive(null);
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedArchive(null)}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:right-8 sm:top-8"
              aria-label="Fermer la galerie"
              autoFocus
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showPreviousArchive}
              className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:left-8"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <motion.figure
              key={selectedMission.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="max-h-[88vh] max-w-6xl overflow-hidden rounded-2xl bg-slate-900 shadow-2xl"
              onTouchStart={(event) => {
                touchStart.current = event.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(event) => {
                if (touchStart.current === null) return;
                const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
                if (distance > 55) showPreviousArchive();
                if (distance < -55) showNextArchive();
                touchStart.current = null;
              }}
            >
              <img
                src={selectedMission.imageUrl}
                alt={`Mission ${selectedMission.title}, ${selectedMission.year}`}
                className="max-h-[76vh] w-full object-contain"
              />
              <figcaption className="flex items-center justify-between gap-5 border-t border-white/10 px-5 py-4 text-white">
                <div>
                  <p className="font-extrabold" style={poppins}>{selectedMission.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{selectedMission.year}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {selectedArchive + 1} / {archiveGallery.length}
                </span>
              </figcaption>
            </motion.figure>
            <button
              type="button"
              onClick={showNextArchive}
              className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:right-8"
              aria-label="Photo suivante"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoriquePage;
