import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Apple,
  ArrowRight,
  Baby,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Compass,
  FileText,
  GraduationCap,
  HelpCircle,
  HeartPulse,
  Library,
  LifeBuoy,
  Megaphone,
  Search,
  ShieldCheck,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  Syringe,
  Users,
  X,
} from 'lucide-react';
import { HEALTH_SHEETS } from '../data/healthSheets';
import { PREVENTION_TIPS } from '../data/preventionTips';
import { VACCINE_CATEGORIES } from '../data/vaccinationSchedule';
import { FIRST_AID_GUIDES } from '../data/firstAidGuides';
import { HEALTH_FAQ_CATEGORIES } from '../data/healthFaq';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

type HealthResource = {
  id: string;
  title: string;
  description: string;
  summary: string;
  to: string;
  image: string;
  alt: string;
  icon: React.ElementType;
  countLabel: string;
  searchTerms: string[];
  featured: boolean;
};

const HEALTH_RESOURCES: HealthResource[] = [
  {
    id: 'fiches-sante',
    title: 'Fiches santé',
    description:
      'Paludisme, diabète, hypertension, santé bucco-dentaire, santé mentale…',
    summary:
      'Des repères organisés par thématique, publiés uniquement après validation médicale.',
    to: '/sante/fiches',
    image: '/sante-communautaire.webp',
    alt: 'Action de santé communautaire avec des familles',
    icon: BookOpenCheck,
    countLabel: `${HEALTH_SHEETS.length} thématiques en préparation`,
    searchTerms: HEALTH_SHEETS.flatMap((sheet) => [
      sheet.title,
      sheet.description,
      ...sheet.topics,
    ]),
    featured: true,
  },
  {
    id: 'prevention',
    title: 'Conseils de prévention',
    description: 'Les bons gestes du quotidien pour rester en bonne santé.',
    summary:
      'Un espace consacré aux sujets de prévention communautaire et aux habitudes du quotidien.',
    to: '/sante/prevention',
    image: '/sensibilisation.jpg',
    alt: 'Séance de sensibilisation communautaire de l’ASFO',
    icon: ShieldPlus,
    countLabel: `${PREVENTION_TIPS.length} thématiques en préparation`,
    searchTerms: PREVENTION_TIPS.flatMap((tip) => [
      tip.title,
      tip.description,
      ...tip.topics,
    ]),
    featured: true,
  },
  {
    id: 'vaccination',
    title: 'Calendrier vaccinal',
    description: 'Les vaccins recommandés, âge par âge.',
    summary:
      'Des repères structurés pour consulter les informations vaccinales lorsqu’elles seront validées.',
    to: '/sante/vaccination',
    image: '/vaccination.webp',
    alt: 'Professionnel de santé accompagnant un enfant pendant une vaccination',
    icon: Syringe,
    countLabel: `${VACCINE_CATEGORIES.length} catégories en préparation`,
    searchTerms: VACCINE_CATEGORIES.flatMap((category) => [
      category.title,
      category.description,
      category.ageRange,
    ]),
    featured: false,
  },
  {
    id: 'gestes-qui-sauvent',
    title: 'Gestes qui sauvent',
    description: 'Réagir face à une urgence en attendant les secours.',
    summary:
      'Une bibliothèque pédagogique qui distingue clairement information et formation pratique.',
    to: '/sante/gestes-qui-sauvent',
    image: '/ateliers-formation-pratique.jpg',
    alt: 'Démonstration encadrée pendant une formation pratique ASFO',
    icon: LifeBuoy,
    countLabel: `${FIRST_AID_GUIDES.length} guides en préparation`,
    searchTerms: FIRST_AID_GUIDES.flatMap((guide) => [
      guide.title,
      guide.description,
      ...guide.objectives,
    ]),
    featured: false,
  },
  {
    id: 'faq-sante',
    title: 'FAQ santé',
    description: 'Les réponses aux questions les plus fréquentes.',
    summary:
      'Un espace de recherche et d’orientation où seules les réponses validées sont rendues publiques.',
    to: '/sante/faq',
    image: '/sensibilisation-consultation.jpg',
    alt: 'Échange avec une patiente pendant une consultation ASFO',
    icon: HelpCircle,
    countLabel: `${HEALTH_FAQ_CATEGORIES.length} catégories en préparation`,
    searchTerms: HEALTH_FAQ_CATEGORIES.flatMap((category) => [
      category.title,
      category.description,
      ...category.topics,
    ]),
    featured: false,
  },
];

const QUICK_LINKS = HEALTH_RESOURCES.map((resource) => ({
  label:
    resource.id === 'prevention'
      ? 'Prévention'
      : resource.id === 'vaccination'
        ? 'Vaccination'
        : resource.id === 'faq-sante'
          ? 'FAQ'
          : resource.title,
  to: resource.to,
  icon: resource.icon,
}));

const SEARCH_SUGGESTIONS = [
  'paludisme',
  'diabète',
  'vaccination',
  'premiers secours',
  'prévention',
];

const PURPOSES = [
  {
    title: 'Prévenir',
    text: 'Mettre à disposition des repères clairs pour mieux comprendre les sujets de prévention.',
    icon: ShieldCheck,
  },
  {
    title: 'Informer',
    text: 'Rassembler les ressources santé de l’ASFO dans un espace simple à parcourir.',
    icon: Library,
  },
  {
    title: 'Former',
    text: 'Orienter vers les contenus pédagogiques et les formations pratiques disponibles.',
    icon: GraduationCap,
  },
  {
    title: 'Orienter',
    text: 'Aider chaque visiteur à trouver la ressource ou le contact adapté à sa recherche.',
    icon: Compass,
  },
];

const RESOURCE_TYPES = [
  {
    title: 'Fiches',
    text: 'Six thématiques santé structurées.',
    to: '/sante/fiches',
    icon: FileText,
  },
  {
    title: 'Guides',
    text: 'Les gestes qui sauvent, après validation.',
    to: '/sante/gestes-qui-sauvent',
    icon: ClipboardList,
  },
  {
    title: 'FAQ',
    text: 'Recherche et réponses relues.',
    to: '/sante/faq',
    icon: HelpCircle,
  },
  {
    title: 'Conseils',
    text: 'Trois axes de prévention communautaire.',
    to: '/sante/prevention',
    icon: ShieldPlus,
  },
  {
    title: 'Campagnes',
    text: 'Les actions de sensibilisation de l’ASFO.',
    to: '/services/awareness',
    icon: Megaphone,
  },
];

const USER_JOURNEY = [
  {
    title: 'Je cherche un sujet de santé',
    text: 'J’utilise la recherche du portail.',
    to: '#ressources-sante',
    icon: Search,
  },
  {
    title: 'Je consulte une fiche',
    text: 'Je parcours les thématiques disponibles.',
    to: '/sante/fiches',
    icon: BookOpenCheck,
  },
  {
    title: 'Je découvre les conseils',
    text: 'J’accède à l’espace prévention.',
    to: '/sante/prevention',
    icon: ShieldPlus,
  },
  {
    title: 'Je consulte la FAQ',
    text: 'Je recherche une réponse validée.',
    to: '/sante/faq',
    icon: HelpCircle,
  },
  {
    title: 'Je contacte un professionnel',
    text: 'Je m’oriente vers les consultations.',
    to: '/services/consultations',
    icon: Stethoscope,
  },
];

const DAILY_PREVENTION = [
  {
    title: 'Hygiène',
    text: 'Accéder aux ressources consacrées à l’hygiène et à l’eau.',
    to: '/sante/prevention',
    icon: Sparkles,
  },
  {
    title: 'Nutrition',
    text: 'Retrouver les thématiques liées à l’alimentation.',
    to: '/sante/prevention',
    icon: Apple,
  },
  {
    title: 'Vaccination',
    text: 'Consulter l’espace dédié au calendrier vaccinal.',
    to: '/sante/vaccination',
    icon: Syringe,
  },
  {
    title: 'Premiers secours',
    text: 'Découvrir les guides en cours de validation.',
    to: '/sante/gestes-qui-sauvent',
    icon: LifeBuoy,
  },
  {
    title: 'Santé familiale',
    text: 'Explorer les ressources concernant la mère et l’enfant.',
    to: '/sante/fiches',
    icon: Baby,
  },
];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const HealthResourceCard: React.FC<{
  resource: HealthResource;
  index: number;
  reducedMotion: boolean;
}> = ({ resource, index, reducedMotion }) => {
  const Icon = resource.icon;

  return (
    <motion.article
      id={resource.id}
      initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.07 }}
      className={`group relative flex h-full scroll-mt-40 flex-col overflow-hidden rounded-[1.75rem] border border-teal-100 bg-white shadow-[0_18px_55px_-34px_rgba(15,118,110,0.48)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_28px_65px_-34px_rgba(15,118,110,0.58)] ${
        resource.featured ? 'sm:min-h-[560px]' : ''
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          resource.featured ? 'aspect-[16/8.5]' : 'aspect-[16/9]'
        }`}
      >
        <img
          src={resource.image}
          alt={resource.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/60 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/90 text-teal-700 shadow-lg backdrop-blur">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>

      <div
        className={`flex flex-1 flex-col ${
          resource.featured ? 'p-7 sm:p-8' : 'p-6 sm:p-7'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3
            style={poppins}
            className={`font-extrabold leading-tight text-[#123f38] ${
              resource.featured ? 'text-2xl sm:text-3xl' : 'text-2xl'
            }`}
          >
            {resource.title}
          </h3>
          <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
            En préparation
          </span>
        </div>
        <p
          className={`mt-4 leading-7 text-slate-600 ${
            resource.featured ? 'text-base sm:text-lg' : 'text-base'
          }`}
        >
          {resource.description}
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          {resource.summary}
        </p>
        <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {resource.countLabel}
        </p>
        <Link
          to={resource.to}
          className={`mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/10 transition-all hover:-translate-y-0.5 ${resource.featured ? 'sm:w-fit' : 'w-full'} ${focusRing}`}
        >
          Explorer
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
};

const SanteHubPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'Espace santé | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const visibleResources = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return HEALTH_RESOURCES;

    const words = normalizedQuery.split(/\s+/).filter(Boolean);
    return HEALTH_RESOURCES.filter((resource) => {
      const searchable = normalize(
        [
          resource.title,
          resource.description,
          resource.summary,
          ...resource.searchTerms,
        ].join(' '),
      );
      return words.every((word) => searchable.includes(word));
    });
  }, [query]);

  const featuredResources = visibleResources.filter(
    (resource) => resource.featured,
  );
  const secondaryResources = visibleResources.filter(
    (resource) => !resource.featured,
  );

  const reveal = (delay = 0) => ({
    initial: reducedMotion ? undefined : { opacity: 0, y: 24 },
    whileInView: reducedMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.55, delay: reducedMotion ? 0 : delay },
  });

  const focusSearch = () => {
    document
      .getElementById('recherche-sante')
      ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    window.setTimeout(() => searchRef.current?.focus(), 350);
  };

  return (
    <div className="overflow-hidden bg-gradient-to-b from-white via-[#f4fbfa] to-white text-slate-900">
      <section className="relative isolate overflow-hidden border-b border-teal-100 bg-gradient-to-br from-[#f8fffd] via-white to-[#eaf8f4]">
        <div
          aria-hidden="true"
          className="absolute -left-36 top-12 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#3fc9a4]/20 blur-3xl"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_.98fr] lg:gap-14 lg:px-8 lg:py-24">
          <motion.div {...reveal()} className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-bold text-teal-800 shadow-sm backdrop-blur">
              <HeartPulse className="h-4 w-4" aria-hidden="true" />
              Santé &amp; Prévention
            </span>
            <h1
              style={poppins}
              className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#123f38] sm:text-5xl lg:text-6xl"
            >
              Bienvenue dans l’{' '}
              <span className="bg-gradient-to-r from-[#178066] to-[#3fc9a4] bg-clip-text text-transparent">
                Espace Santé
              </span>{' '}
              de l’ASFO
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Retrouvez des conseils fiables, des fiches pratiques, des outils
              de prévention et des ressources validées par les professionnels
              de santé de l’ASFO.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('ressources-sante')
                    ?.scrollIntoView({
                      behavior: reducedMotion ? 'auto' : 'smooth',
                    })
                }
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(23,128,102,0.8)] transition-all hover:-translate-y-0.5 ${focusRing}`}
              >
                Explorer les ressources
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link
                to="/services/consultations"
                className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-300 bg-white/80 px-6 py-3 text-sm font-bold text-teal-800 transition-all hover:-translate-y-0.5 hover:bg-teal-50 ${focusRing}`}
              >
                Découvrir nos consultations
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...reveal(0.12)}
            className="relative mx-auto w-full max-w-xl lg:mx-0"
          >
            <div className="grid aspect-[5/4] grid-cols-2 grid-rows-2 gap-3 overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-[0_32px_80px_-36px_rgba(15,118,110,0.55)]">
              {[
                {
                  src: '/sensibilisation-consultation.jpg',
                  alt: 'Consultation médicale ASFO',
                },
                {
                  src: '/sensibilisation.jpg',
                  alt: 'Sensibilisation communautaire ASFO',
                },
                {
                  src: '/vaccination.webp',
                  alt: 'Accompagnement pendant une vaccination',
                },
                {
                  src: '/Nutrition-hygiene-alimentaire.jpg',
                  alt: 'Atelier de prévention autour de la nutrition',
                },
              ].map((image, index) => (
                <div key={image.src} className="relative overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/35 to-transparent" />
                </div>
              ))}
            </div>

            <div className="relative mx-4 -mt-10 rounded-2xl border border-teal-100 bg-white/95 p-5 shadow-xl shadow-teal-900/10 backdrop-blur sm:absolute sm:-bottom-8 sm:left-8 sm:right-8 sm:mx-0">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="grid flex-1 gap-2 text-sm sm:grid-cols-3">
                  <p className="font-extrabold text-[#123f38]">
                    5 espaces santé
                  </p>
                  <p className="font-semibold text-slate-600">
                    Publication après validation
                  </p>
                  <p className="font-semibold text-slate-600">
                    Prévention communautaire
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="recherche-sante"
        className="scroll-mt-36 px-4 pb-8 pt-16 sm:px-6 sm:pt-20 lg:px-8"
      >
        <motion.div {...reveal()} className="mx-auto max-w-5xl">
          <label htmlFor="health-search" className="sr-only">
            Rechercher dans l’espace santé
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-700"
              aria-hidden="true"
            />
            <input
              ref={searchRef}
              id="health-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setQuery('');
              }}
              placeholder="Rechercher une fiche, un conseil ou une question..."
              className="min-h-16 w-full rounded-2xl border border-teal-200 bg-white py-4 pl-14 pr-14 text-base text-slate-800 shadow-[0_18px_50px_-35px_rgba(15,118,110,0.5)] outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  searchRef.current?.focus();
                }}
                aria-label="Réinitialiser la recherche"
                className={`absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 ${focusRing}`}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-semibold text-slate-500">
              Suggestions :
            </span>
            {SEARCH_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  focusSearch();
                }}
                className={`min-h-10 rounded-full border border-teal-100 bg-teal-50/70 px-4 py-2 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-100 ${focusRing}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {visibleResources.length}{' '}
            {visibleResources.length === 1
              ? 'espace trouvé'
              : 'espaces trouvés'}
          </p>
        </motion.div>
      </section>

      <nav
        aria-label="Accès rapide aux ressources santé"
        className="sticky top-[120px] z-40 border-y border-teal-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center justify-center gap-2">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 ${focusRing}`}
                >
                  <Icon className="h-4 w-4 text-teal-700" aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <section
        id="ressources-sante"
        className="scroll-mt-40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Ressources santé
            </span>
            <h2
              style={poppins}
              className="mt-3 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
            >
              Explorez l’espace qui répond à votre besoin
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Les contenus détaillés sont rendus publics uniquement après leur
              rédaction, leur relecture et leur validation.
            </p>
          </motion.div>

          {visibleResources.length > 0 ? (
            <>
              {featuredResources.length > 0 && (
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                  {featuredResources.map((resource, index) => (
                    <HealthResourceCard
                      key={resource.id}
                      resource={resource}
                      index={index}
                      reducedMotion={reducedMotion}
                    />
                  ))}
                </div>
              )}
              {secondaryResources.length > 0 && (
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {secondaryResources.map((resource, index) => (
                    <HealthResourceCard
                      key={resource.id}
                      resource={resource}
                      index={index + featuredResources.length}
                      reducedMotion={reducedMotion}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <motion.div
              {...reveal()}
              className="mt-10 rounded-[2rem] border border-dashed border-teal-200 bg-white/80 px-6 py-12 text-center"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Search className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3
                style={poppins}
                className="mt-5 text-xl font-extrabold text-slate-900"
              >
                Aucun espace ne correspond à cette recherche
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Essayez un autre mot-clé ou affichez à nouveau les cinq espaces
                santé.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className={`mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-teal-200 px-5 py-2.5 text-sm font-bold text-teal-800 hover:bg-teal-50 ${focusRing}`}
              >
                Réinitialiser la recherche
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Notre mission
            </span>
            <h2
              style={poppins}
              className="mt-3 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
            >
              Pourquoi cet espace ?
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PURPOSES.map((purpose, index) => {
              const Icon = purpose.icon;
              return (
                <motion.article
                  key={purpose.title}
                  {...reveal(index * 0.07)}
                  className="rounded-2xl border border-teal-100 bg-white p-6 shadow-[0_14px_40px_-30px_rgba(15,118,110,0.45)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3
                    style={poppins}
                    className="mt-5 text-xl font-extrabold text-slate-900"
                  >
                    {purpose.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {purpose.text}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-teal-100 bg-white p-7 shadow-[0_24px_70px_-45px_rgba(15,118,110,0.5)] sm:p-10 lg:p-12">
          <motion.div {...reveal()} className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Formats disponibles
            </span>
            <h2
              style={poppins}
              className="mt-3 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
            >
              Nos ressources
            </h2>
          </motion.div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {RESOURCE_TYPES.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div key={resource.title} {...reveal(index * 0.06)}>
                  <Link
                    to={resource.to}
                    className={`group flex h-full min-h-44 flex-col rounded-2xl border border-teal-100 bg-[#f8fdfb] p-5 transition-all hover:-translate-y-1 hover:border-teal-200 hover:bg-teal-50 ${focusRing}`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3
                      style={poppins}
                      className="mt-4 text-lg font-extrabold text-slate-900"
                    >
                      {resource.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {resource.text}
                    </p>
                    <ChevronRight className="mt-auto h-5 w-5 self-end text-teal-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          {...reveal()}
          className="mx-auto flex max-w-7xl flex-col items-start gap-5 rounded-[2rem] border border-teal-200 bg-gradient-to-r from-[#eaf8f4] via-white to-[#f6fcfa] p-7 sm:p-9 lg:flex-row lg:items-center"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-900/15">
            <Users className="h-7 w-7" aria-hidden="true" />
          </span>
          <div className="max-w-4xl">
            <h2
              style={poppins}
              className="text-2xl font-extrabold text-[#123f38] sm:text-3xl"
            >
              Des ressources encadrées par les équipes de l’ASFO
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">
              Les contenus de cet espace sont rédigés ou validés par les
              professionnels de santé et les équipes de l’ASFO avant leur
              publication.
            </p>
          </div>
          <Link
            to="/notre-equipe-medicale"
            className={`inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-teal-300 bg-white px-5 py-3 text-sm font-bold text-teal-800 hover:bg-teal-50 lg:ml-auto lg:w-auto ${focusRing}`}
          >
            Notre équipe médicale
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Se repérer facilement
            </span>
            <h2
              style={poppins}
              className="mt-3 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
            >
              Votre parcours dans l’espace santé
            </h2>
          </motion.div>
          <div className="relative mt-12 grid gap-5 lg:grid-cols-5">
            <div
              aria-hidden="true"
              className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-teal-200 lg:block"
            >
              <motion.div
                initial={reducedMotion ? undefined : { scaleX: 0 }}
                whileInView={reducedMotion ? undefined : { scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="h-full origin-left bg-gradient-to-r from-[#3fc9a4] to-[#178066]"
              />
            </div>
            {USER_JOURNEY.map((step, index) => {
              const Icon = step.icon;
              const isAnchor = step.to.startsWith('#');
              const content = (
                <>
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] text-white shadow-lg shadow-teal-900/15">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
                    Étape {index + 1}
                  </span>
                  <h3
                    style={poppins}
                    className="mt-2 text-lg font-extrabold leading-6 text-slate-900"
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.text}
                  </p>
                </>
              );

              return (
                <motion.div key={step.title} {...reveal(index * 0.07)}>
                  {isAnchor ? (
                    <a
                      href={step.to}
                      className={`flex h-full flex-col items-start rounded-2xl border border-teal-100 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-md ${focusRing}`}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      to={step.to}
                      className={`flex h-full flex-col items-start rounded-2xl border border-teal-100 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-md ${focusRing}`}
                    >
                      {content}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal()} className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Thématiques
            </span>
            <h2
              style={poppins}
              className="mt-3 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
            >
              Prévention au quotidien
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {DAILY_PREVENTION.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} {...reveal(index * 0.06)}>
                  <Link
                    to={item.to}
                    className={`group flex h-full min-h-48 flex-col rounded-2xl border border-teal-100 bg-white p-5 shadow-[0_12px_35px_-28px_rgba(15,118,110,0.45)] transition-all hover:-translate-y-1 hover:border-teal-200 ${focusRing}`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3
                      style={poppins}
                      className="mt-4 text-lg font-extrabold text-slate-900"
                    >
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>
                    <ChevronRight className="mt-auto h-5 w-5 self-end text-teal-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          {...reveal()}
          className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-teal-100 bg-gradient-to-r from-[#effaf7] via-white to-[#f8fdfb] p-7 sm:p-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:p-12"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-teal-800 shadow-sm">
              <HelpCircle className="h-4 w-4" />
              Besoin d’une orientation
            </span>
            <h2
              style={poppins}
              className="mt-5 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
            >
              Vous ne trouvez pas votre réponse ?
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              Consultez les questions fréquentes, découvrez les consultations
              de l’ASFO ou contactez notre équipe pour être orienté.
            </p>
          </div>
          <div className="grid gap-3">
            <Link
              to="/services/consultations"
              className={`inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800 ${focusRing}`}
            >
              Voir les consultations
            </Link>
            <Link
              to="/contact"
              className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-200 bg-white px-5 py-3 text-sm font-bold text-teal-800 hover:bg-teal-50 ${focusRing}`}
            >
              Contacter l’ASFO
            </Link>
            <Link
              to="/sante/faq"
              className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-200 bg-white px-5 py-3 text-sm font-bold text-teal-800 hover:bg-teal-50 ${focusRing}`}
            >
              Voir les FAQ
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="px-4 pb-20 pt-10 sm:px-6 sm:pb-24 lg:px-8">
        <motion.div
          {...reveal()}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-teal-100 bg-gradient-to-br from-white via-[#effaf7] to-[#dff5ee] p-7 shadow-[0_24px_70px_-45px_rgba(15,118,110,0.55)] sm:p-10 lg:p-14"
        >
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-300/25 blur-3xl"
          />
          <div className="relative max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-teal-800 shadow-sm">
              <HeartPulse className="h-4 w-4" aria-hidden="true" />
              Santé &amp; prévention
            </span>
            <h2
              style={poppins}
              className="mt-5 text-3xl font-extrabold text-[#123f38] sm:text-4xl"
            >
              Prenez soin de votre santé avec des informations fiables.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg">
              Explorez les ressources de l’ASFO et rapprochez-vous d’un
              professionnel de santé lorsque votre situation nécessite un avis
              personnalisé.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/sante/fiches"
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition-all hover:-translate-y-0.5 ${focusRing}`}
              >
                Découvrir les fiches santé
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services/consultations"
                className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-300 bg-white/90 px-6 py-3 text-sm font-bold text-teal-800 hover:bg-white ${focusRing}`}
              >
                Voir les consultations
              </Link>
              <Link
                to="/contact"
                className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-300 bg-transparent px-6 py-3 text-sm font-bold text-teal-800 hover:bg-white/70 ${focusRing}`}
              >
                Contacter l’ASFO
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default SanteHubPage;
