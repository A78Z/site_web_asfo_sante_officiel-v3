import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const DonateErrorPage: React.FC = () => {
  useEffect(() => {
    document.title = 'ASFO | Paiement non abouti';
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Paiement non abouti
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          Le paiement n'a pas pu être complété. Aucun montant n'a été débité
          de votre compte Wave. Vous pouvez réessayer.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/donate"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg"
          >
            <RotateCcw className="h-4 w-4" />
            Réessayer
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
          >
            Retour à l'accueil
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default DonateErrorPage;
