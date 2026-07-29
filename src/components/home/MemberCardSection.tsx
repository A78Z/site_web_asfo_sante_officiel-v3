import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  CreditCard,
  QrCode,
  ShieldCheck,
  Stethoscope,
  Lock,
  Globe,
  Zap,
  Leaf,
  Wallet,
  FileText,
  Nfc,
  Cpu,
  Quote,
} from 'lucide-react';
import MemberCard from '../admin/MemberCard';
import MemberCardVerso from '../admin/MemberCardVerso';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const DEMO_MEMBER = {
  name: 'Mamadou A. DIALLO',
  role: 'Médecin',
  phone: '+221 7X XXX XX XX',
  city: 'Dakar, Sénégal',
  memberId: 'ASFO-MED-2026-001',
  email: 'membre@asfo.org',
  createdAt: '2026-01-15T00:00:00.000Z',
};

const features = [
  {
    icon: CreditCard,
    title: 'Identité Numérique',
    desc: 'Carte professionnelle officielle avec photo et informations vérifiées.',
  },
  {
    icon: QrCode,
    title: 'QR Code Sécurisé',
    desc: "Vérification instantanée de l'authenticité par scan du QR code.",
  },
  {
    icon: ShieldCheck,
    title: 'Validité 2 Ans',
    desc: 'Carte valable deux ans à partir de la date de création.',
  },
  {
    icon: Stethoscope,
    title: 'Multi-Professions',
    desc: 'Médecins, infirmiers, pharmaciens, bénévoles et autres professionnels.',
  },
  {
    icon: Lock,
    title: 'Données sécurisées',
    desc: 'Toutes les informations sont protégées et vérifiées.',
  },
  {
    icon: Globe,
    title: 'Accessible partout',
    desc: 'Votre carte est disponible sur smartphone à tout moment.',
  },
];

const whyDigital = [
  { icon: Zap, title: 'Instantanée', desc: 'Disponible immédiatement après validation de votre adhésion.' },
  { icon: ShieldCheck, title: 'Sécurisée', desc: 'QR Code unique et vérifiable en un scan sur le terrain.' },
  { icon: Leaf, title: 'Écologique', desc: 'Aucune carte plastique. Une démarche responsable.' },
];

const steps = [
  "Demande d'adhésion",
  'Validation du dossier',
  'Création automatique de la carte',
  'Réception immédiate',
  'Accès aux avantages ASFO',
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const MemberCardSection: React.FC = () => {
  const reduce = useReducedMotion();
  const [cardFace, setCardFace] = useState<'recto' | 'verso'>('recto');

  const flipCard = useCallback(() => {
    setCardFace((prev) => (prev === 'recto' ? 'verso' : 'recto'));
  }, []);

  // Auto-flip every 5 seconds
  useEffect(() => {
    const interval = setInterval(flipCard, 5000);
    return () => clearInterval(interval);
  }, [flipCard]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafb] via-[#f3faf7] to-white py-24 sm:py-32">
      {/* ─── Fond : halos, ondes, trame numérique ─── */}
      <div className="pointer-events-none absolute -left-40 top-24 h-[460px] w-[460px] rounded-full bg-teal-100/40 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-32 h-[420px] w-[420px] rounded-full bg-[#1a6b8a]/10 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[8%] bottom-24 hidden h-28 w-28 rounded-full border border-teal-200/50 lg:block" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[10%] top-40 hidden h-16 w-16 rounded-full border border-teal-200/40 lg:block" aria-hidden="true" />
      <svg className="pointer-events-none absolute right-[4%] top-24 hidden h-36 w-36 text-teal-300/20 lg:block" aria-hidden="true">
        <defs>
          <pattern id="asfo-dots-card" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asfo-dots-card)" />
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
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              Carte membre
            </motion.span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.08)}
            style={poppins}
            className="mt-7 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          >
            Votre Carte Membre{' '}
            <span className="whitespace-nowrap bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">
              100% Numérique
            </span>
          </motion.h2>

          <motion.div {...fadeUp(0.14)} className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-teal-500 to-teal-300" aria-hidden="true" />

          <motion.p
            {...fadeUp(0.18)}
            className="mx-auto mt-7 max-w-[680px] text-lg leading-loose text-gray-600"
          >
            Rejoignez l'ASFO et recevez votre carte de membre professionnelle numérique. Identité
            vérifiable, QR code sécurisé, valable 2 ans.
          </motion.p>
        </div>

        {/* ─── Carte 3D — la star de la section ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-16 flex flex-col items-center"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative scale-[0.78] sm:scale-100 lg:scale-110"
          >
            {/* Halo lumineux */}
            <div className="pointer-events-none absolute -inset-10 rounded-[40px] bg-gradient-to-br from-teal-300/30 via-[#1a6b8a]/15 to-teal-400/25 blur-3xl" aria-hidden="true" />

            <motion.div
              whileHover={reduce ? undefined : { rotateY: 5, rotateX: -3, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              style={{ perspective: '1200px', width: '428px', height: '270px', cursor: 'pointer' }}
              onClick={flipCard}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  flipCard();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Carte membre de démonstration — afficher le ${cardFace === 'recto' ? 'verso' : 'recto'}`}
              className="group relative mx-auto rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
            >
              {/* Bordure lumineuse discrète */}
              <div className="pointer-events-none absolute -inset-[3px] rounded-[18px] bg-gradient-to-br from-teal-300/60 via-white/30 to-[#1a6b8a]/40 opacity-70 blur-[2px] transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.7s ease',
                  transform: cardFace === 'verso' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
                className="rounded-2xl shadow-[0_35px_70px_-20px_rgba(18,63,56,0.5)]"
              >
                {/* Recto */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    // la face inactive est masquée à mi-rotation : un enfant en z-index
                    // échappe sinon au backface-visibility (bug de rendu Chrome)
                    opacity: cardFace === 'recto' ? 1 : 0,
                    transition: 'opacity 0s linear 0.35s',
                  }}
                >
                  <MemberCard
                    name={DEMO_MEMBER.name}
                    role={DEMO_MEMBER.role}
                    phone={DEMO_MEMBER.phone}
                    city={DEMO_MEMBER.city}
                    memberId={DEMO_MEMBER.memberId}
                    email={DEMO_MEMBER.email}
                    createdAt={DEMO_MEMBER.createdAt}
                  />
                </div>
                {/* Verso */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    opacity: cardFace === 'verso' ? 1 : 0,
                    transition: 'opacity 0s linear 0.35s',
                  }}
                >
                  <MemberCardVerso
                    name={DEMO_MEMBER.name}
                    memberId={DEMO_MEMBER.memberId}
                    createdAt={DEMO_MEMBER.createdAt}
                  />
                </div>

                {/* Reflet qui traverse la carte au survol */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true">
                  <div className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[300%]" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <p className="mt-6 select-none text-sm text-gray-400 lg:mt-9">
            Cliquez sur la carte pour voir le {cardFace === 'recto' ? 'verso' : 'recto'}
          </p>

          {/* Attributs sécurité de la carte */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {[
              { icon: Cpu, label: 'Puce sécurisée' },
              { icon: Nfc, label: 'Compatible NFC' },
              { icon: QrCode, label: 'QR vérifiable' },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-gray-600 shadow-sm backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                  {c.label}
                </span>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/member-card"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#123f38] to-[#1f6f60] px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-10px_rgba(18,63,56,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-10px_rgba(18,63,56,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 active:scale-[0.98] sm:w-auto"
            >
              <Wallet className="h-4 w-4" aria-hidden="true" />
              Ajouter à Wallet
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/member-card"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-teal-300/70 bg-white/80 px-7 py-3.5 text-sm font-semibold text-teal-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98] sm:w-auto"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Voir les informations
            </Link>
          </div>
        </motion.div>

        {/* ─── Avantages (6 cartes) ─── */}
        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.07)}
                className="group rounded-2xl border border-white/80 bg-white/80 p-6 text-center shadow-[0_12px_32px_-14px_rgba(18,63,56,0.18)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_22px_45px_-14px_rgba(18,63,56,0.28)]"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-[#e8f3ef] text-teal-600 ring-1 ring-teal-100 transition-all duration-300 group-hover:scale-110 group-hover:from-[#2fb391] group-hover:to-[#178066] group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 style={poppins} className="mt-4 text-base font-bold text-gray-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Pourquoi la carte numérique ─── */}
        <motion.h3
          {...fadeUp(0)}
          style={poppins}
          className="mt-24 text-center text-xl font-bold text-gray-900 sm:text-2xl"
        >
          Pourquoi choisir la carte numérique ASFO&nbsp;?
        </motion.h3>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3">
          {whyDigital.map((w, i) => {
            const Icon = w.icon;
            return (
              <motion.div
                key={w.title}
                {...fadeUp(0.1 + i * 0.1)}
                className="group relative overflow-hidden rounded-3xl border border-teal-100/80 bg-gradient-to-br from-white to-[#f0f9f6] p-8 text-center shadow-[0_15px_38px_-18px_rgba(18,63,56,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_52px_-18px_rgba(18,63,56,0.35)]"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal-100/40 blur-xl" aria-hidden="true" />
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h4 style={poppins} className="relative mt-5 text-lg font-bold text-gray-900">
                  {w.title}
                </h4>
                <p className="relative mt-2 text-sm leading-relaxed text-gray-500">{w.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Timeline d'obtention ─── */}
        <motion.div {...fadeUp(0.1)} className="mx-auto mt-24 max-w-5xl">
          <h3 style={poppins} className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Comment obtenir votre carte&nbsp;?
          </h3>
          <div className="relative mt-12">
            {/* Ligne horizontale (desktop) */}
            <div className="absolute left-[10%] right-[10%] top-[18px] hidden h-[2px] bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200 md:block" aria-hidden="true" />
            {/* Ligne verticale (mobile) */}
            <div className="absolute bottom-4 left-[18px] top-4 w-[2px] bg-gradient-to-b from-teal-200 via-teal-400 to-teal-200 md:hidden" aria-hidden="true" />

            <ol className="flex flex-col gap-8 md:grid md:grid-cols-5 md:gap-4">
              {steps.map((label, i) => (
                <motion.li
                  key={label}
                  {...fadeUp(0.15 + i * 0.1)}
                  className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-0 md:text-center"
                >
                  <span
                    style={poppins}
                    className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-white text-sm font-extrabold shadow-[0_0_0_2px_rgba(47,179,145,0.5)] ${
                      i === steps.length - 1
                        ? 'bg-gradient-to-br from-[#2fb391] to-[#178066] text-white'
                        : 'bg-white text-teal-700'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <p className="mt-1 text-sm leading-snug text-gray-600 md:mt-4">{label}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* ─── Témoignage ─── */}
        <motion.figure
          {...fadeUp(0.1)}
          className="relative mx-auto mt-24 max-w-3xl overflow-hidden rounded-3xl border border-teal-100/80 bg-gradient-to-br from-[#e8f3ef]/70 to-white px-8 py-10 text-center shadow-[0_18px_45px_-20px_rgba(18,63,56,0.25)] sm:px-14"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-200/25 blur-2xl" aria-hidden="true" />
          <Quote className="mx-auto h-12 w-12 -scale-x-100 text-teal-300/70" aria-hidden="true" />
          <blockquote
            style={poppins}
            className="mt-4 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-relaxed"
          >
            «&nbsp;La carte numérique ASFO simplifie notre identification lors des missions
            médicales et garantit une vérification rapide sur le terrain.&nbsp;»
          </blockquote>
          <figcaption className="mt-5 text-sm font-medium text-teal-700">
            Un professionnel de santé membre de l'ASFO
          </figcaption>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-300" aria-hidden="true" />
        </motion.figure>

        {/* ─── CTA final ─── */}
        <motion.div {...fadeUp(0.15)} className="mt-16 flex justify-center">
          <Link
            to="/member-card"
            className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-4 text-sm font-bold text-white shadow-[0_12px_28px_-8px_rgba(23,128,102,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-8px_rgba(23,128,102,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98]"
          >
            Devenir Membre ASFO
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MemberCardSection;
