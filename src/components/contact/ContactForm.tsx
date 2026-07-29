import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Home,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  RotateCcw,
  Send,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createObject } from '../../lib/parse';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
  website: string;
}

interface MessageReceipt {
  requestId: string;
  createdAt: Date;
  subject: string;
}

const SUBJECTS = [
  'Demande d’information',
  'Candidature pour accueillir une caravane',
  'Adhésion ou carte membre',
  'Partenariat',
  'Don',
  'Bénévolat',
  'Mission médicale',
  'Problème technique',
  'Autre',
];

const DEFAULT_VALUES: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false,
  website: '',
};

const inputClass = (hasError?: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 ${
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

const ContactForm: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const submissionLock = useRef(false);
  const [submitError, setSubmitError] = useState('');
  const [receipt, setReceipt] = useState<MessageReceipt | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const message = watch('message');
  const errorMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter((value): value is string => Boolean(value));

  const onSubmit = async (data: ContactFormValues) => {
    if (submissionLock.current) return;
    if (data.website) {
      setSubmitError('Le message n’a pas pu être envoyé. Veuillez réessayer.');
      return;
    }

    submissionLock.current = true;
    setSubmitError('');

    try {
      const created = await createObject('ContactMessages', {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        subject: data.subject,
        message: data.message.trim(),
        status: 'Nouveau',
        consentAccepted: true,
        consentAcceptedAt: new Date().toISOString(),
      });

      setReceipt({
        requestId: created.objectId,
        createdAt: created.createdAt ? new Date(created.createdAt) : new Date(),
        subject: data.subject,
      });
      reset(DEFAULT_VALUES);
    } catch (error) {
      console.error('Contact message submission failed:', error instanceof Error ? error.message : 'Unknown error');
      const isNetworkError =
        error instanceof TypeError ||
        (error instanceof Error && /fetch|network|connexion/i.test(error.message));
      setSubmitError(
        isNetworkError
          ? 'La connexion au serveur a échoué. Vérifiez votre accès internet puis réessayez.'
          : 'Le serveur n’a pas pu enregistrer votre message. Veuillez réessayer plus tard.',
      );
    } finally {
      submissionLock.current = false;
    }
  };

  const handleInvalidSubmit = () => {
    setSubmitError('Vérifiez les champs signalés avant d’envoyer votre message.');
  };

  if (receipt) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 text-center sm:p-8"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-700 text-white shadow-lg shadow-teal-700/20">
          <CheckCircle size={31} aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-teal-700">Envoi confirmé par le serveur</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          Votre message a bien été envoyé
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
          L’équipe de l’ASFO prendra connaissance de votre demande et vous répondra par le moyen de contact indiqué.
        </p>

        <dl className="mx-auto mt-6 max-w-lg divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-5 text-left">
          {[
            ['Numéro de demande', receipt.requestId],
            [
              'Date',
              receipt.createdAt.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }),
            ],
            ['Sujet', receipt.subject],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3.5 text-sm sm:grid-cols-[145px_1fr] sm:gap-4">
              <dt className="text-slate-500">{label}</dt>
              <dd className={`break-all font-bold text-slate-900 ${label === 'Numéro de demande' ? 'font-mono' : ''}`}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setReceipt(null)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:border-teal-300 hover:text-teal-700"
          >
            <RotateCcw size={16} /> Envoyer un autre message
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white hover:bg-teal-800"
          >
            <Home size={16} /> Retour à l’accueil
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Champs obligatoires <span className="text-red-600">*</span></p>
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">
          <MessageSquareText size={14} /> Formulaire sécurisé
        </span>
      </div>

      {errorMessages.length > 1 && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-black text-red-900">Plusieurs informations sont à corriger</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {[...new Set(errorMessages)].map((error) => <li key={error}>{error}</li>)}
          </ul>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-bold text-slate-800">
            Nom complet <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              className={`${inputClass(Boolean(errors.name))} pl-11`}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              placeholder="Votre prénom et votre nom"
              {...register('name', {
                required: 'Le nom complet est requis.',
                validate: (value) => value.trim().length >= 2 || 'Le nom doit contenir au moins 2 caractères.',
              })}
            />
          </div>
          <FieldError id="contact-name-error" message={errors.name?.message} />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-bold text-slate-800">
            Adresse email <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              className={`${inputClass(Boolean(errors.email))} pl-11`}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              placeholder="vous@exemple.com"
              {...register('email', {
                required: 'L’adresse email est requise.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Saisissez une adresse email valide.',
                },
              })}
            />
          </div>
          <FieldError id="contact-email-error" message={errors.email?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className="mb-2 block text-sm font-bold text-slate-800">
          Téléphone <span className="font-normal text-slate-400">(facultatif)</span>
        </label>
        <div className="relative">
          <Phone size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            className={`${inputClass(Boolean(errors.phone))} pl-11`}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            placeholder="+221 77 123 45 67"
            {...register('phone', {
              validate: (value) =>
                !value.trim() ||
                /^(\+221)?[0-9\s-]{9,}$/.test(value.trim()) ||
                'Saisissez un numéro sénégalais valide.',
            })}
          />
        </div>
        <FieldError id="contact-phone-error" message={errors.phone?.message} />
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-2 block text-sm font-bold text-slate-800">
          Sujet <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <select
            id="contact-subject"
            className={`${inputClass(Boolean(errors.subject))} appearance-none pr-11`}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
            {...register('subject', { required: 'Sélectionnez le sujet de votre message.' })}
          >
            <option value="">Sélectionnez un sujet</option>
            {SUBJECTS.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <FieldError id="contact-subject-error" message={errors.subject?.message} />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-bold text-slate-800">
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={7}
          maxLength={2000}
          className={`${inputClass(Boolean(errors.message))} resize-y leading-6`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-help'}
          placeholder="Décrivez votre demande avec les informations utiles…"
          {...register('message', {
            required: 'Le message est requis.',
            validate: (value) =>
              value.trim().length >= 30 || 'Le message doit contenir au moins 30 caractères.',
          })}
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <p id="contact-message-help" className="text-xs text-slate-500">30 caractères minimum · 2 000 maximum</p>
          <p className={`text-xs font-bold ${(message?.trim().length ?? 0) >= 30 ? 'text-teal-700' : 'text-slate-500'}`}>
            {message?.length ?? 0} / 2 000
          </p>
        </div>
        <FieldError id="contact-message-error" message={errors.message?.message} />
      </div>

      <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${errors.consent ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-teal-300'}`}>
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
          {...register('consent', {
            required: 'Vous devez accepter l’utilisation de vos informations pour traiter la demande.',
          })}
        />
        <span className="text-sm leading-6 text-slate-700">
          J’accepte que mes informations soient utilisées uniquement pour traiter cette demande.
          <span className="text-red-600"> *</span>
        </span>
      </label>
      <FieldError id="contact-consent-error" message={errors.consent?.message} />

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Site internet</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      {submitError && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-black">Le message n’a pas été envoyé</p>
            <p className="mt-1">{submitError}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-4 text-base font-black text-white shadow-lg shadow-teal-800/15 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 size={19} className="animate-spin" /> : <Send size={19} />}
        {isSubmitting ? 'Envoi en cours…' : 'Envoyer le message'}
      </button>

      <p className="text-center text-xs leading-5 text-slate-500">
        Les informations transmises sont utilisées uniquement pour traiter votre demande.{' '}
        <Link to="/privacy" className="font-bold text-teal-700 underline underline-offset-2">
          Politique de confidentialité
        </Link>
      </p>
    </form>
  );
};

export default ContactForm;
