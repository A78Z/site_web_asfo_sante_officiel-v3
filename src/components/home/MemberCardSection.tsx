import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CreditCard, QrCode, ShieldCheck, Stethoscope } from 'lucide-react';
import MemberCard from '../admin/MemberCard';
import MemberCardVerso from '../admin/MemberCardVerso';

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
    desc: 'Vérification instantanée de l\'authenticité par scan du QR code.',
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
];

const cardFade = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

const MemberCardSection: React.FC = () => {
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
    <section
      className="relative overflow-hidden py-24 sm:py-32"
      style={{
        background:
          'radial-gradient(ellipse at 20% 50%, rgba(26,107,138,0.05) 0%, transparent 50%), ' +
          'radial-gradient(ellipse at 80% 50%, rgba(13,148,136,0.04) 0%, transparent 50%), ' +
          '#f8fafb',
      }}
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-700">
            Carte membre
          </span>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Votre Carte Membre{' '}
            <span className="text-teal-600">100% Numérique</span>
          </h2>

          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-teal-500" />

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Rejoignez l'ASFO et recevez votre carte de membre professionnelle
            numérique. Identité vérifiable, QR code sécurisé, valable 2 ans.
          </p>
        </motion.div>

        {/* ─── Card 3D ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 flex flex-col items-center"
        >
          <div
            style={{ perspective: '1200px', width: '428px', height: '270px', cursor: 'pointer' }}
            onClick={flipCard}
            className="mx-auto max-w-full"
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.7s ease',
                transform: cardFace === 'verso' ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Recto */}
              <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }}>
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
              <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <MemberCardVerso
                  name={DEMO_MEMBER.name}
                  memberId={DEMO_MEMBER.memberId}
                  createdAt={DEMO_MEMBER.createdAt}
                />
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-400 select-none">
            Cliquez sur la carte pour voir le {cardFace === 'recto' ? 'verso' : 'recto'}
          </p>
        </motion.div>

        {/* ─── Features grid ─── */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                custom={i}
                variants={cardFade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-gray-900">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── CTA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 flex justify-center"
        >
          <Link
            to="/member-card"
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-teal-700 hover:shadow-lg active:scale-[0.98]"
          >
            Devenir Membre ASFO
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MemberCardSection;
