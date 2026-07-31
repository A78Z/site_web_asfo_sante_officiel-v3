import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { FileRejection, useDropzone } from 'react-dropzone';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Camera,
  Check,
  CheckCircle,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  CreditCard,
  Heart,
  Home,
  Loader2,
  CheckCircle2,
  LockKeyhole,
  Mail,
  MapPin,
  Network,
  QrCode,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  Users,
  WalletCards,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { uploadMemberCardPhoto } from '../lib/memberCardUpload';
import {
  MemberCardSubmissionError,
  submitMemberCardRequest,
} from '../lib/memberCardSubmission';
import type { ParseFile } from '../lib/parse';
import {
  validateEmail as validateEmailValue,
  validatePersonName,
  validateVillage,
  validateProfessionAutre,
} from '../../api/_lib/member-request-validation.js';
import {
  sendVerificationCode,
  verifyPhoneCode,
} from '../lib/phoneVerification';
import {
  SENEGAL_DIALLING_CODE,
  SENEGAL_LOCAL_LENGTH,
  extractSenegalLocalDigits,
  formatSenegalLocal,
  senegalPhoneIssue,
} from '../../api/_lib/senegal-phone.js';
import MemberCard from '../components/admin/MemberCard';
import ProfessionCombobox from '../components/member/ProfessionCombobox';
import {
  MEMBER_PROFESSIONS,
  MEMBER_PROFESSION_LABELS,
} from '../data/memberProfessions';

const DRAFT_KEY = 'asfo-member-card-draft-v1';
const SUBMISSION_ID_KEY = 'asfo-member-card-submission-id-v1';
const MAX_PHOTO_SIZE = 2 * 1024 * 1024;
const MIN_PHOTO_DIMENSION = 300;

interface FormInputs {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  profession: string;
  professionAutre: string;
  address: string;
  acceptTerms: boolean;
}

interface SubmissionReceipt {
  requestId: string;
  createdAt: Date;
  fullName: string;
  message: string;
}

interface SavedDraft {
  values: Partial<FormInputs>;
  savedAt: string;
  submissionId?: string;
}

const DEFAULT_VALUES: FormInputs = {
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
  profession: '',
  professionAutre: '',
  address: '',
  acceptTerms: false,
};

const CRITERIA = [
  {
    icon: Heart,
    title: 'Adhésion aux valeurs et à la mission',
    description:
      'Partager notre engagement envers l’amélioration de la santé et du bien-être des populations du Fouta, ainsi que nos valeurs de solidarité, d’équité et de respect des droits humains.',
    condition: 'Engagement de principe',
  },
  {
    icon: Sparkles,
    title: 'Engagement à contribuer activement',
    description:
      'Participer aux initiatives de sensibilisation, consultations gratuites, collectes de fonds ou missions, selon ses compétences et ses disponibilités.',
    condition: 'Participation active',
  },
  {
    icon: ShieldCheck,
    title: 'Respect des règles et des statuts',
    description:
      'Suivre le règlement, respecter la confidentialité, les décisions collectives et les autres membres de l’association.',
    condition: 'Respect du cadre ASFO',
  },
  {
    icon: Users,
    title: 'Participation aux réunions et activités',
    description:
      'Prendre part aux rencontres régulières et aux événements organisés par l’association.',
    condition: 'Vie associative',
  },
  {
    icon: CreditCard,
    title: 'Disposer d’une carte de membre',
    description:
      'La carte de membre est obligatoire. Son coût est fixé à 2 500 FCFA et le paiement intervient après validation de la demande.',
    condition: 'Carte obligatoire',
  },
  {
    icon: CircleDollarSign,
    title: 'Cotisation annuelle',
    description:
      'Le montant est fixé par le bureau. Cette cotisation est obligatoire pour soutenir les actions de l’ASFO.',
    condition: 'Montant fixé par le bureau',
  },
];

const MEMBERSHIP_STEPS = [
  { title: 'Demande en ligne', description: 'Vous transmettez vos informations et votre photo.' },
  { title: 'Vérification', description: 'L’ASFO contrôle les éléments communiqués.' },
  { title: 'Validation ASFO', description: 'La demande est acceptée ou refusée par un responsable.' },
  { title: 'Paiement', description: 'Après validation, vous recevez les instructions pour régler 2 500 FCFA.' },
  { title: 'Création de la carte', description: 'L’administration génère la carte après confirmation.' },
  { title: 'Carte numérique', description: 'La carte vérifiable est ensuite mise à disposition.' },
];

const BENEFITS = [
  { icon: BadgeCheck, title: 'Identité membre vérifiable', description: 'La carte définitive dispose d’un identifiant et d’un QR de vérification.' },
  { icon: Users, title: 'Accès aux activités', description: 'Participez aux rencontres, missions et initiatives de l’association.' },
  { icon: Heart, title: 'Vie communautaire', description: 'Contribuez aux actions sanitaires et solidaires portées par l’ASFO.' },
  { icon: Network, title: 'Réseau ASFO', description: 'Faites reconnaître votre appartenance au réseau associatif ASFO.' },
];

const FAQ_ITEMS = [
  {
    question: 'Qui peut devenir membre ?',
    answer:
      'Toute personne qui adhère aux valeurs de l’ASFO et s’engage à respecter les six critères présentés sur cette page peut déposer une demande.',
  },
  {
    question: 'Quel est le coût de la carte ?',
    answer: 'La carte membre coûte 2 500 FCFA. Ce montant ne comprend pas la cotisation annuelle fixée par le bureau.',
  },
  {
    question: 'Quand dois-je payer ?',
    answer:
      'Aucun paiement n’est demandé lors de l’envoi du formulaire. Les instructions de paiement sont communiquées uniquement après validation de la demande.',
  },
  {
    question: 'Combien de temps dure la validation ?',
    answer:
      'Aucun délai fixe n’est publié. L’équipe vérifie chaque demande avant de communiquer sa décision.',
  },
  {
    question: 'Comment récupérer ma carte ?',
    answer:
      'Après validation et confirmation du paiement, l’administration crée la carte numérique et vous informe de sa mise à disposition.',
  },
  {
    question: 'Puis-je modifier mes informations ?',
    answer:
      'Le portail ne propose pas encore de modification autonome après l’envoi. Contactez l’ASFO en indiquant votre numéro de demande.',
  },
  {
    question: 'Que faire en cas de perte ?',
    answer:
      'Contactez l’ASFO pour signaler la perte et connaître la procédure applicable à votre carte.',
  },
  {
    question: 'La cotisation annuelle est-elle distincte du coût de la carte ?',
    answer:
      'Oui. La carte coûte 2 500 FCFA ; le montant de la cotisation annuelle est fixé séparément par le bureau.',
  },
];

const FORM_STEPS = [
  { id: 1, title: 'Identité', description: 'Vos coordonnées', icon: User },
  { id: 2, title: 'Profil', description: 'Profession et photo', icon: Camera },
  { id: 3, title: 'Vérification', description: 'Relire et envoyer', icon: ClipboardCheck },
] as const;

const STEP_FIELDS: Record<number, Array<keyof FormInputs>> = {
  1: ['lastName', 'firstName', 'email', 'phone'],
  2: ['profession', 'professionAutre', 'address'],
  3: ['acceptTerms'],
};

const inputClass = (hasError?: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 ring-4 ring-red-50 focus:border-red-500'
      : 'border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-50'
  }`;

const loadDraft = (): SavedDraft | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(DRAFT_KEY);
    return stored ? (JSON.parse(stored) as SavedDraft) : null;
  } catch {
    return null;
  }
};

const createSubmissionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const isValidSubmissionId = (value?: string) =>
  Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value,
      ),
  );

const loadStoredSubmissionId = () => {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(SUBMISSION_ID_KEY) ?? '';
  } catch {
    return '';
  }
};

const isOtherProfession = (value: string) => value.toLocaleLowerCase('fr') === 'autre';

const normalizeProfessionAutre = (value: string) =>
  value.trim().replace(/\s+/g, ' ');

const professionLabel = (value: string, professionAutre = '') => {
  if (isOtherProfession(value)) {
    return normalizeProfessionAutre(professionAutre) || 'Autre';
  }
  return MEMBER_PROFESSION_LABELS[value] ?? '';
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const validateImageDimensions = (file: File): Promise<boolean> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const valid = image.naturalWidth >= MIN_PHOTO_DIMENSION && image.naturalHeight >= MIN_PHOTO_DIMENSION;
      URL.revokeObjectURL(url);
      resolve(valid);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    image.src = url;
  });

const FieldError: React.FC<{ id: string; message?: string }> = ({ id, message }) => {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-600">
      <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
};

/** Dimensions natives de `MemberCard`, fixées en style inline dans le composant. */
const MEMBER_CARD_WIDTH = 428;
const MEMBER_CARD_HEIGHT = 270;

const ResponsiveMemberPreview: React.FC<{
  fullName: string;
  profession: string;
  phone: string;
  address: string;
  email: string;
  photo?: string | null;
  showCaption?: boolean;
}> = ({ fullName, profession, phone, address, email, photo, showCaption = true }) => {
  const availableRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // L’échelle suit la largeur réellement disponible, mesurée sur le conteneur.
  // Les paliers `sm:`/`lg:` utilisés auparavant réagissaient à la largeur du
  // *navigateur* : dans la colonne d’aperçu, plus étroite que 428 px alors que
  // la fenêtre dépassait 1024 px, la carte était rendue à sa taille native et
  // débordait — le parent en `overflow-hidden` la rognait sur la droite.
  useLayoutEffect(() => {
    const element = availableRef.current;
    if (!element) return undefined;

    const applyScale = (width: number) => {
      if (width <= 0) return;
      // Jamais au-delà de 1 : agrandir au-dessus de la taille native
      // dégraderait le rendu sans bénéfice.
      setScale(Math.min(1, width / MEMBER_CARD_WIDTH));
    };

    // Première mesure synchrone : évite d’afficher une image débordante avant
    // le premier passage du ResizeObserver.
    applyScale(element.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      applyScale(entries[0]?.contentRect.width ?? 0);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full min-w-0">
      {/* Témoin de mesure : sans contenu, sa largeur est exactement la place
          disponible. Mesurer la boîte de la carte créerait une boucle, sa
          largeur dépendant elle-même de l’échelle calculée. */}
      <div ref={availableRef} aria-hidden="true" className="h-0 w-full" />
      {/* Boîte aux dimensions exactes de la carte mise à l’échelle : le ratio
          est conservé et rien ne dépasse, donc aucun rognage possible. */}
      <div
        className="relative mx-auto"
        style={{
          width: MEMBER_CARD_WIDTH * scale,
          height: MEMBER_CARD_HEIGHT * scale,
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          <MemberCard
            name={fullName || 'VOTRE IDENTITÉ'}
            role={profession || 'Membre ASFO'}
            phone={phone || 'Votre téléphone'}
            city={address || 'Votre ville'}
            email={email || undefined}
            memberId="À ATTRIBUER"
            photo={photo || undefined}
            validity="Après validation"
          />
        </div>
      </div>
      {showCaption && (
        <p className="mx-auto mt-3 max-w-md text-center text-xs leading-5 text-slate-500">
          Aperçu non officiel — la carte définitive sera créée après validation et paiement.
        </p>
      )}
    </div>
  );
};

const HeroCardComposition: React.FC = () => (
  <div className="relative mx-auto w-full max-w-[560px] pb-8 pt-6 lg:pb-10">
    <div className="absolute right-0 top-0 hidden h-[270px] w-[428px] rotate-[5deg] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_22px_55px_-24px_rgba(15,23,42,0.32)] sm:block">
      <div className="flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-asfo.png" alt="" className="h-11 w-11 rounded-full bg-white object-contain" />
            <div>
              <p className="font-black tracking-[0.12em] text-[#1F6F8B]">ASFO</p>
              <p className="text-[10px] text-slate-500">Action Sanitaire pour le Fouta</p>
            </div>
          </div>
          <div className="rounded-xl border-2 border-[#1F6F8B] p-2 text-[#1F6F8B]">
            <QrCode size={45} aria-hidden="true" />
          </div>
        </div>
        <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-teal-800">Vérification numérique</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">Le QR réel est généré uniquement avec une carte validée.</p>
        </div>
        <p className="text-sm font-bold italic text-[#1F6F8B]">Au service du Fouta</p>
      </div>
    </div>

    <div className="relative z-10 sm:-translate-x-6 sm:translate-y-8">
      <ResponsiveMemberPreview fullName="" profession="" phone="" address="" email="" showCaption={false} />
    </div>

    <div className="relative z-20 mx-auto mt-4 grid max-w-[420px] grid-cols-3 gap-2 sm:absolute sm:-bottom-2 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2">
      {[
        { icon: BadgeCheck, title: 'Identité vérifiée' },
        { icon: Clock3, title: 'Valable 2 ans' },
        { icon: CreditCard, title: 'Accès membre ASFO' },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="flex min-h-[72px] flex-col items-center justify-center rounded-xl border border-white/80 bg-white/95 p-2 text-center shadow-lg backdrop-blur">
            <Icon size={17} className="text-teal-700" />
            <p className="mt-1 text-[10px] font-black leading-4 text-slate-700 sm:text-xs">{item.title}</p>
          </div>
        );
      })}
    </div>
  </div>
);

const SuccessCard: React.FC<{
  receipt: SubmissionReceipt;
  onReset: () => void;
}> = ({ receipt, onReset }) => {
  const formattedDate = receipt.createdAt.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="bg-gradient-to-b from-white via-[#f4fbfa] to-white px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_28px_90px_-42px_rgba(15,118,110,0.42)]"
      >
        <div className="border-b border-teal-100 bg-gradient-to-br from-teal-50 via-white to-emerald-50 px-6 py-10 text-center sm:px-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-700 text-white shadow-lg shadow-teal-700/20">
            <CheckCircle size={32} aria-hidden="true" />
          </span>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.15em] text-teal-700">Demande enregistrée</p>
          <h1 className="mx-auto mt-2 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Votre demande de carte membre a bien été envoyée
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{receipt.message}</p>
        </div>

        <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-[1fr_0.95fr]">
          <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-200 px-5">
            {[
              ['Numéro de demande', receipt.requestId],
              ['Date', formattedDate],
              ['Demandeur', receipt.fullName],
              ['Statut initial', 'En attente'],
            ].map(([label, value]) => (
              <div key={label} className="grid gap-1 py-4 text-sm sm:grid-cols-[150px_1fr] sm:gap-5">
                <dt className="text-slate-500">{label}</dt>
                <dd className={`break-all font-bold text-slate-900 ${label === 'Numéro de demande' ? 'font-mono' : ''}`}>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
            <h2 className="font-black text-blue-950">Prochaines étapes</h2>
            <ol className="mt-4 space-y-3">
              {[
                'Vérification de vos informations et de votre photo.',
                'Décision de validation par un responsable ASFO.',
                'Instructions de paiement de 2 500 FCFA si la demande est acceptée.',
                'Création et mise à disposition de la carte après confirmation.',
              ].map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-5 text-blue-950/80">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-blue-700">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-xl bg-white/80 p-3 text-xs leading-5 text-blue-900">
              Aucun paiement n’est demandé à cette étape. Conservez votre numéro de demande pour tout échange avec l’ASFO.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end sm:px-10">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:border-teal-300 hover:text-teal-700"
          >
            <RotateCcw size={16} /> Nouvelle demande
          </button>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:border-teal-300 hover:text-teal-700"
          >
            Découvrir les activités
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white hover:bg-teal-800"
          >
            <Home size={16} /> Retour à l’accueil
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

const MemberCardPage: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const initialDraft = useMemo(loadDraft, []);
  const submissionLock = useRef(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [uploadStage, setUploadStage] = useState('');
  // La photo part vers le serveur dès l’étape 2 : seule la référence de fichier
  // renvoyée par l’API est transmise à l’étape 3.
  const [uploadedPhoto, setUploadedPhoto] = useState<ParseFile | null>(null);
  const [photoUploadStatus, setPhotoUploadStatus] = useState<
    'idle' | 'uploading' | 'done' | 'error'
  >('idle');
  // Évite qu’une réponse tardive d’un ancien fichier écrase la photo courante.
  const photoUploadToken = useRef(0);
  // Le champ téléphone ne contient que les 9 chiffres locaux ; l’indicatif est
  // ajouté à l’enregistrement pour produire l’E.164 attendu par l’envoi SMS.
  const [phoneDigits, setPhoneDigits] = useState(() =>
    extractSenegalLocalDigits(initialDraft?.values.phone ?? '').slice(
      0,
      SENEGAL_LOCAL_LENGTH,
    ),
  );
  // L’erreur n’apparaît qu’après la sortie du champ ou un clic sur « Suivant »,
  // pour ne pas signaler un numéro « invalide » dès le premier chiffre tapé.
  const [phoneTouched, setPhoneTouched] = useState(false);
  // Vérification du numéro par code SMS : sans elle, aucune demande ne part.
  const [otpStage, setOtpStage] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  /** Numéro effectivement vérifié : changer de numéro invalide la vérification. */
  const [verifiedPhone, setVerifiedPhone] = useState('');
  // Anti-bot : instant d’ouverture du formulaire, comparé à l’envoi.
  const formOpenedAt = useRef(Date.now());
  const [honeypot, setHoneypot] = useState('');
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
  const [draftSavedAt, setDraftSavedAt] = useState(initialDraft?.savedAt ?? '');
  const [submissionId, setSubmissionId] = useState(() =>
    isValidSubmissionId(initialDraft?.submissionId)
      ? initialDraft?.submissionId ?? createSubmissionId()
      : isValidSubmissionId(loadStoredSubmissionId())
        ? loadStoredSubmissionId()
        : createSubmissionId(),
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      ...DEFAULT_VALUES,
      ...(initialDraft?.values ?? {}),
      profession: isOtherProfession(initialDraft?.values.profession ?? '')
        ? 'Autre'
        : initialDraft?.values.profession ?? '',
      acceptTerms: false,
    },
  });

  const values = watch();
  const acceptTerms = watch('acceptTerms');
  const fullName = `${values.firstName || ''} ${values.lastName || ''}`.trim();
  const showProfessionAutre = isOtherProfession(values.profession);
  const selectedProfession = professionLabel(values.profession, values.professionAutre);
  const showPhoneError = phoneTouched && Boolean(errors.phone);
  const currentPhone = phoneDigits ? `${SENEGAL_DIALLING_CODE}${phoneDigits}` : '';
  /** Vrai seulement si le numéro affiché est celui qui a été vérifié. */
  const isPhoneVerified = otpStage === 'verified' && verifiedPhone === currentPhone;
  // Stocké en `+221XXXXXXXXX`, affiché en `+221 77 123 45 67`.
  const readablePhone = phoneDigits
    ? `${SENEGAL_DIALLING_CODE} ${formatSenegalLocal(phoneDigits)}`
    : '';

  useEffect(() => {
    document.title = 'Commander ma carte membre | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = window.setInterval(() => {
      setResendIn((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendIn]);

  // Le champ est piloté à la main (badge d’indicatif + formatage), il est donc
  // déclaré ici auprès du formulaire avec ses règles de validation.
  useEffect(() => {
    register('phone', {
      validate: (value: string) => {
        const issue = senegalPhoneIssue(value);
        if (!issue) return true;
        if (issue === 'empty') return 'Le téléphone est requis.';
        if (issue === 'landline') {
          return 'Les numéros fixes ne reçoivent pas de SMS. Indiquez un mobile sénégalais (70, 75, 76, 77 ou 78).';
        }
        return 'Entrez un numéro de mobile sénégalais valide : +221 suivi de 9 chiffres (ex. 77 123 45 67).';
      },
    });
  }, [register]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SUBMISSION_ID_KEY, submissionId);
    } catch {
      // L’idempotence côté serveur reste active pendant la session courante.
    }
  }, [submissionId]);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return undefined;
    }
    const objectUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photoFile]);

  /** Téléverse la photo et mémorise la référence renvoyée par l’API. */
  const startPhotoUpload = useCallback(
    async (file: File) => {
      photoUploadToken.current += 1;
      const token = photoUploadToken.current;
      const isCurrent = () => photoUploadToken.current === token;

      setUploadedPhoto(null);
      setPhotoUploadStatus('uploading');
      setPhotoError('');

      try {
        const photo = await uploadMemberCardPhoto(file, submissionId);
        if (!isCurrent()) return;
        setUploadedPhoto(photo);
        setPhotoUploadStatus('done');
      } catch (error) {
        if (!isCurrent()) return;
        setPhotoUploadStatus('error');
        setPhotoError(
          error instanceof Error
            ? error.message
            : 'La photo n’a pas pu être téléversée. Veuillez réessayer.',
        );
      }
    },
    [submissionId],
  );

  const handleAcceptedPhoto = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      setPhotoError('');
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const allowedExtension = /\.(jpe?g|png|webp)$/i.test(file.name);
      if ((file.type && !allowedMimeTypes.includes(file.type)) || !allowedExtension) {
        setPhotoError('La photo doit être au format JPG, JPEG, PNG ou WEBP.');
        return;
      }
      if (file.size > MAX_PHOTO_SIZE) {
        setPhotoError('La photo ne doit pas dépasser 2 Mo.');
        return;
      }

      const dimensionsValid = await validateImageDimensions(file);
      if (!dimensionsValid) {
        setPhotoError(`La photo doit mesurer au moins ${MIN_PHOTO_DIMENSION} × ${MIN_PHOTO_DIMENSION} pixels.`);
        return;
      }
      setPhotoFile(file);
      void startPhotoUpload(file);
    },
    [startPhotoUpload],
  );

  /** Réessai manuel : la saisie du formulaire est conservée. */
  const handleRetryPhotoUpload = useCallback(() => {
    if (photoFile) void startPhotoUpload(photoFile);
  }, [photoFile, startPhotoUpload]);

  const handleRemovePhoto = useCallback(() => {
    photoUploadToken.current += 1;
    setPhotoFile(null);
    setPhotoError('');
    setUploadedPhoto(null);
    setPhotoUploadStatus('idle');
  }, []);

  const handleRejectedPhoto = useCallback((rejections: FileRejection[]) => {
    const tooLarge = rejections.some((rejection) =>
      rejection.errors.some((error) => error.code === 'file-too-large'),
    );
    setPhotoError(
      tooLarge
        ? 'La photo ne doit pas dépasser 2 Mo.'
        : 'La photo doit être au format JPG, JPEG, PNG ou WEBP.',
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDropAccepted: handleAcceptedPhoto,
    onDropRejected: handleRejectedPhoto,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: MAX_PHOTO_SIZE,
    multiple: false,
    noClick: true,
    disabled: isSubmitting,
  });

  const saveDraft = () => {
    const savedAt = new Date().toISOString();
    const valuesToSave = { ...getValues(), acceptTerms: false };
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ values: valuesToSave, savedAt, submissionId }),
      );
      setDraftSavedAt(savedAt);
      setSubmitError('');
    } catch {
      setSubmitError('Le brouillon n’a pas pu être enregistré sur cet appareil.');
    }
  };

  /** Demande l’envoi d’un code au numéro saisi. */
  const requestVerificationCode = async () => {
    const phone = `${SENEGAL_DIALLING_CODE}${phoneDigits}`;
    setPhoneTouched(true);
    const phoneValid = await trigger('phone');
    if (!phoneValid) return;

    setOtpBusy(true);
    setOtpError('');
    try {
      const result = await sendVerificationCode(phone);
      setOtpStage('sent');
      setResendIn(result.resendInSeconds ?? 60);
    } catch (error) {
      setOtpError(
        error instanceof Error ? error.message : 'Le code n’a pas pu être envoyé.',
      );
    } finally {
      setOtpBusy(false);
    }
  };

  /** Confronte le code saisi au code reçu par SMS. */
  const submitVerificationCode = async () => {
    const phone = `${SENEGAL_DIALLING_CODE}${phoneDigits}`;
    setOtpBusy(true);
    setOtpError('');
    try {
      await verifyPhoneCode(phone, otpCode);
      setOtpStage('verified');
      setVerifiedPhone(phone);
    } catch (error) {
      setOtpError(
        error instanceof Error ? error.message : 'La vérification a échoué.',
      );
    } finally {
      setOtpBusy(false);
    }
  };

  const goToStep = async (target: number) => {
    if (target <= currentStep) {
      setCurrentStep(target);
      setSubmitError('');
      return;
    }

    // Un clic sur « Suivant » vaut confirmation de saisie : l’erreur de
    // téléphone devient visible même si le champ n’a jamais perdu le focus.
    if (currentStep === 1) setPhoneTouched(true);

    const fieldsToValidate = STEP_FIELDS[currentStep].filter(
      (field) =>
        field !== 'professionAutre' ||
        isOtherProfession(getValues('profession')),
    );
    const fieldsValid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (!fieldsValid) return;
    // Le numéro doit être vérifié avant de quitter l’étape 1 : c’est ce qui
    // rend impossible une demande derrière un faux numéro.
    if (currentStep === 1 && !isPhoneVerified) {
      setOtpError('Vérifiez votre numéro avec le code reçu par SMS pour continuer.');
      return;
    }
    if (currentStep === 2 && !photoFile) {
      setPhotoError('Ajoutez une photo d’identité conforme avant de continuer.');
      return;
    }

    setCurrentStep(Math.min(target, currentStep + 1));
    setSubmitError('');
    window.setTimeout(() => {
      document.getElementById('member-request-form')?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 50);
  };

  const onSubmit = async (data: FormInputs) => {
    if (submissionLock.current) return;
    if (!photoFile) {
      setCurrentStep(2);
      setPhotoError('Ajoutez une photo d’identité conforme avant l’envoi.');
      return;
    }
    if (!data.acceptTerms) {
      setCurrentStep(3);
      return;
    }

    submissionLock.current = true;
    setSubmitError('');

    try {
      // Normalement déjà téléversée à l’étape 2 ; sinon on rattrape ici.
      let parsedPhoto = uploadedPhoto;
      if (!parsedPhoto) {
        setUploadStage('Téléversement sécurisé de la photo…');
        try {
          parsedPhoto = await uploadMemberCardPhoto(photoFile, submissionId);
          setUploadedPhoto(parsedPhoto);
          setPhotoUploadStatus('done');
        } catch (uploadError) {
          // Seule la photo a échoué : on renvoie l’utilisateur à l’étape 2
          // pour réessayer, sans perdre la saisie du formulaire.
          setPhotoUploadStatus('error');
          const message =
            uploadError instanceof Error
              ? uploadError.message
              : 'La photo n’a pas pu être téléversée. Veuillez réessayer.';
          setPhotoError(message);
          setCurrentStep(2);
          setSubmitError(
            `La photo n’a pas pu être téléversée : ${message} Vos informations sont conservées, réessayez le téléversement.`,
          );
          return;
        }
      }

      setUploadStage('Enregistrement de la demande…');
      const otherProfession = normalizeProfessionAutre(data.professionAutre);

      // L’identifiant ne doit jamais partir vide ou mal formé : s’il a été perdu
      // (stockage local vidé, brouillon corrompu), on en régénère un ici plutôt
      // que d’imposer un rechargement manuel du formulaire.
      let requestId = submissionId;
      if (!isValidSubmissionId(requestId)) {
        requestId = createSubmissionId();
        setSubmissionId(requestId);
      }

      const buildPayload = (id: string) => ({
        submissionId: id,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        profession: isOtherProfession(data.profession) ? 'Autre' : data.profession,
        ...(isOtherProfession(data.profession)
          ? { professionAutre: otherProfession }
          : {}),
        village: data.address.trim(),
        photo: parsedPhoto,
        consentAccepted: true as const,
        website: honeypot,
        filledInMs: Date.now() - formOpenedAt.current,
      });

      let result;
      try {
        result = await submitMemberCardRequest(buildPayload(requestId));
      } catch (submissionError) {
        // Reprise douce : le serveur a refusé l’identifiant, on en forge un
        // neuf et on renvoie la même demande. La saisie et la photo déjà
        // téléversée sont conservées — rien à ressaisir.
        const rejectedId =
          submissionError instanceof MemberCardSubmissionError &&
          submissionError.code === 'invalid_submission_id';
        if (!rejectedId) throw submissionError;

        const renewedId = createSubmissionId();
        setSubmissionId(renewedId);
        result = await submitMemberCardRequest(buildPayload(renewedId));
      }

      window.localStorage.removeItem(DRAFT_KEY);
      window.localStorage.removeItem(SUBMISSION_ID_KEY);
      setReceipt({
        requestId: result.request.objectId,
        createdAt: result.request.createdAt
          ? new Date(result.request.createdAt)
          : new Date(),
        fullName: `${data.firstName.trim()} ${data.lastName.trim()}`,
        message: result.message,
      });
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      setSubmitError(`La demande n’a pas pu être envoyée : ${message}`);
    } finally {
      setUploadStage('');
      submissionLock.current = false;
    }
  };

  const handleInvalidSubmit = (invalidErrors: FieldErrors<FormInputs>) => {
    const firstInvalidStep = FORM_STEPS.find((step) =>
      STEP_FIELDS[step.id].some((field) => Boolean(invalidErrors[field])),
    );
    if (firstInvalidStep) setCurrentStep(firstInvalidStep.id);
    setSubmitError('Vérifiez les informations signalées avant de transmettre la demande.');
  };

  const handleReset = () => {
    setReceipt(null);
    setSubmitError('');
    handleRemovePhoto();
    setCurrentStep(1);
    setPhoneDigits('');
    setPhoneTouched(false);
    setDraftSavedAt('');
    setSubmissionId(createSubmissionId());
    reset(DEFAULT_VALUES);
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  if (receipt) {
    return <SuccessCard receipt={receipt} onReset={handleReset} />;
  }

  const pageMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.5 },
      };

  const stepMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 14 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -10 },
        transition: { duration: 0.22 },
      };

  const validationMessages = [
    errors.lastName?.message,
    errors.firstName?.message,
    errors.email?.message,
    showPhoneError ? errors.phone?.message : undefined,
    errors.profession?.message,
    errors.professionAutre?.message,
    errors.address?.message,
    photoError,
    errors.acceptTerms?.message,
  ].filter((message): message is string => Boolean(message));

  const renderFormStep = () => {
    if (currentStep === 1) {
      return (
        <motion.div key="identity" {...stepMotion} className="space-y-6">
          <div>
            <p className="text-sm font-black text-teal-700">Étape 1 sur 3</p>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Votre identité</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Utilisez les informations qui devront apparaître dans votre dossier membre.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Champ piège : invisible et hors tabulation pour un humain,
                rempli par les robots qui remplissent tous les champs. */}
            <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Ne pas remplir</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm font-bold text-slate-800">
                Nom <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  className={`${inputClass(Boolean(errors.lastName))} pl-11`}
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  placeholder="Votre nom de famille"
                  {...register('lastName', {
                    required: 'Le nom est requis.',
                    validate: (value) => validatePersonName(value, 'Le nom') ?? true,
                  })}
                />
              </div>
              <FieldError id="lastName-error" message={errors.lastName?.message} />
            </div>

            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-bold text-slate-800">
                Prénom <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  className={`${inputClass(Boolean(errors.firstName))} pl-11`}
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  placeholder="Votre prénom"
                  {...register('firstName', {
                    required: 'Le prénom est requis.',
                    validate: (value) => validatePersonName(value, 'Le prénom') ?? true,
                  })}
                />
              </div>
              <FieldError id="firstName-error" message={errors.firstName?.message} />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-800">
                Adresse email{' '}
                <span className="font-medium text-slate-400">(facultatif)</span>
              </label>
              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`${inputClass(Boolean(errors.email))} pl-11`}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : 'email-help'}
                  placeholder="vous@exemple.com"
                  {...register('email', {
                    validate: (value) => validateEmailValue(value) ?? true,
                  })}
                />
              </div>
              <p id="email-help" className="mt-2 text-xs text-slate-500">Le suivi se fait par SMS. Une adresse e-mail reste utile pour les échanges écrits.</p>
              <FieldError id="email-error" message={errors.email?.message} />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-bold text-slate-800">
                Téléphone <span className="text-red-600">*</span>
              </label>
              {/* L’indicatif est un badge fixe, hors du champ : il ne peut être
                  ni modifié ni effacé, et l’utilisateur ne saisit que les
                  9 chiffres de son numéro local. */}
              <div
                className={`flex items-stretch overflow-hidden rounded-xl border bg-white transition ${
                  showPhoneError
                    ? 'border-red-300 ring-4 ring-red-50 focus-within:border-red-500'
                    : 'border-slate-200 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-50'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex select-none items-center gap-1.5 border-r border-slate-200 bg-slate-50 px-3.5 text-[15px] font-bold text-slate-700"
                >
                  <span className="text-base leading-none">🇸🇳</span>
                  +221
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={12}
                  className="w-full bg-transparent px-4 py-3.5 text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
                  aria-invalid={showPhoneError}
                  aria-describedby={
                    showPhoneError ? 'phone-error' : 'phone-hint'
                  }
                  placeholder="77 123 45 67"
                  value={formatSenegalLocal(phoneDigits)}
                  onChange={(event) => {
                    // Le champ ne reçoit que le numéro local : un 0 de tête est
                    // superflu et retiré dès la frappe, pas seulement une fois
                    // les 10 chiffres atteints.
                    const digits = extractSenegalLocalDigits(event.target.value)
                      .replace(/^0+/, '')
                      .slice(0, SENEGAL_LOCAL_LENGTH);
                    setPhoneDigits(digits);
                    const nextPhone = digits ? `${SENEGAL_DIALLING_CODE}${digits}` : '';
                    setValue('phone', nextPhone, { shouldValidate: phoneTouched });
                    // Modifier le numéro annule la vérification déjà obtenue.
                    if (nextPhone !== verifiedPhone) {
                      setOtpStage('idle');
                      setOtpCode('');
                      setOtpError('');
                    }
                  }}
                  onBlur={() => {
                    setPhoneTouched(true);
                    void trigger('phone');
                  }}
                />
              </div>
              {showPhoneError ? (
                <FieldError id="phone-error" message={errors.phone?.message} />
              ) : (
                <p id="phone-hint" className="mt-2 text-xs text-slate-500">
                  Mobile sénégalais uniquement (70, 75, 76, 77 ou 78) — 9 chiffres.
                </p>
              )}

              {/* Vérification du numéro par code SMS : verrou principal contre
                  les faux numéros. Sans code reçu, la demande ne part pas. */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                {isPhoneVerified ? (
                  <p className="flex items-center gap-2 text-sm font-bold text-teal-700">
                    <CheckCircle2 size={16} /> Numéro vérifié
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-slate-600">
                        {otpStage === 'sent'
                          ? 'Saisissez le code à 6 chiffres reçu par SMS.'
                          : 'Vérifiez votre numéro pour continuer.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => void requestVerificationCode()}
                        disabled={otpBusy || resendIn > 0 || phoneDigits.length !== 9}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-teal-600 bg-white px-3 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {otpBusy && <Loader2 size={13} className="animate-spin" />}
                        {resendIn > 0
                          ? `Renvoyer dans ${resendIn}s`
                          : otpStage === 'sent'
                            ? 'Renvoyer le code'
                            : 'Recevoir un code'}
                      </button>
                    </div>

                    {otpStage === 'sent' && (
                      <div className="mt-2.5 flex gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          value={otpCode}
                          onChange={(event) =>
                            setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                          }
                          placeholder="123456"
                          aria-label="Code de vérification reçu par SMS"
                          className="w-32 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center font-mono text-[15px] tracking-[0.3em] text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-50"
                        />
                        <button
                          type="button"
                          onClick={() => void submitVerificationCode()}
                          disabled={otpBusy || otpCode.length !== 6}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {otpBusy && <Loader2 size={14} className="animate-spin" />}
                          Vérifier
                        </button>
                      </div>
                    )}
                  </>
                )}
                {otpError && (
                  <p role="alert" className="mt-2 text-sm font-medium text-red-600">
                    {otpError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (currentStep === 2) {
      return (
        <motion.div key="profile" {...stepMotion} className="space-y-6">
          <div>
            <p className="text-sm font-black text-teal-700">Étape 2 sur 3</p>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Votre profil</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Complétez les informations professionnelles et ajoutez une photo d’identité récente.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profession" className="mb-2 block text-sm font-bold text-slate-800">
                Profession <span className="text-red-600">*</span>
              </label>
              <input
                type="hidden"
                {...register('profession', { required: 'Sélectionnez votre profession.' })}
              />
              <ProfessionCombobox
                id="profession"
                value={values.profession}
                options={MEMBER_PROFESSIONS}
                onChange={(profession) =>
                  setValue('profession', profession, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                hasError={Boolean(errors.profession)}
                describedBy={errors.profession ? 'profession-error' : undefined}
                disabled={isSubmitting}
              />
              <FieldError id="profession-error" message={errors.profession?.message} />
            </div>

            {showProfessionAutre && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label htmlFor="professionAutre" className="mb-2 block text-sm font-bold text-slate-800">
                  Précisez votre profession <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Briefcase size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="professionAutre"
                    type="text"
                    autoComplete="organization-title"
                    className={`${inputClass(Boolean(errors.professionAutre))} pl-11`}
                    aria-invalid={Boolean(errors.professionAutre)}
                    aria-describedby={errors.professionAutre ? 'professionAutre-error' : undefined}
                    placeholder="Ex. Médecin du travail, anesthésiste, prothésiste dentaire…"
                    maxLength={120}
                    {...register('professionAutre', {
                      validate: (value) => {
                        if (!isOtherProfession(getValues('profession'))) return true;
                        return validateProfessionAutre(normalizeProfessionAutre(value)) ?? true;
                      },
                    })}
                  />
                </div>
                <FieldError id="professionAutre-error" message={errors.professionAutre?.message} />
              </motion.div>
            )}

            <div>
              <label htmlFor="address" className="mb-2 block text-sm font-bold text-slate-800">
                Adresse ou ville <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <MapPin size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="address"
                  type="text"
                  autoComplete="street-address"
                  className={`${inputClass(Boolean(errors.address))} pl-11`}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  placeholder="Ex. Dakar, Sénégal"
                  {...register('address', {
                    required: 'L’adresse ou la ville est requise.',
                    validate: (value) => validateVillage(value) ?? true,
                  })}
                />
              </div>
              <FieldError id="address-error" message={errors.address?.message} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Photo d’identité <span className="text-red-600">*</span>
            </label>
            <div
              {...getRootProps()}
              className={`rounded-2xl border-2 border-dashed p-5 outline-none transition focus-visible:ring-4 focus-visible:ring-teal-100 sm:p-6 ${
                isDragActive
                  ? 'border-teal-600 bg-teal-50'
                  : photoError
                    ? 'border-red-300 bg-red-50/60'
                    : 'border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/50'
              }`}
            >
              <input {...getInputProps()} aria-label="Ajouter une photo d’identité" />
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Aperçu de la photo sélectionnée" className="h-full w-full object-cover" />
                  ) : (
                    <Camera size={32} className="text-slate-300" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-black text-slate-900">
                    {photoFile ? photoFile.name : isDragActive ? 'Déposez la photo ici' : 'Glissez votre photo dans cette zone'}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    JPG, JPEG, PNG ou WEBP · 2 Mo maximum · {MIN_PHOTO_DIMENSION} × {MIN_PHOTO_DIMENSION} px minimum
                  </p>
                  {photoFile && (
                    <p
                      className={`mt-1 flex items-center justify-center gap-1.5 text-xs font-semibold sm:justify-start ${
                        photoUploadStatus === 'error' ? 'text-red-600' : 'text-teal-700'
                      }`}
                      aria-live="polite"
                    >
                      {formatFileSize(photoFile.size)} ·{' '}
                      {photoUploadStatus === 'uploading' && (
                        <>
                          <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                          Téléversement en cours…
                        </>
                      )}
                      {photoUploadStatus === 'done' && (
                        <>
                          <CheckCircle size={13} aria-hidden="true" />
                          Photo enregistrée
                        </>
                      )}
                      {photoUploadStatus === 'error' && 'Téléversement échoué'}
                      {photoUploadStatus === 'idle' && 'Photo prête'}
                    </p>
                  )}
                  <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row sm:justify-start">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        open();
                      }}
                      disabled={isSubmitting || photoUploadStatus === 'uploading'}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-black text-white hover:bg-teal-800 disabled:opacity-50"
                    >
                      <Upload size={16} /> Choisir une photo
                    </button>
                    {photoUploadStatus === 'error' && photoFile && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRetryPhotoUpload();
                        }}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-600 bg-white px-4 py-2.5 text-sm font-black text-teal-700 hover:bg-teal-50 disabled:opacity-50"
                      >
                        <RotateCcw size={16} /> Réessayer le téléversement
                      </button>
                    )}
                    {photoFile && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRemovePhoto();
                        }}
                        disabled={isSubmitting || photoUploadStatus === 'uploading'}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-600 hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                      >
                        <X size={16} /> Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <FieldError id="photo-error" message={photoError} />
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div key="review" {...stepMotion} className="space-y-6">
        <div>
          <p className="text-sm font-black text-teal-700">Étape 3 sur 3</p>
          <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Vérification de la demande</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Relisez les informations qui seront transmises à l’équipe ASFO.
          </p>
        </div>

        {validationMessages.length > 0 && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="font-black text-red-900">Éléments à corriger</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
              {[...new Set(validationMessages)].map((message) => <li key={message}>{message}</li>)}
            </ul>
          </div>
        )}

        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/60 px-5">
          {[
            ['Nom complet', fullName],
            ['Email', values.email],
            ['Téléphone', readablePhone],
            ['Profession', selectedProfession],
            ['Adresse / ville', values.address],
            [
              'Photo',
              photoFile
                ? `${photoFile.name} · ${formatFileSize(photoFile.size)}${
                    photoUploadStatus === 'done'
                      ? ' · enregistrée'
                      : photoUploadStatus === 'uploading'
                        ? ' · téléversement en cours…'
                        : photoUploadStatus === 'error'
                          ? ' · téléversement à refaire'
                          : ''
                  }`
                : 'Non ajoutée',
            ],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-4 text-sm sm:grid-cols-[135px_1fr] sm:gap-5">
              <span className="text-slate-500">{label}</span>
              <span className="break-words font-bold text-slate-900">{value || 'Non renseigné'}</span>
            </div>
          ))}
        </div>

        <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${errors.acceptTerms ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white hover:border-teal-300'}`}>
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            aria-invalid={Boolean(errors.acceptTerms)}
            aria-describedby={errors.acceptTerms ? 'terms-error' : 'terms-help'}
            {...register('acceptTerms', {
              required: 'Vous devez accepter les critères d’adhésion et les règles de l’ASFO.',
            })}
          />
          <span className="text-sm leading-6 text-slate-700">
            <strong>J’ai lu et j’accepte les critères d’adhésion et les règles de l’ASFO.</strong>
            <span className="text-red-600"> *</span>
            <span id="terms-help" className="mt-1 block text-xs text-slate-500">
              Vos informations sont utilisées pour instruire votre demande. Consultez aussi notre{' '}
              <Link to="/privacy" className="font-bold text-teal-700 underline underline-offset-2">politique de confidentialité</Link>.
            </span>
          </span>
        </label>
        <FieldError id="terms-error" message={errors.acceptTerms?.message} />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <WalletCards className="shrink-0 text-amber-700" size={23} />
            <div>
              <p className="font-black text-amber-950">2 500 FCFA</p>
              <p className="text-xs text-amber-900/75">Aucun paiement avant validation</p>
            </div>
          </div>
          <Link to="/terms" className="text-sm font-black text-amber-900 underline underline-offset-4">
            Lire les conditions complètes
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-0 overflow-x-hidden bg-gradient-to-b from-white via-[#f4fbfa] to-white text-slate-900">
      <section className="relative overflow-hidden border-b border-teal-100/80">
        <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-teal-100/45 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 -top-20 h-[480px] w-[480px] rounded-full bg-cyan-100/40 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8 lg:py-16">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/85 px-3 py-1.5 text-xs font-black uppercase tracking-[0.13em] text-teal-800 shadow-sm">
              <Users size={14} /> Rejoignez notre communauté
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.06] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[58px]">
              Commandez votre carte membre ASFO
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Officialisez votre adhésion et participez activement à la vie d’une association engagée au service de la santé et des communautés du Fouta.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#member-request-form"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-teal-800/15 transition hover:-translate-y-0.5 hover:bg-teal-800"
              >
                Commencer ma demande <ArrowRight size={17} />
              </a>
              <a
                href="#criteres-adhesion"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-5 py-3.5 text-sm font-black text-slate-800 transition hover:border-teal-300 hover:text-teal-700"
              >
                Voir les critères d’adhésion
              </a>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
              <BadgeCheck size={17} className="text-teal-700" /> Carte membre numérique et vérifiable
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
          >
            <HeroCardComposition />
          </motion.div>
        </div>
      </section>

      <main>
        <motion.section {...pageMotion} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_22px_70px_-40px_rgba(15,23,42,0.35)] md:grid-cols-[300px_1fr]">
            <div className="relative min-h-0 overflow-hidden bg-[#eef6f4]">
              <img
                src="/images/president-asfo.jpg"
                alt="Dr Abdaramani Ndiaye, 21e Président de l’ASFO"
                className="h-full min-h-[340px] w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xl font-black">Dr Abdaramani Ndiaye</p>
                <p className="mt-1 text-sm font-semibold text-teal-100">21e Président de l’ASFO</p>
              </div>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-teal-700">
                <BadgeCheck size={14} /> Président actuel
              </span>
              <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Une communauté engagée, ouverte à toutes les compétences
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                La 21e Présidence invite les professionnels de santé, étudiants, bénévoles et citoyens engagés à rejoindre l’ASFO et à contribuer durablement à ses missions.
              </p>
              <div className="mt-6 border-l-2 border-teal-600 pl-4">
                <p className="font-serif text-xl italic text-slate-800">Dr Abdaramani Ndiaye</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.13em] text-teal-700">21e Président de l’ASFO</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="criteres-adhesion" {...pageMotion} className="scroll-mt-24 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Adhérer à l’ASFO</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Les six critères d’adhésion</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Ces engagements structurent la vie associative et s’appliquent à toute nouvelle demande de carte membre.
            </p>
          </div>
          <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CRITERIA.map((criterion, index) => {
              const Icon = criterion.icon;
              return (
                <motion.article
                  key={criterion.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: reduceMotion ? 0 : index * 0.05 }}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Icon size={21} /></span>
                    <span className="text-3xl font-black text-slate-100">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-black text-slate-950">{criterion.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{criterion.description}</p>
                  <span className="mt-5 inline-flex w-fit rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">{criterion.condition}</span>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section {...pageMotion} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-6 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm"><WalletCards size={23} /></span>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.13em] text-amber-800">Coût de la carte membre</p>
              <p className="mt-2 text-4xl font-black tracking-tight text-amber-950">2 500 FCFA</p>
              <p className="mt-3 text-sm leading-6 text-amber-950/75">Le paiement intervient uniquement après validation de votre demande.</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-2 text-xs font-black text-amber-900">
                <LockKeyhole size={14} /> Aucun paiement avant validation
              </span>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.13em] text-teal-700">Parcours d’adhésion</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">De la demande à la carte numérique</h2>
              <ol className="mt-7 grid gap-5 lg:grid-cols-6">
                {MEMBERSHIP_STEPS.map((step, index) => (
                  <li key={step.title} className="relative flex gap-4 lg:block">
                    {index < MEMBERSHIP_STEPS.length - 1 && (
                      <span className="absolute left-[17px] top-9 h-[calc(100%+20px)] w-px bg-teal-200 lg:left-[34px] lg:top-[17px] lg:h-px lg:w-[calc(100%-12px)]" aria-hidden="true" />
                    )}
                    <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-black text-white">{index + 1}</span>
                    <div className="lg:mt-3">
                      <h3 className="text-sm font-black text-slate-900">{step.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </motion.section>

        <motion.section id="member-request-form" {...pageMotion} className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Demande de carte membre</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Complétez votre demande en trois étapes</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Les champs marqués d’un astérisque sont obligatoires. La carte ne sera jamais créée automatiquement.</p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_22px_70px_-40px_rgba(15,23,42,0.35)]"
            >
              <div
                role="progressbar"
                aria-label="Progression de la demande"
                aria-valuemin={1}
                aria-valuemax={3}
                aria-valuenow={currentStep}
                aria-valuetext={`Étape ${currentStep} sur 3 : ${FORM_STEPS[currentStep - 1].title}`}
                className="border-b border-slate-100 bg-slate-50 px-5 py-5 sm:px-8"
              >
                <div className="grid grid-cols-3 gap-2">
                  {FORM_STEPS.map((step) => {
                    const Icon = step.icon;
                    const active = currentStep === step.id;
                    const complete = currentStep > step.id;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => void goToStep(step.id)}
                        aria-current={active ? 'step' : undefined}
                        className={`flex flex-col items-center rounded-xl px-2 py-2 text-center transition sm:flex-row sm:gap-3 sm:text-left ${
                          active ? 'bg-white shadow-sm ring-1 ring-teal-200' : 'hover:bg-white/70'
                        }`}
                      >
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          complete ? 'bg-teal-700 text-white' : active ? 'bg-teal-50 text-teal-700' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {complete ? <Check size={17} /> : <Icon size={17} />}
                        </span>
                        <span className="mt-1 min-w-0 sm:mt-0">
                          <span className={`block text-xs font-black sm:text-sm ${active ? 'text-teal-900' : 'text-slate-700'}`}>{step.title}</span>
                          <span className="hidden text-xs text-slate-400 sm:block">{step.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all duration-300" style={{ width: `${currentStep * (100 / 3)}%` }} />
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <AnimatePresence mode="wait">{renderFormStep()}</AnimatePresence>

                {submitError && (
                  <div role="alert" className="mt-7 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <AlertCircle size={19} className="mt-0.5 shrink-0" />
                    {submitError}
                  </div>
                )}

                {isSubmitting && uploadStage && (
                  <div aria-live="polite" className="mt-7 rounded-xl border border-teal-200 bg-teal-50 p-4">
                    <div className="flex items-center gap-3 text-sm font-black text-teal-900">
                      <Loader2 size={18} className="animate-spin" /> {uploadStage}
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-teal-100">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-teal-600" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-100 hover:text-teal-700 disabled:opacity-50 sm:w-auto"
                  >
                    <Save size={16} /> Enregistrer le brouillon
                  </button>
                  {draftSavedAt && (
                    <span role="status" className="text-xs text-slate-400">
                      Enregistré à {new Date(draftSavedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((step) => step - 1)}
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:border-teal-300 hover:text-teal-700 disabled:opacity-50 sm:w-auto"
                    >
                      <ArrowLeft size={16} /> Précédent
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => void goToStep(currentStep + 1)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white hover:bg-teal-800 sm:w-auto"
                    >
                      Suivant <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      // L’envoi attend la référence de photo renvoyée par le
                      // serveur : sans cela le clic partait avant la fin du
                      // téléversement de l’étape 2.
                      disabled={
                        isSubmitting || !acceptTerms || photoUploadStatus === 'uploading'
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-800/15 hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {isSubmitting || photoUploadStatus === 'uploading' ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <CreditCard size={17} />
                      )}
                      {photoUploadStatus === 'uploading'
                        ? 'Téléversement de la photo…'
                        : isSubmitting
                          ? 'Envoi en cours…'
                          : 'Envoyer ma demande'}
                    </button>
                  )}
                </div>
              </div>
            </form>

            <aside className="min-w-0 self-start rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-teal-700">Votre future carte membre</p>
                  <p className="mt-1 text-sm text-slate-500">L’aperçu se met à jour avec vos informations.</p>
                </div>
                <CreditCard className="shrink-0 text-teal-700" />
              </div>
              <div className="mt-5 overflow-hidden rounded-2xl bg-slate-50 py-5">
                <ResponsiveMemberPreview
                  fullName={fullName}
                  profession={selectedProfession}
                  phone={readablePhone}
                  address={values.address}
                  email={values.email}
                  photo={photoPreview}
                />
              </div>
              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-900">
                Aucun numéro officiel, QR de vérification ou date d’expiration n’est généré avant la validation humaine et le paiement confirmé.
              </div>
            </aside>
          </div>
        </motion.section>

        <motion.section {...pageMotion} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Une carte utile et vérifiable</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Les avantages réellement prévus</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article key={benefit.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Icon size={21} /></span>
                  <h3 className="mt-4 font-black text-slate-950">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </motion.section>

        <motion.section {...pageMotion} className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">FAQ adhésion</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Vos questions sur la carte membre</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Les réponses reflètent le fonctionnement actuel du portail et n’annoncent aucun délai non publié.</p>
              <Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
                Contacter l’association <ArrowRight size={16} />
              </Link>
            </div>
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 px-5">
              {FAQ_ITEMS.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-slate-900">
                    {item.question}
                    <ChevronDown size={18} className="shrink-0 text-slate-400 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 pr-8 text-sm leading-6 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[28px] border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-7 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-200/35 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Rejoindre l’ASFO</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Rejoignez une communauté engagée au service de la santé.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Devenez membre de l’ASFO et participez activement à ses missions, rencontres et actions communautaires.</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <a href="#member-request-form" className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-black text-white hover:bg-teal-800">
                  Commencer ma demande <ArrowRight size={16} />
                </a>
                <Link to="/about" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-black text-slate-700 hover:border-teal-300 hover:text-teal-700">Découvrir l’ASFO</Link>
                <Link to="/contact" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-black text-teal-800 hover:bg-white/70">Contacter l’association</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MemberCardPage;
