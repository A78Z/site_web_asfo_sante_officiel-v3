import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import {
  AVAILABILITY_OPTIONS,
  EMAIL_NOTIFICATIONS_ENABLED,
  FILE_RULES,
  GENDERS,
  MAX_RECRUITMENT_AGE,
  MIN_GRADUATION_YEAR,
  MIN_MEMBERSHIP_YEAR,
  MIN_RECRUITMENT_AGE,
  STOCK_EXPERIENCE_OPTIONS,
  categoryBySlug,
  specialtyBySlug,
  specialtyFormLabels,
} from '../../api/_lib/recruitment.js';
import {
  SENEGAL_DIALLING_CODE,
  SENEGAL_LOCAL_LENGTH,
  extractSenegalLocalDigits,
  formatSenegalLocal,
  senegalPhoneIssue,
} from '../../api/_lib/senegal-phone.js';
import {
  ageOnDate,
  frenchDateToIso,
  isoToFrenchDate,
  maskBirthDateInput,
} from '../lib/birthDateField';
import {
  RecruitmentError,
  checkFile,
  createSubmissionId,
  fetchSpecialties,
  submitApplication,
  uploadRecruitmentFile,
  type ApplicationReceipt,
  type FileKind,
} from '../lib/recruitment';
import type { ParseFile } from '../lib/parse';
import { getDepartements, getRegions } from '../data/senegal-geo';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

interface FormInputs {
  lastName: string;
  firstName: string;
  gender: string;
  birthDate: string;
  email: string;
  address: string;
  region: string;
  department: string;
  orderNumber: string;
  university: string;
  diplomaTitle: string;
  graduationYear: string;
  stockExperience: string;
  experience: string;
  employer: string;
  availability: string;
  motivation: string;
  /** Réponse du bouton radio : `'oui'` ou `'non'`, jamais vide une fois validé. */
  isMember: string;
  memberCardNumber: string;
  memberSince: string;
  acceptTerms: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();
const TODAY_ISO = new Date().toISOString().slice(0, 10);

const DEFAULT_VALUES: FormInputs = {
  lastName: '',
  firstName: '',
  gender: '',
  birthDate: '',
  email: '',
  address: '',
  region: '',
  department: '',
  orderNumber: '',
  university: '',
  diplomaTitle: '',
  graduationYear: '',
  stockExperience: '',
  experience: '',
  employer: '',
  availability: '',
  motivation: '',
  isMember: '',
  memberCardNumber: '',
  memberSince: '',
  acceptTerms: false,
};

const inputClass = (hasError?: boolean) =>
  `w-full min-h-[48px] rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 ring-4 ring-red-50 focus:border-red-500'
      : 'border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-50'
  }`;

const FieldError: React.FC<{ id: string; message?: string }> = ({ id, message }) => {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-600">
      <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
};

const Section: React.FC<{
  icon: React.ElementType;
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ icon: Icon, step, title, description, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
    <header className="mb-6 flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-teal-700">
          Étape {step}
        </p>
        <h2 className="text-lg font-black tracking-tight text-slate-950" style={poppins}>
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </header>
    <div className="space-y-5">{children}</div>
  </section>
);

interface UploadState {
  file: ParseFile | null;
  name: string;
  status: 'idle' | 'uploading' | 'done' | 'error';
  error: string;
}

const EMPTY_UPLOAD: UploadState = { file: null, name: '', status: 'idle', error: '' };

const FILE_FIELDS: Array<{ kind: FileKind; icon: React.ElementType; hint: string }> = [
  { kind: 'cv', icon: FileText, hint: 'Parcours, expériences et références.' },
  { kind: 'diploma', icon: GraduationCap, hint: 'Diplôme le plus élevé dans la spécialité.' },
  { kind: 'photo', icon: User, hint: 'Photo d’identité récente, visage dégagé.' },
];

/* ─── Écran de confirmation ─── */
const SuccessCard: React.FC<{ receipt: ApplicationReceipt; specialty: string }> = ({
  receipt,
  specialty,
}) => (
  <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
    <div className="rounded-3xl border border-emerald-200 bg-white p-7 text-center shadow-[0_24px_70px_-45px_rgba(16,185,129,0.6)] sm:p-10">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-950" style={poppins}>
        Votre candidature a bien été enregistrée
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Votre candidature en tant que{' '}
        <strong>{specialty.toLocaleLowerCase('fr')}</strong> pour la 27
        <sup>e</sup> Grande Caravane Médicale ASFO 2026 a bien été enregistrée.
        Notre commission examinera votre dossier et vous serez informé(e) de la
        suite par SMS ou WhatsApp.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Référence de votre dossier
        </p>
        <p className="mt-1 font-mono text-xl font-black tracking-wide text-teal-700">
          {receipt.reference}
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Conservez cette référence : elle est demandée pour tout échange concernant
          votre candidature.
        </p>
      </div>

      <dl
        className={`mt-5 grid gap-3 text-left ${
          EMAIL_NOTIFICATIONS_ENABLED ? 'sm:grid-cols-2' : ''
        }`}
      >
        <div className="rounded-xl border border-slate-200 p-4">
          <dt className="text-xs font-semibold text-slate-500">Confirmation SMS</dt>
          <dd className="mt-1 text-sm font-bold text-slate-900">
            {receipt.smsStatus === 'sent' ? 'Envoyée' : 'Non envoyée — sans effet sur votre dossier'}
          </dd>
        </div>
        {EMAIL_NOTIFICATIONS_ENABLED && (
          <div className="rounded-xl border border-slate-200 p-4">
            <dt className="text-xs font-semibold text-slate-500">Confirmation e-mail</dt>
            <dd className="mt-1 text-sm font-bold text-slate-900">
              {receipt.emailStatus === 'sent'
                ? 'Envoyée'
                : 'Non envoyée — sans effet sur votre dossier'}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          to="/recrutement-medical"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour aux spécialités
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
        >
          Accueil
        </Link>
      </div>
    </div>
  </div>
);

const RecrutementCandidaturePage: React.FC = () => {
  const { specialite = '' } = useParams();
  const reduceMotion = useReducedMotion();
  const category = useMemo(() => categoryBySlug(specialite), [specialite]);
  const specialty = useMemo(
    () => specialtyBySlug(category?.legacySpecialtySlug),
    [category],
  );
  // Intitulés du formulaire, ajustés au métier de la spécialité ouverte.
  const formLabels = useMemo(() => specialtyFormLabels(specialty), [specialty]);

  const [openState, setOpenState] = useState<'loading' | 'open' | 'closed'>('loading');
  const [submissionId] = useState(createSubmissionId);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [uploads, setUploads] = useState<Record<FileKind, UploadState>>({
    cv: EMPTY_UPLOAD,
    diploma: EMPTY_UPLOAD,
    photo: EMPTY_UPLOAD,
  });
  const [honeypot, setHoneypot] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [receipt, setReceipt] = useState<ApplicationReceipt | null>(null);
  const openedAt = useRef(Date.now());
  const submitting = useRef(false);
  const birthDatePickerRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({ mode: 'onBlur', defaultValues: DEFAULT_VALUES });

  const values = watch();
  const birthDateIso = frenchDateToIso(values.birthDate);
  const calculatedAge = birthDateIso ? ageOnDate(birthDateIso) : null;
  const regions = useMemo(() => getRegions(), []);
  const departments = useMemo(
    () => (values.region ? getDepartements(values.region) : []),
    [values.region],
  );

  useEffect(() => {
    document.title = specialty
      ? `Candidature ${specialty.label} | Recrutement ASFO 2026`
      : 'Recrutement médical | ASFO';
  }, [specialty]);

  // L’ouverture est reconfirmée auprès du serveur : le catalogue embarqué ne
  // connaît que les valeurs par défaut, la vérité vit en base.
  useEffect(() => {
    if (!specialty || !category) return;
    let active = true;
    fetchSpecialties()
      .then(({ specialties }) => {
        if (!active) return;
        const found = specialties.find((item) => item.slug === category.slug);
        setOpenState(found?.open ? 'open' : 'closed');
      })
      .catch(() => {
        if (active) setOpenState(specialty.defaultOpen ? 'open' : 'closed');
      });
    return () => {
      active = false;
    };
  }, [category, specialty]);

  const phoneError = phoneTouched ? senegalPhoneIssue(`${SENEGAL_DIALLING_CODE}${phoneDigits}`) : null;

  const openBirthDatePicker = () => {
    const picker = birthDatePickerRef.current;
    if (!picker) return;
    if (typeof picker.showPicker === 'function') {
      try {
        picker.showPicker();
        return;
      } catch {
        // Le clic natif ci-dessous reste le repli multi-navigateur.
      }
    }
    picker.click();
  };

  const handleFile = useCallback(async (kind: FileKind, file: File | null) => {
    if (!file) return;
    const localError = checkFile(kind, file);
    if (localError) {
      setUploads((prev) => ({
        ...prev,
        [kind]: { file: null, name: file.name, status: 'error', error: localError },
      }));
      return;
    }

    setUploads((prev) => ({
      ...prev,
      [kind]: { file: null, name: file.name, status: 'uploading', error: '' },
    }));
    try {
      const stored = await uploadRecruitmentFile(kind, file);
      setUploads((prev) => ({
        ...prev,
        [kind]: { file: stored, name: file.name, status: 'done', error: '' },
      }));
    } catch (error) {
      setUploads((prev) => ({
        ...prev,
        [kind]: {
          file: null,
          name: file.name,
          status: 'error',
          error:
            error instanceof Error ? error.message : 'Le fichier n’a pas pu être envoyé.',
        },
      }));
    }
  }, []);

  const removeFile = (kind: FileKind) =>
    setUploads((prev) => ({ ...prev, [kind]: EMPTY_UPLOAD }));

  const onSubmit = async (data: FormInputs) => {
    if (submitting.current || !specialty || !category) return;
    setSubmitError('');

    const phone = `${SENEGAL_DIALLING_CODE}${phoneDigits}`;
    setPhoneTouched(true);
    if (senegalPhoneIssue(phone)) {
      setSubmitError('Vérifiez votre numéro de téléphone avant d’envoyer votre candidature.');
      return;
    }

    // Un téléversement encore en cours partirait sans sa pièce : on attend.
    const pending = FILE_FIELDS.find(({ kind }) => uploads[kind].status === 'uploading');
    if (pending) {
      setSubmitError(
        `Le fichier « ${FILE_RULES[pending.kind].label} » est encore en cours d’envoi. Patientez quelques instants.`,
      );
      return;
    }

    submitting.current = true;
    try {
      const result = await submitApplication({
        submissionId,
        recruitmentCategory: category.key,
        specialty: specialty.slug,
        lastName: data.lastName.trim(),
        firstName: data.firstName.trim(),
        gender: data.gender,
        birthDate: frenchDateToIso(data.birthDate),
        phone,
        email: data.email.trim(),
        address: data.address.trim(),
        region: data.region,
        department: data.department,
        orderNumber: data.orderNumber.trim(),
        university: data.university.trim(),
        diplomaTitle: data.diplomaTitle.trim(),
        graduationYear: data.graduationYear.trim(),
        // Question réservée aux spécialités qui la déclarent : ne rien envoyer
        // depuis un formulaire où elle n’était pas affichée.
        stockExperience: formLabels.asksStockExperience ? data.stockExperience : '',
        experience: Number(data.experience),
        employer: data.employer.trim(),
        availability: data.availability,
        motivation: data.motivation.trim(),
        isMember: data.isMember === 'oui',
        // Répondre « non » n’envoie aucune précision d’adhésion, même si le
        // visiteur avait commencé à les saisir avant de changer d’avis.
        ...(data.isMember === 'oui'
          ? {
              memberCardNumber: data.memberCardNumber.trim(),
              memberSince: data.memberSince.trim(),
            }
          : {}),
        ...(uploads.cv.file ? { cvFile: uploads.cv.file } : {}),
        ...(uploads.diploma.file ? { diplomaFile: uploads.diploma.file } : {}),
        ...(uploads.photo.file ? { photoFile: uploads.photo.file } : {}),
        consentAccepted: true,
        website: honeypot,
        filledInMs: Date.now() - openedAt.current,
      });
      setReceipt(result.application);
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } catch (error) {
      // Le serveur désigne le champ fautif quand il le connaît : on le signale
      // à l’endroit exact plutôt que par un message global.
      if (error instanceof RecruitmentError && error.field && error.field in DEFAULT_VALUES) {
        setError(error.field as keyof FormInputs, { message: error.message });
      }
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'La candidature n’a pas pu être envoyée. Veuillez réessayer.',
      );
    } finally {
      submitting.current = false;
    }
  };

  if (!specialty || !category || category.formKind !== 'complete') {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <X className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-black text-slate-950" style={poppins}>
          Spécialité introuvable
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Cette spécialité ne figure pas au programme du recrutement 2026.
        </p>
        <Link
          to="/recrutement-medical"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voir les spécialités
        </Link>
      </main>
    );
  }

  if (receipt) return <SuccessCard receipt={receipt} specialty={specialty.label} />;

  if (openState === 'closed') {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <Lock className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-black text-slate-950" style={poppins}>
          Inscriptions non ouvertes
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Les inscriptions pour la catégorie « {category.label} » ne sont pas encore
          ouvertes. Elles le seront prochainement : revenez consulter la page du
          recrutement.
        </p>
        <Link
          to="/recrutement-medical"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voir les spécialités ouvertes
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-slate-50/60">
      {/* ─── En-tête ─── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <Link
            to="/recrutement-medical"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Recrutement médical
          </Link>
          <div className="mt-4 flex items-start gap-4">
            <span aria-hidden="true" className="text-4xl">
              {specialty.emoji}
            </span>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-700">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Inscriptions ouvertes
              </span>
              <h1
                className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl"
                style={poppins}
              >
                Candidature — {specialty.label}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                27<sup>e</sup> Grande Caravane Médicale ASFO 2026. Tous les champs
                marqués d’un astérisque sont obligatoires. Aucun paiement n’est demandé
                à aucune étape.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6"
      >
        {/* Champ piège anti-robot */}
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

        {/* ─── 1. Identité ─── */}
        <Section
          icon={User}
          step={1}
          title="Votre identité"
          description="Les informations qui figureront sur votre dossier de candidature."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm font-bold text-slate-800">
                Nom <span className="text-red-600">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                className={inputClass(Boolean(errors.lastName))}
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                {...register('lastName', {
                  required: 'Le nom est requis.',
                  minLength: { value: 2, message: 'Le nom est trop court.' },
                  maxLength: { value: 60, message: 'Le nom est trop long.' },
                })}
              />
              <FieldError id="lastName-error" message={errors.lastName?.message} />
            </div>

            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-bold text-slate-800">
                Prénom <span className="text-red-600">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                className={inputClass(Boolean(errors.firstName))}
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                {...register('firstName', {
                  required: 'Le prénom est requis.',
                  minLength: { value: 2, message: 'Le prénom est trop court.' },
                  maxLength: { value: 60, message: 'Le prénom est trop long.' },
                })}
              />
              <FieldError id="firstName-error" message={errors.firstName?.message} />
            </div>

            <div>
              <label htmlFor="gender" className="mb-2 block text-sm font-bold text-slate-800">
                Sexe <span className="text-red-600">*</span>
              </label>
              <select
                id="gender"
                className={inputClass(Boolean(errors.gender))}
                aria-invalid={Boolean(errors.gender)}
                aria-describedby={errors.gender ? 'gender-error' : undefined}
                {...register('gender', { required: 'Sélectionnez le sexe.' })}
              >
                <option value="">Sélectionner…</option>
                {GENDERS.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
              <FieldError id="gender-error" message={errors.gender?.message} />
            </div>

            <div>
              <label htmlFor="birthDate" className="mb-2 block text-sm font-bold text-slate-800">
                Date de naissance <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="birthDate"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Ex. 15/08/1990"
                  className={`${inputClass(Boolean(errors.birthDate))} pl-11 pr-12`}
                  aria-invalid={Boolean(errors.birthDate)}
                  aria-describedby={errors.birthDate ? 'birthDate-error' : undefined}
                  value={values.birthDate}
                  {...register('birthDate', {
                    required: 'La date de naissance est requise.',
                    validate: (value) => {
                      const iso = frenchDateToIso(value);
                      if (!iso) return 'Veuillez saisir une date valide au format JJ/MM/AAAA.';
                      const age = ageOnDate(iso);
                      if (age === null) return 'Veuillez saisir une date valide au format JJ/MM/AAAA.';
                      if (age < MIN_RECRUITMENT_AGE) {
                        return `Le recrutement est réservé aux professionnels âgés de ${MIN_RECRUITMENT_AGE} ans et plus.`;
                      }
                      if (age > MAX_RECRUITMENT_AGE) return 'Vérifiez la date de naissance saisie.';
                      return true;
                    },
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                      setValue('birthDate', maskBirthDateInput(event.target.value), {
                        shouldValidate: Boolean(errors.birthDate),
                      });
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={openBirthDatePicker}
                  aria-label="Ouvrir le calendrier"
                  className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-teal-50 hover:text-teal-700"
                >
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                </button>
                <input
                  ref={birthDatePickerRef}
                  type="date"
                  tabIndex={-1}
                  aria-hidden="true"
                  max={TODAY_ISO}
                  value={birthDateIso}
                  onChange={(event) =>
                    setValue(
                      'birthDate',
                      event.target.value ? isoToFrenchDate(event.target.value) : '',
                      { shouldValidate: true },
                    )
                  }
                  className="pointer-events-none absolute h-px w-px opacity-0"
                />
              </div>
              {calculatedAge !== null && !errors.birthDate && calculatedAge >= 0 && (
                <p className="mt-1.5 text-xs font-semibold text-teal-700">{calculatedAge} ans</p>
              )}
              <FieldError id="birthDate-error" message={errors.birthDate?.message} />
            </div>
          </div>
        </Section>

        {/* ─── 2. Coordonnées ─── */}
        <Section
          icon={Phone}
          step={2}
          title="Vos coordonnées"
          description="C’est par ces coordonnées que la commission vous contactera."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-bold text-slate-800">
                Téléphone <span className="text-red-600">*</span>
              </label>
              <div className="flex items-stretch gap-2">
                <span className="flex min-h-[48px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600">
                  {SENEGAL_DIALLING_CODE}
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="77 123 45 67"
                  className={inputClass(Boolean(phoneError))}
                  aria-invalid={Boolean(phoneError)}
                  aria-describedby={phoneError ? 'phone-error' : undefined}
                  value={formatSenegalLocal(phoneDigits)}
                  onChange={(event) =>
                    setPhoneDigits(
                      extractSenegalLocalDigits(event.target.value).slice(0, SENEGAL_LOCAL_LENGTH),
                    )
                  }
                  onBlur={() => setPhoneTouched(true)}
                />
              </div>
              <FieldError
                id="phone-error"
                message={
                  phoneError
                    ? phoneError === 'landline'
                      ? 'Indiquez un mobile : les numéros fixes ne reçoivent pas de SMS.'
                      : 'Entrez un numéro de mobile sénégalais valide (9 chiffres).'
                    : undefined
                }
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-800">
                Email <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="prenom.nom@exemple.com"
                  className={`${inputClass(Boolean(errors.email))} pl-11`}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email', {
                    required: 'L’e-mail est requis.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
                      message: 'Entrez une adresse e-mail valide.',
                    },
                  })}
                />
              </div>
              <FieldError id="email-error" message={errors.email?.message} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="mb-2 block text-sm font-bold text-slate-800">
                Adresse <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <MapPin
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Ex. Quartier Diamaguène, Saint-Louis"
                  className={`${inputClass(Boolean(errors.address))} pl-11`}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  {...register('address', {
                    required: 'L’adresse est requise.',
                    minLength: { value: 3, message: 'L’adresse est trop courte.' },
                    maxLength: { value: 160, message: 'L’adresse est trop longue.' },
                  })}
                />
              </div>
              <FieldError id="address-error" message={errors.address?.message} />
            </div>

            <div>
              <label htmlFor="region" className="mb-2 block text-sm font-bold text-slate-800">
                Région <span className="text-red-600">*</span>
              </label>
              <select
                id="region"
                className={inputClass(Boolean(errors.region))}
                aria-invalid={Boolean(errors.region)}
                aria-describedby={errors.region ? 'region-error' : undefined}
                {...register('region', {
                  required: 'Sélectionnez votre région.',
                  // Changer de région invalide le département déjà choisi.
                  onChange: () => setValue('department', ''),
                })}
              >
                <option value="">Sélectionner…</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <FieldError id="region-error" message={errors.region?.message} />
            </div>

            <div>
              <label htmlFor="department" className="mb-2 block text-sm font-bold text-slate-800">
                Département <span className="text-red-600">*</span>
              </label>
              <select
                id="department"
                disabled={!values.region}
                className={`${inputClass(Boolean(errors.department))} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                aria-invalid={Boolean(errors.department)}
                aria-describedby={errors.department ? 'department-error' : undefined}
                {...register('department', { required: 'Sélectionnez votre département.' })}
              >
                <option value="">
                  {values.region ? 'Sélectionner…' : 'Choisissez d’abord une région'}
                </option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              <FieldError id="department-error" message={errors.department?.message} />
            </div>
          </div>
        </Section>

        {/* ─── 3. Profil professionnel ─── */}
        <Section
          icon={BadgeCheck}
          step={3}
          title="Votre profil professionnel"
          description="Ces éléments permettent à la commission de vérifier votre qualification."
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">Profession</label>
            <div className="flex min-h-[48px] items-center gap-2 rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3 text-base font-bold text-teal-900">
              <span aria-hidden="true">{specialty.emoji}</span>
              {specialty.label}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Pré-remplie selon la spécialité choisie. Pour candidater à une autre
              spécialité, revenez à la liste.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="orderNumber" className="mb-2 block text-sm font-bold text-slate-800">
                {formLabels.orderLabel}{' '}
                <span className="font-medium text-slate-400">(facultatif)</span>
              </label>
              <input
                id="orderNumber"
                type="text"
                placeholder={formLabels.orderPlaceholder}
                className={inputClass(Boolean(errors.orderNumber))}
                aria-invalid={Boolean(errors.orderNumber)}
                aria-describedby={errors.orderNumber ? 'orderNumber-error' : undefined}
                {...register('orderNumber', {
                  // Champ vide accepté ; le format n’est vérifié qu’une fois
                  // renseigné, exactement comme côté serveur.
                  validate: (value) => {
                    const compact = value.trim();
                    if (!compact) return true;
                    return (
                      /^[A-Za-z0-9][A-Za-z0-9./\- ]{2,39}$/.test(compact) ||
                      'Numéro invalide (3 à 40 caractères).'
                    );
                  },
                })}
              />
              <FieldError id="orderNumber-error" message={errors.orderNumber?.message} />
            </div>

            <div>
              <label htmlFor="university" className="mb-2 block text-sm font-bold text-slate-800">
                Université ou établissement de formation{' '}
                <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <GraduationCap
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="university"
                  type="text"
                  placeholder="Ex. Université Cheikh Anta Diop"
                  className={`${inputClass(Boolean(errors.university))} pl-11`}
                  aria-invalid={Boolean(errors.university)}
                  aria-describedby={errors.university ? 'university-error' : undefined}
                  {...register('university', {
                    required: 'L’université est requise.',
                    minLength: { value: 3, message: 'Nom trop court.' },
                    maxLength: { value: 120, message: 'Nom trop long.' },
                  })}
                />
              </div>
              <FieldError id="university-error" message={errors.university?.message} />
            </div>

            <div>
              <label htmlFor="diplomaTitle" className="mb-2 block text-sm font-bold text-slate-800">
                Diplôme <span className="font-medium text-slate-400">(facultatif)</span>
              </label>
              <div className="relative">
                <Award
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="diplomaTitle"
                  type="text"
                  placeholder="Ex. Doctorat en pharmacie"
                  className={`${inputClass(Boolean(errors.diplomaTitle))} pl-11`}
                  aria-invalid={Boolean(errors.diplomaTitle)}
                  aria-describedby={errors.diplomaTitle ? 'diplomaTitle-error' : undefined}
                  {...register('diplomaTitle', {
                    validate: (value) => {
                      const compact = value.trim();
                      if (!compact) return true;
                      return (
                        (compact.length >= 3 && compact.length <= 120) ||
                        'L’intitulé doit compter 3 à 120 caractères.'
                      );
                    },
                  })}
                />
              </div>
              <FieldError id="diplomaTitle-error" message={errors.diplomaTitle?.message} />
            </div>

            <div>
              <label
                htmlFor="graduationYear"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Année d’obtention <span className="font-medium text-slate-400">(facultatif)</span>
              </label>
              <input
                id="graduationYear"
                type="number"
                inputMode="numeric"
                min={MIN_GRADUATION_YEAR}
                max={CURRENT_YEAR}
                step={1}
                placeholder={`Ex. ${CURRENT_YEAR - 5}`}
                className={inputClass(Boolean(errors.graduationYear))}
                aria-invalid={Boolean(errors.graduationYear)}
                aria-describedby={errors.graduationYear ? 'graduationYear-error' : undefined}
                {...register('graduationYear', {
                  validate: (value) => {
                    const compact = value.trim();
                    if (!compact) return true;
                    const year = Number(compact);
                    if (
                      !Number.isInteger(year) ||
                      year < MIN_GRADUATION_YEAR ||
                      year > CURRENT_YEAR
                    ) {
                      return `Indiquez une année entre ${MIN_GRADUATION_YEAR} et ${CURRENT_YEAR}.`;
                    }
                    return true;
                  },
                })}
              />
              <FieldError id="graduationYear-error" message={errors.graduationYear?.message} />
            </div>

            <div>
              <label htmlFor="experience" className="mb-2 block text-sm font-bold text-slate-800">
                Années d’expérience <span className="text-red-600">*</span>
              </label>
              <input
                id="experience"
                type="number"
                inputMode="numeric"
                min={0}
                max={60}
                step={1}
                placeholder="Ex. 7"
                className={inputClass(Boolean(errors.experience))}
                aria-invalid={Boolean(errors.experience)}
                aria-describedby={errors.experience ? 'experience-error' : undefined}
                {...register('experience', {
                  required: 'Indiquez vos années d’expérience.',
                  validate: (value) => {
                    const parsed = Number(value);
                    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 60) {
                      return 'Indiquez un nombre entier entre 0 et 60.';
                    }
                    return true;
                  },
                })}
              />
              <FieldError id="experience-error" message={errors.experience?.message} />
            </div>

            <div>
              <label htmlFor="employer" className="mb-2 block text-sm font-bold text-slate-800">
                {formLabels.employerLabel}{' '}
                <span className="font-medium text-slate-400">(facultatif)</span>
              </label>
              <div className="relative">
                <Building2
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="employer"
                  type="text"
                  placeholder={formLabels.employerPlaceholder}
                  className={`${inputClass(Boolean(errors.employer))} pl-11`}
                  aria-invalid={Boolean(errors.employer)}
                  {...register('employer', {
                    maxLength: { value: 120, message: 'Nom trop long.' },
                  })}
                />
              </div>
              <FieldError id="employer-error" message={errors.employer?.message} />
            </div>

            {/* Question propre aux métiers du médicament : elle n’apparaît que
                si la spécialité la déclare, pour ne pas alourdir les autres. */}
            {formLabels.asksStockExperience && (
              <div className="sm:col-span-2">
                <label
                  htmlFor="stockExperience"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Expérience en gestion de médicaments ou de stocks{' '}
                  <span className="font-medium text-slate-400">(facultatif)</span>
                </label>
                <select
                  id="stockExperience"
                  className={inputClass(Boolean(errors.stockExperience))}
                  aria-invalid={Boolean(errors.stockExperience)}
                  aria-describedby={errors.stockExperience ? 'stockExperience-error' : undefined}
                  {...register('stockExperience')}
                >
                  <option value="">Sélectionner…</option>
                  {STOCK_EXPERIENCE_OPTIONS.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <FieldError id="stockExperience-error" message={errors.stockExperience?.message} />
              </div>
            )}

            <div className="sm:col-span-2">
              <label htmlFor="availability" className="mb-2 block text-sm font-bold text-slate-800">
                Disponibilité pendant la campagne <span className="text-red-600">*</span>
              </label>
              <select
                id="availability"
                className={inputClass(Boolean(errors.availability))}
                aria-invalid={Boolean(errors.availability)}
                aria-describedby={errors.availability ? 'availability-error' : undefined}
                {...register('availability', { required: 'Indiquez votre disponibilité.' })}
              >
                <option value="">Sélectionner…</option>
                {AVAILABILITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <FieldError id="availability-error" message={errors.availability?.message} />
            </div>
          </div>
        </Section>

        {/* ─── 4. Pièces justificatives ─── */}
        <Section
          icon={Upload}
          step={4}
          title="Vos pièces justificatives"
          description="Facultatives à ce stade : la commission vous réclamera les documents manquants lors de l’instruction. Les joindre maintenant accélère l’examen de votre dossier."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {FILE_FIELDS.map(({ kind, icon: Icon, hint }) => {
              const rule = FILE_RULES[kind];
              const state = uploads[kind];
              return (
                <div
                  key={kind}
                  className={`rounded-2xl border-2 border-dashed p-4 transition ${
                    state.status === 'done'
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : state.status === 'error'
                        ? 'border-red-300 bg-red-50/50'
                        : 'border-slate-300 bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
                    {state.status === 'done' && (
                      <button
                        type="button"
                        onClick={() => removeFile(kind)}
                        aria-label={`Retirer le fichier ${rule.label}`}
                        className="rounded-lg p-1 text-slate-400 transition hover:bg-white hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-sm font-black text-slate-900">
                    {rule.label}{' '}
                    <span className="text-xs font-medium text-slate-400">(facultatif)</span>
                  </p>
                  <p className="text-xs leading-5 text-slate-500">{hint}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {rule.formatLabel} · {rule.maxLabel} max
                  </p>

                  <label
                    className={`mt-3 flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                      state.status === 'uploading'
                        ? 'cursor-wait border-slate-200 bg-white text-slate-400'
                        : 'border-teal-200 bg-white text-teal-700 hover:bg-teal-50'
                    }`}
                  >
                    {state.status === 'uploading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Envoi…
                      </>
                    ) : state.status === 'done' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Remplacer
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" aria-hidden="true" /> Choisir un fichier
                      </>
                    )}
                    <input
                      type="file"
                      className="sr-only"
                      accept={rule.accept}
                      disabled={state.status === 'uploading' || isSubmitting}
                      onChange={(event) => {
                        void handleFile(kind, event.target.files?.[0] ?? null);
                        event.target.value = '';
                      }}
                    />
                  </label>

                  {state.name && (
                    <p
                      className={`mt-2 break-all text-xs ${
                        state.status === 'error' ? 'text-red-600' : 'text-slate-600'
                      }`}
                    >
                      {state.status === 'error' ? state.error : state.name}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* ─── 5. Motivation et urgence ─── */}
        <Section
          icon={ClipboardCheck}
          step={5}
          title="Motivation et lien avec l’ASFO"
          description="Dites-nous ce qui vous engage, et si vous êtes déjà membre de l’association."
        >
          <div>
            <label htmlFor="motivation" className="mb-2 block text-sm font-bold text-slate-800">
              Motivation <span className="text-red-600">*</span>
            </label>
            <textarea
              id="motivation"
              rows={5}
              placeholder="Expliquez en quelques lignes ce qui motive votre participation à la caravane médicale."
              className={`${inputClass(Boolean(errors.motivation))} resize-y`}
              aria-invalid={Boolean(errors.motivation)}
              aria-describedby="motivation-hint motivation-error"
              {...register('motivation', {
                required: 'La motivation est requise.',
                minLength: { value: 30, message: 'Développez un peu (30 caractères minimum).' },
                maxLength: { value: 2000, message: 'Texte trop long (2000 caractères maximum).' },
              })}
            />
            <p id="motivation-hint" className="mt-1.5 text-xs text-slate-500">
              {values.motivation.length}/2000 caractères
            </p>
            <FieldError id="motivation-error" message={errors.motivation?.message} />
          </div>

          <fieldset>
            <legend className="mb-2 block text-sm font-bold text-slate-800">
              Êtes-vous déjà membre de l’ASFO ? <span className="text-red-600">*</span>
            </legend>
            <div className="grid gap-3 sm:max-w-md sm:grid-cols-2">
              {[
                { value: 'oui', label: 'Oui' },
                { value: 'non', label: 'Non' },
              ].map((option) => {
                const checked = values.isMember === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-base font-semibold transition ${
                      checked
                        ? 'border-teal-600 bg-teal-50/70 text-teal-900 ring-4 ring-teal-50'
                        : errors.isMember
                          ? 'border-red-300 bg-white text-slate-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="h-5 w-5 shrink-0 border-slate-300 text-teal-600 focus:ring-teal-500"
                      aria-invalid={Boolean(errors.isMember)}
                      aria-describedby={errors.isMember ? 'isMember-error' : undefined}
                      {...register('isMember', {
                        required: 'Indiquez si vous êtes déjà membre de l’ASFO.',
                      })}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
            <FieldError id="isMember-error" message={errors.isMember?.message} />
          </fieldset>

          {/* Précisions réservées aux membres : elles se replient entièrement
              quand la réponse est « non », sans laisser d’espace vide. */}
          <AnimatePresence initial={false}>
            {values.isMember === 'oui' && (
              <motion.div
                key="member-details"
                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="grid gap-5 pt-1 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="memberCardNumber"
                      className="mb-2 block text-sm font-bold text-slate-800"
                    >
                      Numéro de carte membre ASFO{' '}
                      <span className="font-medium text-slate-400">(facultatif)</span>
                    </label>
                    <div className="relative">
                      <CreditCard
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                      />
                      <input
                        id="memberCardNumber"
                        type="text"
                        placeholder="Ex. ASFO-2024-00125"
                        className={`${inputClass(Boolean(errors.memberCardNumber))} pl-11`}
                        aria-invalid={Boolean(errors.memberCardNumber)}
                        aria-describedby={
                          errors.memberCardNumber ? 'memberCardNumber-error' : undefined
                        }
                        {...register('memberCardNumber', {
                          validate: (value) => {
                            const compact = value.trim();
                            if (!compact) return true;
                            return (
                              /^[A-Za-z0-9][A-Za-z0-9./\- ]{2,39}$/.test(compact) ||
                              'Numéro invalide (3 à 40 caractères).'
                            );
                          },
                        })}
                      />
                    </div>
                    <FieldError
                      id="memberCardNumber-error"
                      message={errors.memberCardNumber?.message}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="memberSince"
                      className="mb-2 block text-sm font-bold text-slate-800"
                    >
                      Année d’adhésion{' '}
                      <span className="font-medium text-slate-400">(facultatif)</span>
                    </label>
                    <input
                      id="memberSince"
                      type="number"
                      inputMode="numeric"
                      min={MIN_MEMBERSHIP_YEAR}
                      max={CURRENT_YEAR}
                      step={1}
                      placeholder={`Ex. ${CURRENT_YEAR - 2}`}
                      className={inputClass(Boolean(errors.memberSince))}
                      aria-invalid={Boolean(errors.memberSince)}
                      aria-describedby={errors.memberSince ? 'memberSince-error' : undefined}
                      {...register('memberSince', {
                        validate: (value) => {
                          const compact = value.trim();
                          if (!compact) return true;
                          const year = Number(compact);
                          if (
                            !Number.isInteger(year) ||
                            year < MIN_MEMBERSHIP_YEAR ||
                            year > CURRENT_YEAR
                          ) {
                            return `Indiquez une année entre ${MIN_MEMBERSHIP_YEAR} et ${CURRENT_YEAR}.`;
                          }
                          return true;
                        },
                      })}
                    />
                    <FieldError id="memberSince-error" message={errors.memberSince?.message} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* ─── 6. Consentement et envoi ─── */}
        <Section
          icon={ShieldCheck}
          step={6}
          title="Confirmation"
          description="Dernière étape avant la transmission de votre dossier à la commission."
        >
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              aria-invalid={Boolean(errors.acceptTerms)}
              aria-describedby={errors.acceptTerms ? 'acceptTerms-error' : undefined}
              {...register('acceptTerms', {
                required: 'Vous devez accepter les conditions pour candidater.',
              })}
            />
            <span className="text-sm leading-6 text-slate-700">
              Je certifie l’exactitude des informations et des pièces transmises, et
              j’accepte que l’ASFO les utilise pour instruire ma candidature,
              conformément à la{' '}
              <Link to="/privacy" className="font-bold text-teal-700 underline">
                politique de confidentialité
              </Link>
              . <span className="text-red-600">*</span>
            </span>
          </label>
          <FieldError id="acceptTerms-error" message={errors.acceptTerms?.message} />

          {submitError && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {submitError}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-4 text-base font-black text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Envoi de votre candidature…
              </>
            ) : (
              <>
                <Send className="h-5 w-5" aria-hidden="true" />
                Envoyer ma candidature
              </>
            )}
          </motion.button>

          <p className="text-center text-xs leading-5 text-slate-500">
            {EMAIL_NOTIFICATIONS_ENABLED
              ? 'Vous recevrez un SMS et un e-mail de confirmation avec votre référence de dossier.'
              : 'Vous recevrez un SMS de confirmation avec votre référence de dossier.'}{' '}
            Aucun paiement n’est demandé à aucune étape du recrutement.
          </p>
        </Section>
      </form>
    </main>
  );
};

export default RecrutementCandidaturePage;
