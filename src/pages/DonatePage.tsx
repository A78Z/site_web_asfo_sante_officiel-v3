import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Heart,
  CheckCircle2,
  Activity,
  CalendarDays,
  Loader2,
  ShieldCheck,
  Lock,
  ScrollText,
  Stethoscope,
  Pill,
  Megaphone,
  Sprout,
  Users,
  MapPin,
  Handshake,
  Gift,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  Quote,
  ChevronDown,
  HelpCircle,
  FileText,
  Eye,
  Sparkles,
} from 'lucide-react';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

/* Passer à true dès que l'intégration Wave (transaction créée côté serveur) est prête. */
const WAVE_ENABLED = false;

const CONTACT_PHONE = '+221 71 040 17 60';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

/* ------------------------------------------------------------------ */
/* Données (montants et impacts existants, inchangés)                   */
/* ------------------------------------------------------------------ */

const AMOUNTS = [
  { value: 1000, label: '1 000' },
  { value: 2000, label: '2 000' },
  { value: 5000, label: '5 000' },
  { value: 10000, label: '10 000' },
  { value: 25000, label: '25 000' },
  { value: 50000, label: '50 000' },
];

const IMPACT_ITEMS: { value: number; amount: string; description: string; icon: React.ElementType }[] = [
  { value: 1000, amount: '1 000 F', description: 'Permet de fournir des médicaments essentiels à un patient', icon: Pill },
  { value: 5000, amount: '5 000 F', description: 'Finance une consultation médicale complète pour une personne', icon: Stethoscope },
  { value: 10000, amount: '10 000 F', description: "Contribue à l'achat de matériel médical pour les missions", icon: Activity },
  { value: 25000, amount: '25 000 F', description: 'Soutient une journée de sensibilisation dans un village', icon: Megaphone },
  { value: 50000, amount: '50 000 F', description: "Finance la formation d'un agent de santé communautaire", icon: Sprout },
  { value: 100000, amount: '100 000 F', description: "Permet d'organiser une mission médicale d'une journée", icon: Heart },
];

const WHY_DONATE = [
  { icon: Stethoscope, title: 'Financer les missions médicales', text: 'Chaque don finance directement les caravanes et consultations gratuites au Fouta.' },
  { icon: Pill, title: 'Soutenir les médicaments et le matériel', text: "L'achat de médicaments essentiels et d'équipements pour les équipes de terrain." },
  { icon: Megaphone, title: 'Renforcer la prévention et la sensibilisation', text: 'Des campagnes d’éducation sanitaire au plus près des communautés.' },
  { icon: Sprout, title: 'Accompagner durablement les communautés', text: 'Un impact qui se poursuit au-delà des missions, dans la durée.' },
];

const TRUST_PILLARS = [
  { icon: Eye, title: 'Traçabilité', text: "Des rapports d'activité détaillés retracent l'utilisation de chaque contribution." },
  { icon: Lock, title: 'Sécurité', text: 'Le paiement est délégué à Wave : l’ASFO ne collecte aucune donnée bancaire.' },
  { icon: ScrollText, title: 'Redevabilité', text: "Un engagement de transparence envers nos donateurs et les communautés." },
];

const OTHER_WAYS = [
  { icon: MapPin, title: 'Parrainer une mission', text: 'Soutenez une caravane médicale de bout en bout.', to: '/parrainer', cta: 'Parrainer' },
  { icon: Gift, title: 'Don en nature', text: 'Médicaments, matériel médical, équipements.', to: '/contact', cta: 'Nous contacter' },
  { icon: Building2, title: 'Partenariat institutionnel', text: 'Collectivités, entreprises et organisations.', to: '/about/partenaires', cta: 'Devenir partenaire' },
  { icon: Users, title: 'Bénévolat', text: 'Donnez de votre temps et de vos compétences.', to: '/join', cta: 'Devenir bénévole' },
];

const PROOFS = [
  { icon: Users, value: 250000, suffix: '+', label: 'Bénéficiaires' },
  { icon: CalendarDays, value: 25, suffix: '+', label: "Années d'engagement" },
  { icon: MapPin, value: 192, suffix: '+', label: 'Localités sillonnées' },
  { icon: Heart, value: 600, suffix: '+', label: 'Acteurs mobilisés' },
];

const FAQ = [
  { q: 'Comment mon don est-il utilisé ?', a: 'Votre don finance nos missions médicales : 80 % sont directement affectés aux missions, 15 % aux frais de fonctionnement et 5 % à la communication et à la collecte.' },
  { q: 'Le paiement est-il sécurisé ?', a: "Oui. Le paiement est entièrement délégué à Wave, un prestataire de paiement mobile sécurisé. L'ASFO ne collecte ni ne stocke aucune donnée bancaire." },
  { q: 'Puis-je faire un don anonyme ?', a: 'Oui. Les champs nom et téléphone sont facultatifs : vous pouvez donner sans les renseigner.' },
  { q: 'Puis-je recevoir un reçu ?', a: "Un justificatif pourra vous être transmis une fois l'intégration du paiement finalisée. En attendant, contactez l'ASFO pour toute demande." },
  { q: 'Puis-je faire un don en nature ?', a: "Oui. L'ASFO accepte les dons en nature (médicaments, matériel médical). Contactez-nous pour organiser votre don." },
  { q: 'Comment contacter l’ASFO en cas de problème ?', a: `Vous pouvez joindre l'ASFO au ${CONTACT_PHONE} ou via la page Contact du site.` },
];

/* ------------------------------------------------------------------ */
/* Compteur                                                             */
/* ------------------------------------------------------------------ */

const StatCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setDisplay(value); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1600, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  const formatted = value >= 1000 ? `${Math.round(display / 1000)}K` : display.toLocaleString('fr-FR');
  return <span ref={ref}>{formatted}{suffix}</span>;
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const DonatePage: React.FC = () => {
  const reduce = useReducedMotion();
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [loading] = useState(false); // setLoading vit dans le handler Wave (commenté ci-dessous), réactivé avec WAVE_ENABLED
  const [error, setError] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const formRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = 'Faire un don | ASFO - Action Sanitaire pour le Fouta'; }, []);

  const currentAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError('');
  };

  /* Le paiement Wave est créé côté serveur (jamais de clé exposée, montant
     revalidé côté serveur). Réactiver ce flux dès que WAVE_ENABLED = true.
  const handleDonate = async () => {
    if (currentAmount < 100) { setError('Le montant minimum est de 100 FCFA'); return; }
    if (loading) return;
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/wave/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: currentAmount, donorName: donorName || 'Anonyme', donorPhone: donorPhone || null }),
      });
      const data = await response.json();
      if (data.wave_launch_url) window.location.href = data.wave_launch_url;
      else { setError(data.error || 'Erreur lors de la création du paiement'); setLoading(false); }
    } catch { setError('Erreur de connexion. Vérifiez votre internet.'); setLoading(false); }
  }; */

  const scrollTo = (ref: React.RefObject<HTMLElement>) => ref.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  const activeImpact = useMemo(() => IMPACT_ITEMS.find((i) => i.value === currentAmount)?.value ?? null, [currentAmount]);

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
              <Heart className="h-3.5 w-3.5 text-[#e5533d]" aria-hidden="true" />
              Votre générosité sauve des vies
            </motion.span>
            <motion.h1 {...fadeUp(0.08)} className="mt-6 text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl xl:text-6xl" style={poppins}>
              Soutenez les missions de{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">l'ASFO</span>
            </motion.h1>
            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg sm:leading-8">
              Chaque contribution finance les soins, les médicaments, la prévention et les missions
              médicales gratuites au Fouta. Payez rapidement et en toute sécurité via Wave.
            </motion.p>
            <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <button type="button" onClick={() => scrollTo(formRef)} className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Heart className="h-4 w-4" aria-hidden="true" />
                Faire un don maintenant
              </button>
              <button type="button" onClick={() => scrollTo(impactRef)} className="inline-flex items-center justify-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                Découvrir notre impact
              </button>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.15)} className="relative">
            <div className="grid grid-cols-3 grid-rows-3 gap-3.5">
              <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl border border-white/80 shadow-[0_30px_70px_-30px_rgba(18,63,56,0.45)]">
                <img src="/41.webp" alt="Mission médicale de l'ASFO sur le terrain" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="row-span-2 overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src="/medicalteam.webp" alt="Équipe médicale de l'ASFO" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_50px_-25px_rgba(18,63,56,0.4)]">
                <img src="/9.webp" alt="Bénévoles devant l'unité mobile" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            </div>
            <motion.div animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-6 -left-4 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_20px_50px_-20px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:-left-8">
              <div className="flex items-center gap-3.5">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700" style={poppins}><ShieldCheck className="h-4 w-4" aria-hidden="true" />100 % sécurisé</span>
                <span className="h-4 w-px bg-teal-100" aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700" style={poppins}><img src="/wave.webp" alt="" className="h-4 w-4 rounded" />Wave</span>
                <span className="h-4 w-px bg-teal-100" aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700" style={poppins}><Eye className="h-4 w-4" aria-hidden="true" />Traçable</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ FORMULAIRE + CONFIANCE ════════════════ */}
      <section ref={formRef} id="donation-form" className="relative scroll-mt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            {/* Colonne gauche — formulaire */}
            <motion.div {...fadeUp(0)} className="min-w-0 self-start">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>
                Choisissez votre{' '}
                <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">contribution</span>
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
                Sélectionnez un montant et payez en toute sécurité via Wave. 100 % de votre don finance nos missions médicales.
              </p>

              <div className="mt-7 rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] backdrop-blur-sm sm:p-8">
                {/* Montants */}
                <p className="text-sm font-bold text-gray-700" style={poppins}>Montant du don</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Montant du don">
                  {AMOUNTS.map(({ value, label }) => {
                    const active = selectedAmount === value && !customAmount;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => handleAmountClick(value)}
                        className={`relative rounded-2xl py-3.5 text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 ${
                          active
                            ? 'bg-gradient-to-r from-[#2fb391] to-[#178066] text-white shadow-[0_12px_30px_-12px_rgba(23,128,102,0.7)]'
                            : 'border border-teal-100 bg-white text-gray-800 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50'
                        }`}
                        style={poppins}
                      >
                        {active && <CheckCircle2 className="absolute right-2 top-2 h-3.5 w-3.5" aria-hidden="true" />}
                        {label} F
                      </button>
                    );
                  })}
                </div>

                {/* Montant libre */}
                <label htmlFor="customAmount" className="mt-5 block text-sm text-gray-500">Ou saisissez un montant libre</label>
                <div className={`mt-2 flex items-center overflow-hidden rounded-2xl border-2 transition-colors ${customAmount ? 'border-teal-400' : 'border-teal-100'}`}>
                  <input
                    id="customAmount"
                    type="number"
                    inputMode="numeric"
                    min={100}
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value.replace(/[^0-9]/g, '')); setError(''); }}
                    placeholder="Ex : 15000"
                    className="flex-1 bg-white px-4 py-3 text-base text-gray-800 outline-none"
                  />
                  <span className="border-l border-teal-100 bg-teal-50/60 px-4 py-3 text-sm font-bold text-teal-700">FCFA</span>
                </div>

                {/* Coordonnées facultatives */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="donorName" className="mb-1.5 block text-xs font-semibold text-gray-700">Votre nom <span className="font-normal text-gray-400">(facultatif)</span></label>
                    <input id="donorName" type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Nom du donateur" autoComplete="name" className="w-full rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-300/50" />
                  </div>
                  <div>
                    <label htmlFor="donorPhone" className="mb-1.5 block text-xs font-semibold text-gray-700">Téléphone <span className="font-normal text-gray-400">(facultatif)</span></label>
                    <input id="donorPhone" type="tel" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} placeholder="+221 …" autoComplete="tel" className="w-full rounded-xl border border-teal-100 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-300/50" />
                  </div>
                </div>

                {error && (
                  <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800" role="alert">{error}</p>
                )}

                {/* Résumé */}
                <div className="mt-5 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700" style={poppins}>Résumé de votre don</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Votre contribution</span>
                    <strong className="text-2xl font-extrabold text-teal-700" style={poppins}>{currentAmount.toLocaleString('fr-FR')} FCFA</strong>
                  </div>
                  <dl className="mt-3 space-y-1.5 border-t border-teal-100 pt-3 text-[13px]">
                    <div className="flex justify-between"><dt className="text-gray-500">Moyen de paiement</dt><dd className="inline-flex items-center gap-1.5 font-semibold text-gray-800"><img src="/wave.webp" alt="" className="h-3.5 w-3.5 rounded" />Wave</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Type</dt><dd className="font-semibold text-gray-800">Don unique</dd></div>
                    {donorName.trim() && <div className="flex justify-between"><dt className="text-gray-500">Donateur</dt><dd className="font-semibold text-gray-800">{donorName.trim()}</dd></div>}
                    {donorPhone.trim() && <div className="flex justify-between"><dt className="text-gray-500">Téléphone</dt><dd className="font-semibold text-gray-800">{donorPhone.trim()}</dd></div>}
                  </dl>
                  {WAVE_ENABLED && <p className="mt-3 text-[12px] leading-relaxed text-gray-500">Vous serez redirigé vers Wave pour finaliser le paiement en toute sécurité.</p>}
                </div>

                {/* Bouton de paiement */}
                {WAVE_ENABLED ? (
                  <button
                    type="button"
                    /* onClick={handleDonate} */
                    disabled={loading}
                    className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#1B9AD5] to-[#00B4D8] py-4 text-lg font-bold text-white shadow-[0_18px_40px_-15px_rgba(27,154,213,0.6)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 disabled:cursor-not-allowed disabled:opacity-60"
                    style={poppins}
                    aria-busy={loading}
                  >
                    {loading ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />Redirection vers Wave…</> : <><img src="/wave.webp" alt="" className="h-6 w-6 rounded" />Payer {currentAmount.toLocaleString('fr-FR')} FCFA avec Wave</>}
                  </button>
                ) : (
                  <div className="mt-5">
                    <button type="button" disabled aria-disabled="true" aria-describedby="wave-note" className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-gray-100 py-4 text-lg font-bold text-gray-400" style={poppins}>
                      <img src="/wave.webp" alt="" className="h-6 w-6 rounded grayscale" />
                      Paiement Wave bientôt disponible
                    </button>
                    <p id="wave-note" className="mt-3 flex items-start gap-2 rounded-xl border border-teal-100 bg-teal-50/60 p-3 text-[13px] leading-relaxed text-gray-600">
                      <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
                      L'intégration du paiement en ligne est en cours. Vous pouvez contacter l'ASFO pour effectuer votre don par un autre moyen.
                    </p>
                    <Link to="/contact" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-teal-200/80 bg-white px-6 py-3 text-sm font-bold text-teal-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      Contacter l'ASFO
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Colonne droite — confiance */}
            <motion.aside {...fadeUp(0.1)} className="min-w-0 self-start rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_25px_60px_-30px_rgba(18,63,56,0.35)] backdrop-blur-sm sm:p-8">
              <div className="space-y-6">
                {[
                  { icon: Heart, color: 'text-[#e5533d] bg-red-50', title: 'Pourquoi donner ?', text: 'Votre don finance nos missions médicales au Sénégal : médicaments, matériel médical et formation du personnel de santé local.' },
                  { icon: Activity, color: 'text-teal-600 bg-teal-50', title: 'Utilisation des dons', text: '80 % directement affectés aux missions, 15 % aux frais de fonctionnement, 5 % à la communication et collecte.' },
                  { icon: CalendarDays, color: 'text-teal-600 bg-teal-50', title: 'Transparence totale', text: "Des rapports d'activité détaillés vous permettent de suivre l'impact concret de votre contribution." },
                ].map((row) => (
                  <div key={row.title} className="flex items-start gap-4">
                    <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${row.color}`}><row.icon className="h-5 w-5" aria-hidden="true" /></span>
                    <div>
                      <h3 className="text-base font-bold text-gray-900" style={poppins}>{row.title}</h3>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-gray-600">{row.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 rounded-2xl border border-teal-100 bg-teal-50/50 p-5">
                <h4 className="text-sm font-bold text-gray-800" style={poppins}>Autres moyens de donner</h4>
                <ul className="mt-3 space-y-2 text-[13.5px] text-gray-600">
                  <li className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-none rounded-full bg-teal-500" aria-hidden="true" />Par virement bancaire (RIB sur demande)</li>
                  <li className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-none rounded-full bg-teal-500" aria-hidden="true" />Dons en nature (médicaments, matériel médical)</li>
                  <li className="flex items-center gap-2.5"><Phone className="h-3.5 w-3.5 flex-none text-teal-600" aria-hidden="true" />{CONTACT_PHONE}</li>
                </ul>
                <Link to="/services" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 transition-colors hover:text-teal-500" style={poppins}>
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Consulter nos rapports d'activité
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ════════════════ POURQUOI DONNER ════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute -left-44 top-10 h-[400px] w-[400px] rounded-full bg-teal-50/70 blur-[110px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              Pourquoi donner
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Votre don agit{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">concrètement</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_DONATE.map((c, i) => (
              <motion.div key={c.title} {...fadeUp(0.05 + i * 0.07)} className="group flex flex-col rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-25px_rgba(18,63,56,0.4)]">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_12px_30px_-10px_rgba(23,128,102,0.6)]"><c.icon className="h-6 w-6 text-white" aria-hidden="true" /></span>
                <h3 className="mt-4 text-[15px] font-bold leading-snug text-gray-900" style={poppins}>{c.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-gray-600">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ IMPACT (calculateur) ════════════════ */}
      <section ref={impactRef} className="relative scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-4 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              L'impact de votre don
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Une contribution, un{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">impact concret</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Sélectionnez un montant dans le formulaire : la contribution correspondante est mise en évidence ci-dessous.
            </p>
          </motion.div>
          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {IMPACT_ITEMS.map((item, i) => {
              const active = activeImpact === item.value;
              return (
                <motion.button
                  key={item.value}
                  type="button"
                  {...fadeUp(0.04 + i * 0.05)}
                  onClick={() => { if (AMOUNTS.some((a) => a.value === item.value)) handleAmountClick(item.value); else { setCustomAmount(String(item.value)); } scrollTo(formRef); }}
                  aria-pressed={active}
                  className={`group flex items-start gap-4 rounded-2xl border p-6 text-left shadow-[0_15px_40px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70 ${
                    active ? 'border-teal-400 bg-gradient-to-br from-teal-50/90 to-white ring-2 ring-teal-300/50' : 'border-white/80 bg-white/85 hover:bg-white'
                  }`}
                >
                  <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl transition-colors ${active ? 'bg-gradient-to-br from-[#2fb391] to-[#178066] text-white' : 'border border-teal-100 bg-teal-50 text-teal-600'}`}><item.icon className="h-5 w-5" aria-hidden="true" /></span>
                  <div>
                    <p className="text-xl font-extrabold text-gray-900" style={poppins}>{item.amount}</p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-gray-600">{item.description}</p>
                    {active && <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-teal-700" style={poppins}><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />Montant sélectionné</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ CONFIANCE / TRANSPARENCE ════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-teal-50/40" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 shadow-sm backdrop-blur-sm" style={poppins}>
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Notre engagement
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl" style={poppins}>
              Votre confiance est{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">essentielle</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {TRUST_PILLARS.map((p, i) => (
              <motion.div key={p.title} {...fadeUp(0.06 + i * 0.08)} className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_12px_30px_-10px_rgba(23,128,102,0.6)]"><p.icon className="h-6 w-6 text-white" aria-hidden="true" /></span>
                <h3 className="mt-4 text-lg font-bold text-gray-900" style={poppins}>{p.title}</h3>
                <p className="mt-2 text-[14px] leading-7 text-gray-600">{p.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.1)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white px-5 py-2.5 text-sm font-bold text-teal-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}><FileText className="h-4 w-4" aria-hidden="true" />Rapports d'activité</Link>
            <Link to="/archives" className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white px-5 py-2.5 text-sm font-bold text-teal-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}><MapPin className="h-4 w-4" aria-hidden="true" />Missions réalisées</Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white px-5 py-2.5 text-sm font-bold text-teal-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}><Mail className="h-4 w-4" aria-hidden="true" />Contact ASFO</Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ PREUVES + CITATION ════════════════ */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-8 shadow-[0_30px_70px_-35px_rgba(18,63,56,0.4)] sm:p-12">
            <div className="grid max-w-4xl mx-auto grid-cols-2 gap-5 lg:grid-cols-4">
              {PROOFS.map((s, i) => (
                <motion.div key={s.label} {...fadeUp(0.05 + i * 0.07)} className="rounded-2xl border border-white/80 bg-white px-4 py-6 text-center shadow-[0_15px_40px_-25px_rgba(18,63,56,0.3)]">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2fb391] to-[#178066] shadow-[0_10px_25px_-10px_rgba(23,128,102,0.6)]"><s.icon className="h-5 w-5 text-white" aria-hidden="true" /></span>
                  <p className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}><StatCounter value={s.value} suffix={s.suffix} /></p>
                  <p className="mt-1 text-[13px] text-gray-600">{s.label}</p>
                </motion.div>
              ))}
            </div>
            <figure className="mx-auto mt-10 max-w-2xl text-center">
              <Quote className="mx-auto h-8 w-8 -scale-x-100 text-teal-300/60" aria-hidden="true" />
              <blockquote className="mt-3 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-8" style={poppins}>
                Chaque contribution devient un acte concret de santé, de solidarité et d'espoir.
              </blockquote>
              <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066]" aria-hidden="true" />
            </figure>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ AUTRES MOYENS ════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeUp(0)} className="text-center text-2xl font-extrabold text-gray-900 sm:text-3xl" style={poppins}>Autres moyens de soutenir l'ASFO</motion.h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OTHER_WAYS.map((w, i) => (
              <motion.div key={w.title} {...fadeUp(0.05 + i * 0.07)} className="flex flex-col rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_18px_45px_-25px_rgba(18,63,56,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50"><w.icon className="h-5 w-5 text-teal-600" aria-hidden="true" /></span>
                <h3 className="mt-4 text-base font-bold text-gray-900" style={poppins}>{w.title}</h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-gray-600">{w.text}</p>
                <Link to={w.to} className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-teal-700 transition-colors hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" style={poppins}>{w.cta}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
              </motion.div>
            ))}
          </div>
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
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl" style={poppins}>Vos questions sur les dons</h2>
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
                  {open && <p className="px-6 pb-5 text-[14px] leading-7 text-gray-600">{item.a}</p>}
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
              Chaque geste compte. Chaque don peut changer une{' '}
              <span className="bg-gradient-to-r from-teal-600 to-[#2fb391] bg-clip-text text-transparent">vie</span>.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Soutenez les prochaines missions médicales de l'ASFO et contribuez à rendre les soins
              accessibles aux communautés.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <button type="button" onClick={() => scrollTo(formRef)} className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2fb391] to-[#178066] px-8 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-15px_rgba(23,128,102,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(23,128,102,0.75)] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <Heart className="h-5 w-5" aria-hidden="true" />
                Faire un don
              </button>
              <Link to="/archives" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
                <MapPin className="h-5 w-5 text-teal-600" aria-hidden="true" />
                Voir nos missions
              </Link>
              <Link to="/about/partenaires" className="inline-flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/80 px-7 py-3.5 text-base font-semibold text-teal-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/70" style={poppins}>
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

export default DonatePage;
