import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Stethoscope,
  User,
} from 'lucide-react';
import {
  GENDERS,
  MAX_RECRUITMENT_AGE,
  MEDICAL_SPECIALITIES,
  MIN_MEMBERSHIP_YEAR,
  MIN_RECRUITMENT_AGE,
  OTHER_EDUCATION_LEVEL,
  PARAMEDICAL_SPECIALITIES,
  educationLevelsForCategory,
  type RecruitmentCategory,
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
  createSubmissionId,
  fetchSpecialties,
  submitApplication,
  type ApplicationReceipt,
} from '../lib/recruitment';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };
const CURRENT_YEAR = new Date().getFullYear();
const TODAY_ISO = new Date().toISOString().slice(0, 10);

interface FormInputs {
  lastName: string;
  firstName: string;
  birthDate: string;
  gender: string;
  address: string;
  email: string;
  educationLevel: string;
  educationLevelOther: string;
  speciality: string;
  otherSpeciality: string;
  isMember: string;
  memberCardNumber: string;
  memberSince: string;
  acceptTerms: boolean;
}

const DEFAULT_VALUES: FormInputs = {
  lastName: '',
  firstName: '',
  birthDate: '',
  gender: '',
  address: '',
  email: '',
  educationLevel: '',
  educationLevelOther: '',
  speciality: '',
  otherSpeciality: '',
  isMember: '',
  memberCardNumber: '',
  memberSince: '',
  acceptTerms: false,
};

const inputClass = (error?: boolean) =>
  `min-h-[50px] w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 ${
    error
      ? 'border-red-300 ring-4 ring-red-50 focus:border-red-500'
      : 'border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-50'
  }`;

const FieldError: React.FC<{ id: string; message?: string }> = ({ id, message }) =>
  message ? (
    <p id={id} role="alert" className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-red-600">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  ) : null;

const Section: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ icon: Icon, title, description, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_48px_-40px_rgba(15,23,42,0.45)] sm:p-7">
    <header className="mb-6 flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-lg font-black tracking-tight text-slate-950" style={poppins}>{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </header>
    {children}
  </section>
);

const fold = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');

const SearchableSpeciality: React.FC<{
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}> = ({ options, value, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => {
    const query = fold(value.trim());
    if (!query || options.includes(value)) return options;
    return options.filter((option) => fold(option).includes(query));
  }, [options, value]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-[17px] z-10 h-4 w-4 text-slate-400" aria-hidden="true" />
      <input
        id="speciality"
        role="combobox"
        aria-expanded={open}
        aria-controls="speciality-options"
        aria-autocomplete="list"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'speciality-error' : 'speciality-hint'}
        autoComplete="off"
        value={value}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        placeholder="Rechercher ou sélectionner…"
        className={`${inputClass(Boolean(error))} pl-11 pr-11`}
      />
      <button
        type="button"
        aria-label="Afficher les spécialités"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen((current) => !current)}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-teal-700"
      >
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <ul
          id="speciality-options"
          role="listbox"
          className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl"
        >
          {filtered.length > 0 ? filtered.map((option) => (
            <li key={option} role="option" aria-selected={value === option}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  value === option ? 'bg-teal-50 font-bold text-teal-900' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {option}
                {value === option && <Check className="h-4 w-4 text-teal-600" aria-hidden="true" />}
              </button>
            </li>
          )) : (
            <li className="px-3 py-4 text-sm text-slate-500">Aucune spécialité correspondante.</li>
          )}
        </ul>
      )}
    </div>
  );
};

const SuccessCard: React.FC<{ receipt: ApplicationReceipt; category: RecruitmentCategory }> = ({ receipt, category }) => (
  <main className="bg-slate-50 px-4 py-16 sm:px-6">
    <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-7 text-center shadow-xl sm:p-10">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-950" style={poppins}>Candidature enregistrée</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Votre inscription dans la catégorie <strong>{category.label}</strong> a bien été transmise à l’ASFO.
      </p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Référence du dossier</p>
        <p className="mt-1 font-mono text-xl font-black tracking-wide text-teal-700">{receipt.reference}</p>
      </div>
      <Link to="/recrutement-medical" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-teal-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Retour au recrutement
      </Link>
    </div>
  </main>
);

const RecrutementSimplifiePage: React.FC<{ category: RecruitmentCategory }> = ({ category }) => {
  const reduceMotion = useReducedMotion();
  const pickerRef = useRef<HTMLInputElement>(null);
  const openedAt = useRef(Date.now());
  const submitting = useRef(false);
  const [submissionId] = useState(createSubmissionId);
  const [openState, setOpenState] = useState<'loading' | 'open' | 'closed'>('loading');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [receipt, setReceipt] = useState<ApplicationReceipt | null>(null);

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
  const phoneError = phoneTouched ? senegalPhoneIssue(`${SENEGAL_DIALLING_CODE}${phoneDigits}`) : null;
  const specialityOptions = category.key === 'specialiste' ? MEDICAL_SPECIALITIES : PARAMEDICAL_SPECIALITIES;
  const educationLevelOptions = useMemo(() => educationLevelsForCategory(category), [category]);
  const asksOtherEducationLevel = values.educationLevel === OTHER_EDUCATION_LEVEL;
  const asksSpeciality = category.key !== 'generaliste';
  const asksOther = values.speciality === 'Autre spécialité médicale' || values.speciality === 'Autre profession paramédicale';
  const profession = category.key === 'generaliste'
    ? 'Médecin généraliste'
    : category.key === 'specialiste'
      ? 'Médecin spécialiste'
      : asksOther
        ? values.otherSpeciality || 'À préciser'
        : values.speciality || 'Sélectionnez d’abord votre spécialité';

  useEffect(() => {
    document.title = category.formTitle;
  }, [category]);

  useEffect(() => {
    let active = true;
    fetchSpecialties()
      .then(({ specialties }) => {
        if (!active) return;
        setOpenState(specialties.find((item) => item.key === category.key)?.open ? 'open' : 'closed');
      })
      .catch(() => {
        if (active) setOpenState('closed');
      });
    return () => {
      active = false;
    };
  }, [category]);

  const showPicker = () => {
    const picker = pickerRef.current;
    if (!picker) return;
    if (typeof picker.showPicker === 'function') {
      try {
        picker.showPicker();
        return;
      } catch {
        // Le clic natif ci-dessous reste le repli pour les navigateurs concernés.
      }
    }
    picker.click();
  };

  const onSubmit = async (data: FormInputs) => {
    if (submitting.current) return;
    setSubmitError('');
    const phone = `${SENEGAL_DIALLING_CODE}${phoneDigits}`;
    setPhoneTouched(true);
    if (senegalPhoneIssue(phone)) {
      setSubmitError('Vérifiez votre numéro de téléphone avant l’envoi.');
      return;
    }

    submitting.current = true;
    try {
      const result = await submitApplication({
        submissionId,
        recruitmentCategory: category.key,
        lastName: data.lastName.trim(),
        firstName: data.firstName.trim(),
        birthDate: frenchDateToIso(data.birthDate),
        gender: data.gender,
        address: data.address.trim(),
        phone,
        email: data.email.trim(),
        educationLevel: data.educationLevel,
        ...(asksOtherEducationLevel ? { educationLevelOther: data.educationLevelOther.trim() } : {}),
        ...(asksSpeciality ? { speciality: data.speciality } : {}),
        ...(asksOther ? { otherSpeciality: data.otherSpeciality.trim() } : {}),
        isMember: data.isMember === 'oui',
        ...(data.isMember === 'oui'
          ? {
              memberCardNumber: data.memberCardNumber.trim(),
              memberSince: data.memberSince.trim(),
            }
          : {}),
        consentAccepted: true,
        website: honeypot,
        filledInMs: Date.now() - openedAt.current,
      });
      setReceipt(result.application);
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } catch (error) {
      if (error instanceof RecruitmentError && error.field && error.field in DEFAULT_VALUES) {
        setError(error.field as keyof FormInputs, { message: error.message });
      }
      setSubmitError(error instanceof Error ? error.message : 'La candidature n’a pas pu être envoyée.');
    } finally {
      submitting.current = false;
    }
  };

  if (receipt) return <SuccessCard receipt={receipt} category={category} />;

  if (openState !== 'open') {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        {openState === 'loading' ? (
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-teal-600" aria-hidden="true" />
        ) : (
          <Lock className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
        )}
        <h1 className="mt-4 text-2xl font-black text-slate-950" style={poppins}>
          {openState === 'loading' ? 'Vérification des inscriptions' : 'Inscriptions fermées'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {openState === 'loading'
            ? 'Nous vérifions l’état de cette catégorie.'
            : `Les inscriptions « ${category.label} » ne sont pas ouvertes actuellement.`}
        </p>
        {openState === 'closed' && (
          <Link to="/recrutement-medical" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-teal-700">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voir les cinq catégories
          </Link>
        )}
      </main>
    );
  }

  return (
    <main className="bg-slate-50/70">
      <header className="border-b border-teal-100 bg-gradient-to-br from-white to-teal-50/60">
        <div className="mx-auto max-w-4xl px-4 py-9 sm:px-6">
          <Link to="/recrutement-medical" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-700">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Recrutement médical
          </Link>
          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Inscriptions ouvertes
          </span>
          <h1 className="mt-3 max-w-3xl text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl" style={poppins}>
            {category.formTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Formulaire simplifié sans CV, diplôme ni numéro d’inscription à l’Ordre. Tous les champs marqués d’un astérisque sont obligatoires.
          </p>
        </div>
      </header>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Ne pas remplir</label>
          <input id="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
        </div>

        <Section icon={User} title="Identité" description="Vos informations personnelles telles qu’elles doivent apparaître dans le dossier.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm font-bold text-slate-800">Nom <span className="text-red-600">*</span></label>
              <input id="lastName" autoComplete="family-name" className={inputClass(Boolean(errors.lastName))} {...register('lastName', { required: 'Le nom est requis.', minLength: { value: 2, message: 'Le nom est trop court.' }, maxLength: { value: 60, message: 'Le nom est trop long.' } })} />
              <FieldError id="lastName-error" message={errors.lastName?.message} />
            </div>
            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-bold text-slate-800">Prénom <span className="text-red-600">*</span></label>
              <input id="firstName" autoComplete="given-name" className={inputClass(Boolean(errors.firstName))} {...register('firstName', { required: 'Le prénom est requis.', minLength: { value: 2, message: 'Le prénom est trop court.' }, maxLength: { value: 60, message: 'Le prénom est trop long.' } })} />
              <FieldError id="firstName-error" message={errors.firstName?.message} />
            </div>
            <div>
              <label htmlFor="gender" className="mb-2 block text-sm font-bold text-slate-800">Sexe <span className="text-red-600">*</span></label>
              <select id="gender" className={inputClass(Boolean(errors.gender))} {...register('gender', { required: 'Sélectionnez le sexe.' })}>
                <option value="">Sélectionner…</option>
                {GENDERS.map((gender) => <option key={gender}>{gender}</option>)}
              </select>
              <FieldError id="gender-error" message={errors.gender?.message} />
            </div>
            <div>
              <label htmlFor="birthDate" className="mb-2 block text-sm font-bold text-slate-800">Date de naissance <span className="text-red-600">*</span></label>
              <div className="relative">
                <input
                  id="birthDate"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="JJ/MM/AAAA"
                  className={`${inputClass(Boolean(errors.birthDate))} pr-12`}
                  value={values.birthDate}
                  {...register('birthDate', {
                    required: 'La date de naissance est requise.',
                    validate: (value) => {
                      const iso = frenchDateToIso(value);
                      if (!iso || iso > TODAY_ISO) return 'Veuillez saisir une date valide, non future.';
                      const age = ageOnDate(iso);
                      if (age === null) return 'Veuillez saisir une date valide au format JJ/MM/AAAA.';
                      if (age < MIN_RECRUITMENT_AGE) return `Vous devez avoir au moins ${MIN_RECRUITMENT_AGE} ans.`;
                      if (age > MAX_RECRUITMENT_AGE) return 'Vérifiez la date de naissance saisie.';
                      return true;
                    },
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                      setValue('birthDate', maskBirthDateInput(event.target.value), { shouldValidate: Boolean(errors.birthDate) });
                    },
                  })}
                />
                <button type="button" onClick={showPicker} aria-label="Ouvrir le calendrier" className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-teal-50 hover:text-teal-700">
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                </button>
                <input ref={pickerRef} type="date" tabIndex={-1} aria-hidden="true" max={TODAY_ISO} value={birthDateIso} onChange={(event) => setValue('birthDate', event.target.value ? isoToFrenchDate(event.target.value) : '', { shouldValidate: true })} className="pointer-events-none absolute h-px w-px opacity-0" />
              </div>
              {calculatedAge !== null && !errors.birthDate && calculatedAge >= 0 && (
                <p className="mt-1.5 text-xs font-semibold text-teal-700">{calculatedAge} ans</p>
              )}
              <FieldError id="birthDate-error" message={errors.birthDate?.message} />
            </div>
          </div>
        </Section>

        <Section icon={Phone} title="Coordonnées" description="La commission utilisera ces coordonnées pour vous contacter.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-bold text-slate-800">Numéro de téléphone <span className="text-red-600">*</span></label>
              <div className="flex gap-2">
                <span className="flex min-h-[50px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600">{SENEGAL_DIALLING_CODE}</span>
                <input id="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="77 123 45 67" className={inputClass(Boolean(phoneError))} value={formatSenegalLocal(phoneDigits)} onChange={(event) => setPhoneDigits(extractSenegalLocalDigits(event.target.value).slice(0, SENEGAL_LOCAL_LENGTH))} onBlur={() => setPhoneTouched(true)} />
              </div>
              <FieldError id="phone-error" message={phoneError ? 'Entrez un numéro de mobile sénégalais valide.' : undefined} />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-800">E-mail <span className="text-red-600">*</span></label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-[17px] h-4 w-4 text-slate-400" aria-hidden="true" />
                <input id="email" type="email" autoComplete="email" placeholder="prenom.nom@exemple.com" className={`${inputClass(Boolean(errors.email))} pl-11`} {...register('email', { required: 'L’e-mail est requis.', pattern: { value: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i, message: 'Entrez une adresse e-mail valide.' } })} />
              </div>
              <FieldError id="email-error" message={errors.email?.message} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="mb-2 block text-sm font-bold text-slate-800">Adresse <span className="text-red-600">*</span></label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-[17px] h-4 w-4 text-slate-400" aria-hidden="true" />
                <input id="address" autoComplete="street-address" placeholder="Quartier, ville ou localité" className={`${inputClass(Boolean(errors.address))} pl-11`} {...register('address', { required: 'L’adresse est requise.', minLength: { value: 3, message: 'L’adresse est trop courte.' }, maxLength: { value: 160, message: 'L’adresse est trop longue.' } })} />
              </div>
              <FieldError id="address-error" message={errors.address?.message} />
            </div>
          </div>
        </Section>

        <Section icon={Stethoscope} title="Profil professionnel" description="Indiquez votre qualification. Aucun document ne vous sera demandé dans ce parcours.">
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="educationLevel" className="mb-2 block text-sm font-bold text-slate-800">Niveau d’études <span className="text-red-600">*</span></label>
                <select id="educationLevel" className={inputClass(Boolean(errors.educationLevel))} {...register('educationLevel', { required: 'Sélectionnez votre niveau d’études.', validate: (value) => educationLevelOptions.includes(value) || 'Choisissez un niveau dans la liste.' })}>
                  <option value="">Sélectionner…</option>
                  {educationLevelOptions.map((level) => <option key={level}>{level}</option>)}
                </select>
                <FieldError id="educationLevel-error" message={errors.educationLevel?.message} />

                <AnimatePresence initial={false}>
                  {asksOtherEducationLevel && (
                    <motion.div initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <label htmlFor="educationLevelOther" className="mb-2 mt-4 block text-sm font-bold text-slate-800">
                        Précisez votre niveau ou diplôme <span className="text-red-600">*</span>
                      </label>
                      <input id="educationLevelOther" placeholder="Ex. Diplôme d’État infirmier, technicien supérieur de santé…" className={inputClass(Boolean(errors.educationLevelOther))} {...register('educationLevelOther', { validate: (value) => !asksOtherEducationLevel || (value.trim().length >= 2 && value.trim().length <= 100) || 'Précisez votre niveau ou diplôme (2 à 100 caractères).' })} />
                      <FieldError id="educationLevelOther-error" message={errors.educationLevelOther?.message} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">Profession <span className="text-red-600">*</span></label>
                <div className="flex min-h-[50px] items-center gap-2 rounded-xl border border-teal-200 bg-teal-50/70 px-4 py-3 text-base font-bold text-teal-950">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" /> {profession}
                </div>
                <p className="mt-1.5 text-xs text-slate-500">Renseignée automatiquement selon votre catégorie.</p>
              </div>
            </div>

            {asksSpeciality && (
              <div>
                <label htmlFor="speciality" className="mb-2 block text-sm font-bold text-slate-800">Spécialité <span className="text-red-600">*</span></label>
                {category.key === 'specialiste' ? (
                  <SearchableSpeciality
                    options={specialityOptions}
                    value={values.speciality}
                    onChange={(value) => setValue('speciality', value, { shouldValidate: true })}
                    error={errors.speciality?.message}
                  />
                ) : (
                  <select id="speciality" className={inputClass(Boolean(errors.speciality))} {...register('speciality', { required: 'Sélectionnez votre spécialité.', validate: (value) => specialityOptions.includes(value) || 'Choisissez une spécialité dans la liste.' })}>
                    <option value="">Sélectionner…</option>
                    {specialityOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                )}
                {category.key === 'specialiste' && (
                  <input type="hidden" {...register('speciality', { required: 'Sélectionnez votre spécialité.', validate: (value) => specialityOptions.includes(value) || 'Choisissez une spécialité dans la liste.' })} />
                )}
                <p id="speciality-hint" className="mt-1.5 text-xs text-slate-500">
                  {category.key === 'specialiste' ? 'Tapez quelques lettres pour filtrer la liste.' : 'Votre profession sera préremplie à partir de ce choix.'}
                </p>
                <FieldError id="speciality-error" message={errors.speciality?.message} />
              </div>
            )}

            <AnimatePresence initial={false}>
              {asksOther && (
                <motion.div initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <label htmlFor="otherSpeciality" className="mb-2 block text-sm font-bold text-slate-800">
                    {category.key === 'specialiste' ? 'Précisez votre spécialité' : 'Précisez votre profession paramédicale'} <span className="text-red-600">*</span>
                  </label>
                  <input id="otherSpeciality" className={inputClass(Boolean(errors.otherSpeciality))} {...register('otherSpeciality', { validate: (value) => !asksOther || (value.trim().length >= 2 && value.trim().length <= 100) || 'Précisez votre spécialité (2 à 100 caractères).' })} />
                  <FieldError id="otherSpeciality-error" message={errors.otherSpeciality?.message} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Section>

        <Section icon={ShieldCheck} title="Membre ASFO et confirmation" description="Une dernière vérification avant l’envoi de votre inscription.">
          <div className="space-y-5">
            <fieldset>
              <legend className="mb-2 text-sm font-bold text-slate-800">Êtes-vous membre de l’ASFO ? <span className="text-red-600">*</span></legend>
              <div className="grid gap-3 sm:max-w-md sm:grid-cols-2">
                {[{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }].map((option) => {
                  const checked = values.isMember === option.value;
                  return (
                    <label key={option.value} className={`flex min-h-[50px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-base font-bold transition ${checked ? 'border-teal-600 bg-teal-50 text-teal-950 ring-4 ring-teal-50' : 'border-slate-200 text-slate-700 hover:border-teal-300'}`}>
                      <input type="radio" value={option.value} className="h-5 w-5 text-teal-600" {...register('isMember', { required: 'Indiquez si vous êtes membre de l’ASFO.' })} />
                      {option.label}
                    </label>
                  );
                })}
              </div>
              <FieldError id="isMember-error" message={errors.isMember?.message} />
            </fieldset>

            <AnimatePresence initial={false}>
              {values.isMember === 'oui' && (
                <motion.div initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="grid gap-5 rounded-xl border border-teal-100 bg-teal-50/40 p-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="memberCardNumber" className="mb-2 block text-sm font-bold text-slate-800">Numéro de carte <span className="font-medium text-slate-400">(facultatif)</span></label>
                      <div className="relative">
                        <CreditCard className="pointer-events-none absolute left-4 top-[17px] h-4 w-4 text-slate-400" aria-hidden="true" />
                        <input id="memberCardNumber" className={`${inputClass(Boolean(errors.memberCardNumber))} pl-11`} {...register('memberCardNumber', { validate: (value) => !value.trim() || /^[A-Za-z0-9][A-Za-z0-9./\- ]{2,39}$/.test(value.trim()) || 'Numéro de carte invalide.' })} />
                      </div>
                      <FieldError id="memberCardNumber-error" message={errors.memberCardNumber?.message} />
                    </div>
                    <div>
                      <label htmlFor="memberSince" className="mb-2 block text-sm font-bold text-slate-800">Année d’adhésion <span className="font-medium text-slate-400">(facultatif)</span></label>
                      <input id="memberSince" type="number" inputMode="numeric" min={MIN_MEMBERSHIP_YEAR} max={CURRENT_YEAR} className={inputClass(Boolean(errors.memberSince))} {...register('memberSince', { validate: (value) => !value.trim() || (Number.isInteger(Number(value)) && Number(value) >= MIN_MEMBERSHIP_YEAR && Number(value) <= CURRENT_YEAR) || 'Vérifiez l’année d’adhésion.' })} />
                      <FieldError id="memberSince-error" message={errors.memberSince?.message} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <input type="checkbox" className="mt-0.5 h-5 w-5 rounded text-teal-600" {...register('acceptTerms', { required: 'Vous devez accepter les conditions pour candidater.' })} />
              <span className="text-sm leading-6 text-slate-700">Je certifie l’exactitude des informations transmises et j’accepte leur traitement pour l’instruction de ma candidature, conformément à la <Link to="/privacy" className="font-bold text-teal-700 underline">politique de confidentialité</Link>. <span className="text-red-600">*</span></span>
            </label>
            <FieldError id="acceptTerms-error" message={errors.acceptTerms?.message} />

            {submitError && <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {submitError}</p>}

            <motion.button type="submit" disabled={isSubmitting} whileTap={reduceMotion ? undefined : { scale: 0.985 }} className="inline-flex w-full min-h-[54px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-base font-black text-white shadow-lg transition hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Envoi en cours…</> : <><Send className="h-5 w-5" aria-hidden="true" /> Envoyer ma candidature</>}
            </motion.button>
            <p className="text-center text-xs leading-5 text-slate-500">Aucun CV, diplôme, numéro d’Ordre ou paiement ne vous sera demandé dans ce formulaire.</p>
          </div>
        </Section>
      </form>
    </main>
  );
};

export default RecrutementSimplifiePage;
