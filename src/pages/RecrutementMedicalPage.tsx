import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CircleOff,
  HeartPulse,
  Loader2,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { RECRUITMENT_CATEGORIES } from '../../api/_lib/recruitment.js';
import { fetchSpecialties, type RecruitmentCategoryState } from '../lib/recruitment';

const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const iconByCategory: Record<string, React.ElementType> = {
  dentiste: Sparkles,
  pharmacien: Pill,
  paramedical: Activity,
  medecins: Stethoscope,
  specialiste: HeartPulse,
  generaliste: Stethoscope,
};

const defaultStates = (): RecruitmentCategoryState[] =>
  RECRUITMENT_CATEGORIES.filter((category) => !category.hidden).map((category) => ({
    ...category,
    open: category.defaultOpen,
    updatedAt: null,
    updatedBy: null,
  }));

const CategoryCard: React.FC<{
  category: RecruitmentCategoryState;
  index: number;
}> = ({ category, index }) => {
  const reduceMotion = useReducedMotion();
  const Icon = iconByCategory[category.key] ?? Stethoscope;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] border bg-white p-6 shadow-[0_22px_60px_-38px_rgba(15,23,42,0.38)] transition duration-300 sm:p-7 ${
        category.open
          ? 'border-teal-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_28px_72px_-38px_rgba(13,148,136,0.5)]'
          : 'border-slate-200'
      }`}
    >
      {category.open && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-teal-200/45 blur-3xl"
          animate={reduceMotion ? undefined : { opacity: [0.45, 0.85, 0.45], scale: [1, 1.08, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="relative flex items-start justify-between gap-4">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            category.open
              ? 'bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-[0_16px_28px_-16px_rgba(13,148,136,0.9)]'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Icon className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] ${
            category.open
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
          }`}
        >
          {category.open ? (
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <CircleOff className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {category.open ? 'Inscriptions ouvertes' : 'Fermées'}
        </span>
      </div>

      <h2 className="relative mt-6 text-xl font-black tracking-tight text-slate-950 sm:text-2xl" style={poppins}>
        {category.label}
      </h2>
      {category.subtitle && (
        <p className="relative mt-1 text-sm font-bold text-teal-700">{category.subtitle}</p>
      )}
      <p className="relative mt-3 flex-1 text-sm leading-6 text-slate-600">
        {category.description}
      </p>

      {category.open ? (
        <Link
          to={`/recrutement-medical/${category.slug}`}
          className="relative mt-6 inline-flex min-h-[50px] items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 text-sm font-black text-white shadow-[0_15px_30px_-18px_rgba(13,148,136,0.9)] transition hover:from-teal-700 hover:to-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 active:scale-[0.985]"
        >
          {!reduceMotion && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-20 -skew-x-12 bg-white/20 blur-sm"
              animate={{ x: ['-180%', '520%'] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 5, delay: index * 0.35 }}
            />
          )}
          <span className="relative">{category.ctaLabel ?? 'S’inscrire'}</span>
          <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="relative mt-6 inline-flex min-h-[50px] cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 text-sm font-black text-slate-400"
        >
          {category.ctaLabel ?? 'S’inscrire'}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </motion.article>
  );
};

const RecrutementMedicalPage: React.FC = () => {
  const [categories, setCategories] = useState<RecruitmentCategoryState[]>(defaultStates);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    document.title = 'Recrutement médical ASFO 2026 | Inscriptions';
  }, []);

  useEffect(() => {
    let active = true;
    fetchSpecialties()
      .then(({ specialties }) => {
        if (active) setCategories(specialties);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f7faf9]">
      <section className="relative overflow-hidden border-b border-teal-100 bg-gradient-to-br from-[#062f2b] via-[#0b4b45] to-[#087c70] text-white">
        <div aria-hidden="true" className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-200/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-teal-50 backdrop-blur">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            27e Grande Caravane Médicale · 2026
          </span>
          <h1 className="mt-6 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-5xl" style={poppins}>
            Rejoignez la mission médicale ASFO 2026
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-teal-50/85 sm:text-lg">
            Un parcours clair, quatre catégories professionnelles. Choisissez votre profil et déposez votre inscription en quelques minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-teal-50/90">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">4 liens d’inscription</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">Aucun paiement</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">Confirmation par SMS</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-teal-700">Votre porte d’entrée</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl" style={poppins}>
              Choisissez votre catégorie
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Les spécialités sont regroupées dans leur famille professionnelle. Une fermeture bloque également l’envoi côté serveur.
            </p>
          </div>
          {loading && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500" role="status">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Actualisation des inscriptions…
            </span>
          )}
        </div>

        {loadError && (
          <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
            L’état en direct n’a pas pu être actualisé. Rechargez la page avant de commencer une inscription.
          </p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard key={category.key} category={category} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default RecrutementMedicalPage;
