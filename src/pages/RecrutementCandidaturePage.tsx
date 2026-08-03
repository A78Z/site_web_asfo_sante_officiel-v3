import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
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
  FILE_RULES,
  GENDERS,
  MAX_RECRUITMENT_AGE,
  MIN_RECRUITMENT_AGE,
  specialtyBySlug,
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
  experience: string;
  employer: string;
  availability: string;
  motivation: string;
  emergencyContactName: string;
  acceptTerms: boolean;
}

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
  experience: '',
  employer: '',
  availability: '',
  motivation: '',
  emergencyContactName: '',
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
        Merci pour votre engagement. Notre commission examinera votre dossier de{' '}
        <strong>{specialty}</strong> et vous serez informé(e) de la suite par SMS ou
        WhatsApp.
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

      <dl className="mt-5 grid gap-3 text-left sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <dt className="text-xs font-semibold text-slate-500">Confirmation SMS</dt>
          <dd className="mt-1 text-sm font-bold text-slate-900">
            {receipt.smsStatus === 'sent' ? 'Envoyée' : 'Non envoyée — sans effet sur votre dossier'}
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <dt className="text-xs font-semibold text-slate-500">Confirmation e-mail</dt>
          <dd className="mt-1 text-sm font-bold text-slate-900">
            {receipt.emailStatus === 'sent' ? 'Envoyée' : 'Non envoyée — sans effet sur votre dossier'}
          </dd>
        </div>
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
  const specialty = useMemo(() => specialtyBySlug(specialite), [specialite]);

  const [openState, setOpenState] = useState<'loading' | 'open' | 'closed'>('loading');
  const [submissionId] = useState(createSubmissionId);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [emergencyDigits, setEmergencyDigits] = useState('');
  const [emergencyTouched, setEmergencyTouched] = useState(false);
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

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({ mode: 'onBlur', defaultValues: DEFAULT_VALUES });

  const values = watch();
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
    if (!specialty) return;
    let active = true;
    fetchSpecialties()
      .then(({ specialties }) => {
        if (!active) return;
        const found = specialties.find((item) => item.slug === specialty.slug);
        setOpenState(found?.open ? 'open' : 'closed');
      })
      .catch(() => {
        if (active) setOpenState(specialty.defaultOpen ? 'open' : 'closed');
      });
    return () => {
      active = false;
    };
  }, [specialty]);

  const phoneError = phoneTouched ? senegalPhoneIssue(`${SENEGAL_DIALLING_CODE}${phoneDigits}`) : null;
  const emergencyError = emergencyTouched
    ? senegalPhoneIssue(`${SENEGAL_DIALLING_CODE}${emergencyDigits}`)
    : null;

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
    if (submitting.current || !specialty) return;
    setSubmitError('');

    const phone = `${SENEGAL_DIALLING_CODE}${phoneDigits}`;
    const emergencyPhone = `${SENEGAL_DIALLING_CODE}${emergencyDigits}`;
    setPhoneTouched(true);
    setEmergencyTouched(true);
    if (senegalPhoneIssue(phone) || senegalPhoneIssue(emergencyPhone)) {
      setSubmitError('Vérifiez les numéros de téléphone avant d’envoyer votre candidature.');
      return;
    }

    const missingFile = FILE_FIELDS.find(({ kind }) => !uploads[kind].file);
    if (missingFile) {
      setSubmitError(
        `Le fichier « ${FILE_RULES[missingFile.kind].label} » est requis pour envoyer la candidature.`,
      );
      return;
    }

    submitting.current = true;
    try {
      const result = await submitApplication({
        submissionId,
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
        experience: Number(data.experience),
        employer: data.employer.trim(),
        availability: data.availability,
        motivation: data.motivation.trim(),
        emergencyContactName: data.emergencyContactName.trim(),
        emergencyContactPhone: emergencyPhone,
        cvFile: uploads.cv.file as ParseFile,
        diplomaFile: uploads.diploma.file as ParseFile,
        photoFile: uploads.photo.file as ParseFile,
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

  if (!specialty) {
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
          Les inscriptions pour la spécialité « {specialty.label} » ne sont pas encore
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
                  className={`${inputClass(Boolean(errors.birthDate))} pl-11`}
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
              </div>
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
                Numéro d’inscription à l’Ordre <span className="text-red-600">*</span>
              </label>
              <input
                id="orderNumber"
                type="text"
                placeholder="Ex. ONMS-12345"
                className={inputClass(Boolean(errors.orderNumber))}
                aria-invalid={Boolean(errors.orderNumber)}
                aria-describedby={errors.orderNumber ? 'orderNumber-error' : undefined}
                {...register('orderNumber', {
                  required: 'Le numéro d’inscription à l’Ordre est requis.',
                  pattern: {
                    value: /^[A-Za-z0-9][A-Za-z0-9./\- ]{2,39}$/,
                    message: 'Numéro invalide (3 à 40 caractères).',
                  },
                })}
              />
              <FieldError id="orderNumber-error" message={errors.orderNumber?.message} />
            </div>

            <div>
              <label htmlFor="university" className="mb-2 block text-sm font-bold text-slate-800">
                Université <span className="text-red-600">*</span>
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
                Employeur actuel{' '}
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
                  placeholder="Ex. Hôpital régional de Ndioum"
                  className={`${inputClass(Boolean(errors.employer))} pl-11`}
                  aria-invalid={Boolean(errors.employer)}
                  {...register('employer', {
                    maxLength: { value: 120, message: 'Nom trop long.' },
                  })}
                />
              </div>
              <FieldError id="employer-error" message={errors.employer?.message} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="availability" className="mb-2 block text-sm font-bold text-slate-800">
                Disponibilité <span className="text-red-600">*</span>
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
          description="Chaque fichier est vérifié à l’envoi : format, taille et contenu réel."
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
                    {rule.label} <span className="text-red-600">*</span>
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
          title="Motivation et contact d’urgence"
          description="Dites-nous ce qui vous engage, et qui prévenir en cas de besoin sur le terrain."
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

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="emergencyContactName"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Personne à contacter en cas d’urgence <span className="text-red-600">*</span>
              </label>
              <input
                id="emergencyContactName"
                type="text"
                placeholder="Nom et prénom"
                className={inputClass(Boolean(errors.emergencyContactName))}
                aria-invalid={Boolean(errors.emergencyContactName)}
                aria-describedby={
                  errors.emergencyContactName ? 'emergencyContactName-error' : undefined
                }
                {...register('emergencyContactName', {
                  required: 'Indiquez une personne à contacter.',
                  minLength: { value: 3, message: 'Nom trop court.' },
                  maxLength: { value: 80, message: 'Nom trop long.' },
                })}
              />
              <FieldError
                id="emergencyContactName-error"
                message={errors.emergencyContactName?.message}
              />
            </div>

            <div>
              <label
                htmlFor="emergencyPhone"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Téléphone d’urgence <span className="text-red-600">*</span>
              </label>
              <div className="flex items-stretch gap-2">
                <span className="flex min-h-[48px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600">
                  {SENEGAL_DIALLING_CODE}
                </span>
                <input
                  id="emergencyPhone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="77 123 45 67"
                  className={inputClass(Boolean(emergencyError))}
                  aria-invalid={Boolean(emergencyError)}
                  aria-describedby={emergencyError ? 'emergencyPhone-error' : undefined}
                  value={formatSenegalLocal(emergencyDigits)}
                  onChange={(event) =>
                    setEmergencyDigits(
                      extractSenegalLocalDigits(event.target.value).slice(0, SENEGAL_LOCAL_LENGTH),
                    )
                  }
                  onBlur={() => setEmergencyTouched(true)}
                />
              </div>
              <FieldError
                id="emergencyPhone-error"
                message={emergencyError ? 'Entrez un numéro sénégalais valide.' : undefined}
              />
            </div>
          </div>
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
            Vous recevrez un SMS et un e-mail de confirmation avec votre référence de
            dossier. Aucun paiement n’est demandé à aucune étape du recrutement.
          </p>
        </Section>
      </form>
    </main>
  );
};

export default RecrutementCandidaturePage;
