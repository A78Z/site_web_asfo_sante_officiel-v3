import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import {
  ArrowRight,
  Baby,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FileText,
  GraduationCap,
  HandHeart,
  Handshake,
  Heart,
  HeartHandshake,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  PackageCheck,
  Pill,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Truck,
  UploadCloud,
  UserRoundCheck,
  Users,
} from 'lucide-react';
import { createObject } from '../lib/parse';
import { CONTACT_DETAILS } from '../data/contact';
import {
  postSubmissionSteps,
  sponsorTypes,
  sponsorshipFaq,
  sponsorshipObjectives,
  sponsorshipOptions,
  sponsorshipSteps,
  sponsorshipVillages,
  supportedNeeds,
  transparencyCommitments,
} from '../data/sponsorship';

type SubmissionState = 'idle' | 'sending' | 'success' | 'error';

const sponsorshipSchema = z.object({
  sponsorType: z.string().min(1, 'Sélectionnez un type de parrain.'),
  organizationName: z.string().trim().min(2, 'Indiquez votre nom ou raison sociale.'),
  contactName: z.string().trim().min(2, 'Indiquez le nom du responsable.'),
  email: z.string().trim().email('Saisissez une adresse email valide.'),
  phone: z.string().trim().min(7, 'Saisissez un numéro de téléphone valide.'),
  country: z.string().trim().min(2, 'Indiquez le pays.'),
  city: z.string().trim().min(2, 'Indiquez la ville.'),
  preferredVillage: z.string().trim(),
  supportType: z.string().min(1, 'Sélectionnez un type de soutien.'),
  duration: z.string().min(1, 'Indiquez la durée envisagée.'),
  indicativeBudget: z.string().trim(),
  message: z.string().trim().min(20, 'Présentez votre proposition en au moins 20 caractères.'),
  consent: z.literal(true, { errorMap: () => ({ message: 'Votre consentement est requis.' }) }),
  website: z.string().max(0),
});

type SponsorshipForm = z.infer<typeof sponsorshipSchema>;

const EMPTY_FORM: SponsorshipForm = {
  sponsorType: '',
  organizationName: '',
  contactName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  preferredVillage: '',
  supportType: '',
  duration: '',
  indicativeBudget: '',
  message: '',
  consent: false,
  website: '',
};

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const objectiveIcons = [Stethoscope, ShieldCheck, UserRoundCheck, Megaphone];
const sponsorIcons = [Heart, Building2, ShieldCheck, Users];
const needIcons = [Stethoscope, Pill, Search, Baby, Megaphone, UserRoundCheck, Truck, GraduationCap];
const optionIcons = [HandHeart, Clock3, Building2, Sparkles];
const transparencyIcons = [FileText, MapPin, ClipboardCheck, MessageCircle, CheckCircle2, Users];

const SponsorshipPage: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const formSectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<SponsorshipForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof SponsorshipForm, string>>>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [submissionReference, setSubmissionReference] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = 'Parrainer un village | ASFO';
  }, []);

  const publishedVillages = useMemo(
    () => sponsorshipVillages.filter(({ isPublished }) => isPublished),
    [],
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const beginSponsorship = (sponsorType?: string) => {
    if (sponsorType) {
      setForm((current) => ({ ...current, sponsorType }));
      setErrors((current) => ({ ...current, sponsorType: undefined }));
    }
    formSectionRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const updateField = <K extends keyof SponsorshipForm>(key: K, value: SponsorshipForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
    if (submissionState === 'error') setSubmissionState('idle');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionState === 'sending') return;

    const validation = sponsorshipSchema.safeParse(form);
    if (!validation.success) {
      const nextErrors: Partial<Record<keyof SponsorshipForm, string>> = {};
      validation.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof SponsorshipForm;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      const firstInvalid = validation.error.issues[0]?.path[0];
      if (firstInvalid) {
        document.getElementById(`sponsorship-${String(firstInvalid)}`)?.focus();
      }
      return;
    }

    const lastSubmission = Number(window.localStorage.getItem('asfo-sponsorship-last-submit') ?? 0);
    if (Date.now() - lastSubmission < 30_000) {
      setSubmissionState('error');
      return;
    }

    setSubmissionState('sending');
    setErrors({});

    try {
      const result = await createObject('SponsorshipRequests', {
        sponsorType: validation.data.sponsorType,
        organizationName: validation.data.organizationName,
        contactName: validation.data.contactName,
        email: validation.data.email,
        phone: validation.data.phone,
        country: validation.data.country,
        city: validation.data.city,
        preferredVillage: validation.data.preferredVillage || 'À définir avec l’ASFO',
        supportType: validation.data.supportType,
        duration: validation.data.duration,
        indicativeBudget: validation.data.indicativeBudget || '',
        message: validation.data.message,
        consent: validation.data.consent,
        status: 'En attente',
        paymentStatus: 'Non demandé',
        source: 'Page Parrainer un village',
      });

      window.localStorage.setItem('asfo-sponsorship-last-submit', String(Date.now()));
      setSubmissionReference(`PAR-${new Date().getFullYear()}-${result.objectId.slice(-6).toUpperCase()}`);
      setSubmissionState('success');
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error('Sponsorship request submission failed:', error);
      setSubmissionState('error');
    }
  };

  const fieldClass = (field: keyof SponsorshipForm) =>
    `min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
      errors[field]
        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
        : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50'
    }`;

  return (
    <div className="overflow-x-clip bg-[linear-gradient(180deg,#f5fbfa_0%,#ffffff_24%,#f4fbfa_100%)] text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-teal-100">
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-cyan-100/45 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:px-8 lg:py-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-teal-800 shadow-sm backdrop-blur">
              <HeartHandshake size={15} aria-hidden="true" /> S’engager durablement
            </span>
            <h1
              className="mt-6 max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[58px]"
              style={poppins}
            >
              Parrainez un village et accompagnez sa santé dans la durée
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Soutenez une communauté du Fouta en contribuant au financement des soins, du suivi
              médical, de la prévention et des actions de sensibilisation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollTo('villages')}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:text-base"
              >
                Découvrir les villages <MapPin size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo('fonctionnement')}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:text-base"
              >
                Comprendre le parrainage <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <ShieldCheck size={17} className="text-teal-700" aria-hidden="true" />
              Chaque parrainage est étudié, suivi et validé par l’ASFO.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.58, delay: 0.08 }}
            className="relative mx-auto w-full max-w-[600px] pb-16 lg:mx-0"
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-3">
              <div className="col-span-2 row-span-3 overflow-hidden rounded-[28px] border-[6px] border-white shadow-[0_30px_80px_-35px_rgba(15,118,110,0.5)]">
                <img src="/41.webp" alt="Mission médicale ASFO auprès d’une communauté" className="h-full w-full object-cover" />
              </div>
              <div className="row-span-2 overflow-hidden rounded-[24px] border-4 border-white shadow-xl">
                <img src="/medicalteam.webp" alt="Équipe médicale de l’ASFO en mission" className="h-full w-full object-cover" />
              </div>
              <div className="overflow-hidden rounded-[24px] border-4 border-white shadow-xl">
                <img src="/village-bode-lao.webp" alt="Mission ASFO au village de Bodé Lao" className="h-full w-full object-cover" />
              </div>
            </div>
            {[
              { className: '-left-3 top-7 sm:-left-8', icon: Clock3, label: 'Suivi dans la durée' },
              { className: '-bottom-2 left-5 sm:left-12', icon: HandHeart, label: 'Impact communautaire' },
              { className: '-bottom-2 right-2 sm:-right-4', icon: ShieldCheck, label: 'Transparence des actions' },
            ].map(({ className, icon: Icon, label }) => (
              <div key={label} className={`absolute ${className} flex items-center gap-2.5 rounded-2xl border border-white bg-white/95 p-3.5 shadow-xl backdrop-blur`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="max-w-[130px] text-xs font-black leading-5 text-slate-900">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <main>
        {/* Introduction */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="mx-auto max-w-4xl text-center">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Un engagement durable</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
              Un engagement concret au service d’une communauté
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Le parrainage permet à une personne, une entreprise, une fondation ou une organisation
              de soutenir durablement les besoins sanitaires d’un village identifié et validé par l’ASFO.
            </p>
          </motion.div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sponsorshipObjectives.map((objective, index) => {
              const Icon = objectiveIcons[index];
              return (
                <motion.article
                  key={objective.title}
                  {...reveal(index * 0.05)}
                  className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon size={23} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-black text-slate-950">{objective.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{objective.description}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* Trois rubriques */}
        <section className="border-y border-slate-200 bg-white/70 py-16">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <motion.article {...reveal()} className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <ClipboardCheck size={27} aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-xl font-black text-slate-950">Comment ça marche</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Une proposition, une étude humaine, un périmètre convenu puis un suivi défini avec l’ASFO.
              </p>
              <ol className="mt-5 space-y-2 text-sm text-slate-600">
                {['Proposer', 'Échanger', 'Valider', 'Suivre'].map((step, index) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-[11px] font-black text-white">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
              <button type="button" onClick={() => scrollTo('fonctionnement')} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
                Voir le fonctionnement <ArrowRight size={16} aria-hidden="true" />
              </button>
            </motion.article>

            <motion.article {...reveal(0.06)} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
              <div className="aspect-[16/7] overflow-hidden">
                <img src="/village-bode-lao.webp" alt="Mission médicale ASFO dans un village" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-amber-800 ring-1 ring-amber-200">
                  En préparation
                </span>
                <h2 className="mt-4 text-xl font-black text-slate-950">Villages en attente</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Les villages seront présentés ici uniquement après étude, validation administrative et autorisation de publication.
                </p>
                <span className="mt-5 inline-flex min-h-11 items-center text-sm font-black text-slate-400" aria-disabled="true">
                  Publication après validation
                </span>
              </div>
            </motion.article>

            <motion.article {...reveal(0.12)} className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Heart size={27} aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-black uppercase tracking-wide text-slate-500">Sans engagement de durée</p>
              <h2 className="mt-2 text-xl font-black text-slate-950">Faire un don ponctuel</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Soutenez les missions de l’ASFO sans mettre en place un parrainage durable.
              </p>
              <Link to="/donate" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-black text-white hover:bg-teal-800">
                Faire un don <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </motion.article>
          </div>
        </section>

        {/* Fonctionnement */}
        <section id="fonctionnement" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Le parcours</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
              Comment fonctionne le parrainage ?
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Le processus protège le village comme le parrain : aucune publication, affectation ou contribution n’est activée automatiquement.
            </p>
          </motion.div>
          <ol className="relative mt-9 grid gap-4 md:grid-cols-7">
            <div className="absolute left-[7%] right-[7%] top-6 hidden h-px bg-teal-200 md:block" />
            {sponsorshipSteps.map((step, index) => (
              <motion.li
                key={step.title}
                {...reveal(index * 0.04)}
                className="relative grid grid-cols-[48px_1fr] gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:block md:p-4 md:pt-0 md:text-center"
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
        </section>

        {/* Types de parrains */}
        <section className="border-y border-slate-200 bg-white/70 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...reveal()} className="text-center">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Profils d’engagement</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                Qui peut devenir parrain ?
              </h2>
            </motion.div>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {sponsorTypes.map((sponsor, index) => {
                const Icon = sponsorIcons[index];
                return (
                  <motion.article key={sponsor.id} {...reveal(index * 0.05)} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <Icon size={23} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-black text-slate-950">{sponsor.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{sponsor.description}</p>
                    <ul className="mt-4 space-y-2">
                      {sponsor.supports.map((support) => (
                        <li key={support} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <Check size={14} className="text-teal-600" aria-hidden="true" /> {support}
                        </li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => beginSponsorship(sponsor.id)} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
                      Commencer <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Villages */}
        <section id="villages" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Villages disponibles</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                Communautés ouvertes au parrainage
              </h2>
            </div>
            <span className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-amber-800 ring-1 ring-amber-200">
              En préparation
            </span>
          </motion.div>

          {publishedVillages.length === 0 ? (
            <motion.div {...reveal(0.08)} className="mt-8 grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.85fr_1.15fr]">
              <img src="/village-diattar.webp" alt="Mission médicale ASFO dans une communauté" loading="lazy" className="h-full min-h-[260px] w-full object-cover" />
              <div className="p-7 sm:p-9">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <MapPin size={27} aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-2xl font-black text-slate-950">Aucun village n’est encore publié</h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                  L’ASFO prépare la liste des communautés pouvant être parrainées. Chaque fiche sera
                  publiée uniquement après étude des besoins, validation administrative et vérification
                  des informations partageables.
                </p>
                <p className="mt-5 rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm font-semibold leading-6 text-sky-950">
                  Vous pouvez néanmoins transmettre une intention générale ou proposer une localité.
                  L’équipe vous contactera pour étudier la possibilité d’un accompagnement.
                </p>
                <button type="button" onClick={() => beginSponsorship()} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-black text-white hover:bg-teal-800">
                  Proposer un parrainage <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {publishedVillages.map((village) => (
                <article key={village.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <img src={village.imageUrl} alt={village.name} loading="lazy" className="aspect-[16/9] w-full rounded-2xl object-cover" />
                  <h3 className="mt-5 text-lg font-black text-slate-950">{village.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{village.department}, {village.region}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{village.healthContext}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Besoins */}
        <section className="border-y border-slate-200 bg-white/70 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...reveal()} className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Besoins soutenus</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                Construire un soutien utile et cohérent
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Les catégories ci-dessous correspondent aux actions déjà présentes dans les missions
                et programmes de l’ASFO. Le périmètre réel dépend des besoins validés.
              </p>
            </motion.div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {supportedNeeds.map((need, index) => {
                const Icon = needIcons[index];
                return (
                  <motion.div key={need} {...reveal(index * 0.035)} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <p className="text-sm font-black leading-6 text-slate-800">{need}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Formules */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="text-center">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Formules sans prix prédéfini</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
              Choisir la forme de votre engagement
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Le montant et les modalités sont définis uniquement après étude de la proposition et validation du partenariat.
            </p>
          </motion.div>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {sponsorshipOptions.map((option, index) => {
              const Icon = optionIcons[index];
              return (
                <motion.article key={option.id} {...reveal(index * 0.05)} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-black text-slate-950">{option.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{option.description}</p>
                  <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-400">Montant défini avec l’ASFO</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* Formulaire */}
        <section ref={formSectionRef} id="proposition" className="scroll-mt-24 border-y border-slate-200 bg-white/70 py-16">
          <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
            <motion.div {...reveal()} className="lg:sticky lg:top-28">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Intention de parrainage</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                Construisons votre engagement avec l’ASFO
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Ce formulaire transmet une proposition pour étude. Il ne déclenche aucun paiement,
                aucune publication et aucune activation automatique.
              </p>
              <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-5">
                <p className="flex items-center gap-2 text-sm font-black text-teal-950">
                  <Lock size={17} aria-hidden="true" /> Étude obligatoire par l’ASFO
                </p>
                <p className="mt-2 text-sm leading-6 text-teal-900/75">
                  Le montant, la durée, les documents et le processus de paiement sont définis après validation.
                </p>
              </div>
            </motion.div>

            <motion.div {...reveal(0.08)} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {submissionState === 'success' ? (
                <div className="py-10 text-center" role="status">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                    <CheckCircle2 size={32} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-2xl font-black text-slate-950">Votre proposition a bien été transmise</h3>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">
                    L’équipe ASFO étudiera votre intention avant de vous recontacter. Aucun paiement n’a été demandé.
                  </p>
                  <p className="mx-auto mt-5 w-fit rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-800">
                    Référence : {submissionReference}
                  </p>
                  <button type="button" onClick={() => setSubmissionState('idle')} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
                    Envoyer une autre proposition <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div aria-hidden="true" className="absolute -left-[9999px]">
                    <label htmlFor="sponsorship-website">Site web</label>
                    <input id="sponsorship-website" name="website" value={form.website} onChange={(event) => updateField('website', event.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="sponsorship-sponsorType" className="mb-2 block text-sm font-bold text-slate-700">Type de parrain *</label>
                      <select id="sponsorship-sponsorType" value={form.sponsorType} onChange={(event) => updateField('sponsorType', event.target.value)} className={fieldClass('sponsorType')} aria-invalid={Boolean(errors.sponsorType)}>
                        <option value="">Sélectionner</option>
                        {sponsorTypes.map((type) => <option key={type.id} value={type.id}>{type.title}</option>)}
                      </select>
                      {errors.sponsorType && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.sponsorType}</p>}
                    </div>
                    <div>
                      <label htmlFor="sponsorship-organizationName" className="mb-2 block text-sm font-bold text-slate-700">Nom ou raison sociale *</label>
                      <input id="sponsorship-organizationName" value={form.organizationName} onChange={(event) => updateField('organizationName', event.target.value)} className={fieldClass('organizationName')} aria-invalid={Boolean(errors.organizationName)} />
                      {errors.organizationName && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.organizationName}</p>}
                    </div>
                    <div>
                      <label htmlFor="sponsorship-contactName" className="mb-2 block text-sm font-bold text-slate-700">Nom du responsable *</label>
                      <input id="sponsorship-contactName" value={form.contactName} onChange={(event) => updateField('contactName', event.target.value)} className={fieldClass('contactName')} aria-invalid={Boolean(errors.contactName)} />
                      {errors.contactName && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.contactName}</p>}
                    </div>
                    <div>
                      <label htmlFor="sponsorship-email" className="mb-2 block text-sm font-bold text-slate-700">Email *</label>
                      <input id="sponsorship-email" type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} className={fieldClass('email')} aria-invalid={Boolean(errors.email)} />
                      {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="sponsorship-phone" className="mb-2 block text-sm font-bold text-slate-700">Téléphone *</label>
                      <input id="sponsorship-phone" type="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className={fieldClass('phone')} aria-invalid={Boolean(errors.phone)} />
                      {errors.phone && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="sponsorship-country" className="mb-2 block text-sm font-bold text-slate-700">Pays *</label>
                      <input id="sponsorship-country" value={form.country} onChange={(event) => updateField('country', event.target.value)} className={fieldClass('country')} aria-invalid={Boolean(errors.country)} />
                      {errors.country && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.country}</p>}
                    </div>
                    <div>
                      <label htmlFor="sponsorship-city" className="mb-2 block text-sm font-bold text-slate-700">Ville *</label>
                      <input id="sponsorship-city" value={form.city} onChange={(event) => updateField('city', event.target.value)} className={fieldClass('city')} aria-invalid={Boolean(errors.city)} />
                      {errors.city && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="sponsorship-preferredVillage" className="mb-2 block text-sm font-bold text-slate-700">Village souhaité</label>
                      <input id="sponsorship-preferredVillage" value={form.preferredVillage} onChange={(event) => updateField('preferredVillage', event.target.value)} className={fieldClass('preferredVillage')} placeholder="Facultatif — à étudier avec l’ASFO" />
                    </div>
                    <div>
                      <label htmlFor="sponsorship-supportType" className="mb-2 block text-sm font-bold text-slate-700">Type de soutien *</label>
                      <select id="sponsorship-supportType" value={form.supportType} onChange={(event) => updateField('supportType', event.target.value)} className={fieldClass('supportType')} aria-invalid={Boolean(errors.supportType)}>
                        <option value="">Sélectionner</option>
                        {sponsorshipOptions.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}
                      </select>
                      {errors.supportType && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.supportType}</p>}
                    </div>
                    <div>
                      <label htmlFor="sponsorship-duration" className="mb-2 block text-sm font-bold text-slate-700">Durée envisagée *</label>
                      <select id="sponsorship-duration" value={form.duration} onChange={(event) => updateField('duration', event.target.value)} className={fieldClass('duration')} aria-invalid={Boolean(errors.duration)}>
                        <option value="">Sélectionner</option>
                        <option value="Action ponctuelle">Action ponctuelle</option>
                        <option value="Moins d’un an">Moins d’un an</option>
                        <option value="Un an">Un an</option>
                        <option value="Plus d’un an">Plus d’un an</option>
                        <option value="À définir avec l’ASFO">À définir avec l’ASFO</option>
                      </select>
                      {errors.duration && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.duration}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="sponsorship-indicativeBudget" className="mb-2 block text-sm font-bold text-slate-700">Budget indicatif facultatif</label>
                      <input id="sponsorship-indicativeBudget" value={form.indicativeBudget} onChange={(event) => updateField('indicativeBudget', event.target.value)} className={fieldClass('indicativeBudget')} placeholder="Indication libre, sans paiement immédiat" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="sponsorship-message" className="mb-2 block text-sm font-bold text-slate-700">Votre proposition *</label>
                      <textarea id="sponsorship-message" rows={5} value={form.message} onChange={(event) => updateField('message', event.target.value)} className={`${fieldClass('message')} min-h-[140px] resize-y`} aria-invalid={Boolean(errors.message)} placeholder="Présentez votre projet, vos attentes et les formes de soutien envisagées." />
                      {errors.message && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                        <div className="flex items-start gap-4">
                          <UploadCloud size={24} className="shrink-0 text-slate-400" aria-hidden="true" />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-black text-slate-700">Document de présentation facultatif</p>
                              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase text-amber-800">En préparation</span>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-slate-500">
                              Pour protéger les documents, la transmission sécurisée sera proposée par l’équipe ASFO après le premier échange.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                        <input type="checkbox" checked={form.consent} onChange={(event) => updateField('consent', event.target.checked)} className="mt-0.5 h-5 w-5 rounded border-slate-300 text-teal-700 focus:ring-teal-500" />
                        <span className="text-sm leading-6 text-slate-600">
                          J’accepte que mes informations soient utilisées par l’ASFO pour étudier et traiter cette proposition, conformément à la <Link to="/privacy" className="font-black text-teal-700 underline">politique de confidentialité</Link>.
                        </span>
                      </label>
                      {errors.consent && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.consent}</p>}
                    </div>
                  </div>

                  {submissionState === 'error' && (
                    <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">
                      La proposition n’a pas pu être envoyée. Vérifiez votre connexion, attendez quelques instants puis réessayez.
                    </div>
                  )}

                  <button type="submit" disabled={submissionState === 'sending'} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:bg-teal-800 disabled:cursor-wait disabled:opacity-70 sm:w-auto">
                    {submissionState === 'sending' ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
                    {submissionState === 'sending' ? 'Envoi en cours…' : 'Envoyer ma proposition de parrainage'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* Après soumission */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="text-center">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Après l’envoi</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
              Un processus encadré avant tout paiement
            </h2>
          </motion.div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {postSubmissionSteps.map((step, index) => (
              <motion.div key={step} {...reveal(index * 0.04)} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-xs font-black text-white">{index + 1}</span>
                <p className="mt-3 text-xs font-black leading-5 text-slate-800">{step}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
            <strong>Paiement :</strong> il intervient uniquement après validation du partenariat,
            définition du montant et génération d’un moyen de paiement contrôlé côté serveur.
            Aucun paiement n’est disponible sur cette page.
          </div>
        </section>

        {/* Transparence */}
        <section className="border-y border-slate-200 bg-white/70 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Transparence et suivi</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                Suivre concrètement l’impact de votre engagement
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Les modalités de suivi sont définies avec le parrain selon les actions validées et les données réellement disponibles.
              </p>
            </motion.div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {transparencyCommitments.map((commitment, index) => {
                const Icon = transparencyIcons[index];
                return (
                  <motion.article key={commitment.title} {...reveal(index * 0.04)} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
                    <Icon size={21} className="text-teal-700" aria-hidden="true" />
                    <h3 className="mt-4 text-base font-black text-slate-950">{commitment.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{commitment.description}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pourquoi */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Pourquoi l’ASFO ?</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
              Un partenariat construit avec rigueur
            </h2>
          </motion.div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Stethoscope, title: 'Expertise médicale', text: 'Des missions et spécialités médicales documentées dans les archives ASFO.' },
              { icon: MapPin, title: 'Connaissance du terrain', text: 'Une expérience construite au contact des communautés et des acteurs locaux.' },
              { icon: PackageCheck, title: 'Validation des besoins', text: 'Le périmètre est défini après étude, sans publication ni affectation automatique.' },
              { icon: ShieldCheck, title: 'Suivi transparent', text: 'Les modalités de suivi et les indicateurs sont convenus dans l’engagement validé.' },
            ].map(({ icon: Icon, title, text }, index) => (
              <motion.article key={title} {...reveal(index * 0.05)} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><Icon size={23} aria-hidden="true" /></span>
                <h3 className="mt-5 text-lg font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Don ponctuel */}
        <section className="border-y border-slate-200 bg-white/70 py-16">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            {[
              { icon: HeartHandshake, title: 'Parrainer un village', text: 'Construire un engagement durable soumis à l’étude de l’ASFO.', action: 'Proposer un parrainage', onClick: () => beginSponsorship() },
              { icon: Handshake, title: 'Financer une action précise', text: 'Échanger avec l’équipe sur un besoin ou une intervention définie.', action: 'Contacter l’ASFO', to: '/contact' },
              { icon: Heart, title: 'Faire un don sans engagement', text: 'Utiliser la page dédiée au don ponctuel, sans dupliquer son formulaire.', action: 'Faire un don ponctuel', to: '/donate' },
            ].map(({ icon: Icon, title, text, action, to, onClick }) => (
              <article key={title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <Icon size={25} className="text-teal-700" aria-hidden="true" />
                <h2 className="mt-5 text-xl font-black text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                {to ? (
                  <Link to={to} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
                    {action} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <button type="button" onClick={onClick} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
                    {action} <ArrowRight size={16} aria-hidden="true" />
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="text-center">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Questions fréquentes</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>FAQ parrainage</h2>
          </motion.div>
          <div className="mt-8 space-y-3">
            {sponsorshipFaq.map((item, index) => {
              const open = openFaq === index;
              const panelId = `sponsorship-faq-panel-${index}`;
              const buttonId = `sponsorship-faq-button-${index}`;
              return (
                <motion.article key={item.question} {...reveal(index * 0.025)} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                      <ChevronDown size={20} className={`shrink-0 text-teal-700 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                  </h3>
                  {open && (
                    <div id={panelId} role="region" aria-labelledby={buttonId} className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-600">
                      {item.answer}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <motion.div {...reveal()} className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-teal-200 bg-[linear-gradient(135deg,#ecfdf8_0%,#f0fdfa_55%,#eff6ff_100%)] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
            <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-teal-200/35 blur-3xl" />
            <div className="relative">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                <HeartHandshake size={27} aria-hidden="true" />
              </span>
              <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black tracking-[-0.025em] text-slate-950 sm:text-4xl" style={poppins}>
                Votre engagement peut transformer durablement la santé d’un village.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Découvrez les communautés en attente de soutien et construisez avec l’ASFO un accompagnement adapté, transparent et mesurable.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={() => scrollTo('villages')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-800 hover:border-teal-300 hover:text-teal-700">
                  Découvrir les villages
                </button>
                <button type="button" onClick={() => beginSponsorship()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/10 hover:bg-teal-800">
                  Proposer un parrainage <ArrowRight size={16} aria-hidden="true" />
                </button>
                <Link to="/donate" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-800 hover:border-teal-300 hover:text-teal-700">
                  Faire un don ponctuel
                </Link>
                <a href={`mailto:${CONTACT_DETAILS.email}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-800 hover:border-teal-300 hover:text-teal-700">
                  <Mail size={16} aria-hidden="true" /> Contacter l’ASFO
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default SponsorshipPage;
