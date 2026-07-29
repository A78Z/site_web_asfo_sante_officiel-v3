import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { queryObjects, type ParseFile } from '../lib/parse';
import { findMemberById } from '../utils/memberId';
import { ShieldCheck, ShieldAlert, ArrowLeft, Loader2, Phone, MapPin, Mail, Calendar, BadgeCheck, Globe } from 'lucide-react';

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

const VerifyMemberPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<MemberRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        // id looks like ASFO-MED-2026-001
        const response = await queryObjects<MemberRequest>('MemberRequests', { where: { status: 'Validé' } });
        const found = findMemberById(id!, response.results) as MemberRequest | undefined;

        if (found) {
          setMember(found);
        } else {
          setError('Membre non reconnu');
        }
      } catch {
        setError('Erreur lors de la vérification');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMember();
    }
  }, [id]);

  // Check if membership is still valid (2 years from creation)
  const isActive = member?.status === 'Validé';
  const expiryDate = member ? (() => {
    const d = new Date(member.createdAt);
    d.setFullYear(d.getFullYear() + 2);
    return d;
  })() : new Date();
  const isExpired = new Date() > expiryDate;

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-[#0D9488]/20 animate-ping" />
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0F766E] to-[#0D9488] flex items-center justify-center relative z-10">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        </div>
        <p className="text-gray-700 font-semibold text-lg">Vérification en cours...</p>
        <p className="mt-2 text-sm text-gray-400">Consultation du registre officiel ASFO</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">

        {/* Logo ASFO header */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo-asfo.png"
              alt="ASFO"
              className="h-10 w-10 rounded-lg object-contain"
            />
            <div>
              <p className="text-sm font-extrabold text-[#0F766E] tracking-wider">ASFO</p>
              <p className="text-[10px] text-gray-400">Action Sanitaire pour le Fouta</p>
            </div>
          </div>
        </div>

        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#0F766E] mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>

        {error || !member ? (
          /* ── MEMBER NOT FOUND ── */
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-[6px] border-[#DC2626] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShieldAlert className="w-32 h-32" />
            </div>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-6 border border-red-100 relative z-10">
              <ShieldAlert className="h-10 w-10 text-[#DC2626]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 relative z-10 text-center">
              Vérification Échouée
            </h2>
            <div className="inline-flex items-center justify-center w-full mt-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-[#DC2626] shadow-sm mb-6 relative z-10">
              Membre non reconnu
            </div>
            <p className="text-gray-500 text-center text-sm mb-6 relative z-10">
              Cet identifiant ne correspond à aucun membre ASFO actif dans notre registre officiel. La carte pourrait être invalide ou expirée.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center relative z-10">
              <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">ID Scanné</span>
              <span className="font-mono text-gray-700 font-semibold">{id}</span>
            </div>
          </div>
        ) : (
          /* ── MEMBER VERIFIED ── */
          <div className="bg-white overflow-hidden rounded-2xl shadow-xl relative">
            {/* Top colored bar */}
            <div className="h-1.5 flex">
              <div className="flex-[2] bg-[#0F766E]" />
              <div className="w-8 bg-white" />
              <div className="flex-[3] bg-[#DC2626]" />
            </div>

            {/* Green header section */}
            <div
              className="relative px-6 pt-8 pb-14 text-center"
              style={{
                background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
              }}
            >
              {/* Dot pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '14px 14px',
                }}
              />

              <div className="relative z-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-4 border border-white/30">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Vérification Officielle</h2>
                <div className="inline-flex items-center mt-3 px-4 py-1.5 rounded-full text-sm font-bold text-white bg-white/20 backdrop-blur-sm border border-white/30">
                  <BadgeCheck className="h-4 w-4 mr-1.5" />
                  Membre vérifié ASFO
                </div>
              </div>
            </div>

            {/* Member photo overlapping header */}
            <div className="relative z-10 -mt-10 flex justify-center">
              <div className="relative">
                <div className="h-32 w-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                  {member.photo?.url ? (
                    <img
                      src={member.photo.url}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0F766E] to-[#1E3A5F] flex items-center justify-center text-white text-3xl font-bold">
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </div>
                  )}
                </div>
                {/* Status indicator */}
                <div
                  className={`absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full border-[3px] border-white shadow-sm ${
                    isActive && !isExpired ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>

            {/* Name & role */}
            <div className="text-center px-6 pt-4 pb-2">
              <h3 className="text-xl font-extrabold text-[#1E3A5F] uppercase tracking-wide">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-sm text-[#0F766E] font-semibold mt-1">
                {profLabel(member.profession)}
              </p>
            </div>

            {/* Member details */}
            <div className="px-6 pb-6 pt-3">
              <div className="w-full space-y-2.5">
                {/* Status */}
                <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Statut</span>
                  <span className={`font-bold flex items-center gap-1.5 ${
                    isActive && !isExpired ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isActive && !isExpired ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                    }`} />
                    {isActive && !isExpired ? 'Membre Actif' : 'Carte Expirée'}
                  </span>
                </div>

                {/* Profession */}
                <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Profession</span>
                  <span className="font-semibold text-[#0F766E]">{profLabel(member.profession)}</span>
                </div>

                {/* Phone */}
                {member.phone && (
                  <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone className="h-3 w-3" /> Téléphone
                    </span>
                    <a href={`tel:${member.phone}`} className="font-semibold text-[#1E3A5F] hover:underline">
                      {member.phone}
                    </a>
                  </div>
                )}

                {/* Email */}
                {member.email && (
                  <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Mail className="h-3 w-3" /> Email
                    </span>
                    <a href={`mailto:${member.email}`} className="font-semibold text-[#1E3A5F] hover:underline text-sm truncate max-w-[180px]">
                      {member.email}
                    </a>
                  </div>
                )}

                {/* City / Village */}
                {member.village && (
                  <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> Localité
                    </span>
                    <span className="font-semibold text-gray-700 text-sm text-right max-w-[180px]">
                      {member.village}
                    </span>
                  </div>
                )}

                {/* Organisation */}
                <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Globe className="h-3 w-3" /> Organisation
                  </span>
                  <span className="font-semibold text-[#0F766E]">ASFO</span>
                </div>

                {/* Member ID */}
                <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">N° Membre</span>
                  <span className="font-mono text-gray-700 font-medium">{id}</span>
                </div>

                {/* Validity */}
                <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Validité
                  </span>
                  <span className={`font-semibold ${isExpired ? 'text-red-600' : 'text-gray-700'}`}>
                    {validityYear}
                  </span>
                </div>

                {/* Member since */}
                <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Membre depuis</span>
                  <span className="font-medium text-gray-600 text-sm">
                    {new Date(member.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* ASFO footer branding */}
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <img src="/logo-asfo.png" alt="ASFO" className="h-6 w-6 rounded object-contain" />
                  <span className="text-xs font-bold text-[#0F766E] tracking-wider">ASFO</span>
                </div>
                <p className="text-xs text-gray-400">
                  Registre officiel — Action Sanitaire pour le Fouta
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  www.asfosante.org
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyMemberPage;
