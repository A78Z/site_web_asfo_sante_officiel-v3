import React from 'react';
import { CalendarDays } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, <span className="text-teal-600">Admin</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Résumé de la plateforme ASFO — Vue d'ensemble de vos activités
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
          <CalendarDays className="h-4 w-4 text-teal-500" />
          <span className="capitalize">{today}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
