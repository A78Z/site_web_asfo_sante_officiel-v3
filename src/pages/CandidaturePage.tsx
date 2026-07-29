import React, { useCallback, useMemo, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileRejection, useDropzone } from 'react-dropzone';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle,
  ChevronDown,
  ClipboardCheck,
  Copy,
  Download,
  ExternalLink,
  FileEdit,
  FileText,
  HeartPulse,
  Home,
  Loader2,
  Mail,
  MapPin,
  MousePointerClick,
  Phone,
  Save,
  Send,
  Shield,
  UploadCloud,
  Users,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createObject, queryObjects, uploadFile } from '../lib/parse';
import { getCommunes, getDepartements, getRegions } from '../data/senegal-geo';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DRAFT_KEY = 'asfo-candidature-draft-v1';

const candidatureSchema = z.object({
  nomVillage: z.string().trim().min(2, 'Le nom du village est requis (2 caractères minimum).'),
  region: z.string().min(1, 'Veuillez sélectionner une région.'),
  departement: z.string().min(1, 'Veuillez sélectionner un département.'),
  commune: z.string().min(1, 'Veuillez sélectionner une commune.'),
  population: z.string().optional(),
  distanceCentreSante: z.string().optional(),
  posteSante: z.string().optional(),
  nomAmicale: z.string().trim().min(2, "Le nom de l'association ou de l'organisation est requis."),
  universite: z.string().optional(),
  nomContact: z.string().trim().min(2, 'Le nom du contact principal est requis.'),
  fonction: z.string().optional(),
  email: z.string().trim().email('Saisissez une adresse email valide.'),
  telephone: z
    .string()
    .trim()
    .regex(/^(\+221)?[0-9\s-]{9,}$/, 'Numéro sénégalais invalide (ex. +221 77 123 45 67).'),
  description: z.string().trim().min(100, 'La description doit contenir au moins 100 caractères.'),
  conditions: z.boolean().refine((value) => value, {
    message: 'Vous devez certifier l’exactitude des informations avant l’envoi.',
  }),
});

type CandidatureFormData = z.infer<typeof candidatureSchema>;
type FormField = keyof CandidatureFormData;

interface UploadedFile {
  file: File;
  label: string;
}

interface SubmissionSummary {
  village: string;
  organisation: string;
  submittedAt: Date;
}

interface DraftPayload {
  values: Partial<CandidatureFormData>;
  savedAt: string;
}

const allRegions = getRegions();

const DEFAULT_VALUES: CandidatureFormData = {
  nomVillage: '',
  region: '',
  departement: '',
  commune: '',
  population: '',
  distanceCentreSante: '',
  posteSante: '',
  nomAmicale: '',
  universite: '',
  nomContact: '',
  fonction: '',
  email: '',
  telephone: '',
  description: '',
  conditions: false,
};

const FORM_STEPS = [
  { id: 1, title: 'Localité', short: 'Localité', description: 'Village et localisation', icon: MapPin },
  { id: 2, title: 'Organisation', short: 'Organisation', description: 'Structure et contact', icon: Users },
  { id: 3, title: 'Situation sanitaire', short: 'Situation', description: 'Contexte et besoins', icon: HeartPulse },
  { id: 4, title: 'Documents', short: 'Documents', description: 'Dossier au format PDF', icon: UploadCloud },
  { id: 5, title: 'Vérification', short: 'Vérification', description: 'Relire et transmettre', icon: ClipboardCheck },
] as const;

const STEP_FIELDS: Record<number, FormField[]> = {
  1: ['nomVillage', 'region', 'departement', 'commune'],
  2: ['nomAmicale', 'nomContact', 'email', 'telephone'],
  3: ['description'],
  4: [],
  5: ['conditions'],
};

const REQUIRED_DOCUMENTS = [
  {
    title: "Lettre adressée au Président de l'ASFO",
    description: 'Une demande formelle signée par la structure candidate.',
  },
  {
    title: 'Situation géographique du village',
    description: 'Les repères utiles pour localiser et accéder au village.',
  },
  {
    title: 'Situation sanitaire du village',
    description: 'Les besoins prioritaires et les principales difficultés constatées.',
  },
  {
    title: 'Frais de dossier : 20 000 FCFA',
    description: 'Le règlement intervient après l’enregistrement de la candidature.',
  },
];

const PROCESS_STEPS = [
  { icon: MousePointerClick, title: 'S’informer', description: 'Lire le guide officiel' },
  { icon: FileText, title: 'Préparer', description: 'Rassembler les pièces' },
  { icon: FileEdit, title: 'Compléter', description: 'Renseigner le formulaire' },
  { icon: UploadCloud, title: 'Transmettre', description: 'Ajouter le dossier PDF' },
  { icon: Send, title: 'Valider', description: 'Vérifier puis envoyer' },
];

const FAQ_ITEMS = [
  {
    question: 'Qui peut déposer une candidature ?',
    answer:
      'Une association de développement, une amicale d’étudiants, un comité local ou une collectivité souhaitant accueillir une caravane médicale.',
  },
  {
    question: 'Quand faut-il régler les frais de dossier ?',
    answer:
      'Le règlement de 20 000 FCFA est demandé après l’enregistrement. Les instructions et les numéros de paiement apparaissent sur la confirmation.',
  },
  {
    question: 'Puis-je modifier un dossier déjà envoyé ?',
    answer:
      'Le portail ne permet pas encore la modification autonome. Contactez l’ASFO en indiquant votre numéro de dossier.',
  },
  {
    question: 'Comment suivre l’avancement de ma demande ?',
    answer:
      'Conservez votre numéro de dossier et communiquez-le à l’ASFO par téléphone ou par email. Aucun délai fixe de traitement n’est publié.',
  },
];

const inputClass = (hasError?: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 ring-4 ring-red-50 focus:border-red-500'
      : 'border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-50'
  }`;

const loadDraft = (): DraftPayload | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as DraftPayload;
  } catch {
    return null;
  }
};

const FieldError: React.FC<{ id: string; message?: string }> = ({ id, message }) => {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-red-600">
      <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
};

const StepCard: React.FC<{
  step: (typeof FORM_STEPS)[number];
  active: boolean;
  complete: boolean;
  onSelect: () => void;
}> = ({ step, active, complete, onSelect }) => {
  const Icon = step.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? 'step' : undefined}
      className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
        active
          ? 'border-teal-300 bg-teal-50 shadow-sm'
          : 'border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50'
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          complete ? 'bg-teal-700 text-white' : active ? 'bg-white text-teal-700' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {complete ? <Check size={17} aria-hidden="true" /> : <Icon size={17} aria-hidden="true" />}
      </span>
      <span className="min-w-0">
        <span className={`block text-sm font-bold ${active ? 'text-teal-900' : 'text-slate-800'}`}>
          {step.id}. {step.title}
        </span>
        <span className="block truncate text-xs text-slate-500">{step.description}</span>
      </span>
    </button>
  );
};

const SuccessCard: React.FC<{
  numeroDossier: string;
  summary: SubmissionSummary;
  onReset: () => void;
}> = ({ numeroDossier, summary, onReset }) => {
  const [copied, setCopied] = useState(false);

  const copyNumeroDossier = async () => {
    try {
      await navigator.clipboard.writeText(numeroDossier);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = numeroDossier;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  const formattedDate = summary.submittedAt.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const downloadReceipt = () => {
    const receipt = `
═══════════════════════════════════════════
        REÇU DE CANDIDATURE - ASFO
        Caravane de Santé
═══════════════════════════════════════════

Numéro de dossier : ${numeroDossier}
Date : ${formattedDate}
Village : ${summary.village}
Organisation : ${summary.organisation}
Statut : En attente

───────────────────────────────────────────
PAIEMENT DES FRAIS DE DOSSIER
Montant : 20 000 F CFA
Téléphone 1 : +221 77 879 20 62
Téléphone 2 : +221 77 090 88 49

───────────────────────────────────────────
Votre candidature a bien été enregistrée.
Conservez ce numéro et communiquez-le pour
toute demande concernant votre dossier.

ASFO — Action Sanitaire pour le Fouta
UCAD Dakar
═══════════════════════════════════════════
    `;
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `recu-candidature-${numeroDossier}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-[#F5F8F7] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-36px_rgba(15,118,110,0.35)]"
      >
        <div className="border-b border-slate-100 bg-gradient-to-br from-teal-50 via-white to-emerald-50 px-6 py-10 text-center sm:px-10">
          <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-teal-700 text-white shadow-lg shadow-teal-700/20">
            <CheckCircle size={32} aria-hidden="true" />
          </span>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Candidature enregistrée</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Votre candidature a bien été enregistrée
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Votre dossier est désormais transmis à l’équipe ASFO pour examen.
          </p>
        </div>

        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">Numéro de dossier</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="font-mono text-2xl font-black text-teal-950 sm:text-3xl">{numeroDossier}</p>
                <button
                  type="button"
                  onClick={copyNumeroDossier}
                  className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
                >
                  {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              </div>
            </div>

            <dl className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200 px-5">
              {[
                ['Date de dépôt', formattedDate],
                ['Village', summary.village],
                ['Organisation', summary.organisation],
                ['Statut', 'En attente'],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[120px_1fr] gap-4 py-3.5 text-sm">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="font-semibold text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-700">
                <AlertTriangle size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-amber-800">Prochaine étape</p>
                <h2 className="text-lg font-black text-slate-950">Régler les frais de dossier</h2>
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-amber-800">20 000 F CFA</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Envoyez le règlement par Wave ou Orange Money en mentionnant votre numéro de dossier.
            </p>
            <div className="mt-4 space-y-2">
              <a href="tel:+221778792062" className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-800 hover:text-teal-700">
                <Phone size={16} className="text-teal-700" /> +221 77 879 20 62
              </a>
              <a href="tel:+221770908849" className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-800 hover:text-teal-700">
                <Phone size={16} className="text-teal-700" /> +221 77 090 88 49
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="text-sm text-slate-600">Conservez le reçu et votre numéro de dossier.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={downloadReceipt}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 hover:border-teal-300 hover:text-teal-700"
            >
              <Download size={16} /> Télécharger le reçu
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white hover:bg-teal-800"
            >
              <FileEdit size={16} /> Nouvelle candidature
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              <Home size={16} /> Accueil
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const CandidaturePage: React.FC = () => {
  const initialDraft = useMemo(loadDraft, []);
  const shouldReduceMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [numeroDossier, setNumeroDossier] = useState('');
  const [submissionSummary, setSubmissionSummary] = useState<SubmissionSummary | null>(null);
  const [fileError, setFileError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [uploadStage, setUploadStage] = useState('');
  const [draftSavedAt, setDraftSavedAt] = useState(initialDraft?.savedAt ?? '');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<CandidatureFormData>({
    resolver: zodResolver(candidatureSchema),
    mode: 'onTouched',
    defaultValues: {
      ...DEFAULT_VALUES,
      ...(initialDraft?.values ?? {}),
      conditions: false,
    },
  });

  const values = watch();
  const selectedRegion = values.region;
  const selectedDepartement = values.departement;
  const descriptionLength = values.description?.length ?? 0;

  const departementsList = useMemo(
    () => (selectedRegion ? getDepartements(selectedRegion) : []),
    [selectedRegion],
  );
  const communesList = useMemo(
    () => (selectedDepartement ? getCommunes(selectedDepartement) : []),
    [selectedDepartement],
  );

  const stepCompletion = useMemo(
    () => ({
      1: Boolean(values.nomVillage && values.region && values.departement && values.commune),
      2: Boolean(values.nomAmicale && values.nomContact && values.email && values.telephone),
      3: descriptionLength >= 100,
      4: uploadedFiles.length > 0,
      5: Boolean(values.conditions),
    }),
    [descriptionLength, uploadedFiles.length, values],
  );

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('region', event.target.value, { shouldValidate: true, shouldDirty: true });
    setValue('departement', '', { shouldValidate: false, shouldDirty: true });
    setValue('commune', '', { shouldValidate: false, shouldDirty: true });
  };

  const handleDepartementChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('departement', event.target.value, { shouldValidate: true, shouldDirty: true });
    setValue('commune', '', { shouldValidate: false, shouldDirty: true });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFileError('');
    const uniqueFiles = acceptedFiles.filter((file) => {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      return isPdf && file.size <= MAX_FILE_SIZE;
    });
    setUploadedFiles((previous) => {
      const existing = new Set(previous.map((item) => `${item.file.name}-${item.file.size}`));
      return [
        ...previous,
        ...uniqueFiles
          .filter((file) => !existing.has(`${file.name}-${file.size}`))
          .map((file) => ({ file, label: file.name })),
      ];
    });
  }, []);

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    const tooLarge = rejections.some((item) => item.errors.some((error) => error.code === 'file-too-large'));
    setFileError(
      tooLarge
        ? 'Chaque fichier doit peser 5 Mo maximum.'
        : 'Seuls les fichiers PDF sont acceptés.',
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_FILE_SIZE,
    multiple: true,
    disabled: isSubmitting,
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const removeFile = (index: number) => {
    setUploadedFiles((previous) => previous.filter((_, fileIndex) => fileIndex !== index));
  };

  const saveDraft = () => {
    const draftValues = { ...getValues(), conditions: false };
    const savedAt = new Date().toISOString();
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ values: draftValues, savedAt }));
      setDraftSavedAt(savedAt);
    } catch {
      setSubmitError('Le brouillon n’a pas pu être enregistré sur cet appareil.');
    }
  };

  const goToStep = async (targetStep: number) => {
    if (targetStep <= currentStep) {
      setCurrentStep(targetStep);
      setSubmitError('');
      return;
    }

    if (currentStep === 4 && uploadedFiles.length === 0) {
      setFileError('Ajoutez au moins un fichier PDF avant de continuer.');
      return;
    }

    const valid = await trigger(STEP_FIELDS[currentStep], { shouldFocus: true });
    if (!valid) return;

    setCurrentStep(Math.min(targetStep, currentStep + 1));
    setSubmitError('');
    window.setTimeout(() => document.getElementById('candidature-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const generateNumeroDossier = async (): Promise<string> => {
    const year = new Date().getFullYear();
    const prefix = `ASFO-${year}-`;
    const { results } = await queryObjects<{ numeroDossier?: string }>('Candidatures', {
      where: { numeroDossier: { $regex: `^${prefix}` } },
      order: '-numeroDossier',
      limit: 1,
      keys: 'numeroDossier',
    });

    let nextNumber = 1;
    if (results[0]?.numeroDossier) {
      const lastPart = results[0].numeroDossier.split('-').pop();
      const parsed = lastPart ? Number.parseInt(lastPart, 10) : 0;
      if (!Number.isNaN(parsed)) nextNumber = parsed + 1;
    }
    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  };

  const onSubmit = async (data: CandidatureFormData) => {
    if (isSubmitting) return;
    if (uploadedFiles.length === 0) {
      setCurrentStep(4);
      setFileError('Ajoutez au moins un fichier PDF avant l’envoi.');
      return;
    }

    setFileError('');
    setSubmitError('');
    setIsSubmitting(true);
    setUploadStage('Préparation sécurisée du dossier…');

    try {
      const numero = await generateNumeroDossier();
      setUploadStage('Téléversement des documents…');
      const uploadedDocs = await Promise.all(
        uploadedFiles.map(async (uploadedFile) => {
          const parsedFile = await uploadFile(uploadedFile.file.name, uploadedFile.file);
          return { label: uploadedFile.label, ...parsedFile };
        }),
      );

      setUploadStage('Enregistrement de la candidature…');
      await createObject('Candidatures', {
        numeroDossier: numero,
        nomVillage: data.nomVillage,
        region: data.region,
        departement: data.departement,
        commune: data.commune,
        population: data.population || '',
        distanceCentreSante: data.distanceCentreSante || '',
        posteSante: data.posteSante || '',
        nomAmicale: data.nomAmicale,
        universite: data.universite || '',
        nomContact: data.nomContact,
        fonction: data.fonction || '',
        email: data.email,
        telephone: data.telephone,
        description: data.description,
        conditionsAcceptees: data.conditions,
        statut: 'En attente',
        documents: uploadedDocs,
        dossierPDF: uploadedDocs[0],
      });

      const submittedAt = new Date();
      setNumeroDossier(numero);
      setSubmissionSummary({
        village: data.nomVillage,
        organisation: data.nomAmicale,
        submittedAt,
      });
      window.localStorage.removeItem(DRAFT_KEY);
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting candidature:', error);
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      setSubmitError(`La candidature n’a pas pu être envoyée : ${message}. Vérifiez votre connexion puis réessayez.`);
    } finally {
      setUploadStage('');
      setIsSubmitting(false);
    }
  };

  const handleInvalidSubmit = (invalidErrors: FieldErrors<CandidatureFormData>) => {
    const invalidStep = FORM_STEPS.find((step) => {
      if (step.id === 4) return uploadedFiles.length === 0;
      return STEP_FIELDS[step.id].some((field) => Boolean(invalidErrors[field]));
    });
    if (invalidStep) setCurrentStep(invalidStep.id);
    setSubmitError('Vérifiez les champs signalés avant de transmettre la candidature.');
  };

  const handleReset = () => {
    setSubmitSuccess(false);
    setNumeroDossier('');
    setSubmissionSummary(null);
    setUploadedFiles([]);
    setCurrentStep(1);
    setDraftSavedAt('');
    reset(DEFAULT_VALUES);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitSuccess && submissionSummary) {
    return (
      <SuccessCard
        numeroDossier={numeroDossier}
        summary={submissionSummary}
        onReset={handleReset}
      />
    );
  }

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.22 },
      };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <motion.div key="step-1" {...motionProps} className="space-y-6">
          <div>
            <p className="text-sm font-bold text-teal-700">Étape 1 sur 5</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Informations sur la localité</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Identifiez précisément le village candidat. Les listes sont reliées pour éviter les erreurs de localisation.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nomVillage" className="mb-2 block text-sm font-bold text-slate-800">
                Nom du village <span className="text-red-600">*</span>
              </label>
              <input
                id="nomVillage"
                type="text"
                autoComplete="address-level3"
                aria-invalid={Boolean(errors.nomVillage)}
                aria-describedby={errors.nomVillage ? 'nomVillage-error' : undefined}
                className={inputClass(Boolean(errors.nomVillage))}
                placeholder="Ex. Thilogne"
                {...register('nomVillage')}
              />
              <FieldError id="nomVillage-error" message={errors.nomVillage?.message} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="region" className="mb-2 block text-sm font-bold text-slate-800">
                Région <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  id="region"
                  aria-invalid={Boolean(errors.region)}
                  aria-describedby={errors.region ? 'region-error' : undefined}
                  className={`${inputClass(Boolean(errors.region))} appearance-none pr-10`}
                  {...register('region')}
                  onChange={handleRegionChange}
                >
                  <option value="">Sélectionnez une région</option>
                  {allRegions.map((region) => <option key={region} value={region}>{region}</option>)}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <FieldError id="region-error" message={errors.region?.message} />
            </div>

            <div>
              <label htmlFor="departement" className="mb-2 block text-sm font-bold text-slate-800">
                Département <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  id="departement"
                  disabled={!selectedRegion}
                  aria-invalid={Boolean(errors.departement)}
                  aria-describedby={errors.departement ? 'departement-error' : 'departement-help'}
                  className={`${inputClass(Boolean(errors.departement))} appearance-none pr-10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                  {...register('departement')}
                  onChange={handleDepartementChange}
                >
                  <option value="">{selectedRegion ? 'Sélectionnez un département' : 'Choisissez d’abord une région'}</option>
                  {departementsList.map((departement) => (
                    <option key={departement} value={departement}>{departement}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              {!selectedRegion && <p id="departement-help" className="mt-2 text-xs text-slate-500">La région détermine les départements proposés.</p>}
              <FieldError id="departement-error" message={errors.departement?.message} />
            </div>

            <div>
              <label htmlFor="commune" className="mb-2 block text-sm font-bold text-slate-800">
                Commune <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  id="commune"
                  disabled={!selectedDepartement}
                  aria-invalid={Boolean(errors.commune)}
                  aria-describedby={errors.commune ? 'commune-error' : 'commune-help'}
                  className={`${inputClass(Boolean(errors.commune))} appearance-none pr-10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                  {...register('commune')}
                >
                  <option value="">{selectedDepartement ? 'Sélectionnez une commune' : 'Choisissez d’abord un département'}</option>
                  {communesList.map((commune) => <option key={commune} value={commune}>{commune}</option>)}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              {!selectedDepartement && <p id="commune-help" className="mt-2 text-xs text-slate-500">Le département détermine les communes proposées.</p>}
              <FieldError id="commune-error" message={errors.commune?.message} />
            </div>

            <div>
              <label htmlFor="population" className="mb-2 block text-sm font-bold text-slate-800">Population estimée <span className="font-normal text-slate-400">(facultatif)</span></label>
              <input id="population" type="text" inputMode="numeric" className={inputClass()} placeholder="Ex. 5 000 habitants" {...register('population')} />
            </div>
            <div>
              <label htmlFor="distanceCentreSante" className="mb-2 block text-sm font-bold text-slate-800">Distance du centre de santé <span className="font-normal text-slate-400">(facultatif)</span></label>
              <input id="distanceCentreSante" type="text" className={inputClass()} placeholder="Ex. 35 km" {...register('distanceCentreSante')} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="posteSante" className="mb-2 block text-sm font-bold text-slate-800">Poste de santé existant <span className="font-normal text-slate-400">(facultatif)</span></label>
              <input id="posteSante" type="text" className={inputClass()} placeholder="Précisez le nom ou indiquez « Aucun »" {...register('posteSante')} />
            </div>
          </div>
        </motion.div>
      );
    }

    if (currentStep === 2) {
      return (
        <motion.div key="step-2" {...motionProps} className="space-y-6">
          <div>
            <p className="text-sm font-bold text-teal-700">Étape 2 sur 5</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Association ou organisation</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Renseignez la structure porteuse et la personne que l’ASFO pourra contacter.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nomAmicale" className="mb-2 block text-sm font-bold text-slate-800">Nom de l’association / organisation <span className="text-red-600">*</span></label>
              <input
                id="nomAmicale"
                type="text"
                className={inputClass(Boolean(errors.nomAmicale))}
                aria-invalid={Boolean(errors.nomAmicale)}
                aria-describedby={errors.nomAmicale ? 'nomAmicale-error' : undefined}
                placeholder="Ex. Amicale des étudiants de Thilogne"
                {...register('nomAmicale')}
              />
              <FieldError id="nomAmicale-error" message={errors.nomAmicale?.message} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="universite" className="mb-2 block text-sm font-bold text-slate-800">Université ou établissement <span className="font-normal text-slate-400">(facultatif)</span></label>
              <input id="universite" type="text" className={inputClass()} placeholder="Ex. Université Cheikh Anta Diop" {...register('universite')} />
            </div>
            <div>
              <label htmlFor="nomContact" className="mb-2 block text-sm font-bold text-slate-800">Contact principal <span className="text-red-600">*</span></label>
              <input
                id="nomContact"
                type="text"
                autoComplete="name"
                className={inputClass(Boolean(errors.nomContact))}
                aria-invalid={Boolean(errors.nomContact)}
                aria-describedby={errors.nomContact ? 'nomContact-error' : undefined}
                placeholder="Prénom et nom"
                {...register('nomContact')}
              />
              <FieldError id="nomContact-error" message={errors.nomContact?.message} />
            </div>
            <div>
              <label htmlFor="fonction" className="mb-2 block text-sm font-bold text-slate-800">Fonction <span className="font-normal text-slate-400">(facultatif)</span></label>
              <input id="fonction" type="text" className={inputClass()} placeholder="Ex. Président de l’amicale" {...register('fonction')} />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-800">Adresse email <span className="text-red-600">*</span></label>
              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`${inputClass(Boolean(errors.email))} pl-11`}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  placeholder="contact@association.sn"
                  {...register('email')}
                />
              </div>
              <FieldError id="email-error" message={errors.email?.message} />
            </div>
            <div>
              <label htmlFor="telephone" className="mb-2 block text-sm font-bold text-slate-800">Téléphone <span className="text-red-600">*</span></label>
              <div className="relative">
                <Phone size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="telephone"
                  type="tel"
                  autoComplete="tel"
                  className={`${inputClass(Boolean(errors.telephone))} pl-11`}
                  aria-invalid={Boolean(errors.telephone)}
                  aria-describedby={errors.telephone ? 'telephone-error' : undefined}
                  placeholder="+221 77 123 45 67"
                  {...register('telephone')}
                />
              </div>
              <FieldError id="telephone-error" message={errors.telephone?.message} />
            </div>
          </div>
        </motion.div>
      );
    }

    if (currentStep === 3) {
      return (
        <motion.div key="step-3" {...motionProps} className="space-y-6">
          <div>
            <p className="text-sm font-bold text-teal-700">Étape 3 sur 5</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Situation sanitaire du village</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Décrivez le contexte local, les besoins médicaux prioritaires et les difficultés d’accès aux soins.
            </p>
          </div>
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-bold text-slate-800">
              Situation sanitaire et besoins <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              rows={11}
              className={`${inputClass(Boolean(errors.description))} resize-y leading-6`}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'description-error' : 'description-help'}
              placeholder="Présentez la population, les pathologies ou besoins observés, l’accès aux structures de santé et les attentes liées à la caravane…"
              {...register('description')}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p id="description-help" className="text-xs text-slate-500">Minimum 100 caractères. Évitez les données médicales nominatives.</p>
              <p className={`text-xs font-bold ${descriptionLength >= 100 ? 'text-teal-700' : 'text-slate-500'}`}>
                {descriptionLength} / 100 minimum
              </p>
            </div>
            <FieldError id="description-error" message={errors.description?.message} />
          </div>
        </motion.div>
      );
    }

    if (currentStep === 4) {
      return (
        <motion.div key="step-4" {...motionProps} className="space-y-6">
          <div>
            <p className="text-sm font-bold text-teal-700">Étape 4 sur 5</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Téléversement du dossier</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ajoutez un ou plusieurs PDF. Vous pouvez regrouper les pièces dans un dossier unique ou les joindre séparément.
            </p>
          </div>

          <div id="upload-zone">
            <div
              {...getRootProps()}
              className={`rounded-2xl border-2 border-dashed px-6 py-10 text-center outline-none transition focus-visible:ring-4 focus-visible:ring-teal-100 ${
                isDragActive
                  ? 'border-teal-600 bg-teal-50'
                  : fileError
                    ? 'border-red-300 bg-red-50/60'
                    : 'border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/50'
              }`}
            >
              <input {...getInputProps()} aria-label="Ajouter les documents PDF du dossier" />
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm">
                <UploadCloud size={27} aria-hidden="true" />
              </span>
              <p className="mt-4 font-bold text-slate-900">
                {isDragActive ? 'Déposez les fichiers ici' : 'Glissez vos PDF ou cliquez pour parcourir'}
              </p>
              <p className="mt-1 text-sm text-slate-500">PDF uniquement · 5 Mo maximum par fichier</p>
            </div>
            <FieldError id="file-error" message={fileError} />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-3" aria-live="polite">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Documents ajoutés</h3>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">{uploadedFiles.length} fichier{uploadedFiles.length > 1 ? 's' : ''}</span>
              </div>
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={`${uploadedFile.file.name}-${uploadedFile.file.size}`} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600"><FileText size={19} /></span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{uploadedFile.file.name}</p>
                      <p className="text-xs text-slate-500">{formatSize(uploadedFile.file.size)} · Prêt à être envoyé</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={isSubmitting}
                    aria-label={`Supprimer ${uploadedFile.file.name}`}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            <strong>Avant de continuer :</strong> vérifiez que les trois pièces justificatives sont présentes. Le règlement de 20 000 FCFA intervient uniquement après l’enregistrement.
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div key="step-5" {...motionProps} className="space-y-6">
        <div>
          <p className="text-sm font-bold text-teal-700">Étape 5 sur 5</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Vérification et envoi</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Relisez les informations essentielles avant de transmettre définitivement le dossier.</p>
        </div>

        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/60 px-5">
          {[
            ['Village', values.nomVillage],
            ['Localisation', [values.commune, values.departement, values.region].filter(Boolean).join(', ')],
            ['Organisation', values.nomAmicale],
            ['Contact', values.nomContact],
            ['Coordonnées', `${values.email} · ${values.telephone}`],
            ['Description', `${descriptionLength} caractères`],
            ['Documents', `${uploadedFiles.length} PDF joint${uploadedFiles.length > 1 ? 's' : ''}`],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-4 text-sm sm:grid-cols-[140px_1fr] sm:gap-5">
              <span className="text-slate-500">{label}</span>
              <span className="break-words font-semibold text-slate-900">{value || 'Non renseigné'}</span>
            </div>
          ))}
        </div>

        <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${errors.conditions ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white hover:border-teal-300'}`}>
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            aria-invalid={Boolean(errors.conditions)}
            aria-describedby={errors.conditions ? 'conditions-error' : undefined}
            {...register('conditions')}
          />
          <span className="text-sm leading-6 text-slate-700">
            Je certifie que les informations et documents fournis sont exacts, et j’autorise l’ASFO à les utiliser pour l’instruction de cette candidature. <span className="text-red-600">*</span>
          </span>
        </label>
        <FieldError id="conditions-error" message={errors.conditions?.message} />

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Important :</strong> l’envoi est définitif. Conservez le numéro de dossier affiché après validation.
        </div>
      </motion.div>
    );
  };

  const sidebarContent = (
    <>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-teal-700">Votre progression</p>
        <div className="mt-4 space-y-1">
          {FORM_STEPS.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              active={currentStep === step.id}
              complete={stepCompletion[step.id as keyof typeof stepCompletion]}
              onSelect={() => {
                void goToStep(step.id);
                setMobileSidebarOpen(false);
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-6">
        <div className="rounded-2xl bg-slate-950 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-300">Frais de dossier</p>
          <p className="mt-1 text-2xl font-black">20 000 FCFA</p>
          <p className="mt-2 text-xs leading-5 text-slate-300">Paiement par Wave ou Orange Money après l’enregistrement de la demande.</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 p-5">
        <p className="font-black text-slate-900">Besoin d’aide ?</p>
        <p className="mt-1 text-sm leading-5 text-slate-500">L’équipe ASFO peut vous accompagner.</p>
        <div className="mt-4 space-y-2 text-sm">
          <a href="tel:+221710401760" className="flex items-center gap-2 font-semibold text-slate-700 hover:text-teal-700"><Phone size={15} /> +221 71 040 17 60</a>
          <a href="mailto:contact@asfosante.org" className="flex items-center gap-2 break-all font-semibold text-slate-700 hover:text-teal-700"><Mail size={15} /> contact@asfosante.org</a>
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-[#F5F8F7] font-sans text-slate-900">
      <section className="relative overflow-hidden border-b border-teal-950/10 bg-[#EAF4F1]">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-16">
          <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-teal-800">
              <Shield size={14} /> Caravane de santé ASFO
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.06] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[58px]">
              Accueillez une caravane médicale dans votre localité
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Déposez la candidature de votre association, amicale, comité local ou collectivité grâce à un parcours clair et sécurisé.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#candidature-form" className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-teal-800/15 transition hover:-translate-y-0.5 hover:bg-teal-800">
                Commencer la candidature <ArrowRight size={17} />
              </a>
              <a href="/GUIDE_DE_CANDIDATURE_CAMPAGNE_MEDICALE_ASFO.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-5 py-3.5 text-sm font-black text-slate-800 transition hover:border-teal-300 hover:text-teal-700">
                Consulter le guide <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mx-auto w-full max-w-xl lg:mx-0"
          >
            <div className="overflow-hidden rounded-[28px] border-4 border-white bg-white shadow-[0_30px_80px_-32px_rgba(15,23,42,0.45)]">
              <img src="/last-mission.webp" alt="Équipe médicale ASFO en mission auprès d’une communauté" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-1 rounded-[24px] bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 grid grid-cols-3 gap-2 sm:left-8 sm:right-8">
              {[
                ['5 étapes', 'Parcours guidé'],
                ['PDF', '5 Mo maximum'],
                ['100 %', 'Dépôt en ligne'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-white/80 bg-white/95 p-3 text-center shadow-lg backdrop-blur">
                  <p className="text-sm font-black text-teal-800 sm:text-base">{value}</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-slate-500 sm:text-xs">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><BookOpen size={23} /></span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.13em] text-teal-700">Document officiel</p>
                    <h2 className="mt-1 text-xl font-black text-slate-950">Guide de candidature</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">Consultez les conditions et préparez votre dossier avant de commencer.</p>
                    <p className="mt-2 text-xs font-semibold text-slate-400">PDF · environ 4 Mo</p>
                  </div>
                </div>
                <a href="/GUIDE_DE_CANDIDATURE_CAMPAGNE_MEDICALE_ASFO.pdf" download className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-teal-600 px-4 py-3 text-sm font-black text-teal-700 hover:bg-teal-50">
                  <Download size={17} /> Télécharger
                </a>
              </div>
            </div>

            <div id="criteres" className="rounded-[24px] border border-teal-200 bg-teal-900 p-6 text-white shadow-sm sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.13em] text-teal-200">Avant de déposer</p>
              <h2 className="mt-2 text-xl font-black">Vérifiez votre éligibilité</h2>
              <p className="mt-2 text-sm leading-6 text-teal-50/80">La structure candidate doit représenter la localité et pouvoir fournir un dossier complet.</p>
              <a href="#documents-requis" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-white hover:text-teal-200">
                Voir les pièces requises <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Le parcours</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Comment candidater ?</h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700"><Icon size={18} /></span>
                    <span className="text-3xl font-black text-slate-100">0{index + 1}</span>
                  </div>
                  <h3 className="mt-4 font-black text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
            <AlertTriangle className="mt-0.5 shrink-0 text-blue-600" size={23} />
            <div>
              <h2 className="font-black text-blue-950">Dépôt exclusivement en ligne</h2>
              <p className="mt-1 text-sm leading-6 text-blue-900/80">Toutes les candidatures se font via ce portail. Aucun dossier physique ne sera accepté.</p>
            </div>
          </div>
        </section>

        <section id="documents-requis" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Liste de contrôle</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Dossier à fournir</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Préparez ces éléments avant de démarrer. Les justificatifs doivent être transmis au format PDF.</p>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {REQUIRED_DOCUMENTS.map((document, index) => (
                <div key={document.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-black text-teal-700 shadow-sm">{index + 1}</span>
                  <div>
                    <h3 className="font-black text-slate-900">{document.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500">{document.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="candidature-form" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7">
            <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Formulaire de candidature</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Préparez votre dossier, étape par étape</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Les champs marqués d’un astérisque sont obligatoires. Vos fichiers ne sont envoyés qu’au moment de la validation finale.</p>
          </div>

          <div className="mb-5 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((open) => !open)}
              aria-expanded={mobileSidebarOpen}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm"
            >
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.12em] text-teal-700">Étape {currentStep} sur 5</span>
                <span className="mt-1 block font-black text-slate-900">{FORM_STEPS[currentStep - 1].title}</span>
              </span>
              <ChevronDown className={`text-slate-500 transition ${mobileSidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {mobileSidebarOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">{sidebarContent}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_60px_-38px_rgba(15,23,42,0.35)]"
            >
              <div className="h-1.5 bg-slate-100">
                <div className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all duration-300" style={{ width: `${currentStep * 20}%` }} />
              </div>
              <div className="p-6 sm:p-8 lg:p-10">
                <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

                {submitError && (
                  <div role="alert" className="mt-7 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <AlertCircle size={19} className="mt-0.5 shrink-0" />
                    <p>{submitError}</p>
                  </div>
                )}

                {isSubmitting && uploadStage && (
                  <div aria-live="polite" className="mt-7 rounded-xl border border-teal-200 bg-teal-50 p-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-teal-900">
                      <Loader2 size={18} className="animate-spin" />
                      {uploadStage}
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-teal-100">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-teal-600" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-teal-700 disabled:opacity-50"
                  >
                    <Save size={16} /> Enregistrer le brouillon
                  </button>
                  {draftSavedAt && (
                    <span className="text-center text-xs text-slate-400" role="status">
                      Enregistré à {new Date(draftSavedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((step) => step - 1)}
                      disabled={isSubmitting}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-teal-300 hover:text-teal-700 disabled:opacity-50 sm:flex-none"
                    >
                      <ArrowLeft size={16} /> Précédent
                    </button>
                  )}
                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => void goToStep(currentStep + 1)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800 sm:flex-none"
                    >
                      Continuer <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-800/15 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                    >
                      {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
                      {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma candidature'}
                    </button>
                  )}
                </div>
              </div>
            </form>

            <aside className="sticky top-24 hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:block">
              {sidebarContent}
            </aside>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.13em] text-teal-700">Questions fréquentes</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Une question avant l’envoi ?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Les réponses ci-contre reprennent uniquement le fonctionnement actuel du portail.</p>
              <Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-teal-700 hover:text-teal-900">
                Contacter l’ASFO <ArrowRight size={16} />
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
        </section>
      </main>
    </div>
  );
};

export default CandidaturePage;
