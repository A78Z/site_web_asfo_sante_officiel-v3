import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  FolderCheck,
  Landmark,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ScrollText,
  Send,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Users,
  WalletCards,
} from 'lucide-react';
import {
  applicantProfiles,
  applicationCalendar,
  applicationContact,
  applicationDocuments,
  applicationFaq,
  campaignApplication,
  eligibilityCriteria,
  submissionChecklist,
  submissionSteps,
} from '../data/campaignApplication';
import { upcomingCampaign } from '../data/upcomingCampaign';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const navigationItems = [
  { id: 'presentation', label: 'Présentation' },
  { id: 'criteres', label: 'Critères d’éligibilité' },
  { id: 'pieces', label: 'Pièces à fournir' },
  { id: 'calendrier', label: 'Calendrier' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'candidature', label: 'Déposer une candidature' },
] as const;

const criterionIcons = [ShieldCheck, MapPin, Building2];
const documentIcons = [FileText, MapPin, ClipboardCheck, CreditCard];
const submissionIcons = [BookOpen, FileCheck2, FolderCheck, ScrollText, Send];

const GuideCandidaturePage: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [showMobileActions, setShowMobileActions] = useState(true);

  useEffect(() => {
    document.title = 'Guide officiel de candidature | ASFO';
  }, []);

  useEffect(() => {
    const finalCta = document.getElementById('guide-final-cta');
    if (!finalCta || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowMobileActions(!entry.isIntersecting),
      { threshold: 0.08 },
    );

    observer.observe(finalCta);
    return () => observer.disconnect();
  }, []);

  const checklistProgress = useMemo(
    () => Math.round((checkedItems.length / submissionChecklist.length) * 100),
    [checkedItems],
  );

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-70px' },
          transition: { duration: 0.5, delay, ease: 'easeOut' as const },
        };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const toggleChecklistItem = (index: number) => {
    setCheckedItems((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  const PdfButton = ({ compact = false }: { compact?: boolean }) =>
    campaignApplication.guideAvailable ? (
      <a
        href={campaignApplication.guidePdf}
        download
        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 font-extrabold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
          compact ? 'px-4 py-3 text-sm' : 'px-5 py-3.5 text-sm sm:text-base'
        }`}
      >
        <Download size={18} aria-hidden="true" />
        {compact ? 'Télécharger le PDF' : 'Télécharger le guide PDF'}
      </a>
    ) : (
      <span
        role="status"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-500"
      >
        <FileText size={18} aria-hidden="true" />
        Guide temporairement indisponible
      </span>
    );

  return (
    <div className="overflow-x-clip bg-[linear-gradient(180deg,#f7fbfa_0%,#ffffff_24%,#f4fbfa_100%)] pb-24 text-slate-900 md:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-teal-100/80">
        <div className="pointer-events-none absolute -left-24 top-12 h-80 w-80 rounded-full bg-teal-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3.5 py-2 text-xs font-black uppercase tracking-[0.12em] text-teal-800 shadow-sm backdrop-blur">
              <Sparkles size={14} aria-hidden="true" />
              {upcomingCampaign.officialTitle}
            </span>
            <h1
              className="mt-6 max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[62px]"
              style={poppins}
            >
              Guide officiel de candidature
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Les critères, les pièces à fournir, le calendrier et les modalités de dépôt pour les
              villages du département de Podor, réunis dans un parcours clair et vérifiable.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PdfButton />
              <Link
                to={campaignApplication.route}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-extrabold text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:text-base"
              >
                Déposer une candidature <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <ShieldCheck size={17} className="text-teal-700" aria-hidden="true" />
              Document officiel de préparation du dossier
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.58, delay: 0.08 }}
            className="relative mx-auto w-full max-w-[560px] pb-16 sm:pb-10 lg:mx-0"
          >
            <div className="relative ml-auto w-[82%] max-w-[390px] overflow-hidden rounded-[28px] border-[7px] border-white bg-white shadow-[0_32px_90px_-38px_rgba(15,118,110,0.55)]">
              <img
                src={campaignApplication.guidePreview}
                alt="Première page du guide officiel de candidature ASFO 2026"
                className="aspect-[595/842] w-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent px-5 pb-5 pt-16 text-white">
                <p className="text-xs font-black uppercase tracking-[0.12em]">Aperçu du document officiel</p>
                <p className="mt-1 text-xs text-white/75">PDF · {campaignApplication.guideSize}</p>
              </div>
            </div>

            <div className="absolute left-0 top-8 flex max-w-[225px] items-center gap-3 rounded-2xl border border-white bg-white/95 p-4 shadow-xl backdrop-blur">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <FileCheck2 size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-black text-slate-900">Dossier 100 % numérique</p>
                <p className="mt-0.5 text-xs text-slate-500">Dépôt via le portail</p>
              </div>
            </div>

            <div className="absolute bottom-20 left-0 rounded-2xl border border-amber-100 bg-amber-50/95 p-4 shadow-xl backdrop-blur sm:bottom-6">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Frais de dossier</p>
              <p className="mt-1 text-lg font-black text-amber-950">
                {campaignApplication.fee.toLocaleString('fr-FR')} FCFA
              </p>
            </div>

            <div className="absolute -bottom-1 right-1 flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/95 p-4 shadow-xl backdrop-blur sm:bottom-8 sm:-right-5">
              <UserRoundCheck size={21} className="shrink-0 text-sky-700" aria-hidden="true" />
              <p className="max-w-[150px] text-xs font-black leading-5 text-sky-950">
                Étude par la commission ASFO
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation interne */}
      <nav
        aria-label="Sommaire du guide de candidature"
        className="sticky top-20 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-lg"
      >
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-max items-center gap-1 py-2">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`min-h-11 rounded-lg px-3.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  index === navigationItems.length - 1
                    ? 'bg-teal-700 text-white hover:bg-teal-800'
                    : 'text-slate-600 hover:bg-teal-50 hover:text-teal-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Présentation */}
        <motion.section
          id="presentation"
          {...reveal()}
          className="scroll-mt-36 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-46px_rgba(15,23,42,0.35)] sm:p-8 lg:p-10"
        >
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">
                Présentation de la campagne
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                Préparer la candidature de votre localité
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Dans le cadre de la 27e édition de la Grande Campagne Médicale de l’ASFO, les
                structures représentant une localité du département de Podor sont invitées à
                soumettre leur candidature exclusivement en ligne.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Chaque dossier est rigoureusement étudié par la Commission Planification et
                Logistique. La sélection repose sur les critères sanitaires, géographiques et
                organisationnels publiés, ainsi que sur la capacité de la structure candidate à
                collaborer avec l’ASFO pour accueillir la mission.
              </p>
              <div className="mt-7 rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
                <p className="text-sm font-black text-teal-950">Structures pouvant candidater</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {applicantProfiles.map((profile) => (
                    <li key={profile} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                      <CheckCircle2 size={16} className="mt-1 shrink-0 text-teal-600" aria-hidden="true" />
                      {profile}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-3 self-start">
              {[
                {
                  icon: Landmark,
                  title: 'Objectif de la campagne',
                  text: 'Améliorer l’accès aux soins des populations grâce à une grande mission médicale.',
                },
                {
                  icon: MapPin,
                  title: 'Territoire concerné',
                  text: `${upcomingCampaign.department}, pour l’édition ${upcomingCampaign.year}.`,
                },
                {
                  icon: Users,
                  title: 'Public pouvant candidater',
                  text: 'Les structures locales représentatives et capables de porter la candidature du village.',
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-[#fbfdfc] p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-sm font-black text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="mt-12 grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_290px]">
          <div className="min-w-0 space-y-16">
            {/* Critères */}
            <section id="criteres" className="scroll-mt-36">
              <motion.div {...reveal()}>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Éligibilité</span>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                  Les critères étudiés par la commission
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                  Les dossiers sont analysés selon trois familles de critères. Aucune pondération
                  automatique ni aucun classement instantané n’est appliqué.
                </p>
              </motion.div>

              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {eligibilityCriteria.map((criterion, index) => {
                  const Icon = criterionIcons[index];
                  return (
                    <motion.article
                      key={criterion.id}
                      {...reveal(index * 0.06)}
                      className="group rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-100">
                        <Icon size={28} aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 text-xl font-black text-slate-950">{criterion.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{criterion.description}</p>
                      <ul className="mt-5 space-y-3">
                        {criterion.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
                            <Check size={16} className="mt-1 shrink-0 text-teal-600" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <span className="mt-6 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-slate-600">
                        Critère étudié par la commission
                      </span>
                    </motion.article>
                  );
                })}
              </div>

              <motion.div
                {...reveal(0.12)}
                className="mt-6 flex items-start gap-4 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sky-950 sm:p-6"
              >
                <UserRoundCheck size={24} className="mt-0.5 shrink-0 text-sky-700" aria-hidden="true" />
                <div>
                  <h3 className="font-black">Une décision entièrement humaine</h3>
                  <p className="mt-1 text-sm leading-6">
                    Aucun village n’est sélectionné automatiquement. Chaque dossier est étudié par
                    la commission ASFO avant toute décision.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Pièces */}
            <section id="pieces" className="scroll-mt-36">
              <motion.div {...reveal()}>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Dossier complet</span>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                  Les pièces à fournir
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                  Les quatre pièces sont obligatoires et doivent être regroupées dans un seul
                  fichier PDF. Tout dossier incomplet est automatiquement rejeté.
                </p>
              </motion.div>

              <div className="mt-8 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-900">Repère de préparation</p>
                    <p className="mt-1 text-sm text-slate-500">
                      4 pièces obligatoires à réunir — aucun avancement n’est enregistré par le site.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setChecklistOpen(true);
                      window.setTimeout(() => scrollToSection('avant-soumettre'), 20);
                    }}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-black text-teal-800 transition hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    <ClipboardCheck size={17} aria-hidden="true" /> Vérifier mon dossier
                  </button>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2" aria-label="Quatre pièces obligatoires à préparer">
                  {applicationDocuments.map((document, index) => (
                    <div key={document.id} className="h-2 rounded-full bg-teal-100" title={`Pièce ${index + 1}`} />
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {applicationDocuments.map((document, index) => {
                  const Icon = documentIcons[index];
                  return (
                    <motion.article
                      key={document.id}
                      {...reveal(index * 0.05)}
                      className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-200 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                          <Icon size={23} aria-hidden="true" />
                        </span>
                        <span className="rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-red-700">
                          Obligatoire
                        </span>
                      </div>
                      <h3 className="mt-5 text-lg font-black text-slate-950">{document.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{document.description}</p>
                      <div className="mt-5 rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Conseil de préparation</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{document.advice}</p>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              <motion.div
                {...reveal(0.12)}
                className="mt-6 grid overflow-hidden rounded-[26px] border border-amber-200 bg-amber-50 shadow-sm lg:grid-cols-[0.8fr_1.2fr]"
              >
                <div className="border-b border-amber-200 p-6 lg:border-b-0 lg:border-r lg:p-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
                    <WalletCards size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-black text-amber-950">Frais de dossier</h3>
                  <p className="mt-2 text-4xl font-black tracking-tight text-amber-950" style={poppins}>
                    {campaignApplication.fee.toLocaleString('fr-FR')} FCFA
                  </p>
                  <p className="mt-2 text-sm font-bold text-amber-800">Frais non remboursables</p>
                </div>
                <div className="p-6 lg:p-8">
                  <h4 className="text-sm font-black text-amber-950">Processus de paiement réel</h4>
                  <ul className="mt-4 space-y-3">
                    {[
                      `Le paiement intervient ${campaignApplication.feeTiming}.`,
                      `Les moyens indiqués par le portail sont ${campaignApplication.paymentMethods.join(' et ')}.`,
                      'Les instructions et les numéros de paiement apparaissent sur la confirmation.',
                      'La preuve de paiement est jointe au dossier puis vérifiée par l’administration.',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-amber-950/80">
                        <CheckCircle2 size={16} className="mt-1 shrink-0 text-amber-700" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 rounded-xl border border-amber-200 bg-white/60 p-3 text-xs font-semibold leading-5 text-amber-900">
                    Aucun paiement n’est simulé sur cette page. Suivez uniquement les instructions
                    affichées après l’enregistrement du formulaire.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Calendrier */}
            <section id="calendrier" className="scroll-mt-36">
              <motion.div {...reveal()}>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Calendrier et dépôt</span>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                  Du dossier à la décision
                </h2>
                <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-teal-200 bg-white px-4 py-3 shadow-sm">
                  <CalendarDays size={21} className="text-teal-700" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Période officielle de dépôt</p>
                    <p className="mt-0.5 font-black text-slate-900">{campaignApplication.depositPeriod}</p>
                  </div>
                </div>
              </motion.div>

              <div className="relative mt-8">
                <div className="absolute bottom-7 left-6 top-7 w-px bg-teal-200 md:bottom-auto md:left-10 md:right-10 md:top-6 md:h-px md:w-auto" />
                <ol className="relative grid gap-4 md:grid-cols-7">
                  {applicationCalendar.map((step, index) => (
                    <motion.li
                      key={step.title}
                      {...reveal(index * 0.04)}
                      className="grid grid-cols-[48px_1fr] gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:block md:min-w-0 md:p-4 md:pt-0 md:text-center"
                    >
                      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-teal-700 text-sm font-black text-white shadow-md md:mx-auto">
                        {index + 1}
                      </span>
                      <div className="md:mt-4">
                        <h3 className="text-sm font-black leading-5 text-slate-900">{step.title}</h3>
                        <p className="mt-2 text-xs leading-5 text-slate-500">{step.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>

              <motion.div
                {...reveal(0.12)}
                className="mt-6 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950 sm:p-6"
              >
                <AlertTriangle size={24} className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
                <div>
                  <h3 className="font-black">Attention</h3>
                  <p className="mt-1 text-sm leading-6">
                    Aucun dossier physique ne sera traité. Toute candidature soumise après la date
                    limite entraînera la disqualification de l’amicale ou de la structure candidate.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Avant de soumettre */}
            <section id="avant-soumettre" className="scroll-mt-36">
              <motion.div
                {...reveal()}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Contrôle final</span>
                    <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950" style={poppins}>
                      Avant de soumettre
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                      Cette checklist est un simple outil de préparation local. Elle ne valide ni
                      n’enregistre votre candidature.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChecklistOpen((open) => !open)}
                    aria-expanded={checklistOpen}
                    aria-controls="submission-checklist"
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                  >
                    <ClipboardCheck size={17} aria-hidden="true" />
                    {checklistOpen ? 'Masquer la checklist' : 'Vérifier mon dossier'}
                  </button>
                </div>

                {checklistOpen && (
                  <div id="submission-checklist" className="mt-7 border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-black text-slate-800">
                        {checkedItems.length} élément{checkedItems.length > 1 ? 's' : ''} vérifié
                        {checkedItems.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-sm font-black text-teal-700">{checklistProgress} %</p>
                    </div>
                    <div
                      className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={checklistProgress}
                      aria-label="Progression de la checklist de préparation"
                    >
                      <div
                        className="h-full rounded-full bg-teal-600 transition-[width]"
                        style={{ width: `${checklistProgress}%` }}
                      />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {submissionChecklist.map((item, index) => {
                        const checked = checkedItems.includes(index);
                        return (
                          <label
                            key={item}
                            className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-teal-200 hover:bg-teal-50/50"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleChecklistItem(index)}
                              className="h-5 w-5 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                            />
                            <span className={`text-sm font-semibold ${checked ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </section>

            {/* Comment déposer */}
            <section id="candidature" className="scroll-mt-36">
              <motion.div {...reveal()}>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Mode d’emploi</span>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                  Comment déposer votre candidature ?
                </h2>
              </motion.div>
              <ol className="relative mt-8 grid gap-4 md:grid-cols-5">
                <div className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-teal-200 md:block" />
                {submissionSteps.map((step, index) => {
                  const Icon = submissionIcons[index];
                  return (
                    <motion.li
                      key={step.title}
                      {...reveal(index * 0.05)}
                      className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-3 md:block">
                        <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-md md:mx-auto">
                          <Icon size={23} aria-hidden="true" />
                        </span>
                        <span className="text-xs font-black uppercase tracking-[0.15em] text-teal-700 md:mt-5 md:block md:text-center">
                          Étape {index + 1}
                        </span>
                      </div>
                      <h3 className="mt-4 text-base font-black text-slate-950 md:text-center">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 md:text-center">{step.description}</p>
                    </motion.li>
                  );
                })}
              </ol>
            </section>

            {/* Contacts */}
            <section id="contacts" className="scroll-mt-36">
              <motion.div
                {...reveal()}
                className="grid overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.8fr_1.2fr]"
              >
                <div className="bg-[linear-gradient(145deg,#ecfdf8,#f0f9ff)] p-6 sm:p-8">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                    <MessageCircle size={27} aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 text-3xl font-black text-slate-950" style={poppins}>
                    Contacts et assistance
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    Pour toute difficulté liée à la constitution ou à la soumission du dossier,
                    contactez la commission.
                  </p>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <a
                      href={`mailto:${applicationContact.email}`}
                      className="rounded-2xl border border-slate-200 p-5 transition hover:border-teal-200 hover:bg-teal-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    >
                      <Mail size={21} className="text-teal-700" aria-hidden="true" />
                      <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">Email</p>
                      <p className="mt-1 break-all text-sm font-black text-slate-900">{applicationContact.email}</p>
                    </a>
                    <div className="rounded-2xl border border-slate-200 p-5">
                      <Phone size={21} className="text-teal-700" aria-hidden="true" />
                      <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">Téléphones</p>
                      <a href={applicationContact.primaryPhone.href} className="mt-1 block text-sm font-black text-slate-900 hover:text-teal-700">
                        {applicationContact.primaryPhone.display}
                      </a>
                      <a href={applicationContact.secondaryPhone.href} className="mt-1 block text-sm font-black text-slate-900 hover:text-teal-700">
                        {applicationContact.secondaryPhone.display}
                      </a>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <a
                      href={`mailto:${applicationContact.email}`}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-teal-300 hover:text-teal-700"
                    >
                      <Mail size={16} aria-hidden="true" /> Envoyer un email
                    </a>
                    <a
                      href={applicationContact.primaryPhone.href}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-teal-300 hover:text-teal-700"
                    >
                      <Phone size={16} aria-hidden="true" /> Appeler
                    </a>
                    <a
                      href={applicationContact.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-800"
                    >
                      <MessageCircle size={16} aria-hidden="true" /> WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* FAQ */}
            <section aria-labelledby="faq-title">
              <motion.div {...reveal()}>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Questions fréquentes</span>
                <h2 id="faq-title" className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                  FAQ candidature
                </h2>
              </motion.div>
              <div className="mt-7 space-y-3">
                {applicationFaq.map((item, index) => {
                  const open = openFaq === index;
                  const panelId = `application-faq-panel-${index}`;
                  const buttonId = `application-faq-button-${index}`;
                  return (
                    <motion.article
                      key={item.question}
                      {...reveal(index * 0.025)}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <h3>
                        <button
                          id={buttonId}
                          type="button"
                          onClick={() => setOpenFaq(open ? null : index)}
                          aria-expanded={open}
                          aria-controls={panelId}
                          className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-black text-slate-900 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 sm:text-base"
                        >
                          {item.question}
                          <ChevronDown
                            size={20}
                            className={`shrink-0 text-teal-700 transition-transform ${open ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                          />
                        </button>
                      </h3>
                      {open && (
                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-600"
                        >
                          {item.answer}
                        </div>
                      )}
                    </motion.article>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Actions sticky desktop */}
          <aside className="sticky top-40 hidden space-y-4 xl:block" aria-label="Actions du guide">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-700">Votre dossier</p>
              <h2 className="mt-2 text-lg font-black text-slate-950">Prêt à candidater ?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Relisez le guide et rassemblez les pièces avant d’ouvrir le formulaire.
              </p>
              <div className="mt-5 grid gap-2.5">
                <PdfButton compact />
                <Link
                  to={campaignApplication.route}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-teal-300 hover:text-teal-700"
                >
                  Déposer une candidature <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => scrollToSection('contacts')}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50 hover:text-teal-700"
                >
                  <MessageCircle size={16} aria-hidden="true" /> Contacter l’ASFO
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-teal-800">
                <Clock3 size={15} aria-hidden="true" /> Date limite
              </p>
              <p className="mt-2 text-sm font-black text-teal-950">{campaignApplication.depositClosing}</p>
            </div>
          </aside>
        </div>
      </main>

      {/* CTA final */}
      <section id="guide-final-cta" className="px-4 pb-14 pt-4 sm:px-6 sm:pb-20 lg:px-8">
        <motion.div
          {...reveal()}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-teal-200 bg-[linear-gradient(135deg,#ecfdf8_0%,#f0fdfa_52%,#eff6ff_100%)] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14"
        >
          <div className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-teal-200/35 blur-3xl" />
          <div className="relative">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
              <Landmark size={27} aria-hidden="true" />
            </span>
            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
              Votre village souhaite accueillir la prochaine campagne médicale ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Préparez soigneusement votre dossier, vérifiez les critères et transmettez votre
              candidature exclusivement en ligne.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to={campaignApplication.route}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800"
              >
                Déposer une candidature maintenant <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <PdfButton compact />
              <button
                type="button"
                onClick={() => scrollToSection('contacts')}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-black text-slate-800 transition hover:border-teal-300 hover:text-teal-700"
              >
                <MessageCircle size={17} aria-hidden="true" /> Contacter la commission
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Barre d’action mobile */}
      {showMobileActions && (
        <div className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {campaignApplication.guideAvailable ? (
              <a
                href={campaignApplication.guidePdf}
                download
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 text-xs font-black text-teal-800"
              >
                <Download size={17} aria-hidden="true" /> Guide PDF
              </a>
            ) : (
              <span className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-500">
                PDF indisponible
              </span>
            )}
            <Link
              to={campaignApplication.route}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-3 text-xs font-black text-white"
            >
              <Send size={17} aria-hidden="true" /> Formulaire
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideCandidaturePage;
