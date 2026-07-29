import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  BookOpen,
  CheckCircle2,
  Droplets,
  GraduationCap,
  HandHeart,
  HeartPulse,
  LifeBuoy,
  MessageCircle,
  PhoneCall,
  Presentation,
  ShieldCheck,
  Siren,
  Users,
  Wind,
} from 'lucide-react';
import {
  FIRST_AID_GUIDES,
  type FirstAidGuide,
  type FirstAidGuideIcon,
} from '../data/firstAidGuides';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const GUIDE_ICONS: Record<FirstAidGuideIcon, React.ElementType> = {
  recovery: LifeBuoy,
  bleeding: Droplets,
  choking: Wind,
};

const QUICK_LINKS = [
  { href: '#position-laterale-securite', label: 'Position latérale de sécurité' },
  { href: '#hemorragies-plaies', label: 'Hémorragies & plaies' },
  { href: '#etouffement', label: 'Étouffement' },
  { href: '#alerter-les-secours', label: 'Alerter les secours' },
  { href: '#formations', label: 'Formations de premiers secours' },
];

const PAS_STEPS = [
  {
    letter: 'P',
    title: 'Protéger',
    text: 'Éviter un danger supplémentaire.',
    icon: ShieldCheck,
  },
  {
    letter: 'A',
    title: 'Alerter',
    text: 'Contacter les secours et transmettre les informations utiles.',
    icon: PhoneCall,
  },
  {
    letter: 'S',
    title: 'Secourir',
    text: 'Appliquer uniquement les gestes adaptés et maîtrisés.',
    icon: HandHeart,
  },
];

const THINGS_TO_AVOID = [
  'Agir dans la panique',
  'Déplacer inutilement une victime',
  'Donner à boire ou à manger sans indication',
  'Appliquer un geste non maîtrisé',
  'Retarder l’appel aux secours',
];

const TRAINING_FORMATS = [
  {
    title: 'Sensibilisation grand public',
    text: 'Des temps d’information accessibles pour développer une culture commune de prévention.',
    icon: Presentation,
  },
  {
    title: 'Formation pratique',
    text: 'Des ateliers encadrés pour apprendre par la démonstration et la mise en situation.',
    icon: GraduationCap,
  },
  {
    title: 'Initiation des bénévoles',
    text: 'Des briefings techniques intégrés à la préparation des missions de terrain.',
    icon: Users,
  },
  {
    title: 'Ateliers communautaires',
    text: 'Des actions adaptées aux relais et acteurs de santé au plus près des populations.',
    icon: HeartPulse,
  },
];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600';

const GuideCard: React.FC<{
  guide: FirstAidGuide;
  index: number;
  reducedMotion: boolean;
}> = ({ guide, index, reducedMotion }) => {
  const Icon = GUIDE_ICONS[guide.icon];

  return (
    <motion.article
      id={guide.slug}
      initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.08 }}
      className="group relative flex scroll-mt-40 flex-col overflow-hidden rounded-2xl border border-teal-100/80 bg-white p-6 shadow-[0_16px_45px_-30px_rgba(15,118,110,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_24px_55px_-28px_rgba(15,118,110,0.5)] sm:p-7"
    >
      <div
        aria-hidden="true"
        className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-teal-100/50 blur-3xl transition-colors duration-300 group-hover:bg-teal-200/60"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700 ring-1 ring-teal-200/70">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          En préparation
        </span>
      </div>

      <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
        {guide.category}
      </p>
      <h2 style={poppins} className="relative mt-2 text-2xl font-extrabold leading-tight text-slate-900">
        {guide.title}
      </h2>
      <p className="relative mt-3 text-base leading-7 text-slate-600">{guide.description}</p>

      <div className="relative my-6 h-px bg-gradient-to-r from-teal-200 via-teal-100 to-transparent" />

      <p className="relative text-sm font-bold text-slate-800">Objectifs pédagogiques</p>
      <ul className="relative mt-3 space-y-3">
        {guide.objectives.map((objective) => (
          <li key={objective} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
            <span>{objective}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
        <p className="text-sm leading-6 text-slate-600">
          Ce guide sera publié après rédaction et validation par des professionnels formés aux premiers secours.
        </p>
      </div>

      <div className="relative mt-auto grid gap-2.5 pt-6">
        <button
          type="button"
          disabled
          className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500"
        >
          Bientôt disponible
        </button>
        <Link
          to="/news"
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-3 text-center text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 ${focusRing}`}
        >
          Être informé de sa publication
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
};

const GestesQuiSauventPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);

  useEffect(() => {
    document.title = 'Gestes qui sauvent | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  const reveal = (delay = 0) => ({
    initial: reducedMotion ? undefined : { opacity: 0, y: 24 },
    whileInView: reducedMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.55, delay: reducedMotion ? 0 : delay },
  });

  return (
    <div className="overflow-hidden bg-gradient-to-b from-white via-[#f4fbfa] to-white text-slate-900">
      <section className="relative isolate overflow-hidden border-b border-teal-100 bg-gradient-to-br from-[#f8fffd] via-white to-[#eaf8f4]">
        <div aria-hidden="true" className="absolute -left-36 top-12 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#3fc9a4]/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-8 lg:py-24">
          <motion.div {...reveal(0)} className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-bold text-teal-800 shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Santé &amp; Prévention
            </span>
            <h1
              style={poppins}
              className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#123f38] sm:text-5xl lg:text-6xl"
            >
              Les bons réflexes peuvent{' '}
              <span className="bg-gradient-to-r from-[#178066] to-[#3fc9a4] bg-clip-text text-transparent">
                sauver une vie
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Découvrez les gestes essentiels à connaître face à une urgence, en attendant l’arrivée des secours.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#guides"
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(23,128,102,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-14px_rgba(23,128,102,0.9)] ${focusRing}`}
              >
                Explorer les gestes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                to="/services/training"
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-teal-300 bg-white/80 px-6 py-3 text-sm font-bold text-teal-800 transition-all hover:-translate-y-0.5 hover:bg-teal-50 ${focusRing}`}
              >
                Voir nos formations
              </Link>
            </div>
          </motion.div>

          <motion.div {...reveal(0.12)} className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="relative overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-[0_32px_80px_-36px_rgba(15,118,110,0.55)]">
              <img
                src="/ateliers-formation-pratique.jpg"
                alt="Démonstration pratique encadrée lors d’une formation ASFO"
                className="aspect-[4/4.3] w-full object-cover object-center sm:aspect-[4/3.5] lg:aspect-[4/4.1]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123f38]/55 via-transparent to-white/5" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/25 bg-[#123f38]/75 p-4 text-white backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-100">Apprendre en pratique</p>
                <p className="mt-1 text-sm leading-6 text-white/90">
                  Des démonstrations encadrées par des professionnels qualifiés.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:absolute sm:-left-8 sm:-right-8 sm:-top-5 sm:mt-0 sm:grid-cols-2 sm:justify-between sm:gap-y-[21rem] lg:-left-10 lg:-right-6">
              {[
                { label: 'Protéger', icon: ShieldCheck },
                { label: 'Alerter', icon: Siren },
                { label: 'Secourir', icon: HandHeart },
                { label: 'Rassurer', icon: HeartPulse },
              ].map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex min-h-12 items-center gap-2 rounded-xl border border-teal-100 bg-white/95 px-3.5 py-3 text-sm font-bold text-[#123f38] shadow-lg shadow-teal-900/10 backdrop-blur"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 -mt-1 px-4 sm:px-6 lg:px-8">
        <motion.div
          {...reveal(0.05)}
          className="mx-auto mt-8 flex max-w-7xl items-start gap-4 rounded-2xl border border-red-200/80 bg-gradient-to-r from-red-50 to-amber-50/60 p-5 shadow-sm sm:p-6"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm ring-1 ring-red-100">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 style={poppins} className="text-lg font-extrabold text-slate-900">
              Ces contenus ne remplacent pas une formation pratique
            </h2>
            <p className="mt-2 max-w-5xl text-sm leading-7 text-slate-700 sm:text-base">
              En situation d’urgence, alertez immédiatement les services de secours et suivez leurs consignes. Les
              gestes présentés sur ce site doivent être validés par des professionnels qualifiés.
            </p>
          </div>
        </motion.div>
      </section>

      <nav aria-label="Navigation rapide des gestes qui sauvent" className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-x-auto rounded-2xl border border-teal-100 bg-white/90 p-2 shadow-sm backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-1">
            <span className="px-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Accès rapide</span>
            {QUICK_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`inline-flex min-h-11 items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-800 ${focusRing}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section id="guides" className="scroll-mt-36 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Bibliothèque pédagogique</span>
            <h2 style={poppins} className="mt-3 text-3xl font-extrabold tracking-tight text-[#123f38] sm:text-4xl">
              Comprendre avant d’agir
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Chaque guide suit un processus de rédaction, de relecture et de validation. Aucun geste détaillé n’est
              publié avant l’accord de professionnels qualifiés.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FIRST_AID_GUIDES.map((guide, index) => (
              <GuideCard key={guide.slug} guide={guide} index={index} reducedMotion={reducedMotion} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-teal-100 bg-white p-6 shadow-[0_24px_70px_-45px_rgba(15,118,110,0.5)] sm:p-10 lg:p-12">
          <motion.div {...reveal()} className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Une méthode simple à retenir</span>
            <h2 style={poppins} className="mt-3 text-3xl font-extrabold text-[#123f38] sm:text-4xl">
              La méthode P.A.S.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Trois principes généraux pour garder un cadre clair face à une situation d’urgence.
            </p>
          </motion.div>

          <div className="relative mt-10 grid gap-6 lg:grid-cols-3">
            <div aria-hidden="true" className="absolute left-[16.5%] right-[16.5%] top-10 hidden h-px bg-teal-200 lg:block">
              <motion.div
                initial={reducedMotion ? undefined : { scaleX: 0 }}
                whileInView={reducedMotion ? undefined : { scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="h-full origin-left bg-gradient-to-r from-[#3fc9a4] to-[#178066]"
              />
            </div>
            {PAS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.letter}
                  {...reveal(index * 0.1)}
                  className="relative rounded-2xl border border-teal-100 bg-[#f8fdfb] p-6"
                >
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] text-3xl font-black text-white shadow-lg shadow-teal-900/15">
                    {step.letter}
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
                    <h3 style={poppins} className="text-xl font-extrabold text-slate-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-base leading-7 text-slate-600">{step.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-red-600">Rester prudent</span>
            <h2 style={poppins} className="mt-3 text-3xl font-extrabold text-[#123f38] sm:text-4xl">
              Ce qu’il faut éviter
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Ces repères généraux ne remplacent ni l’évaluation des secours ni l’apprentissage auprès d’un formateur.
            </p>
          </motion.div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {THINGS_TO_AVOID.map((item, index) => (
              <motion.div
                key={item}
                {...reveal(index * 0.06)}
                className="flex min-h-32 flex-col items-start rounded-2xl border border-red-100 bg-red-50/55 p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                  <Ban className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-bold leading-6 text-slate-800">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="alerter-les-secours" className="scroll-mt-36 px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          {...reveal()}
          className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] border border-teal-200 bg-gradient-to-r from-[#e9f8f4] via-white to-[#f4fbfa] p-7 sm:p-10 lg:flex-row lg:items-center"
        >
          <div className="flex max-w-4xl items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-900/15">
              <PhoneCall className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 style={poppins} className="text-2xl font-extrabold text-[#123f38] sm:text-3xl">
                Quand appeler les secours ?
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Face à une situation grave, inhabituelle ou potentiellement dangereuse, contactez immédiatement les
                services de secours et suivez leurs instructions.
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className={`inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl border border-teal-300 bg-white px-5 py-3 text-sm font-bold text-teal-800 transition-colors hover:bg-teal-50 lg:w-auto ${focusRing}`}
          >
            Contacter l’ASFO
          </Link>
        </motion.div>
      </section>

      <section id="formations" className="scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal()} className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Apprendre par la pratique</span>
            <h2 style={poppins} className="mt-3 text-3xl font-extrabold text-[#123f38] sm:text-4xl">
              Apprendre les gestes qui sauvent avec l’ASFO
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              La maîtrise des premiers secours s’acquiert par la pratique, l’encadrement et la répétition des gestes.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TRAINING_FORMATS.map((format, index) => {
              const Icon = format.icon;
              return (
                <motion.article
                  key={format.title}
                  {...reveal(index * 0.07)}
                  className="rounded-2xl border border-teal-100 bg-white p-6 shadow-[0_14px_40px_-30px_rgba(15,118,110,0.45)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 style={poppins} className="mt-5 text-lg font-extrabold text-slate-900">
                    {format.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{format.text}</p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/services/training"
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-800 ${focusRing}`}
            >
              Découvrir les formations
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-300 bg-white px-6 py-3 text-sm font-bold text-teal-800 transition-colors hover:bg-teal-50 ${focusRing}`}
            >
              Contacter l’ASFO
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-10 sm:px-6 sm:pb-24 lg:px-8">
        <motion.div
          {...reveal()}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-teal-100 bg-gradient-to-br from-white via-[#effaf7] to-[#dff5ee] p-7 shadow-[0_24px_70px_-45px_rgba(15,118,110,0.55)] sm:p-10 lg:p-14"
        >
          <div aria-hidden="true" className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-300/25 blur-3xl" />
          <div className="relative max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-teal-800 shadow-sm">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Formation &amp; engagement
            </span>
            <h2 style={poppins} className="mt-5 text-3xl font-extrabold text-[#123f38] sm:text-4xl">
              Se former aujourd’hui peut faire la différence demain.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg">
              Découvrez les formations de l’ASFO et apprenez les gestes essentiels auprès de professionnels qualifiés.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/services/training"
                className={`inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition-all hover:-translate-y-0.5 ${focusRing}`}
              >
                Voir les formations
              </Link>
              <Link
                to="/contact"
                className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-teal-300 bg-white/90 px-6 py-3 text-sm font-bold text-teal-800 transition-colors hover:bg-white ${focusRing}`}
              >
                Contacter l’ASFO
              </Link>
              <Link
                to="/join"
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-teal-300 bg-transparent px-6 py-3 text-sm font-bold text-teal-800 transition-colors hover:bg-white/70 ${focusRing}`}
              >
                Devenir bénévole
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default GestesQuiSauventPage;
