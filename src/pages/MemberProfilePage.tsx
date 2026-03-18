import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { queryObjects, type ParseFile } from '../lib/parse';
import { CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export interface MemberRequest {
  objectId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  village: string;
  region: string;
  profession: string;
  status: 'En attente' | 'Validé' | 'Refusé';
  createdAt: string;
  photo?: ParseFile;
}

const profLabel = (val: string) => {
  const labels: Record<string, string> = {
    'medecin': 'Médecin',
    'infirmier': 'Infirmier',
    'sage_femme': 'Sage-femme',
    'pharmacien': 'Pharmacien',
    'technicien': 'Technicien Supérieur',
    'etudiant': 'Étudiant',
    'secretaire': 'Secrétaire Médical',
    'agent_sante': 'Agent de Santé',
    'chauffeur': 'Ambulancier / Chauffeur',
    'autre_medical': 'Autre professionnel de santé',
    'enseignant': 'Enseignant',
    'etudiant_non_medical': 'Étudiant (Autre)',
    'commercant': 'Commerçant(e)',
    'artisan': 'Artisan',
    'agriculteur': 'Agriculteur / Éleveur',
    'cadre': 'Cadre / Cadre Supérieur',
    'employe': 'Employé(e) / Ouvrier',
    'fonctionnaire': 'Fonctionnaire',
    'secteur_informel': 'Secteur informel',
    'retraite': 'Retraité(e)',
    'sans_emploi': 'Sans emploi',
    'autre': 'Autre',
  };
  return labels[val] ?? val;
};

const MemberProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<MemberRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        // Since id is shortened (e.g., ASFO-M-LFPZ3I), we fetch all validated members and find the match
        const response = await queryObjects<MemberRequest>('MemberRequests', { where: { status: 'Validé' } });
        const found = response.results.find((m) => `ASFO-M-${m.objectId.slice(0, 6).toUpperCase()}` === id);
        
        if (found) {
          setMember(found);
        } else {
          setError('Membre introuvable ou carte non valide.');
        }
      } catch (err: any) {
        console.error('Error fetching member:', err);
        setError('Erreur lors de la vérification de la carte.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMember();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0F2A44] mb-4" />
        <p className="text-gray-500 font-medium">Vérification de la carte membre...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#E63946] mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>

        {error || !member ? (
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-t-4 border-red-500">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carte non reconnue</h2>
            <p className="text-gray-500 mb-8">{error}</p>
            <div className="text-sm text-gray-400">
              ID scanné : <span className="font-mono text-gray-600">{id}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white overflow-hidden rounded-2xl shadow-xl border-t-4 border-emerald-500">
            <div className="p-8 pb-6 text-center bg-gradient-to-b from-emerald-50 to-white">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4 shadow-sm">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Carte Membre Officielle</h2>
              <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200">
                Membre Valide
              </div>
            </div>

            <div className="px-8 pb-8 pt-2">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                    {member.photo?.url ? (
                      <img 
                        src={member.photo.url} 
                        alt={`${member.firstName} ${member.lastName}`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0F2A44] flex items-center justify-center text-white text-3xl font-bold">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold text-gray-900 text-center uppercase tracking-wide">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-lg font-medium text-[#E63946] mt-1 text-center">
                  {profLabel(member.profession)}
                </p>
                
                <div className="w-full mt-8 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">ID Membre</p>
                    <p className="font-mono text-gray-900 font-medium">{id}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Profession</p>
                    <p className="text-gray-900 font-medium">{profLabel(member.profession)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberProfilePage;
