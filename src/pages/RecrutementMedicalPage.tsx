import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  HeartPulse,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';
import {
  fetchSpecialties,
  type RecruitmentSpecialtyState,
} from '../lib/recruitment';
import { SPECIALTIES } from '../../api/_lib/recruitment.js';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: 'easeOut' as const },
});

/** Repères du parcours, affichés sous le hero. */
const STEPS = [
  {
    icon: ClipboardList,
    title: 'Déposez votre dossier',
    text: 'Formulaire en ligne, CV, diplôme et photo. Une dizaine de minutes suffisent.',
  },
  {
    icon: ShieldCheck,
    title: 'Vérification de la commission',
    text: 'Chaque dossier est examiné : diplôme, inscription à l’Ordre et expérience.',
  },
  {
    icon: HeartPulse,
    title: 'Affectation sur le terrain',
    text: 'Les professionnels retenus rejoignent l’unité correspondant à leur spécialité.',
  },
];

const HERO_IMAGES = [
  { src: '/medicalteam.webp', alt: 'Équipe médicale ASFO en mission', span: 'col-span-2' },
  { src: '/dentaire.jpg', alt: 'Consultation dentaire lors d’une caravane ASFO', span: '' },
  { src: '/soins-medicaux-base.webp', alt: 'Soins médicaux de base dispensés aux populations', span: '' },
];

/* ─── Carte de spécialité ─── */
const SpecialtyCard: React.FC<{
  specialty: RecruitmentSpecialtyState;
  index: number;
  reduceMotion: boolean | null;
}> = ({ specialty, index, reduceMotion }) => {
  const open = specialty.open;

  return (
    <motion.article
      {...(reduceMotion ? {} : fadeUp(Math.min(index, 8) * 0.035))}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border p-5 transition duration-300 ${
        open
          ? 'border-teal-200 bg-white shadow-[0_18px_50px_-34px_rgba(13,148,136,0.55)] hover:-translate-y-1 hover:border-teal-400 hover:shadow-[0_24px_60px_-32px_rgba(13,148,136,0.6)]'
          : 'border-slate-200 bg-slate-50/70'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
            open ? 'bg-teal-50' : 'bg-slate-100 grayscale'
          }`}
        >
          {specialty.emoji}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${
            open ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200/70 text-slate-500'
          }`}
        >
          {open ? (
            <>
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Inscriptions ouvertes
            </>
          ) : (
            <>
              <Clock3 className="h-3 w-3" aria-hidden="true" /> Bientôt disponible
            </>
          )}
        </span>
      </div>

      <h3
        className={`mt-4 text-lg font-black tracking-tight ${open ? 'text-slate-950' : 'text-slate-500'}`}
        style={poppins}
      >
        {specialty.label}
      </h3>
      <p className={`mt-2 flex-1 text-sm leading-6 ${open ? 'text-slate-600' : 'text-slate-400'}`}>
        {specialty.description}
      </p>

      {open ? (
        <Link
          to={`/recrutement-medical/${specialty.slug}`}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
        >
          S’inscrire
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <p className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-400">
          <Lock className="h-4 w-4" aria-hidden="true" />
          Bientôt disponible
        </p>
      )}
    </motion.article>
  );
};

const RecrutementMedicalPage: React.FC = () => {
  const reduceMotion = useReducedMotion();
  // Le catalogue est connu du bundle : la page s’affiche immédiatement, et
  // l’appel réseau ne fait que corriger l’état d’ouverture.
  const [specialties, setSpecialties] = useState<RecruitmentSpecialtyState[]>(() =>
    SPECIALTIES.map((item) => ({
      ...item,
      open: item.defaultOpen,
      updatedAt: null,
      updatedBy: null,
    })),
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    document.title =
      'Recrutement médical | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  useEffect(() => {
    let active = true;
    fetchSpecialties()
      .then((result) => {
        if (!active) return;
        setSpecialties(result.specialties);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : 'Les spécialités n’ont pas pu être actualisées.',
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const openSpecialties = useMemo(
    () => specialties.filter((item) => item.open),
    [specialties],
  );
  const closedSpecialties = useMemo(
    () => specialties.filter((item) => !item.open),
    [specialties],
  );

  return (
    <main className="bg-white">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-teal-200">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Recrutement ASFO 2026
            </span>

            <h1
              className="mt-5 text-3xl font-black leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl"
              style={poppins}
            >
              Rejoignez la 27<sup className="text-[0.55em]">e</sup> Grande Caravane
              Médicale ASFO
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Les inscriptions sont ouvertes progressivement par spécialité.
              Rejoignez notre équipe de professionnels de santé et participez à une
              mission humanitaire au service des populations.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#specialites"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-teal-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40"
              >
                Voir les spécialités
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                to="/missions/prochaine-campagne"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                La campagne 2026
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[
                { icon: Users, value: `${specialties.length}`, label: 'Spécialités au programme' },
                { icon: Stethoscope, value: `${openSpecialties.length}`, label: 'Ouvertes aujourd’hui' },
                { icon: MapPin, value: 'Fouta', label: 'Zone d’intervention' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <stat.icon className="h-4 w-4 text-teal-300" aria-hidden="true" />
                    <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {stat.label}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Illustration : équipe médicale, unité dentaire, soins de base */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {HERO_IMAGES.map((image) => (
              <div
                key={image.src}
                className={`overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${image.span}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover transition duration-700 hover:scale-105 ${
                    image.span ? 'h-48 sm:h-60' : 'h-32 sm:h-40'
                  }`}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Parcours ─── */}
      <section className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              {...(reduceMotion ? {} : fadeUp(index * 0.06))}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-base font-black text-slate-950" style={poppins}>
                {index + 1}. {step.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Spécialités ─── */}
      <section id="specialites" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.header {...(reduceMotion ? {} : fadeUp())} className="max-w-2xl">
            <h2
              className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl"
              style={poppins}
            >
              Les spécialités recherchées
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Chaque spécialité ouvre à son tour, au fil de la constitution des
              équipes. Les spécialités encore fermées le seront prochainement :
              revenez consulter cette page.
            </p>
          </motion.header>

          {loading && (
            <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Actualisation des inscriptions…
            </p>
          )}

          {loadError && (
            <p
              role="status"
              className="mt-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {loadError} Les spécialités affichées peuvent ne pas refléter les
              dernières ouvertures.
            </p>
          )}

          {openSpecialties.length > 0 && (
            <>
              <h3 className="mt-10 text-sm font-black uppercase tracking-wide text-teal-700">
                Ouvertes maintenant
              </h3>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {openSpecialties.map((specialty, index) => (
                  <SpecialtyCard
                    key={specialty.slug}
                    specialty={specialty}
                    index={index}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>
            </>
          )}

          {closedSpecialties.length > 0 && (
            <>
              <h3 className="mt-12 text-sm font-black uppercase tracking-wide text-slate-500">
                Bientôt disponibles
              </h3>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {closedSpecialties.map((specialty, index) => (
                  <SpecialtyCard
                    key={specialty.slug}
                    specialty={specialty}
                    index={index}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── Pièces à préparer ─── */}
      <section className="border-t border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <motion.div
            {...(reduceMotion ? {} : fadeUp())}
            className="grid items-center gap-8 rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 lg:grid-cols-[1.4fr_1fr]"
          >
            <div>
              <h2
                className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl"
                style={poppins}
              >
                Préparez vos pièces avant de commencer
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Le formulaire se remplit en une seule fois. Munissez-vous des
                documents suivants au format numérique : votre dossier n’en sera
                que plus vite instruit par la commission.
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: FileText, label: 'CV', hint: 'PDF · 5 Mo max' },
                  { icon: BadgeCheck, label: 'Diplôme', hint: 'PDF · 5 Mo max' },
                  { icon: Users, label: 'Photo', hint: 'JPG/PNG/WEBP · 2 Mo' },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <item.icon className="h-4 w-4 text-teal-600" aria-hidden="true" />
                    <p className="mt-2 text-sm font-black text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.hint}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-slate-950 p-6 text-white">
              <ShieldCheck className="h-6 w-6 text-teal-400" aria-hidden="true" />
              <p className="mt-3 text-sm font-bold">Vos données restent confidentielles</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Les pièces transmises servent exclusivement à l’instruction de
                votre candidature par la commission de recrutement de l’ASFO.
                Aucun paiement n’est demandé à aucune étape.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default RecrutementMedicalPage;
