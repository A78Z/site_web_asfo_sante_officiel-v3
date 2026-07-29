import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Users,
  CalendarDays,
  MapPin,
  Activity,
  Briefcase,
  BadgeCheck,
  Heart,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  GraduationCap,
  ClipboardList,
  HeartHandshake,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Quote,
  Compass,
  BookOpen,
  HelpCircle,
  Home,
} from 'lucide-react';
import { createObject } from '../lib/parse';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

/* ------------------------------------------------------------------ */
/* Données (contenu existant conservé)                                  */
/* ------------------------------------------------------------------ */

const BENEFITS = [
  { icon: Heart, title: 'Faire une différence', text: "Participez à des missions qui ont un impact direct sur la santé et le bien-être des populations défavorisées au Sénégal.", perk: 'Un impact concret et mesurable' },
  { icon: Activity, title: 'Développer vos compétences', text: "Mettez en pratique vos connaissances dans un contexte différent et acquérez une expérience unique en santé internationale.", perk: 'Une montée en compétence réelle' },
  { icon: Users, title: 'Rejoindre une communauté', text: "Intégrez un réseau de professionnels et d'étudiants passionnés qui partagent les mêmes valeurs d'entraide et de solidarité.", perk: '600+ bénévoles engagés' },
  { icon: HeartHandshake, title: 'Vivre une expérience humaine', text: 'Partagez des moments forts de solidarité et de terrain, où chaque geste compte pour les communautés et pour l’équipe.', perk: 'Le partage au cœur des missions' },
];

const STEPS = [
  { icon: ClipboardList, title: 'Candidature', text: "Remplissez le formulaire de candidature en ligne pour nous faire part de votre intérêt et de vos compétences.", next: 'Votre dossier est enregistré et transmis à l’équipe.' },
  { icon: CalendarDays, title: 'Entretien', text: "Un membre de notre équipe vous contactera pour un entretien afin de mieux comprendre vos motivations et vos disponibilités.", next: 'Un échange pour faire connaissance.' },
  { icon: Activity, title: 'Formation', text: "Participez à une session d'orientation pour vous familiariser avec notre mission, nos valeurs et nos méthodes de travail.", next: 'Vous êtes préparé aux réalités du terrain.' },
  { icon: MapPin, title: 'Préparation de mission', text: "Une fois accepté, vous serez informé des prochaines missions disponibles et vous pourrez choisir celle qui vous convient.", next: 'Vous choisissez la mission qui vous convient.' },
  { icon: Heart, title: 'Participation à la mission', text: "Rejoignez l'équipe sur le terrain pour contribuer à notre mission humanitaire au Sénégal.", next: 'Vous agissez au plus près des communautés.' },
];

const PROFILES = [
  { value: 'medical', icon: Stethoscope, title: 'Professionnel de santé', description: 'Médecins, infirmiers, dentistes, ophtalmologues, gynécologues, pharmaciens...', skills: ['Expertise médicale', 'Expérience clinique', 'Adaptabilité'] },
  { value: 'student', icon: GraduationCap, title: 'Étudiant en médecine', description: 'Étudiants en médecine, pharmacie, dentisterie, sciences infirmières...', skills: ['Motivation', "Travail d'équipe", "Volonté d'apprendre"] },
  { value: 'logistics', icon: Briefcase, title: 'Logistique & Administration', description: 'Coordination, gestion de projet, logistique, communication...', skills: ['Organisation', 'Communication', 'Gestion'] },
  { value: 'non-medical', icon: HeartHandshake, title: 'Bénévole non médical', description: 'Traduction, sensibilisation, éducation, soutien logistique...', skills: ['Engagement', 'Polyvalence', 'Initiative'] },
];

const OFFERINGS = [
  { icon: Compass, title: 'Une expérience de terrain', text: 'Des missions médicales concrètes au contact des populations.' },
  { icon: ShieldCheck, title: 'Un accompagnement avant les missions', text: 'Une orientation et une préparation aux réalités du terrain.' },
  { icon: BookOpen, title: 'Un apprentissage continu', text: 'Formations, ateliers et partage entre pairs.' },
  { icon: Users, title: 'Une communauté engagée', text: 'Un réseau solidaire de professionnels et d’étudiants.' },
];

const TESTIMONIALS = [
  { name: 'Dr. Fatou Ndiaye', role: 'Médecin généraliste', image: '/dr-fatou-ndiaye.webp', quote: "Participer aux missions d'ASFO a été l'expérience la plus enrichissante de mon parcours médical. J'ai pu mettre en pratique mes connaissances tout en aidant des personnes qui en avaient vraiment besoin." },
  { name: 'Moussa Diop', role: 'Étudiant en médecine', image: '/moussa-diop.webp', quote: "En tant qu'étudiant, ASFO m'a offert une opportunité unique d'apprendre sur le terrain et de développer mes compétences cliniques. C'est une expérience qui m'a marqué à vie et qui a confirmé ma vocation." },
  { name: 'Aminata Sow', role: 'Infirmière', image: '/Aminata-Sow.webp', quote: "L'ambiance au sein des équipes d'ASFO est exceptionnelle. Malgré les conditions parfois difficiles, l'entraide et la bonne humeur sont toujours présentes. Je me suis fait des amis pour la vie." },
];

const AVAILABILITY_OPTIONS = [
  { value: 'week', label: '1 semaine' },
  { value: 'two-weeks', label: '2 semaines' },
  { value: 'month', label: '1 mois' },
  { value: 'more', label: "Plus d'un mois" },
  { value: 'remote', label: 'Travail à distance' },
  { value: 'grand-campagnes', label: 'Grandes Campagnes' },
  { value: 'strat-campagnes', label: 'Strat-Campagnes' },
  { value: 'pedagogique', label: 'Assistance aux activités pédagogiques' },
  { value: 'sensibilisation', label: 'Pour la sensibilisation' },
  { value: 'other', label: 'Autre' },
];

const FAQ = [
  { q: 'Qui peut devenir bénévole ?', a: "L'ASFO accueille des professionnels de santé, des étudiants en médecine et disciplines associées, des profils logistiques et administratifs, ainsi que des bénévoles non médicaux motivés à aider." },
  { q: 'Faut-il être professionnel de santé ?', a: "Non. Si les professionnels et étudiants en santé sont recherchés, des bénévoles non médicaux (traduction, sensibilisation, éducation, soutien logistique) ont aussi toute leur place." },
  { q: 'Comment sont sélectionnés les candidats ?', a: "Après votre candidature, un membre de l'équipe vous contacte pour un entretien afin de mieux comprendre vos motivations et vos disponibilités, avant une session d'orientation." },
  { q: 'Dois-je être disponible toute l’année ?', a: "Non. Vous indiquez votre disponibilité dans le formulaire (d'une semaine aux grandes campagnes) et vous choisissez ensuite les missions qui vous conviennent." },
  { q: 'Les missions sont-elles rémunérées ?', a: "Non. L'engagement à l'ASFO est bénévole : il s'agit d'une action humanitaire et solidaire, pas d'un emploi salarié." },
  { q: 'Comment suis-je informé de la suite ?', a: "Votre candidature est étudiée par l'équipe de l'ASFO, qui vous contacte si votre profil correspond aux besoins des prochaines missions." },
];

const inputCls =
  'w-full rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/50';
const labelCls = 'mb-1.5 block text-xs font-semibold text-gray-700';
const errorCls = 'mt-1 flex items-center gap-1 text-xs text-red-600';

const DRAFT_KEY = 'asfo-volunteer-draft';

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '',
  profile: '', otherProfile: '', specialty: '', experience: '', workplace: '',
  motivation: '', availability: '', otherAvailability: '', terms: false,
};

type Form = typeof EMPTY;

/* ------------------------------------------------------------------ */
/* Slider témoignages                                                   */
/* ------------------------------------------------------------------ */

const TestimonialsSlider: React.FC = () => {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = TESTIMONIALS.length;
  const next = () => setIndex((i) => (i + 1) % n);
  const prev = () => setIndex((i) => (i - 1 + n) % n);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(next, 6500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, paused]);

  const t = TESTIMONIALS[index];
  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label="Témoignages de bénévoles"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); next(); } if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); } }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative mx-auto max-w-3xl rounded-3xl border border-white/80 bg-white/85 p-8 shadow-[0_25px_60px_-30px_rgba(18,63,56,0.4)] backdrop-blur-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/50 sm:p-10"
    >
      <Quote className="absolute right-8 top-8 h-12 w-12 -scale-x-100 text-teal-100" aria-hidden="true" />
      <div className="relative min-h-[210px] sm:min-h-[170px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            drag={reduce ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => { if (info.offset.x < -60) next(); else if (info.offset.x > 60) prev(); }}
            className="cursor-grab active:cursor-grabbing"
          >
            <blockquote className="text-base font-medium italic leading-relaxed text-gray-700 sm:text-lg sm:leading-8">« {t.quote} »</blockquote>
            <figcaption className="mt-6 flex items-center gap-3.5">
              <img src={t.image} alt={`Portrait — ${t.name}`} loading="lazy" className="h-12 w-12 flex-none rounded-full border-2 border-white object-cover object-top shadow-md ring-2 ring-teal-100" />
              <div>
                <p className="text-sm font-bold text-gray-900" style={poppins}>{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700" style={poppins}>
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Bénévole ASFO
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-7 flex items-center justify-between border-t border-teal-50 pt-5">
        <div className="flex items-center gap-2" role="tablist" aria-label="Choisir un témoignage">
          {TESTIMONIALS.map((tt, i) => (
            <button key={tt.name} type="button" role="tab" aria-selected={i === index} aria-label={`Témoignage ${i + 1} — ${tt.name}`} onClick={() => setIndex(i)} className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${i === index ? 'w-8 bg-gradient-to-r from-[#2fb391] to-[#178066]' : 'w-2.5 bg-teal-100 hover:bg-teal-200'}`} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={prev} aria-label="Précédent" className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-100 bg-white text-teal-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
          <button type="button" onClick={next} aria-label="Suivant" className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-100 bg-white text-teal-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const JoinPage: React.FC = () => {
  const reduce = useReducedMotion();
  const [form, setForm] = useState<Form>(() => {
    try { const raw = localStorage.getItem(DRAFT_KEY); if (raw) return { ...EMPTY, ...JSON.parse(raw), terms: false }; } catch { /* noop */ }
    return EMPTY;
  });
  const [step, setStep] = useState(1);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [sentDate, setSentDate] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = 'Devenir bénévole | ASFO - Action Sanitaire pour le Fouta'; }, []);

  /* Sauvegarde locale du brouillon (hors consentement) */
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...form, terms: undefined }));
    } catch { /* noop */ }
  }, [form]);

  const set = <K extends keyof Form>(key: K) => (v: Form[K]) => setForm((f) => ({ ...f, [key]: v }));

  /* Validation par champ */
  const errors = useMemo(() => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (!form.firstName.trim()) e.firstName = 'Le prénom est requis.';
    if (!form.lastName.trim()) e.lastName = 'Le nom est requis.';
    if (!form.email.trim()) e.email = "L'email est requis.";
    else if (!emailRe.test(form.email.trim())) e.email = 'Adresse email invalide.';
    if (!form.phone.trim()) e.phone = 'Le téléphone est requis.';
    if (!form.profile) e.profile = 'Veuillez choisir un profil.';
    if (form.profile === 'other' && !form.otherProfile.trim()) e.otherProfile = 'Veuillez préciser votre profil.';
    if (!form.motivation.trim()) e.motivation = 'La motivation est requise.';
    if (!form.availability) e.availability = 'Veuillez indiquer votre disponibilité.';
    if (form.availability === 'other' && !form.otherAvailability.trim()) e.otherAvailability = 'Veuillez préciser votre disponibilité.';
    if (!form.terms) e.terms = 'Vous devez accepter les conditions.';
    return e;
  }, [form]);

  const stepFields: (keyof Form)[][] = [
    ['firstName', 'lastName', 'email', 'phone'],
    ['profile', 'otherProfile'],
    ['motivation', 'availability', 'otherAvailability', 'terms'],
  ];

  const stepValid = (s: number) => stepFields[s - 1].every((f) => !errors[f]);

  const markStepTouched = (s: number) => setTouched((t) => ({ ...t, ...Object.fromEntries(stepFields[s - 1].map((f) => [f, true])) }));

  const goNext = () => {
    markStepTouched(step);
    if (stepValid(step)) setStep((s) => Math.min(s + 1, 3));
  };
  const goPrev = () => setStep((s) => Math.max(s - 1, 1));

  const chooseProfile = (value: string) => {
    setForm((f) => ({ ...f, profile: value }));
    setStep(2);
    formRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    markStepTouched(1); markStepTouched(2); markStepTouched(3);
    if (Object.keys(errors).length > 0) {
      // aller à la première étape invalide
      if (!stepValid(1)) setStep(1); else if (!stepValid(2)) setStep(2); else setStep(3);
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      await createObject('VolunteerRequests', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        profile: form.profile === 'other' && form.otherProfile.trim() ? form.otherProfile.trim() : form.profile,
        speciality: form.specialty.trim(),
        experience: form.experience.trim(),
        motivation: form.motivation.trim(),
        availability: form.availability === 'other' && form.otherAvailability.trim() ? form.otherAvailability.trim() : form.availability,
        workplace: form.workplace.trim(),
        status: 'En attente',
      });
      setSentDate(new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));
      setStatus('success');
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
    } catch (err) {
      console.error('Volunteer submit error:', err);
      setStatus('error');
      setErrorMsg('Une erreur est survenue. Veuillez vérifier votre connexion et réessayer.');
    }
  };

  const showErr = (k: keyof Form) => touched[k] && errors[k];

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
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Donnez du sens à votre engagement
            </motion.span>
            <motion.h1 {...fadeUp(0.08)} className="mt-6 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl xl:text-6xl" style={poppins}>
              Rejoignez notre équipe de{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">bénévoles</span>
            </motion.h1>
            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8">
              ASFO mobilise régulièrement des bénévoles passionnés pour ses missions humanitaires.
              Professionnels de santé, étudiants, logisticiens ou bénévoles motivés : vous avez votre place parmi nous.
            </motion.p>
            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <button type="button" onClick={() => formRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })} className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Déposer ma candidature
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => document.getElementById('parcours')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })} className="inline-flex items-center justify-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Découvrir le parcours bénévole
              </button>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.15)} className="relative">
            <div className="grid grid-cols-3 grid-rows-3 gap-3.5">
              <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl border border-white/80 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.45)]">
                <img src="/rejoindre-equipe.webp" alt="L'équipe de bénévoles de l'ASFO en mission" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="row-span-2 overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src="/medicalteam.webp" alt="Équipe médicale de l'ASFO" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src="/9.webp" alt="Bénévoles devant l'unité mobile" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            </div>
            <motion.div animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-6 -left-4 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_20px_50px_-20px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:-left-8">
              <div className="flex items-center gap-4">
                <div><p className="text-lg font-extrabold text-teal-700" style={poppins}>600+</p><p className="text-[11px] font-semibold text-gray-500">bénévoles</p></div>
                <div className="h-9 w-px bg-teal-100" aria-hidden="true" />
                <div><p className="text-lg font-extrabold text-teal-700" style={poppins}>25+</p><p className="text-[11px] font-semibold text-gray-500">années</p></div>
                <div className="h-9 w-px bg-teal-100" aria-hidden="true" />
                <div><p className="text-sm font-bold text-teal-700" style={poppins}>Terrain</p><p className="text-[11px] font-semibold text-gray-500">missions réelles</p></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ POURQUOI NOUS REJOINDRE ════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-teal-100/30 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              Pourquoi nous rejoindre
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Les avantages de devenir{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">bénévole</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title} {...fadeUp(0.05 + i * 0.07)} className="group flex flex-col rounded-3xl border border-white/80 bg-white/85 p-7 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)]">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_12px_30px_-10px_rgba(23,128,102,0.6)] transition-transform duration-300 group-hover:scale-110"><b.icon className="h-6 w-6 text-white" aria-hidden="true" /></span>
                <h3 className="mt-4 text-lg font-bold text-gray-900" style={poppins}>{b.title}</h3>
                <div className="mt-2 h-1 w-10 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
                <p className="mt-3 flex-1 text-[14px] leading-7 text-gray-600">{b.text}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-teal-700" style={poppins}><CheckCircle2 className="h-4 w-4" aria-hidden="true" />{b.perk}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ COMMENT ÇA MARCHE ════════════════ */}
      <section id="parcours" className="relative overflow-hidden scroll-mt-24 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-teal-50/40" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              Comment ça marche
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Le parcours pour devenir{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">bénévole</span>
            </h2>
          </motion.div>
          <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-3">
            <div className="absolute left-6 top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-teal-200 via-teal-300 to-teal-200 lg:left-[10%] lg:right-[10%] lg:top-6 lg:h-px lg:w-[80%] lg:bg-gradient-to-r" aria-hidden="true" />
            {STEPS.map((s, i) => (
              <motion.li key={s.title} {...fadeUp(0.06 + i * 0.08)} className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:text-center">
                <span className="z-10 flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-teal-200 bg-white text-teal-600 shadow-sm">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#2fb391] to-[#178066] text-[10px] font-bold text-white" style={poppins}>{i + 1}</span>
                </span>
                <div className="lg:mt-3 lg:px-1">
                  <p className="text-[15px] font-bold text-gray-900" style={poppins}>{s.title}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">{s.text}</p>
                  <p className="mt-2 inline-flex items-start gap-1 text-[11.5px] font-semibold text-teal-700"><ArrowRight className="mt-0.5 h-3 w-3 flex-none" aria-hidden="true" />{s.next}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ════════════════ PROFILS RECHERCHÉS ════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              Profils recherchés
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Des compétences{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">variées</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              ASFO a besoin de bénévoles aux profils complémentaires. Choisissez le vôtre pour préremplir votre candidature.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROFILES.map((p, i) => (
              <motion.div key={p.value} {...fadeUp(0.05 + i * 0.06)} className="group flex flex-col rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition-colors duration-300 group-hover:bg-teal-100"><p.icon className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="mt-4 text-base font-bold text-gray-900" style={poppins}>{p.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{p.description}</p>
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Compétences recherchées</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.skills.map((s) => <span key={s} className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700">{s}</span>)}
                  </div>
                </div>
                <button type="button" onClick={() => chooseProfile(p.value)} className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-teal-200/80 bg-white px-4 py-2.5 text-sm font-bold text-teal-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}>
                  Choisir ce profil
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CE QUE L'ASFO VOUS APPORTE ════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-teal-50/40" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeUp(0)} className="text-center text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>Ce que l'ASFO vous apporte</motion.h2>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OFFERINGS.map((o, i) => (
              <motion.div key={o.title} {...fadeUp(0.06 + i * 0.07)} className="rounded-3xl border border-white/80 bg-white/90 p-6 text-center shadow-[0_15px_40px_-22px_rgba(18,63,56,0.28)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100 bg-teal-50"><o.icon className="h-5 w-5 text-teal-600" aria-hidden="true" /></span>
                <h3 className="mt-3.5 text-[15px] font-bold text-gray-900" style={poppins}>{o.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{o.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ FORMULAIRE ════════════════ */}
      <section ref={formRef} id="volunteer-form" className="relative scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
            {/* Colonne gauche */}
            <motion.div {...fadeUp(0)} className="self-start lg:sticky lg:top-28">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
                <HeartHandshake className="h-3.5 w-3.5" aria-hidden="true" />
                Devenir bénévole
              </span>
              <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
                Votre engagement commence{' '}
                <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">ici</span>
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-gray-600">
                Remplissez le formulaire en trois étapes. Votre candidature sera étudiée par l'équipe de l'ASFO,
                qui vous contactera si votre profil correspond aux besoins des prochaines missions.
              </p>
              <ul className="mt-6 space-y-3">
                {['Préparez vos coordonnées', 'Identifiez votre profil et votre expérience', 'Exprimez votre motivation et vos disponibilités'].map((t, i) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700" style={poppins}>{i + 1}</span>
                    <span className="text-sm text-gray-700">{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-teal-600" aria-hidden="true" />
                <p className="text-[13px] leading-relaxed text-gray-700"><strong className="text-gray-900">Vos informations restent confidentielles</strong> et ne servent qu'au traitement de votre candidature.</p>
              </div>
            </motion.div>

            {/* Colonne droite — formulaire */}
            <motion.div {...fadeUp(0.1)} className="min-w-0 self-start rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-9">
              {status === 'success' ? (
                <div className="py-8 text-center" role="status">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2fb391] to-[#178066]"><CheckCircle2 className="h-8 w-8 text-white" aria-hidden="true" /></span>
                  <h3 className="mt-5 text-2xl font-extrabold text-gray-900" style={poppins}>Votre candidature a bien été envoyée</h3>
                  <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-gray-600">
                    L'équipe de l'ASFO étudiera votre dossier et vous contactera si votre profil correspond aux
                    besoins des prochaines missions.
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-700"><CalendarDays className="h-4 w-4" aria-hidden="true" />Envoyée le {sentDate}</p>
                  <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white px-6 py-3 text-sm font-bold text-teal-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}><Home className="h-4 w-4" aria-hidden="true" />Retour à l'accueil</Link>
                    <Link to="/archives" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>Découvrir nos missions<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Barre de progression */}
                  <div className="mb-7">
                    <div className="flex items-center justify-between">
                      {['Identité', 'Profil', 'Motivation'].map((label, i) => {
                        const n = i + 1;
                        const done = step > n;
                        const active = step === n;
                        return (
                          <React.Fragment key={label}>
                            <div className="flex items-center gap-2">
                              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${done ? 'bg-gradient-to-br from-[#2fb391] to-[#178066] text-white' : active ? 'border-2 border-teal-500 bg-white text-teal-700' : 'border border-teal-100 bg-white text-gray-400'}`} style={poppins}>
                                {done ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : n}
                              </span>
                              <span className={`hidden text-xs font-bold sm:inline ${active || done ? 'text-teal-700' : 'text-gray-400'}`} style={poppins}>{label}</span>
                            </div>
                            {n < 3 && <span className={`mx-2 h-0.5 flex-1 rounded-full ${step > n ? 'bg-gradient-to-r from-[#2fb391] to-[#178066]' : 'bg-teal-100'}`} aria-hidden="true" />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-right text-[11px] text-gray-400">Champs obligatoires <span className="text-red-500">*</span></p>
                  </div>

                  <AnimatePresence mode="wait">
                    {/* ── Étape 1 ── */}
                    {step === 1 && (
                      <motion.div key="s1" initial={{ opacity: 0, x: reduce ? 0 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduce ? 0 : -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="firstName" className={labelCls}>Prénom <span className="text-red-500">*</span></label>
                            <input id="firstName" value={form.firstName} onChange={(e) => set('firstName')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, firstName: true }))} className={inputCls} placeholder="Prénom" autoComplete="given-name" aria-invalid={!!showErr('firstName')} aria-describedby={showErr('firstName') ? 'err-firstName' : undefined} />
                            {showErr('firstName') && <p id="err-firstName" className={errorCls}><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors.firstName}</p>}
                          </div>
                          <div>
                            <label htmlFor="lastName" className={labelCls}>Nom <span className="text-red-500">*</span></label>
                            <input id="lastName" value={form.lastName} onChange={(e) => set('lastName')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, lastName: true }))} className={inputCls} placeholder="Nom" autoComplete="family-name" aria-invalid={!!showErr('lastName')} aria-describedby={showErr('lastName') ? 'err-lastName' : undefined} />
                            {showErr('lastName') && <p id="err-lastName" className={errorCls}><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors.lastName}</p>}
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="email" className={labelCls}>Email <span className="text-red-500">*</span></label>
                            <div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-500" aria-hidden="true" /><input id="email" type="email" value={form.email} onChange={(e) => set('email')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} className={`${inputCls} pl-10`} placeholder="vous@exemple.com" autoComplete="email" aria-invalid={!!showErr('email')} aria-describedby={showErr('email') ? 'err-email' : undefined} /></div>
                            {showErr('email') && <p id="err-email" className={errorCls}><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors.email}</p>}
                          </div>
                          <div>
                            <label htmlFor="phone" className={labelCls}>Téléphone <span className="text-red-500">*</span></label>
                            <div className="relative"><Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-500" aria-hidden="true" /><input id="phone" type="tel" value={form.phone} onChange={(e) => set('phone')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, phone: true }))} className={`${inputCls} pl-10`} placeholder="+221 …" autoComplete="tel" aria-invalid={!!showErr('phone')} aria-describedby={showErr('phone') ? 'err-phone' : undefined} /></div>
                            {showErr('phone') && <p id="err-phone" className={errorCls}><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors.phone}</p>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ── Étape 2 ── */}
                    {step === 2 && (
                      <motion.div key="s2" initial={{ opacity: 0, x: reduce ? 0 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduce ? 0 : -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                        <div>
                          <label htmlFor="profile" className={labelCls}>Profil <span className="text-red-500">*</span></label>
                          <select id="profile" value={form.profile} onChange={(e) => set('profile')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, profile: true }))} className={inputCls} aria-invalid={!!showErr('profile')}>
                            <option value="">Sélectionnez votre profil</option>
                            <option value="medical">Professionnel de santé</option>
                            <option value="student">Étudiant en médecine</option>
                            <option value="logistics">Logistique & Administration</option>
                            <option value="non-medical">Bénévole non médical</option>
                            <option value="other">Autre</option>
                          </select>
                          {showErr('profile') && <p className={errorCls}><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors.profile}</p>}
                        </div>
                        {form.profile === 'other' && (
                          <div>
                            <label htmlFor="otherProfile" className={labelCls}>Précisez votre profil <span className="text-red-500">*</span></label>
                            <input id="otherProfile" value={form.otherProfile} onChange={(e) => set('otherProfile')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, otherProfile: true }))} className={inputCls} placeholder="Ex : Étudiant en pharmacie, Logisticien…" aria-invalid={!!showErr('otherProfile')} />
                            {showErr('otherProfile') && <p className={errorCls}><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors.otherProfile}</p>}
                          </div>
                        )}
                        <div>
                          <label htmlFor="specialty" className={labelCls}>Spécialité / Domaine de compétence</label>
                          <input id="specialty" value={form.specialty} onChange={(e) => set('specialty')(e.target.value)} className={inputCls} placeholder="Votre spécialité ou domaine" />
                        </div>
                        <div>
                          <label htmlFor="workplace" className={labelCls}>Lieu d'exercice</label>
                          <input id="workplace" value={form.workplace} onChange={(e) => set('workplace')(e.target.value)} className={inputCls} placeholder="Ex : Hôpital Principal de Dakar, UCAD…" autoComplete="organization" />
                        </div>
                        <div>
                          <label htmlFor="experience" className={labelCls}>Expérience humanitaire précédente</label>
                          <textarea id="experience" rows={3} value={form.experience} onChange={(e) => set('experience')(e.target.value)} className={`${inputCls} resize-none`} placeholder="Décrivez brièvement votre expérience (facultatif)" />
                        </div>
                      </motion.div>
                    )}

                    {/* ── Étape 3 ── */}
                    {step === 3 && (
                      <motion.div key="s3" initial={{ opacity: 0, x: reduce ? 0 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduce ? 0 : -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                        <div>
                          <label htmlFor="motivation" className={labelCls}>Motivation <span className="text-red-500">*</span></label>
                          <textarea id="motivation" rows={4} value={form.motivation} onChange={(e) => set('motivation')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, motivation: true }))} className={`${inputCls} resize-none`} placeholder="Pourquoi souhaitez-vous rejoindre l'ASFO ?" aria-invalid={!!showErr('motivation')} />
                          {showErr('motivation') && <p className={errorCls}><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors.motivation}</p>}
                        </div>
                        <div>
                          <label htmlFor="availability" className={labelCls}>Disponibilité <span className="text-red-500">*</span></label>
                          <select id="availability" value={form.availability} onChange={(e) => set('availability')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, availability: true }))} className={inputCls} aria-invalid={!!showErr('availability')}>
                            <option value="">Sélectionnez votre disponibilité</option>
                            {AVAILABILITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                          {showErr('availability') && <p className={errorCls}><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors.availability}</p>}
                        </div>
                        {form.availability === 'other' && (
                          <div>
                            <label htmlFor="otherAvailability" className={labelCls}>Précisez votre disponibilité <span className="text-red-500">*</span></label>
                            <input id="otherAvailability" value={form.otherAvailability} onChange={(e) => set('otherAvailability')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, otherAvailability: true }))} className={inputCls} placeholder="Ex : Week-ends, vacances scolaires…" aria-invalid={!!showErr('otherAvailability')} />
                            {showErr('otherAvailability') && <p className={errorCls}><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors.otherAvailability}</p>}
                          </div>
                        )}
                        {/* Résumé */}
                        <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-teal-700" style={poppins}>Récapitulatif</p>
                          <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
                            <dt className="text-gray-500">Candidat</dt><dd className="font-semibold text-gray-800">{form.firstName} {form.lastName}</dd>
                            <dt className="text-gray-500">Email</dt><dd className="truncate font-semibold text-gray-800">{form.email || '—'}</dd>
                            <dt className="text-gray-500">Profil</dt><dd className="font-semibold text-gray-800">{form.profile === 'other' ? form.otherProfile || 'Autre' : (PROFILES.find((p) => p.value === form.profile)?.title ?? '—')}</dd>
                          </dl>
                        </div>
                        <label htmlFor="terms" className="flex items-start gap-2.5 text-sm text-gray-600">
                          <input id="terms" type="checkbox" checked={form.terms} onChange={(e) => { set('terms')(e.target.checked); setTouched((t) => ({ ...t, terms: true })); }} className="mt-0.5 h-4 w-4 rounded border-teal-300 text-teal-600 focus:ring-teal-400" aria-invalid={!!showErr('terms')} />
                          <span>J'accepte les <a href="/privacy" className="font-semibold text-teal-700 hover:underline">conditions d'utilisation</a> et la <a href="/privacy" className="font-semibold text-teal-700 hover:underline">politique de confidentialité</a> d'ASFO. <span className="text-red-500">*</span></span>
                        </label>
                        {showErr('terms') && <p className={errorCls}><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors.terms}</p>}
                        {status === 'error' && (
                          <p className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />{errorMsg}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="mt-7 flex items-center justify-between gap-3">
                    {step > 1 ? (
                      <button type="button" onClick={goPrev} className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white px-5 py-2.5 text-sm font-bold text-teal-800 shadow-sm transition-all duration-300 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}><ArrowLeft className="h-4 w-4" aria-hidden="true" />Précédent</button>
                    ) : <span />}
                    {step < 3 ? (
                      <button type="button" onClick={goNext} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-2.5 text-sm font-bold text-white shadow-[0_15px_35px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>Suivant<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                    ) : (
                      <button type="submit" disabled={status === 'sending'} className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 disabled:cursor-not-allowed disabled:opacity-70" style={poppins}>
                        {status === 'sending' ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />Envoi en cours…</> : <><Heart className="h-5 w-5" aria-hidden="true" />Envoyer ma candidature</>}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ TÉMOIGNAGES ════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-teal-100/30 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-10 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Quote className="h-3.5 w-3.5" aria-hidden="true" />
              Témoignages de bénévoles
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              L'expérience de ceux qui ont rejoint nos{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">missions</span>
            </h2>
          </motion.div>
          <motion.div {...fadeUp(0.1)}><TestimonialsSlider /></motion.div>
        </div>
      </section>

      {/* ════════════════ FAQ ════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-teal-50/40" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mb-10 text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Questions fréquentes
            </span>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>Vos questions, nos réponses</h2>
          </motion.div>
          <div className="space-y-3">
            {FAQ.map((item, i) => {
              const open = faqOpen === i;
              return (
                <motion.div key={item.q} {...fadeUp(0.03 + i * 0.04)} className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-[0_15px_40px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm">
                  <button type="button" onClick={() => setFaqOpen(open ? null : i)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
                    <span className="text-[15px] font-bold text-gray-900" style={poppins}>{item.q}</span>
                    <ChevronDown className={`h-5 w-5 flex-none text-teal-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
                        <p className="px-6 pb-5 text-[14px] leading-7 text-gray-600">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
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
              Prêt à mettre vos compétences au service des{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">communautés</span> ?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Déposez votre candidature et rejoignez une équipe engagée dans des missions médicales et
              humanitaires à fort impact.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <button type="button" onClick={() => formRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })} className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                Commencer ma candidature
              </button>
              <Link to="/contact" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Mail className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Contacter l'ASFO
              </Link>
              <Link to="/archives" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Compass className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Voir les missions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default JoinPage;
