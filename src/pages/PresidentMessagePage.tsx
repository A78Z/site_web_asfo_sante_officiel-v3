import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Quote,
  Heart,
  Users,
  Target,
  HeartHandshake,
  Landmark,
  BadgeCheck,
  Stethoscope,
  CalendarDays,
  Award,
  Handshake,
  Sparkles,
} from 'lucide-react';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const PRESIDENT = {
  name: 'Dr Abdaramani Ndiaye',
  role: '21e Président de l’ASFO',
  photo: '/images/president-asfo.jpg',
};

const PRIORITIES = [
  { icon: Stethoscope, label: 'Accès aux soins' },
  { icon: Users, label: 'Engagement communautaire' },
  { icon: Handshake, label: 'Renforcement des partenariats' },
  { icon: Sparkles, label: 'Mobilisation de la jeunesse' },
];

const LANDMARKS = [
  { icon: BadgeCheck, label: '21e Président' },
  { icon: CalendarDays, label: 'ASFO fondée en 2000' },
  { icon: Award, label: '25+ années d’engagement' },
];

const PresidentMessagePage: React.FC = () => {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = 'Le mot du Président | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-[#f6fbf9] to-white">
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden pb-16 pt-14 sm:pt-20 lg:pb-24">
        <div className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-44 top-64 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[42%] top-8 hidden h-28 w-28 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-10">
          {/* Texte */}
          <div>
            <motion.span
              {...fadeUp(0)}
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm"
              style={poppins}
            >
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              Message du Président de l’ASFO
            </motion.span>

            <motion.h1
              {...fadeUp(0.08)}
              className="mt-6 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl xl:text-6xl"
              style={poppins}
            >
              Le mot du{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
                Président
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8">
              Une vision d’engagement, de solidarité et de santé pour tous.
            </motion.p>

            <motion.div {...fadeUp(0.22)} className="mt-6 flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-700" style={poppins}>
                21e Présidence de l’ASFO
              </p>
            </motion.div>
          </div>

          {/* Photo */}
          <motion.div {...fadeUp(0.15)} className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="group relative overflow-hidden rounded-[2rem] border-[6px] border-white bg-white shadow-[0_30px_70px_-30px_rgba(18,63,56,0.45)]">
              <div className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-teal-200/30 via-transparent to-teal-100/30" aria-hidden="true" />
              <img
                src={PRESIDENT.photo}
                alt={`${PRESIDENT.name} — ${PRESIDENT.role}`}
                className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b2824]/85 via-[#0b2824]/30 to-transparent p-6 pt-16">
                <p className="text-lg font-bold text-white" style={poppins}>{PRESIDENT.name}</p>
                <p className="text-sm font-medium text-teal-200">{PRESIDENT.role}</p>
              </div>
            </div>
            <motion.span
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-3 top-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[0_12px_30px_-10px_rgba(23,128,102,0.7)] sm:-right-5"
              style={poppins}
            >
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Président actuel
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ CARTE D'IDENTITÉ ════════════════ */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div
            {...fadeUp(0)}
            className="flex flex-col items-center gap-6 rounded-3xl border border-white/80 bg-white/80 p-7 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:flex-row sm:gap-8 sm:p-8"
          >
            <img
              src={PRESIDENT.photo}
              alt=""
              className="h-24 w-24 flex-none rounded-full border-4 border-white object-cover object-top shadow-lg ring-4 ring-teal-100"
            />
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h2 className="text-2xl font-extrabold text-gray-900" style={poppins}>{PRESIDENT.name}</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700" style={poppins}>
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Président actuel
                </span>
              </div>
              <p className="mt-1 text-base font-semibold text-teal-700">{PRESIDENT.role}</p>
              <p className="mt-1.5 text-sm text-gray-600">Au service de la santé et des communautés</p>
            </div>
            <span className="hidden h-14 w-14 flex-none items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 sm:flex">
              <Landmark className="h-6 w-6 text-teal-600" aria-hidden="true" />
            </span>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ MESSAGE ════════════════ */}
      <section className="relative pb-20">
        <div className="pointer-events-none absolute -left-44 top-40 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-6 sm:px-8 lg:grid-cols-[1.6fr_1fr] lg:gap-14 lg:px-10">
          {/* Colonne principale — le message */}
          <motion.div {...fadeUp(0.05)} className="relative min-w-0 self-start">
            <Quote className="pointer-events-none absolute -left-3 -top-8 h-20 w-20 -scale-x-100 text-teal-100 sm:-left-8 sm:h-28 sm:w-28" aria-hidden="true" />

            <div className="relative space-y-7 text-base leading-8 text-gray-700 sm:text-lg sm:leading-9">
              {/* Introduction */}
              <div className="flex items-start gap-4 rounded-2xl border-l-4 border-teal-500 bg-teal-50/60 p-6 sm:p-7">
                <span className="mt-0.5 hidden h-9 w-9 flex-none items-center justify-center rounded-xl bg-white shadow-sm sm:flex">
                  <Heart className="h-4 w-4 text-teal-600" aria-hidden="true" />
                </span>
                <p className="font-semibold text-gray-900">
                  Bienvenue au portail web de l'Action Sanitaire pour le Fouta (ASFO).
                </p>
              </div>

              <p>
                Ce site incarne une nouvelle étape dans notre volonté de rendre l'ASFO plus
                accessible, plus visible et plus proche des populations que nous servons depuis
                plus de deux décennies.
              </p>

              {/* Vision */}
              <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-6 shadow-[0_15px_40px_-28px_rgba(18,63,56,0.3)] sm:p-7">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700" style={poppins}>
                  <Target className="h-4 w-4" aria-hidden="true" />
                  Notre vision
                </p>
                <p>
                  L'ASFO, c'est une <strong className="text-teal-700">jeunesse engagée</strong>, une{' '}
                  <strong className="text-teal-700">chaîne de solidarité intergénérationnelle</strong>, une vision
                  portée par le <strong className="text-teal-700">don de soi</strong>. Depuis sa création en{' '}
                  <strong className="text-gray-900">2000</strong>, notre association n'a cessé de mobiliser des
                  professionnels de la santé et bénévoles autour d'une mission noble :{' '}
                  <strong className="text-gray-900">soigner</strong>, <strong className="text-gray-900">former</strong>,{' '}
                  <strong className="text-gray-900">sensibiliser</strong> et{' '}
                  <strong className="text-gray-900">bâtir un avenir en meilleure santé</strong> pour les zones les
                  plus vulnérables, en particulier le Fouta.
                </p>
              </div>

              {/* Engagement */}
              <div className="rounded-2xl border border-teal-200/70 bg-white/90 p-6 shadow-[0_15px_40px_-28px_rgba(18,63,56,0.3)] sm:p-7">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700" style={poppins}>
                  <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                  Notre engagement
                </p>
                <p>
                  Aujourd'hui, grâce à l'extension de nos sections dans les universités du pays, à
                  la modernisation de nos outils de communication et à notre ambition de devenir
                  une <strong className="text-teal-700">ONG structurée</strong>, nous renforçons notre impact et
                  préparons l'avenir avec responsabilité.
                </p>
              </div>

              {/* Appel à la mobilisation */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6 shadow-[0_15px_40px_-28px_rgba(120,80,10,0.2)] sm:p-7">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700" style={poppins}>
                  <Users className="h-4 w-4" aria-hidden="true" />
                  Un espace d'engagement
                </p>
                <p>
                  Ce site est plus qu'une vitrine : il est un{' '}
                  <strong className="text-amber-800">espace de mémoire, de mobilisation, de partage et
                  d'engagement</strong>. Il vous permet de suivre nos actions, de découvrir nos archives,
                  de rejoindre nos équipes ou de nous accompagner comme{' '}
                  <strong className="text-amber-800">partenaire ou mécène</strong>.
                </p>
              </div>

              {/* Citation présidentielle */}
              <figure className="rounded-3xl border border-white/80 bg-gradient-to-b from-white/95 to-teal-50/60 p-8 text-center shadow-[0_20px_50px_-28px_rgba(18,63,56,0.35)] sm:p-10">
                <span className="text-5xl font-extrabold leading-none text-teal-500/50 sm:text-6xl" style={poppins} aria-hidden="true">
                  «&nbsp;»
                </span>
                <blockquote className="mt-3 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-8" style={poppins}>
                  Merci à tous ceux qui, de près ou de loin, soutiennent l'ASFO. C'est ensemble
                  que nous continuerons à faire la différence.
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-center gap-3">
                  <img src={PRESIDENT.photo} alt="" className="h-11 w-11 rounded-full border-2 border-white object-cover object-top shadow-md ring-2 ring-teal-100" />
                  <span className="text-left">
                    <span className="block text-sm font-bold text-gray-900" style={poppins}>{PRESIDENT.name}</span>
                    <span className="block text-xs font-semibold text-teal-700">{PRESIDENT.role}</span>
                  </span>
                </figcaption>
              </figure>

              {/* Signature */}
              <div className="flex flex-col items-end border-t border-teal-100 pt-8">
                <p className="text-xl font-bold italic text-gray-900" style={poppins}>{PRESIDENT.name}</p>
                <p className="mt-0.5 text-sm font-semibold text-teal-700">{PRESIDENT.role}</p>
                <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
              </div>
            </div>
          </motion.div>

          {/* Colonne latérale */}
          <aside className="min-w-0 space-y-6 self-start">
            <motion.div
              {...fadeUp(0.12)}
              className="rounded-3xl border border-white/80 bg-white/80 p-7 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm"
            >
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700" style={poppins}>
                Priorités de la Présidence
              </h3>
              <ul className="mt-5 space-y-3.5">
                {PRIORITIES.map((p) => (
                  <li key={p.label} className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                      <p.icon className="h-4 w-4 text-teal-600" aria-hidden="true" />
                    </span>
                    <span className="text-[15px] font-semibold text-gray-800" style={poppins}>{p.label}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp(0.18)}
              className="rounded-3xl border border-white/80 bg-white/80 p-7 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm"
            >
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700" style={poppins}>
                Repères
              </h3>
              <ul className="mt-5 space-y-3">
                {LANDMARKS.map((l) => (
                  <li key={l.label} className="flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-3">
                    <l.icon className="h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
                    <span className="text-sm font-semibold text-gray-800" style={poppins}>{l.label}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </aside>
        </div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div
            {...fadeUp(0)}
            className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/90 to-teal-50/60 p-10 text-center shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-14"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl" style={poppins}>
              Transformons ensemble cet engagement en{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
                actions concrètes
              </span>
              .
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Rejoignez les bénévoles, partenaires et donateurs qui accompagnent les missions de l'ASFO.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link
                to="/join"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Users className="h-5 w-5" aria-hidden="true" />
                Devenir bénévole
              </Link>
              <Link
                to="/donate"
                className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Heart className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Faire un don
              </Link>
              <Link
                to="/about/partenaires"
                className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70"
                style={poppins}
              >
                <Handshake className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Devenir partenaire
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PresidentMessagePage;
