import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Home,
  Activity,
  Stethoscope,
  Baby,
  Heart,
  HeartPulse,
  Users,
  Truck,
  ClipboardList,
  Megaphone,
  Flag,
  GraduationCap,
  ShieldPlus,
  Quote,
  CheckCircle2,
} from 'lucide-react';
import {
  podorBoundary,
  podorVillages,
  senegalOutline,
  senegalRiverValley,
  type GeoCoordinate,
} from '../../data/podorIntervention';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

/* ─── Données de la mission (inchangées) ─── */

const GALLERY = [
  { src: '/last-mission.webp', alt: 'Équipe ASFO au contact des populations pendant la mission' },
  { src: '/1.webp', alt: 'Consultation ophtalmologique pendant la mission' },
  { src: '/11.webp', alt: 'Soins dentaires pendant la mission' },
  { src: '/28.webp', alt: 'Distribution de médicaments à la pharmacie de mission' },
];

const dashboard = [
  { icon: HeartPulse, value: 9083, label: 'Consultations' },
  { icon: Users, value: 105, label: 'Professionnels mobilisés' },
  { icon: Activity, value: 419, label: 'Circoncisions' },
  { icon: Baby, value: 5, label: 'Accouchements' },
  { icon: Stethoscope, value: null, label: 'ECG & échographies', note: 'Dépistages & imagerie' },
  { icon: Truck, value: null, label: 'Unités mobiles', note: 'PNT · MSAS · SAMU' },
];

const timeline = [
  { icon: ClipboardList, label: 'Préparation' },
  { icon: Truck, label: 'Déploiement des équipes' },
  { icon: Stethoscope, label: 'Consultations' },
  { icon: Megaphone, label: 'Sensibilisation' },
  { icon: Flag, label: 'Clôture' },
];

const impact = [
  { icon: Stethoscope, label: 'Médecine' },
  { icon: ShieldPlus, label: 'Prévention' },
  { icon: Baby, label: 'Santé maternelle' },
  { icon: GraduationCap, label: 'Formation' },
  { icon: Truck, label: 'Urgence' },
  { icon: Megaphone, label: 'Sensibilisation' },
];

const MAP_WIDTH = 640;
const MAP_HEIGHT = 470;
const MAP_PADDING = 22;
const MAP_BOUNDS = {
  left: -17.8,
  right: -11.3,
  top: 16.9,
  bottom: 12.2,
};

const projectGeoPoint = ([longitude, latitude]: GeoCoordinate) => ({
  x:
    MAP_PADDING +
    ((longitude - MAP_BOUNDS.left) / (MAP_BOUNDS.right - MAP_BOUNDS.left)) *
      (MAP_WIDTH - MAP_PADDING * 2),
  y:
    MAP_PADDING +
    ((MAP_BOUNDS.top - latitude) / (MAP_BOUNDS.top - MAP_BOUNDS.bottom)) *
      (MAP_HEIGHT - MAP_PADDING * 2),
});

const toSvgPath = (coordinates: GeoCoordinate[]) =>
  `${coordinates
    .map((coordinate, index) => {
      const { x, y } = projectGeoPoint(coordinate);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ')} Z`;

const toSvgLine = (coordinates: GeoCoordinate[]) =>
  coordinates
    .map((coordinate, index) => {
      const { x, y } = projectGeoPoint(coordinate);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

const SENEGAL_PATH = toSvgPath(senegalOutline);
const PODOR_PATH = toSvgPath(podorBoundary);
const SENEGAL_RIVER_PATH = toSvgLine(senegalRiverValley);
const getVillageMarkerPoint = (village: (typeof podorVillages)[number]) => {
  const anchor = projectGeoPoint(village.coordinate);

  return {
    anchor,
    marker: {
      x: anchor.x + village.markerOffset[0],
      y: anchor.y + village.markerOffset[1],
    },
  };
};

/* ─── Compteur animé ─── */
const StatCounter: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const DURATION = 1700;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION);
      setN(Math.round(easeOutCubic(p) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString('fr-FR')}
    </span>
  );
};

const LatestMission: React.FC = () => {
  const reduce = useReducedMotion();
  const [activeImage, setActiveImage] = useState(0);
  const [activeVillageId, setActiveVillageId] = useState<number | null>(null);
  const activeVillage =
    podorVillages.find((village) => village.id === activeVillageId) ?? null;
  const activeVillagePoint = activeVillage
    ? getVillageMarkerPoint(activeVillage).marker
    : null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f5faf8] to-teal-50/50 py-24 sm:py-32">
      {/* ─── Fond ─── */}
      <div className="pointer-events-none absolute -right-40 -top-24 h-[460px] w-[460px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-44 bottom-40 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[6%] top-40 hidden h-32 w-32 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />
      <svg className="pointer-events-none absolute left-[4%] top-28 hidden h-32 w-32 text-teal-300/20 lg:block" aria-hidden="true">
        <defs>
          <pattern id="asfo-dots-mission" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.7" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asfo-dots-mission)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* ─── En-tête ─── */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp(0)} className="inline-block">
            <motion.span
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/70 bg-white/70 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-[0_10px_25px_-10px_rgba(18,63,56,0.3)] backdrop-blur-md"
            >
              <Activity className="h-4 w-4" aria-hidden="true" />
              Mission récente
            </motion.span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.08)}
            style={poppins}
            className="mt-7 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          >
            Notre Dernière{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              Mission
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.16)}
            className="mx-auto mt-7 max-w-[640px] text-lg leading-loose text-gray-600"
          >
            Découvrez notre mission la plus récente et son impact dans les communautés locales.
          </motion.p>
        </div>

        {/* ─── Deux colonnes : galerie / informations ─── */}
        <div className="mx-auto mt-16 grid max-w-6xl items-start gap-12 lg:grid-cols-2 lg:gap-14">
          {/* ── Galerie immersive ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="group relative overflow-hidden rounded-[24px] shadow-[0_25px_55px_-18px_rgba(18,63,56,0.4)] ring-1 ring-teal-900/10">
              <div className="relative aspect-[16/11]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={GALLERY[activeImage].src}
                    src={GALLERY[activeImage].src}
                    alt={GALLERY[activeImage].alt}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" aria-hidden="true" />

                {/* Carte mission flottante */}
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/40 bg-white/85 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2fb391] to-[#178066]">
                      <Heart className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p style={poppins} className="truncate text-sm font-bold text-gray-900">
                        Mission Humanitaire ASFO 2024
                      </p>
                      <p className="flex flex-wrap items-center gap-x-2 text-xs font-medium text-gray-600">
                        <span>Septembre 2024</span>
                        <span className="text-gray-300" aria-hidden="true">·</span>
                        <span>Département de Podor</span>
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Terminée
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Miniatures */}
            <div className="mt-4 grid grid-cols-4 gap-3" role="tablist" aria-label="Photos de la mission">
              {GALLERY.map((img, i) => (
                <button
                  key={img.src}
                  role="tab"
                  aria-selected={i === activeImage}
                  aria-label={`Photo ${i + 1} : ${img.alt}`}
                  onClick={() => setActiveImage(i)}
                  className={`group/thumb relative aspect-[4/3] overflow-hidden rounded-xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 ${
                    i === activeImage
                      ? 'shadow-[0_10px_22px_-8px_rgba(18,63,56,0.45)] ring-2 ring-teal-500 ring-offset-2'
                      : 'opacity-70 shadow-sm hover:-translate-y-0.5 hover:opacity-100 hover:shadow-md'
                  }`}
                >
                  <img
                    src={img.src}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Informations ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          >
            <h3
              style={poppins}
              className="text-2xl font-extrabold leading-snug text-gray-900 sm:text-3xl"
            >
              Mission menée dans six villages du département de Podor —{' '}
              <span className="text-teal-700">Septembre 2024</span>
            </h3>

            {/* Infos clés */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Calendar, text: 'Du 5 au 11 septembre 2024' },
                { icon: Clock, text: '7 jours de mission' },
                { icon: Home, text: '6 villages couverts' },
                { icon: MapPin, text: 'Département de Podor' },
              ].map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.text} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 ring-1 ring-teal-100">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{d.text}</span>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Guédé Village · Village Diattar · Village Tatqui · Village Madina Ndiathbé · Village
              Diaba · Village Bodé Lao
            </p>

            {/* Résumé premium */}
            <figure className="relative mt-6 overflow-hidden rounded-2xl border border-teal-100/80 bg-gradient-to-br from-[#e8f3ef]/70 to-white p-6 shadow-[0_15px_38px_-18px_rgba(18,63,56,0.25)] sm:p-7">
              <span className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#2fb391] to-[#178066]" aria-hidden="true" />
              <Quote className="h-8 w-8 -scale-x-100 text-teal-300/70" aria-hidden="true" />
              <blockquote className="mt-2 text-base leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed">
                L'ASFO a mené une campagne médicale sur le thème{' '}
                <strong className="font-semibold text-teal-700">
                  «&nbsp;Santé mentale&nbsp;: état des lieux, défis et perspectives&nbsp;»
                </strong>
                . <strong className="font-bold text-teal-700">105</strong> professionnels
                mobilisés, <strong className="font-bold text-teal-700">9&nbsp;083</strong>{' '}
                consultations, <strong className="font-bold text-teal-700">419</strong>{' '}
                circoncisions, <strong className="font-bold text-teal-700">5</strong>{' '}
                accouchements, soins dentaires, échographies, ECG, formations, dépistages et
                unités mobiles (PNT, MSAS, SAMU) ont permis une prise en charge
                multidisciplinaire et communautaire.
              </blockquote>
            </figure>

            {/* Boutons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/rapport"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-8px_rgba(23,128,102,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-8px_rgba(23,128,102,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98]"
              >
                Voir le rapport complet
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                to="/archives"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-300/70 bg-white/80 px-6 py-3.5 text-sm font-semibold text-teal-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98]"
              >
                Voir toutes les missions
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ─── Dashboard des résultats ─── */}
        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-6">
          {dashboard.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                {...fadeUp(i * 0.06)}
                className="group rounded-2xl border border-white/80 bg-white/80 p-5 text-center shadow-[0_12px_30px_-14px_rgba(18,63,56,0.2)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-14px_rgba(18,63,56,0.3)]"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 ring-1 ring-teal-100 transition-all duration-300 group-hover:scale-110 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p
                  style={poppins}
                  className="mt-3 bg-gradient-to-br from-teal-600 to-[#178066] bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl"
                >
                  {s.value !== null ? <StatCounter value={s.value} /> : <CheckCircle2 className="mx-auto h-7 w-7 text-teal-600" aria-label="Réalisé" />}
                </p>
                <p className="mt-1 text-xs font-bold text-gray-700">{s.label}</p>
                {s.note && <p className="mt-0.5 text-[11px] text-gray-500">{s.note}</p>}
                <div className="mx-auto mt-3 h-[3px] w-9 rounded-full bg-gradient-to-r from-teal-400 to-teal-200 transition-all duration-300 group-hover:w-14" aria-hidden="true" />
              </motion.div>
            );
          })}
        </div>

        {/* ─── Zone d'intervention + Timeline ─── */}
        <div className="mx-auto mt-20 grid max-w-6xl items-stretch gap-8 lg:grid-cols-2">
          {/* Zone d'intervention */}
          <motion.section
            {...fadeUp(0.1)}
            className="rounded-3xl border border-teal-100/80 bg-white p-5 shadow-[0_18px_46px_-22px_rgba(18,63,56,0.24)] sm:p-7 lg:col-span-2 lg:p-9"
            aria-labelledby="intervention-map-title"
          >
            <h3
              id="intervention-map-title"
              style={poppins}
              className="text-center text-2xl font-bold text-gray-900 sm:text-3xl"
            >
              Zone d'intervention
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-relaxed text-gray-500 sm:text-base">
              6 villages couverts dans le département de Podor, vallée du fleuve Sénégal
            </p>

            <div className="mt-7 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:items-stretch">
              <div className="min-w-0 rounded-2xl border border-teal-100 bg-[#fbfefd] p-3 sm:p-5">
                <div className="relative mx-auto w-full max-w-2xl">
                  <svg
                    viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                    className="block h-auto w-full"
                    role="img"
                    aria-labelledby="senegal-map-title senegal-map-description"
                  >
                    <title id="senegal-map-title">
                      Carte du Sénégal et zone d'intervention de Podor
                    </title>
                    <desc id="senegal-map-description">
                      Le département de Podor est mis en évidence au nord du Sénégal. Six
                      marqueurs numérotés localisent les villages couverts par les missions
                      ASFO.
                    </desc>
                    <defs>
                      <filter id="podor-map-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow
                          dx="0"
                          dy="5"
                          stdDeviation="6"
                          floodColor="#123f38"
                          floodOpacity="0.12"
                        />
                      </filter>
                    </defs>

                    <path
                      d={SENEGAL_PATH}
                      fill="#e7f7f3"
                      stroke="#8bdccb"
                      strokeWidth="2.4"
                      strokeLinejoin="round"
                      filter="url(#podor-map-shadow)"
                    />
                    <path
                      d={PODOR_PATH}
                      fill="#43c6a5"
                      fillOpacity="0.42"
                      stroke="#14836d"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />
                    <path
                      d={SENEGAL_RIVER_PATH}
                      fill="none"
                      stroke="#78b8d0"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="7 7"
                      opacity="0.85"
                    />

                    <text
                      x="380"
                      y="325"
                      fill="#5f8d84"
                      fontSize="19"
                      fontWeight="700"
                      letterSpacing="4"
                      opacity="0.55"
                      style={poppins}
                    >
                      SÉNÉGAL
                    </text>

                    <g aria-hidden="true">
                      <line
                        x1="470"
                        y1="143"
                        x2="365"
                        y2="95"
                        stroke="#176f60"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="470"
                        y="125"
                        width="92"
                        height="36"
                        rx="18"
                        fill="white"
                        stroke="#b9e9df"
                      />
                      <text
                        x="516"
                        y="148"
                        textAnchor="middle"
                        fill="#176f60"
                        fontSize="14"
                        fontWeight="700"
                        style={poppins}
                      >
                        Podor
                      </text>
                    </g>

                    {podorVillages.map((village, index) => {
                      const { anchor, marker: point } = getVillageMarkerPoint(village);
                      const isActive = village.id === activeVillageId;

                      return (
                        <motion.g
                          key={village.missionId}
                          role="button"
                          tabIndex={0}
                          aria-label={`${village.name}, département de Podor`}
                          className="cursor-pointer outline-none"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: reduce ? 0 : 0.45,
                            delay: reduce ? 0 : 0.18 + index * 0.08,
                          }}
                          onMouseEnter={() => setActiveVillageId(village.id)}
                          onFocus={() => setActiveVillageId(village.id)}
                          onClick={() =>
                            setActiveVillageId((current) =>
                              current === village.id ? null : village.id,
                            )
                          }
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setActiveVillageId((current) =>
                                current === village.id ? null : village.id,
                              );
                            }
                            if (event.key === 'Escape') {
                              setActiveVillageId(null);
                            }
                          }}
                        >
                          <title>{village.name}</title>
                          <line
                            x1={anchor.x}
                            y1={anchor.y}
                            x2={point.x}
                            y2={point.y}
                            stroke="#126f5d"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            opacity="0.72"
                          />
                          <circle
                            cx={anchor.x}
                            cy={anchor.y}
                            r="4.2"
                            fill="#126f5d"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r={isActive ? 23 : 20}
                            fill="#d6f5ed"
                            stroke="white"
                            strokeWidth="3"
                            className="transition-all duration-200"
                          />
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r={isActive ? 16 : 14}
                            fill="#126f5d"
                            stroke="#0d584b"
                            strokeWidth="1.4"
                            className="transition-all duration-200"
                          />
                          <text
                            x={point.x}
                            y={point.y + 5}
                            textAnchor="middle"
                            fill="white"
                            fontSize="14"
                            fontWeight="800"
                            pointerEvents="none"
                            style={poppins}
                          >
                            {village.id}
                          </text>
                        </motion.g>
                      );
                    })}
                  </svg>

                  <AnimatePresence>
                    {activeVillage && activeVillagePoint && (
                      <motion.div
                        key={activeVillage.id}
                        initial={{ opacity: 0, y: -5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                        transition={{ duration: reduce ? 0 : 0.18 }}
                        className="absolute z-20 w-[min(230px,78vw)] -translate-x-1/2 rounded-2xl border border-teal-100 bg-white p-4 shadow-[0_18px_42px_-18px_rgba(12,76,64,0.45)]"
                        style={{
                          left: `${(activeVillagePoint.x / MAP_WIDTH) * 100}%`,
                          top: `${(activeVillagePoint.y / MAP_HEIGHT) * 100 + 5}%`,
                        }}
                        role="status"
                      >
                        <p className="text-sm font-bold text-gray-900">{activeVillage.name}</p>
                        <p className="mt-1 text-xs font-medium text-teal-700">
                          Département de Podor
                        </p>
                        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <dt className="text-gray-400">Mission</dt>
                            <dd className="font-semibold text-gray-700">{activeVillage.year}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-400">Consultations</dt>
                            <dd className="font-semibold text-gray-700">
                              {activeVillage.consultations.toLocaleString('fr-FR')}
                            </dd>
                          </div>
                        </dl>
                        {activeVillage.coordinateStatus === 'to-validate' && (
                          <p className="mt-2 text-[10px] leading-relaxed text-amber-700">
                            Localisation indicative — coordonnées à valider.
                          </p>
                        )}
                        <Link
                          to={activeVillage.missionPath}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 transition-colors hover:text-teal-900"
                        >
                          Voir la mission
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div
                  className="mt-4 grid gap-2.5 border-t border-teal-100 pt-4 text-xs text-gray-600 sm:grid-cols-2 xl:grid-cols-4"
                  aria-label="Légende de la carte"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#126f5d]" aria-hidden="true" />
                    Village couvert
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-4 rounded-sm bg-[#43c6a5]/60" aria-hidden="true" />
                    Département de Podor
                  </span>
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3 w-4 rounded-sm border-2 border-[#8bdccb] bg-[#e7f7f3]"
                      aria-hidden="true"
                    />
                    Contour du Sénégal
                  </span>
                  <span className="flex items-center gap-2">
                    <span
                      className="w-5 border-t-2 border-dashed border-[#78b8d0]"
                      aria-hidden="true"
                    />
                    Vallée du fleuve Sénégal
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-gray-400">
                  Limites administratives : Gouvernement du Sénégal / OCHA ROWCA via
                  geoBoundaries. Position n° 6 indicative, à confirmer.
                </p>
              </div>

              <aside className="flex h-full flex-col rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/75 to-white p-5 sm:p-6">
                <span className="w-fit rounded-full bg-teal-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-teal-800">
                  6 villages couverts
                </span>
                <div className="mt-5 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h4 style={poppins} className="text-xl font-bold text-gray-900">
                      Département de Podor
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">Vallée du fleuve Sénégal</p>
                  </div>
                </div>

                <ol className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                  {podorVillages.map((village) => (
                    <li key={village.missionId}>
                      <button
                        type="button"
                        onClick={() => setActiveVillageId(village.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                          activeVillageId === village.id
                            ? 'border-teal-300 bg-white text-teal-800 shadow-sm'
                            : 'border-transparent bg-white/65 text-gray-700 hover:border-teal-200 hover:bg-white'
                        }`}
                        aria-pressed={activeVillageId === village.id}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#126f5d] text-xs font-extrabold text-white">
                          {village.id}
                        </span>
                        <span>{village.name}</span>
                      </button>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 flex items-center gap-2 rounded-xl border border-teal-200 bg-white/80 px-3 py-3 text-xs font-bold text-teal-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Zone prioritaire d'intervention
                </div>

                <Link
                  to="/archives"
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#178066] to-[#229d7d] px-4 py-3 text-center text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(23,128,102,0.85)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_rgba(23,128,102,0.9)]"
                >
                  Découvrir les missions de Podor
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </aside>
            </div>
          </motion.section>

          {/* Timeline de la mission */}
          <motion.div
            {...fadeUp(0.15)}
            className="w-full max-w-2xl justify-self-center rounded-3xl border border-teal-100/80 bg-white/80 p-7 shadow-[0_15px_38px_-18px_rgba(18,63,56,0.22)] backdrop-blur-sm lg:col-span-2"
          >
            <h3 style={poppins} className="text-center text-lg font-bold text-gray-900 sm:text-xl">
              Déroulé de la mission
            </h3>
            <ol className="relative mx-auto mt-6 max-w-sm">
              <span className="absolute bottom-5 left-[19px] top-5 w-[2px] bg-gradient-to-b from-teal-200 via-teal-400 to-teal-200" aria-hidden="true" />
              {timeline.map((t, i) => {
                const Icon = t.icon;
                return (
                  <motion.li
                    key={t.label}
                    {...fadeUp(0.2 + i * 0.08)}
                    className="relative flex items-center gap-4 py-3"
                  >
                    <span
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-white shadow-[0_0_0_2px_rgba(47,179,145,0.45)] ${
                        i === timeline.length - 1
                          ? 'bg-gradient-to-br from-[#2fb391] to-[#178066] text-white'
                          : 'bg-white text-teal-600'
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-gray-700">{t.label}</p>
                  </motion.li>
                );
              })}
            </ol>
          </motion.div>
        </div>

        {/* ─── Paroles du terrain ─── */}
        <motion.figure
          {...fadeUp(0.1)}
          className="relative mx-auto mt-20 max-w-3xl overflow-hidden rounded-3xl border border-teal-100/80 bg-gradient-to-br from-[#e8f3ef]/70 to-white px-8 py-10 text-center shadow-[0_18px_45px_-20px_rgba(18,63,56,0.25)] sm:px-14"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-200/25 blur-2xl" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700/80">
            Paroles du terrain
          </p>
          <Quote className="mx-auto mt-3 h-11 w-11 -scale-x-100 text-teal-300/70" aria-hidden="true" />
          <blockquote
            style={poppins}
            className="mt-3 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-relaxed"
          >
            «&nbsp;Chaque mission représente bien plus que des soins. C'est une rencontre humaine
            qui renforce la confiance des communautés et améliore durablement leur qualité de
            vie.&nbsp;»
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center gap-3">
            <img
              src="/images/president-asfo.jpg"
              alt=""
              className="h-12 w-12 rounded-full object-cover object-top shadow-md ring-2 ring-teal-200"
            />
            <span className="text-left">
              <span style={poppins} className="block text-sm font-bold text-gray-900">
                Dr Abdaramani Ndiaye
              </span>
              <span className="block text-xs font-medium text-teal-700">21e Président de l'ASFO</span>
            </span>
          </figcaption>
        </motion.figure>

        {/* ─── Bande d'impact ─── */}
        <motion.div {...fadeUp(0.1)} className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {impact.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.span
                key={t.label}
                {...fadeUp(0.12 + i * 0.06)}
                className="group inline-flex items-center gap-2.5 rounded-full border border-teal-100 bg-white/80 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 transition-all duration-300 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {t.label}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default LatestMission;
