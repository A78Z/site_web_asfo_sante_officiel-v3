import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Ambulance,
  Apple,
  BatteryFull,
  Bell,
  CalendarDays,
  Check,
  CreditCard,
  FileText,
  Heart,
  Home,
  MapPin,
  Navigation,
  Newspaper,
  Play,
  ShieldCheck,
  Signal,
  UserRound,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const APP_ACTIONS: Array<{
  label: string;
  icon: LucideIcon;
  accent: string;
  wide?: boolean;
}> = [
  {
    label: 'Faire un don',
    icon: Heart,
    accent: 'bg-rose-50 text-rose-600',
  },
  {
    label: 'Prochaine campagne',
    icon: Ambulance,
    accent: 'bg-teal-50 text-teal-700',
  },
  {
    label: 'Carte des interventions',
    icon: MapPin,
    accent: 'bg-amber-50 text-amber-700',
  },
  {
    label: 'Actualités',
    icon: Newspaper,
    accent: 'bg-sky-50 text-sky-700',
  },
  {
    label: 'Calendrier des missions',
    icon: CalendarDays,
    accent: 'bg-violet-50 text-violet-700',
    wide: true,
  },
];

const APP_NAVIGATION: Array<{
  label: string;
  icon: LucideIcon;
  active?: boolean;
}> = [
  { label: 'Accueil', icon: Home, active: true },
  { label: 'Missions', icon: Ambulance },
  { label: 'Carte', icon: Navigation },
  { label: 'Alertes', icon: Bell },
  { label: 'Profil', icon: UserRound },
];

const APP_FEATURES: Array<{ label: string; icon: LucideIcon }> = [
  { label: 'Notifications en temps réel', icon: Bell },
  { label: 'Carte des interventions', icon: MapPin },
  { label: 'Carte membre numérique', icon: CreditCard },
  { label: 'Dons sécurisés', icon: ShieldCheck },
  { label: 'Actualités', icon: Newspaper },
  { label: 'Rapports', icon: FileText },
  { label: 'Candidatures', icon: Ambulance },
];

const StoreButton: React.FC<{
  icon: LucideIcon;
  store: string;
}> = ({ icon: Icon, store }) => (
  <button
    type="button"
    disabled
    aria-label={`${store} — bientôt disponible`}
    className="flex min-h-14 w-full cursor-not-allowed items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-left text-white/80 shadow-inner sm:w-auto sm:min-w-[12rem]"
  >
    <Icon className="h-6 w-6 flex-none text-teal-200" aria-hidden="true" />
    <span>
      <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-teal-100/55">
        Bientôt disponible
      </span>
      <span className="mt-0.5 block text-sm font-bold" style={poppins}>
        {store}
      </span>
    </span>
  </button>
);

const AppPhone: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => (
  <motion.div
    animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
    transition={
      reduceMotion
        ? undefined
        : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
    }
    className="relative z-10 mx-auto w-[14rem] sm:w-[16rem] lg:-rotate-[3deg]"
  >
    <div className="relative rounded-[2.7rem] border border-white/30 bg-gradient-to-br from-slate-700 via-slate-950 to-black p-[6px] shadow-[0_42px_75px_-28px_rgba(0,0,0,0.9),0_0_50px_rgba(63,201,164,0.18)]">
      <div className="pointer-events-none absolute -left-[3px] top-24 h-14 w-[3px] rounded-l bg-slate-500" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-[3px] top-32 h-20 w-[3px] rounded-r bg-slate-500" aria-hidden="true" />
      <div className="relative h-[29.5rem] overflow-hidden rounded-[2.35rem] bg-[#f5faf9] sm:h-[32.5rem]">
        <div className="absolute left-1/2 top-2 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-950 shadow-inner" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-16 -top-10 z-20 h-72 w-28 rotate-[20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent blur-[1px]"
          aria-hidden="true"
        />

        <div className="flex h-full flex-col">
          <div className="flex h-8 flex-none items-end justify-between px-5 pb-1 text-[7px] font-bold text-slate-700">
            <span>09:41</span>
            <span className="flex items-center gap-1">
              <Signal className="h-2.5 w-2.5" aria-hidden="true" />
              <Wifi className="h-2.5 w-2.5" aria-hidden="true" />
              <BatteryFull className="h-2.5 w-2.5" aria-hidden="true" />
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-4 pb-3 pt-1">
            <span className="flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-xl border border-teal-100 bg-white shadow-sm">
              <img src="/logo.png" alt="" className="h-8 w-8 object-contain" />
            </span>
            <div className="min-w-0">
              <p className="text-[8px] font-semibold text-teal-700">Bonjour 👋</p>
              <p className="truncate text-[12px] font-extrabold text-slate-900" style={poppins}>
                Bienvenue
              </p>
            </div>
            <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-sm">
              <Bell className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden px-3">
            <div className="rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#124e46] p-3 text-white shadow-[0_12px_25px_-14px_rgba(15,118,110,0.8)]">
              <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-teal-100">
                ASFO Mobile
              </p>
              <p className="mt-1 text-[11px] font-extrabold leading-tight" style={poppins}>
                La santé et la solidarité, partout avec vous.
              </p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-white/15 px-2 py-1 text-[6.5px] font-semibold">
                  37+ missions
                </span>
                <span className="rounded-full bg-white/15 px-2 py-1 text-[6.5px] font-semibold">
                  25 000+ bénéficiaires
                </span>
              </div>
            </div>

            <p className="mb-2 mt-3 text-[8px] font-extrabold uppercase tracking-[0.1em] text-slate-500">
              Accès rapide
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {APP_ACTIONS.map(({ label, icon: Icon, accent, wide }, index) => (
                <motion.div
                  key={label}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.32, delay: 0.18 + index * 0.05 }}
                  className={`flex min-h-12 items-center gap-2 rounded-xl border border-slate-100 bg-white p-2 shadow-[0_7px_18px_-14px_rgba(15,23,42,0.5)] ${
                    wide ? 'col-span-2' : ''
                  }`}
                >
                  <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg ${accent}`}>
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-[7px] font-bold leading-tight text-slate-700">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-teal-100 bg-teal-50/80 p-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-white">
                  <Ambulance className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[6.5px] font-semibold uppercase tracking-wide text-teal-700">
                    Prochaine campagne
                  </p>
                  <p className="truncate text-[8px] font-extrabold text-slate-900">
                    Département de Podor • 2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav className="mt-2 grid h-14 flex-none grid-cols-5 border-t border-slate-200 bg-white px-1 pt-2" aria-label="Aperçu de la navigation mobile">
            {APP_NAVIGATION.map(({ label, icon: Icon, active }) => (
              <span
                key={label}
                className={`flex flex-col items-center gap-1 text-[5.5px] font-bold ${
                  active ? 'text-teal-700' : 'text-slate-400'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </div>
  </motion.div>
);

const MemberCardPreview: React.FC<{ reduceMotion: boolean }> = ({
  reduceMotion,
}) => (
  <motion.div
    initial={reduceMotion ? false : { opacity: 0, x: -16, y: 12 }}
    whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay: 0.35 }}
    className="absolute bottom-5 left-0 z-20 w-[10.8rem] rounded-2xl border border-white/80 bg-white/95 p-3 text-slate-900 shadow-[0_22px_45px_-18px_rgba(0,0,0,0.75)] backdrop-blur sm:bottom-8 sm:left-3 sm:w-[12rem]"
  >
    <div className="flex items-center justify-between gap-2">
      <p className="text-[8px] font-extrabold" style={poppins}>
        Carte Membre ASFO
      </p>
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[6px] font-bold text-emerald-700">
        <Check className="h-2 w-2" aria-hidden="true" />
        Vérifiée
      </span>
    </div>
    <div className="mt-2.5 grid grid-cols-[2.7rem_1fr] items-center gap-2.5">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-100 bg-white p-1">
        <QRCodeSVG
          value="ASFO-MOBILE-CARTE-MEMBRE"
          size={38}
          bgColor="#ffffff"
          fgColor="#0f4f46"
          level="M"
          aria-label="QR Code de démonstration de la carte membre ASFO"
        />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[7px] font-extrabold text-slate-800">
          Nom du membre
        </span>
        <span className="mt-0.5 block truncate text-[6px] text-slate-500">
          Profession
        </span>
        <span className="mt-1 block text-[5.5px] font-bold uppercase tracking-wide text-teal-700">
          Membre ASFO
        </span>
      </span>
    </div>
  </motion.div>
);

const CampaignNotification: React.FC<{ reduceMotion: boolean }> = ({
  reduceMotion,
}) => (
  <motion.div
    initial={reduceMotion ? false : { opacity: 0, x: 18, y: -8 }}
    whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true }}
    animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
    transition={
      reduceMotion
        ? { duration: 0 }
        : {
            opacity: { duration: 0.45, delay: 0.45 },
            x: { duration: 0.45, delay: 0.45 },
            y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut' },
          }
    }
    className="absolute right-0 top-10 z-20 w-[10.8rem] rounded-2xl border border-white/15 bg-[#102f38]/95 p-3 text-white shadow-[0_20px_45px_-18px_rgba(0,0,0,0.8)] backdrop-blur sm:right-2 sm:top-14 sm:w-[12.2rem]"
  >
    <div className="flex items-start gap-2.5">
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-teal-400/20 text-teal-200">
        <Bell className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[7px] font-bold uppercase tracking-wide text-teal-300">
          Nouvelle alerte
        </span>
        <span className="mt-0.5 block text-[8px] font-extrabold leading-tight">
          Nouvelle campagne médicale
        </span>
        <span className="mt-1 block text-[7px] text-teal-50/60">
          Podor • Août 2026
        </span>
      </span>
    </div>
  </motion.div>
);

const MobileAppShowcase: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const reduce = Boolean(reduceMotion);

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.62, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-8 md:col-span-2 xl:col-span-3 lg:p-10"
      aria-labelledby="asfo-mobile-title"
    >
      <div
        className="pointer-events-none absolute -left-12 top-1/3 h-72 w-72 rounded-full bg-teal-400/15 blur-[90px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/35 to-transparent"
        aria-hidden="true"
      />

      <span
        className="absolute right-4 top-4 z-30 rounded-full border border-teal-300/10 bg-teal-400/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-200 sm:right-6 sm:top-6"
        style={poppins}
      >
        Bientôt disponible
      </span>

      <div className="relative grid items-center gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-16 lg:pt-4">
        <div className="relative mx-auto min-h-[35rem] w-full max-w-[32rem] sm:min-h-[39rem]">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/20 blur-[70px] sm:h-96 sm:w-96"
            aria-hidden="true"
          />
          <AppPhone reduceMotion={reduce} />
          <MemberCardPreview reduceMotion={reduce} />
          <CampaignNotification reduceMotion={reduce} />
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/15 bg-teal-300/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-200">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            L’ASFO dans votre poche
          </span>
          <h3
            id="asfo-mobile-title"
            className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
            style={poppins}
          >
            Application mobile ASFO
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-teal-50/70 sm:text-base">
            Retrouvez toutes les missions, les actualités, les campagnes
            médicales, votre carte membre numérique, les notifications
            importantes et les services de l&apos;ASFO directement sur votre
            smartphone.
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {APP_FEATURES.map(({ label, icon: Icon }, index) => (
              <motion.li
                key={label}
                initial={reduce ? false : { opacity: 0, x: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.15 + index * 0.04 }}
                className="flex items-center gap-2.5 text-sm text-teal-50/85"
              >
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {label}
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <StoreButton icon={Play} store="Google Play" />
            <StoreButton icon={Apple} store="App Store" />
          </div>
          <p className="mt-3 text-xs leading-5 text-teal-50/45">
            Les téléchargements seront activés lors de la publication officielle.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default MobileAppShowcase;
