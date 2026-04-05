import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const DonateSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') || '';
  const amount = searchParams.get('amount') || '';
  const name = decodeURIComponent(searchParams.get('name') || 'Anonyme');

  useEffect(() => {
    document.title = 'ASFO | Don réussi';
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Merci {name} !
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          Votre don de{' '}
          <strong className="text-teal-700">
            {amount ? parseInt(amount).toLocaleString('fr-FR') : '—'} FCFA
          </strong>{' '}
          a été reçu avec succès via Wave.
        </p>

        {ref && (
          <p className="text-gray-400 text-sm mb-6">Référence : {ref}</p>
        )}

        <p className="text-gray-500 text-sm leading-relaxed mb-10">
          Votre contribution aide directement les populations du Fouta.
          Au nom de l'ASFO, merci pour votre générosité.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg"
        >
          Retour à l'accueil
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
};

export default DonateSuccessPage;
