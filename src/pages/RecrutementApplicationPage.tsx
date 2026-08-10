import React, { lazy, Suspense, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import { categoryBySlug } from '../../api/_lib/recruitment.js';

const RecrutementCandidaturePage = lazy(() => import('./RecrutementCandidaturePage'));
const RecrutementSimplifiePage = lazy(() => import('./RecrutementSimplifiePage'));
const poppins = { fontFamily: "'Poppins', 'Inter', sans-serif" };

const RecrutementApplicationPage: React.FC = () => {
  const { specialite = '' } = useParams();
  const category = useMemo(() => categoryBySlug(specialite), [specialite]);

  // Les anciens liens Généralistes et Spécialistes restent valides : ils
  // conduisent à la porte unique « Médecins » qui les remplace.
  if (category?.mergedInto) {
    return <Navigate to={`/recrutement-medical/${category.mergedInto}`} replace />;
  }

  if (!category) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <X className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-black text-slate-950" style={poppins}>Catégorie introuvable</h1>
        <p className="mt-3 text-sm text-slate-600">Ce lien ne fait pas partie des inscriptions ASFO 2026.</p>
        <Link to="/recrutement-medical" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-teal-700">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voir les catégories d’inscription
        </Link>
      </main>
    );
  }

  return (
    <Suspense fallback={<main className="flex min-h-[45vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-teal-600" aria-hidden="true" /></main>}>
      {category.formKind === 'simplified'
        ? <RecrutementSimplifiePage category={category} />
        : <RecrutementCandidaturePage />}
    </Suspense>
  );
};

export default RecrutementApplicationPage;
