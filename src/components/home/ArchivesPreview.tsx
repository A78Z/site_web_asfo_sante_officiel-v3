import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Users,
  Archive,
  Calendar,
  Stethoscope,
  HeartPulse,
  Quote,
  FileText,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { archives, ArchiveMission } from '@/data/archives';
import {
  geolocatedMissions,
  territorialMissions,
  type GeolocatedMission,
} from '@/data/territorialInterventions';
import { senegalOutline, type GeoCoordinate } from '@/data/podorIntervention';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const MAP_WIDTH = 400;
const MAP_HEIGHT = 300;
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

const SENEGAL_PATH = `${senegalOutline
  .map((coordinate, index) => {
    const { x, y } = projectGeoPoint(coordinate);
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  })
  .join(' ')} Z`;

interface MissionMapPoint {
  record: GeolocatedMission;
  anchor: { x: number; y: number };
  marker: { x: number; y: number };
}

const CONTROLLED_OFFSETS = [
  { x: 0, y: 0 },
  { x: 8, y: -7 },
  { x: -8, y: -7 },
  { x: 9, y: 7 },
  { x: -9, y: 7 },
  { x: 13, y: 0 },
  { x: -13, y: 0 },
];

const missionMapPoints: MissionMapPoint[] = [...geolocatedMissions]
  .sort(
    (a, b) =>
      Number(b.mission.year) - Number(a.mission.year) ||
      a.mission.id.localeCompare(b.mission.id),
  )
  .reduce<MissionMapPoint[]>((points, record) => {
    const anchor = projectGeoPoint([
      record.geography.longitude,
      record.geography.latitude,
    ]);
    const nearbyCount = points.filter(
      ({ anchor: placed }) => Math.hypot(placed.x - anchor.x, placed.y - anchor.y) < 15,
    ).length;
    const offset = CONTROLLED_OFFSETS[Math.min(nearbyCount, CONTROLLED_OFFSETS.length - 1)];

    points.push({
      record,
      anchor,
      marker: { x: anchor.x + offset.x, y: anchor.y + offset.y },
    });

    return points;
  }, []);

const ArchivesPreview: React.FC = () => {
  const reduce = useReducedMotion();
  const [yearFilter, setYearFilter] = useState<'all' | string>('all');
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<ArchiveMission | null>(null);
  const [timelineYear, setTimelineYear] = useState<string | null>(null);
  const [activeMapMissionId, setActiveMapMissionId] = useState<string | null>(null);

  const years = useMemo(
    () =>
      [
        ...new Set(
          territorialMissions.map(({ mission }) => mission.year).filter(Boolean),
        ),
      ]
        .sort()
        .reverse(),
    [],
  );
  const missionsPerYear = useMemo(() => {
    const acc: Record<string, number> = {};
    territorialMissions.forEach(({ mission }) => {
      if (mission.year) acc[mission.year] = (acc[mission.year] ?? 0) + 1;
    });
    return acc;
  }, []);

  const visible = useMemo(() => {
    const pool = yearFilter === 'all' ? archives : archives.filter((a) => a.year === yearFilter);
    return [...pool].sort((a, b) => (b.year > a.year ? 1 : -1)).slice(0, 3);
  }, [yearFilter]);

  const highlightedYear =
    timelineYear ?? (hovered !== null ? visible[hovered]?.year ?? null : null);
  const activeMapPoint =
    missionMapPoints.find(({ record }) => record.mission.id === activeMapMissionId) ?? null;

  return (
    <section className="relative overflow-hidden border-t border-teal-100/60 bg-gradient-to-b from-[#f7fbf9] via-white to-teal-50/50 py-24 sm:py-32">
      {/* ─── Fond ─── */}
      <div className="pointer-events-none absolute -left-40 top-24 h-[440px] w-[440px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-24 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[8%] top-32 hidden h-28 w-28 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />
      <svg className="pointer-events-none absolute left-[5%] bottom-28 hidden h-32 w-32 text-teal-300/20 lg:block" aria-hidden="true">
        <defs>
          <pattern id="asfo-dots-archives" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.7" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asfo-dots-archives)" />
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
              <Archive className="h-4 w-4" aria-hidden="true" />
              Nos missions
            </motion.span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.08)}
            style={poppins}
            className="mt-7 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          >
            Archives des{' '}
            <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              missions médicales
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.16)}
            className="mx-auto mt-7 max-w-[700px] text-lg leading-loose text-gray-600"
          >
            Retrouvez les campagnes médicales menées par l'ASFO dans les villages du Fouta —
            {` ${archives.length}`} missions documentées, témoins de plus de vingt ans
            d'engagement sur le terrain.
          </motion.p>
        </div>

        {/* ─── Filtres par année ─── */}
        <motion.div
          {...fadeUp(0.2)}
          role="tablist"
          aria-label="Filtrer les missions par année"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {['all', ...years].map((y) => (
            <button
              key={y}
              role="tab"
              aria-selected={yearFilter === y}
              onClick={() => setYearFilter(y)}
              className={`rounded-full px-5 py-2 text-sm font-semibold backdrop-blur-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 ${
                yearFilter === y
                  ? 'bg-gradient-to-r from-[#2fb391] to-[#178066] text-white shadow-[0_10px_22px_-8px_rgba(23,128,102,0.6)]'
                  : 'border border-teal-100 bg-white/70 text-gray-600 shadow-sm hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700'
              }`}
            >
              {y === 'all' ? 'Toutes' : y}
            </button>
          ))}
        </motion.div>

        {/* ─── Galerie ─── */}
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {visible.map((m, i) => (
            <motion.article
              key={m.id}
              {...fadeUp(i * 0.1)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group"
            >
              <button
                onClick={() => setSelected(m)}
                aria-label={`Ouvrir le détail de la mission ${m.title} (${m.year})`}
                className="block w-full overflow-hidden rounded-3xl border border-white/80 bg-white/85 text-left shadow-[0_15px_40px_-18px_rgba(18,63,56,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_55px_-18px_rgba(18,63,56,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
              >
                {/* Photo */}
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={m.imageUrl}
                    alt={`Mission ${m.title}, ${m.year}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/barre.webp';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/60 via-transparent to-transparent" aria-hidden="true" />
                  {/* Badge mission */}
                  <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-700 shadow-sm backdrop-blur-sm">
                    <HeartPulse className="h-3 w-3" aria-hidden="true" />
                    Mission médicale
                  </span>
                  <span className="absolute right-3.5 top-3.5 rounded-full bg-teal-600/90 px-3 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
                    {m.year}
                  </span>
                  {/* Titre sur photo */}
                  <h3
                    style={poppins}
                    className="absolute inset-x-4 bottom-3.5 text-lg font-bold text-white drop-shadow-md"
                  >
                    Mission {m.title}
                  </h3>
                </div>

                {/* Infos */}
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-teal-500" aria-hidden="true" />
                      {m.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-teal-500" aria-hidden="true" />
                      {m.date || m.year}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5 text-teal-500" aria-hidden="true" />
                      {m.specialties.length} spécialités
                    </span>
                  </div>

                  {/* Encart impact */}
                  <div className="mt-4 rounded-xl border border-teal-100/80 bg-gradient-to-r from-[#e8f3ef]/70 to-white px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-teal-700/80">
                      Impact de la mission
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-700">
                      <Users className="h-4 w-4 text-teal-600" aria-hidden="true" />
                      <strong style={poppins} className="text-base font-extrabold text-teal-700">
                        {m.consultations.toLocaleString('fr-FR')}
                      </strong>
                      consultations
                      {m.participants > 0 && (
                        <span className="text-gray-500">· {m.participants} professionnels</span>
                      )}
                    </p>
                  </div>

                  {/* Résumé révélé au survol */}
                  <p className="mt-0 max-h-0 overflow-hidden text-sm leading-relaxed text-gray-500 opacity-0 transition-all duration-500 group-hover:mt-3 group-hover:max-h-24 group-hover:opacity-100">
                    <span className="line-clamp-3">{m.summary}</span>
                  </p>

                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-teal-600">
                    Découvrir la mission
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </button>
            </motion.article>
          ))}
        </div>

        {/* ─── Timeline + carte du Sénégal ─── */}
        <div className="mx-auto mt-20 grid max-w-6xl items-stretch gap-8 lg:grid-cols-2">
          {/* Timeline des années */}
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-3xl border border-teal-100/80 bg-white/80 p-7 shadow-[0_15px_38px_-18px_rgba(18,63,56,0.22)] backdrop-blur-sm"
          >
            <h3 style={poppins} className="text-center text-lg font-bold text-gray-900 sm:text-xl">
              Missions documentées par année
            </h3>
            <ol className="relative mx-auto mt-7 max-w-xs">
              <span className="absolute bottom-4 left-[13px] top-4 w-[2px] bg-gradient-to-b from-teal-200 via-teal-400 to-teal-200" aria-hidden="true" />
              {years.map((y, i) => (
                <motion.li
                  key={y}
                  {...fadeUp(0.15 + i * 0.07)}
                  className="relative flex items-center gap-4 py-2.5"
                >
                  <button
                    type="button"
                    onMouseEnter={() => setTimelineYear(y)}
                    onMouseLeave={() => setTimelineYear(null)}
                    onFocus={() => setTimelineYear(y)}
                    onBlur={() => setTimelineYear(null)}
                    onClick={() => setTimelineYear((current) => (current === y ? null : y))}
                    aria-pressed={timelineYear === y}
                    aria-label={`Mettre en évidence les missions de ${y}`}
                    className="flex w-full items-center gap-4 rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
                  >
                    <span
                      className={`relative z-10 h-7 w-7 shrink-0 rounded-full border-[3px] border-white shadow-[0_0_0_2px_rgba(47,179,145,0.5)] transition-all duration-300 motion-reduce:transition-none ${
                        highlightedYear === y
                          ? 'scale-110 bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_0_0_2px_rgba(47,179,145,0.65),0_0_18px_rgba(47,179,145,0.35)]'
                          : i === 0
                            ? 'bg-gradient-to-br from-[#2fb391] to-[#178066]'
                            : 'bg-teal-300'
                      }`}
                    />
                    <div className="flex flex-1 items-baseline justify-between gap-3">
                      <p style={poppins} className="text-base font-extrabold text-teal-800">
                        {y}
                      </p>
                      <p className="text-sm font-medium text-gray-600">
                        {missionsPerYear[y]} mission{missionsPerYear[y] > 1 ? 's' : ''}
                      </p>
                    </div>
                  </button>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* Carte du Sénégal */}
          <motion.div
            {...fadeUp(0.15)}
            className="rounded-3xl border border-teal-100/80 bg-white/80 p-7 shadow-[0_15px_38px_-18px_rgba(18,63,56,0.22)] backdrop-blur-sm"
          >
            <h3
              id="archives-territory-map-title"
              style={poppins}
              className="text-center text-lg font-bold text-gray-900 sm:text-xl"
            >
              Missions affichées sur le territoire
            </h3>
            <p className="mt-1 text-center text-sm text-gray-500">
              Survolez une carte pour illuminer sa zone d'intervention
            </p>
            <div
              className="relative mx-auto mt-4 w-full max-w-md"
              onMouseLeave={() => setActiveMapMissionId(null)}
            >
              <svg
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                preserveAspectRatio="xMidYMid meet"
                className="block h-auto w-full"
                role="img"
                aria-labelledby="archives-senegal-map-title archives-senegal-map-description"
              >
                <title id="archives-senegal-map-title">
                  Carte des missions médicales documentées au Sénégal
                </title>
                <desc id="archives-senegal-map-description">
                  Silhouette géographique du Sénégal avec la Gambie en découpe intérieure.
                  Les marqueurs correspondent uniquement aux missions disposant de coordonnées
                  validées.
                </desc>

                <path
                  d={SENEGAL_PATH}
                  fill="#e4f7f2"
                  stroke="#83ddcb"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_7px_9px_rgba(18,63,56,0.10)]"
                />
                <text
                  x="167"
                  y="211"
                  textAnchor="middle"
                  fill="#91a8a3"
                  fontSize="7.5"
                  fontWeight="700"
                  letterSpacing="1.4"
                  opacity="0.8"
                  style={poppins}
                  aria-hidden="true"
                >
                  GAMBIE
                </text>

                {missionMapPoints.map(({ record, anchor, marker }) => {
                  const mission = record.mission;
                  const isYearActive = highlightedYear === mission.year;
                  const isDimmed = highlightedYear !== null && !isYearActive;
                  const isMarkerActive = activeMapMissionId === mission.id;
                  const isOffset = anchor.x !== marker.x || anchor.y !== marker.y;

                  return (
                    <motion.g
                      key={mission.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${mission.title}, mission ${mission.year}, ${mission.consultations.toLocaleString('fr-FR')} consultations`}
                      className="cursor-pointer outline-none"
                      initial={false}
                      animate={{ opacity: isDimmed ? 0.22 : 1 }}
                      transition={{ duration: reduce ? 0 : 0.3, ease: 'easeOut' }}
                      onMouseEnter={() => setActiveMapMissionId(mission.id)}
                      onFocus={() => setActiveMapMissionId(mission.id)}
                      onClick={() =>
                        setActiveMapMissionId((current) =>
                          current === mission.id ? null : mission.id,
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setActiveMapMissionId((current) =>
                            current === mission.id ? null : mission.id,
                          );
                        }
                        if (event.key === 'Escape') {
                          setActiveMapMissionId(null);
                        }
                      }}
                    >
                      <title>
                        {mission.title} — {mission.year}
                      </title>
                      {isOffset && (
                        <>
                          <line
                            x1={anchor.x}
                            y1={anchor.y}
                            x2={marker.x}
                            y2={marker.y}
                            stroke="#177866"
                            strokeWidth="1"
                            opacity="0.55"
                          />
                          <circle
                            cx={anchor.x}
                            cy={anchor.y}
                            r="2.2"
                            fill="#177866"
                            stroke="white"
                            strokeWidth="1"
                          />
                        </>
                      )}
                      <circle
                        cx={marker.x}
                        cy={marker.y}
                        r="28"
                        fill="transparent"
                        pointerEvents="all"
                      />
                      <motion.circle
                        cx={marker.x}
                        cy={marker.y}
                        initial={false}
                        animate={
                          isYearActive && !reduce
                            ? {
                                r: [10, 12, 10],
                                fillOpacity: [0.32, 0.52, 0.32],
                              }
                            : {
                                r: isMarkerActive ? 11 : 8,
                                fillOpacity: isMarkerActive ? 0.48 : 0.2,
                              }
                        }
                        transition={
                          isYearActive && !reduce
                            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                            : { duration: reduce ? 0 : 0.25, ease: 'easeOut' }
                        }
                        fill="#45d7b5"
                      />
                      <circle
                        cx={marker.x}
                        cy={marker.y}
                        r={isMarkerActive ? 5.2 : 4}
                        fill="#126f5d"
                        stroke="white"
                        strokeWidth="1.8"
                        className="transition-all duration-300 motion-reduce:transition-none"
                      />
                    </motion.g>
                  );
                })}
              </svg>

              {activeMapPoint && (
                <div
                  className="absolute z-20 w-[min(220px,75vw)] -translate-x-1/2"
                  style={{
                    left: `clamp(7rem, ${(activeMapPoint.marker.x / MAP_WIDTH) * 100}%, calc(100% - 7rem))`,
                    top: `${(activeMapPoint.marker.y / MAP_HEIGHT) * 100 + 5}%`,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: reduce ? 0 : -4, scale: reduce ? 1 : 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: reduce ? 0.15 : 0.2 }}
                    className="rounded-2xl border border-teal-100 bg-white p-3.5 shadow-[0_16px_38px_-16px_rgba(12,76,64,0.45)]"
                    aria-live="polite"
                  >
                    <p className="text-sm font-bold text-gray-900">
                      {activeMapPoint.record.mission.title}
                    </p>
                    <p className="mt-1 text-xs font-medium text-teal-700">
                      {activeMapPoint.record.mission.year} ·{' '}
                      {activeMapPoint.record.geography.region}
                    </p>
                    <p className="mt-2 text-xs text-gray-600">
                      <strong className="font-bold text-gray-800">
                        {activeMapPoint.record.mission.consultations.toLocaleString('fr-FR')}
                      </strong>{' '}
                      consultations
                    </p>
                    {activeMapPoint.record.route && (
                      <Link
                        to={activeMapPoint.record.route}
                        className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
                      >
                        Voir la mission
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    )}
                  </motion.div>
                </div>
              )}
            </div>

            <div
              className="mx-auto mt-2 flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-teal-100 pt-3 text-[11px] text-gray-500 sm:text-xs"
              aria-label="Légende de la carte"
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#126f5d]" aria-hidden="true" />
                Mission documentée
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-4 w-4 rounded-full bg-[#45d7b5]/35 ring-1 ring-[#45d7b5]/50"
                  aria-hidden="true"
                />
                Mission de l'année sélectionnée
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-3 w-4 rounded-sm border border-[#83ddcb] bg-[#e4f7f2]"
                  aria-hidden="true"
                />
                Territoire du Sénégal
              </span>
            </div>
          </motion.div>
        </div>

        {/* ─── Témoignage ─── */}
        <motion.figure
          {...fadeUp(0.1)}
          className="relative mx-auto mt-20 max-w-3xl overflow-hidden rounded-3xl border border-teal-100/80 bg-gradient-to-br from-[#e8f3ef]/70 to-white px-8 py-10 text-center shadow-[0_18px_45px_-20px_rgba(18,63,56,0.25)] sm:px-14"
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-teal-200/25 blur-2xl" aria-hidden="true" />
          <Quote className="mx-auto h-11 w-11 -scale-x-100 text-teal-300/70" aria-hidden="true" />
          <blockquote
            style={poppins}
            className="mt-3 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-relaxed"
          >
            «&nbsp;Chaque mission est une étape supplémentaire vers une meilleure santé pour les
            communautés du Fouta.&nbsp;»
          </blockquote>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-300" aria-hidden="true" />
        </motion.figure>

        {/* ─── Boutons ─── */}
        <motion.div {...fadeUp(0.15)} className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/archives"
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-8px_rgba(23,128,102,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-8px_rgba(23,128,102,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98] sm:w-auto"
          >
            Voir toutes les missions
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            to="/rapport"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-teal-300/70 bg-white/80 px-7 py-3.5 text-sm font-semibold text-teal-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98] sm:w-auto"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Télécharger le rapport annuel
          </Link>
        </motion.div>
      </div>

      {/* ─── Fenêtre immersive ─── */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-3xl border-teal-100 p-0">
          {selected && (
            <div>
              <div className="relative aspect-[16/8] overflow-hidden">
                <img
                  src={selected.imageUrl}
                  alt={`Mission ${selected.title}, ${selected.year}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/barre.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-6 bottom-4">
                  <span className="rounded-full bg-teal-600 px-3 py-1 text-[11px] font-bold text-white">
                    {selected.year}
                  </span>
                  <DialogTitle asChild>
                    <h3 style={poppins} className="mt-2 text-2xl font-extrabold text-white drop-shadow-md">
                      Mission {selected.title}
                    </h3>
                  </DialogTitle>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <DialogDescription asChild>
                  <p className="text-sm leading-relaxed text-gray-600">{selected.summary}</p>
                </DialogDescription>

                {/* Impact */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-teal-100 bg-[#e8f3ef]/60 px-4 py-3 text-center">
                    <p style={poppins} className="text-xl font-extrabold text-teal-700">
                      {selected.consultations.toLocaleString('fr-FR')}
                    </p>
                    <p className="text-xs font-medium text-gray-600">Consultations</p>
                  </div>
                  <div className="rounded-xl border border-teal-100 bg-[#e8f3ef]/60 px-4 py-3 text-center">
                    <p style={poppins} className="text-xl font-extrabold text-teal-700">
                      {selected.specialties.length}
                    </p>
                    <p className="text-xs font-medium text-gray-600">Spécialités</p>
                  </div>
                  <div className="col-span-2 rounded-xl border border-teal-100 bg-[#e8f3ef]/60 px-4 py-3 text-center sm:col-span-1">
                    <p style={poppins} className="text-xl font-extrabold text-teal-700">
                      {selected.location}
                    </p>
                    <p className="text-xs font-medium text-gray-600">Localité</p>
                  </div>
                </div>

                {/* Top spécialités */}
                {selected.specialties.length > 0 && (
                  <div className="mt-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-teal-700/80">
                      Principales spécialités
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[...selected.specialties]
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5)
                        .map((s) => (
                          <span
                            key={s.name}
                            className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-white px-3 py-1 text-xs font-semibold text-gray-600"
                          >
                            <Stethoscope className="h-3 w-3 text-teal-600" aria-hidden="true" />
                            {s.name}
                            <strong className="text-teal-700">{s.count}</strong>
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={`/archives/${selected.id}`}
                    className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                  >
                    Voir la mission complète
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  <button
                    onClick={() => setSelected(null)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ArchivesPreview;
