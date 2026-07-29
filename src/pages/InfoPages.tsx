import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GestesQuiSauventPageImpl from './GestesQuiSauventPage';
import FaqSantePageImpl from './FaqSantePage';
import SanteHubPageImpl from './SanteHubPage';

/**
 * Pages « placeholder structuré » : squelette éditorial prêt à remplir
 * (hero teal + sections). Le contenu de chaque section est à compléter —
 * remplacer les cartes par du contenu réel au fur et à mesure.
 */

interface SectionDef {
  title: string;
  description: string;
  to?: string; // si la section pointe vers une autre page
}

const InfoPage: React.FC<{
  badge: string;
  title: string;
  subtitle: string;
  sections: SectionDef[];
}> = ({ badge, title, subtitle, sections }) => {
  useEffect(() => {
    document.title = `${title} | ASFO - Action Sanitaire pour le Fouta`;
  }, [title]);

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 py-16">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-6 inline-flex items-center rounded-full bg-white/20 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm">
              {badge}
            </span>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{title}</h1>
            <p className="text-lg leading-relaxed text-white/90">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => {
              const card = (
                <div
                  key={s.title}
                  className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h2 className="text-lg font-bold text-gray-800">{s.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{s.description}</p>
                  {s.to ? (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-600">
                      Consulter <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="mt-4 inline-flex w-fit items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                      Contenu à venir
                    </span>
                  )}
                </div>
              );
              return s.to ? (
                <Link key={s.title} to={s.to} className="no-underline">
                  {card}
                </Link>
              ) : (
                card
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ─── ASFO / Transparence ─── */

export const PresidentsPage: React.FC = () => (
  <InfoPage
    badge="Organisation"
    title="Nos présidents"
    subtitle="Celles et ceux qui ont porté l'ASFO depuis sa création en 2000."
    sections={[
      { title: 'Galerie des présidents', description: 'Portraits et mandats des 21 présidents de l’ASFO.' },
      { title: 'Le mot du Président', description: 'Le message du Dr Abdaramani Ndiaye, 21e Président.', to: '/president-message' },
      { title: 'Passations', description: 'Les moments forts des passations de service.' },
    ]}
  />
);

export const ImpactPage: React.FC = () => (
  <InfoPage
    badge="Transparence"
    title="Impact & chiffres"
    subtitle="L'effet concret de nos actions, mesuré mission après mission."
    sections={[
      { title: 'Chiffres clés', description: '37+ missions, 25 000+ patients soignés, 7 spécialités mobilisées.' },
      { title: 'Rapports annuels', description: 'Nos bilans détaillés, publiés chaque année.', to: '/rapport' },
      { title: 'Gouvernance & statuts', description: 'Budget, bilans financiers et statuts de l’association.' },
    ]}
  />
);

export const DocumentairePage: React.FC = () => (
  <InfoPage
    badge="Médias"
    title="Documentaire & vidéos"
    subtitle="L'ASFO en images : documentaires, reportages et témoignages."
    sections={[
      { title: 'Documentaire ASFO', description: 'Le film qui retrace nos missions au Fouta.' },
      { title: 'Reportages de mission', description: 'Les campagnes médicales filmées sur le terrain.' },
      { title: 'Médiathèque photos', description: 'Toutes les photos de nos missions.', to: '/gallery' },
    ]}
  />
);

/* ─── Ressources ─── */

export const PressePage: React.FC = () => (
  <InfoPage
    badge="Ressources"
    title="Communiqués & presse"
    subtitle="Espace presse : communiqués officiels, revue de presse et contacts médias."
    sections={[
      { title: 'Communiqués officiels', description: 'Les annonces officielles de l’ASFO.' },
      { title: 'Revue de presse', description: 'L’ASFO dans les médias sénégalais et internationaux.' },
      { title: 'Contact presse', description: 'Kit média et coordonnées pour les journalistes.', to: '/contact' },
    ]}
  />
);

export const NewsletterPage: React.FC = () => (
  <InfoPage
    badge="Ressources"
    title="Newsletter & alertes"
    subtitle="Recevez nos annonces, convocations et comptes-rendus par email."
    sections={[
      { title: 'Inscription newsletter', description: 'Formulaire d’inscription à la lettre d’information (à venir).' },
      { title: 'Alertes SMS', description: 'Notifications pour les annonces et convocations importantes.' },
      { title: 'Dernières actualités', description: 'Articles et comptes-rendus déjà publiés.', to: '/news' },
    ]}
  />
);

/* ─── S'engager ─── */

export const ParrainerPage: React.FC = () => (
  <InfoPage
    badge="S'engager"
    title="Parrainer un village"
    subtitle="Soutenez durablement une communauté du Fouta en finançant soins et suivi médical."
    sections={[
      { title: 'Comment ça marche', description: 'Le principe du parrainage : engagement, durée, suivi.' },
      { title: 'Villages en attente', description: 'Les communautés qui recherchent un parrain.' },
      { title: 'Faire un don ponctuel', description: 'Contribuer sans engagement de durée.', to: '/donate' },
    ]}
  />
);

/* ─── Missions & Campagnes ─── */

export const ProchaineCampagnePage: React.FC = () => (
  <InfoPage
    badge="Missions & Campagnes"
    title="Prochaine campagne"
    subtitle="27e Grande Campagne Médicale ASFO — département de Podor, 2026."
    sections={[
      { title: 'Dates & lieux', description: 'Calendrier et villages retenus (annonce à venir).' },
      { title: 'Candidature village', description: 'Votre village souhaite accueillir la caravane ?', to: '/candidature' },
      { title: 'Spécialités mobilisées', description: 'Médecine générale, ophtalmologie, dentaire, pédiatrie…' },
    ]}
  />
);

export const CarteInterventionsPage: React.FC = () => (
  <InfoPage
    badge="Missions & Campagnes"
    title="Carte des interventions"
    subtitle="Nos missions à travers le Fouta, visualisées sur une carte interactive."
    sections={[
      { title: 'Carte interactive', description: 'Visualisation des villages couverts depuis 2000 (à venir).' },
      { title: 'Archives des missions', description: 'Le détail de chaque campagne passée.', to: '/archives' },
      { title: 'Résultats & rapports', description: 'Les bilans chiffrés de chaque mission.', to: '/rapport' },
    ]}
  />
);

/* ─── Santé & Prévention ─── */

const FICHES = [
  { title: 'Paludisme', description: 'Prévention, symptômes et prise en charge.' },
  { title: 'Diabète', description: 'Dépistage, alimentation et suivi au quotidien.' },
  { title: 'Hypertension', description: 'Comprendre et contrôler sa tension artérielle.' },
  { title: 'Santé bucco-dentaire', description: 'Hygiène, caries et soins dentaires.' },
  { title: 'Santé mentale', description: 'Bien-être psychologique et où trouver de l’aide.' },
  { title: 'Santé de la mère et de l’enfant', description: 'Grossesse, vaccination et nutrition infantile.' },
];

export const SanteHubPage = SanteHubPageImpl;

export const FichesSantePage: React.FC = () => (
  <InfoPage
    badge="Santé & Prévention"
    title="Fiches santé"
    subtitle="Des fiches claires et pratiques sur les maladies les plus fréquentes au Fouta."
    sections={FICHES}
  />
);

export const PreventionPage: React.FC = () => (
  <InfoPage
    badge="Santé & Prévention"
    title="Conseils de prévention"
    subtitle="Adopter les bons gestes au quotidien pour éviter les maladies les plus courantes."
    sections={[
      { title: 'Hygiène & eau potable', description: 'Prévenir les maladies hydriques et digestives.' },
      { title: 'Nutrition', description: 'Bien se nourrir avec les ressources locales.' },
      { title: 'Moustiquaires & paludisme', description: 'Se protéger efficacement des piqûres.' },
    ]}
  />
);

export const VaccinationPage: React.FC = () => (
  <InfoPage
    badge="Santé & Prévention"
    title="Calendrier vaccinal"
    subtitle="Les vaccins recommandés au Sénégal, de la naissance à l'âge adulte."
    sections={[
      { title: 'Nourrissons (0–2 ans)', description: 'BCG, polio, pentavalent, rougeole…' },
      { title: 'Enfants & adolescents', description: 'Rappels et rattrapages vaccinaux.' },
      { title: 'Adultes & femmes enceintes', description: 'Tétanos, hépatite B et vaccins spécifiques.' },
    ]}
  />
);

export const GestesQuiSauventPage = GestesQuiSauventPageImpl;

export const FaqSantePage = FaqSantePageImpl;
