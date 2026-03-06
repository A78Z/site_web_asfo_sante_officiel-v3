import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Users, UploadCloud, CheckCircle, Download, Home,
  FileText, X, Loader2, AlertCircle, Phone, Mail,
  AlertTriangle, HeartPulse, Shield, BookOpen, MousePointerClick, FileEdit, Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createObject, uploadFile } from '../lib/parse';

// ─── Zod Schema ──────────────────────────────────────────────
const candidatureSchema = z.object({
  // Section 1 - Village
  nomVillage: z.string().min(2, 'Le nom du village est requis (min 2 caractères)'),
  commune: z.string().min(2, 'La commune est requise'),
  region: z.string().min(1, 'Veuillez sélectionner une région'),
  population: z.string().optional(),
  distanceCentreSante: z.string().optional(),
  posteSante: z.string().optional(),

  // Section 2 - Amicale
  nomAmicale: z.string().min(2, "Le nom de l'amicale est requis"),
  universite: z.string().optional(),
  nomContact: z.string().min(2, 'Le nom du contact est requis'),
  fonction: z.string().optional(),
  email: z.string().email('Adresse email invalide'),
  telephone: z.string().regex(
    /^(\+221)?[0-9\s-]{9,}$/,
    'Numéro tél. sénégalais invalide (ex: +221 77 123 45 67)'
  ),

  // Section 3 - Description
  description: z.string().min(100, 'La description doit contenir au moins 100 caractères'),
});

type CandidatureFormData = z.infer<typeof candidatureSchema>;

// ─── Constants ───────────────────────────────────────────────
const senegalRegions = [
  'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Louga',
  'Tambacounda', 'Kaolack', 'Kolda', 'Ziguinchor', 'Fatick',
  'Kaffrine', 'Kédougou', 'Matam', 'Sédhiou', 'Mauritanie'
];

interface UploadedFile {
  file: File;
  label: string;
}

const REQUIRED_DOCUMENTS = [
  "Lettre adressée au Président de l'ASFO",
  "Situation géographique du village",
  "Situation sanitaire du village",
  "Paiement des frais de dossier : 20 000 FCFA",
];

// ─── Success Card ────────────────────────────────────────────
const SuccessCard: React.FC<{
  numeroDossier: string;
  onReset: () => void;
}> = ({ numeroDossier, onReset }) => {
  const downloadReceipt = () => {
    // Generate a simple text receipt
    const receipt = `
═══════════════════════════════════════════
        REÇU DE CANDIDATURE - ASFO
        Caravane de Santé
═══════════════════════════════════════════

Numéro de dossier : ${numeroDossier}
Date : ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
Statut : En attente

───────────────────────────────────────────
Votre candidature a bien été enregistrée.
Veuillez conserver ce numéro pour suivre
votre dossier.

ASFO — Action Sanitaire pour le Fouta
UCAD Dakar
═══════════════════════════════════════════
    `;
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recu-candidature-${numeroDossier}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
      className="max-w-2xl mx-auto w-full pt-12 md:pt-20 px-4"
    >
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden text-center p-8 md:p-12">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Candidature envoyée avec succès</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Votre dossier a été soumis et sera examiné par notre équipe. Un email de confirmation a été envoyé.
        </p>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8 text-center mb-8 max-w-sm mx-auto">
          <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wider">Numéro de dossier</p>
          <p className="text-3xl md:text-4xl font-extrabold text-[#0F766E] font-mono tracking-tight">
            {numeroDossier}
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Conservez ce numéro pour suivre votre dossier.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadReceipt}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <Download size={18} />
            Télécharger le reçu
          </button>
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <Home size={18} />
            Retour à l'accueil
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Candidature Page ───────────────────────────────────
const CandidaturePage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [numeroDossier, setNumeroDossier] = useState('');
  const [fileError, setFileError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidatureFormData>({
    resolver: zodResolver(candidatureSchema),
    mode: 'onBlur',
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFileError('');
    const newFiles = acceptedFiles.map((file) => ({
      file,
      label: file.name,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  };

  // Generate unique dossier number
  const generateNumeroDossier = (): string => {
    const year = new Date().getFullYear();
    const stored = localStorage.getItem('asfo_dossier_counter');
    let counter = stored ? parseInt(stored, 10) : 0;
    counter += 1;
    localStorage.setItem('asfo_dossier_counter', counter.toString());
    return `ASFO-${year}-${counter.toString().padStart(4, '0')}`;
  };

  const onSubmit = async (data: CandidatureFormData) => {
    if (uploadedFiles.length === 0) {
      setFileError('Veuillez fournir les documents requis au format PDF.');
      document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setFileError('');
    setIsSubmitting(true);

    try {
      const numero = generateNumeroDossier();

      const uploadedDocs = await Promise.all(
        uploadedFiles.map(async (uf) => {
          const parsed = await uploadFile(uf.file.name, uf.file);
          return { label: uf.label, ...parsed };
        }),
      );

      await createObject('Candidatures', {
        numeroDossier: numero,
        nomVillage: data.nomVillage,
        commune: data.commune,
        region: data.region,
        population: data.population || '',
        distanceCentreSante: data.distanceCentreSante || '',
        posteSante: data.posteSante || '',
        nomAmicale: data.nomAmicale,
        universite: data.universite || '',
        nomContact: data.nomContact,
        fonction: data.fonction || '',
        email: data.email,
        telephone: data.telephone,
        description: data.description,
        statut: 'En attente',
        documents: uploadedDocs,
      });

      setNumeroDossier(numero);
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting candidature:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitSuccess(false);
    setNumeroDossier('');
    setUploadedFiles([]);
    reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <SuccessCard numeroDossier={numeroDossier} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans pb-24">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* 1 — Header Premium */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold uppercase tracking-wider">
            <Shield size={14} /> Caravane de Santé ASFO
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <span role="img" aria-label="ambulance">🚑</span>
            Dépôt de candidature
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-2xl">
            Vous représentez une association de développement du village, une amicale d’étudiants ou un comité local, et vous souhaitez accueillir une caravane médicale dans votre localité ?
            Merci de remplir ce formulaire et de fournir les documents demandés.
          </p>
        </div>

        {/* --- NOUVEAU : Guide de candidature --- */}
        <div className="bg-white border text-left border-gray-200 shadow-sm rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between transform transition hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
              <BookOpen className="text-teal-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Guide de candidature</h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Avant de déposer votre dossier, consultez le guide officiel de la campagne médicale.
                Il contient toutes les informations et critères de sélection.
              </p>
            </div>
          </div>
          <a
            href="/GUIDE_DE_CANDIDATURE_CAMPAGNE_MEDICALE_ASFO.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-white text-teal-700 border-2 border-teal-600 hover:bg-teal-50 px-6 py-3 rounded-lg font-semibold transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <Download size={18} /> Télécharger le guide
          </a>
        </div>

        {/* --- NOUVEAU : Processus 5 étapes --- */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="text-teal-600" size={20} /> Comment candidater ?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon: MousePointerClick, title: '1. S\'informer', desc: 'Lire le guide' },
              { icon: FileText, title: '2. Préparer', desc: 'Rassembler les pièces' },
              { icon: FileEdit, title: '3. Formulaire', desc: 'Remplir les infos' },
              { icon: UploadCloud, title: '4. Transmettre', desc: 'Uploader le dossier' },
              { icon: Send, title: '5. Valider', desc: 'Envoyer la demande' },
            ].map((step, i) => (
              <div key={i} className="bg-white border text-left border-gray-100 rounded-lg p-4 shadow-sm relative overflow-hidden group hover:border-teal-200 transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-teal-50 transition-colors">
                  <step.icon className="text-gray-500 group-hover:text-teal-600 transition-colors" size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2 — Carte Informations importantes */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 md:p-6 flex items-start gap-4">
          <AlertTriangle className="text-blue-500 shrink-0 mt-0.5" size={24} />
          <p className="text-blue-800 text-sm md:text-base leading-relaxed">
            <strong className="font-semibold block mb-1">Attention</strong>
            Toutes les candidatures se font exclusivement via ce portail. Aucun dossier physique ne sera accepté.
          </p>
        </div>

        {/* 3 — Carte Dossier à fournir */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
              <FileText className="text-gray-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Dossier à fournir</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REQUIRED_DOCUMENTS.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="text-[#0F766E] shrink-0 mt-0.5" size={18} />
                <span className="text-gray-700 text-sm md:text-base" dangerouslySetInnerHTML={{ __html: doc.replace('20 000 FCFA', '<strong>20 000 FCFA</strong>') }} />
              </li>
            ))}
          </ul>
        </div>

        {/* 4 — Formulaire Premium */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* Section 1 — Informations du village */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <MapPin className="text-[#0F766E]" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Informations du village</h3>
            </div>
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom du village <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('nomVillage')}
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none ${errors.nomVillage
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                    : 'border-gray-200 focus:border-[#0F766E] focus:ring-4 focus:ring-teal-50'
                    }`}
                  placeholder="Ex: Thilogne"
                />
                {errors.nomVillage && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.nomVillage.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Commune / Département <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('commune')}
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none ${errors.commune
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                    : 'border-gray-200 focus:border-[#0F766E] focus:ring-4 focus:ring-teal-50'
                    }`}
                  placeholder="Ex: Thilogne / Podor"
                />
                {errors.commune && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.commune.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Région <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('region')}
                  className={`w-full px-4 py-3 rounded-lg border transition-all bg-white focus:outline-none appearance-none ${errors.region
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                    : 'border-gray-200 focus:border-[#0F766E] focus:ring-4 focus:ring-teal-50'
                    }`}
                >
                  <option value="">Sélectionnez une région</option>
                  {senegalRegions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.region && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.region.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2 — Informations de l'amicale */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <Users className="text-[#0F766E]" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Informations sur l'association / organisation</h3>
            </div>
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom de l'amicale <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('nomAmicale')}
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none ${errors.nomAmicale
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                    : 'border-gray-200 focus:border-[#0F766E] focus:ring-4 focus:ring-teal-50'
                    }`}
                  placeholder="Ex: Amicale des Étudiants de Thilogne"
                />
                {errors.nomAmicale && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.nomAmicale.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom du contact principal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('nomContact')}
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none ${errors.nomContact
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                    : 'border-gray-200 focus:border-[#0F766E] focus:ring-4 focus:ring-teal-50'
                    }`}
                  placeholder="Prénom et Nom"
                />
                {errors.nomContact && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.nomContact.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none ${errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                      : 'border-gray-200 focus:border-[#0F766E] focus:ring-4 focus:ring-teal-50'
                      }`}
                    placeholder="contact@amicale.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.email.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    {...register('telephone')}
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none ${errors.telephone
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                      : 'border-gray-200 focus:border-[#0F766E] focus:ring-4 focus:ring-teal-50'
                      }`}
                    placeholder="+221 77 123 45 67"
                  />
                </div>
                {errors.telephone && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.telephone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3 — Description du village */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <HeartPulse className="text-[#0F766E]" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Description du village</h3>
            </div>
            <div className="p-6 md:p-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Situation sanitaire et besoins <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={6}
                className={`w-full px-4 py-4 rounded-lg border transition-all resize-y focus:outline-none ${errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : 'border-gray-200 focus:border-[#0F766E] focus:ring-4 focus:ring-teal-50'
                  }`}
                placeholder="Décrivez votre village, la situation sanitaire, la population et les besoins médicaux..."
              />
              <div className="flex justify-between mt-1.5">
                {errors.description ? (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.description.message}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">Minimum 100 caractères</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4 — Upload document */}
          <div id="upload-zone" className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <UploadCloud className="text-[#0F766E]" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Téléversement du dossier complet</h3>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive
                  ? 'border-[#0F766E] bg-teal-50'
                  : fileError
                    ? 'border-red-300 bg-red-50 hover:bg-red-100'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                  }`}
              >
                <input {...getInputProps()} />
                <motion.div animate={isDragActive ? { y: -5 } : { y: 0 }}>
                  <UploadCloud
                    size={40}
                    className={`mx-auto mb-4 ${isDragActive ? 'text-[#0F766E]' : fileError ? 'text-red-400' : 'text-gray-400'}`}
                  />
                </motion.div>
                <p className={`text-base font-semibold mb-1 ${fileError ? 'text-red-700' : 'text-gray-700'}`}>
                  {isDragActive ? 'Déposez vos fichiers ici' : 'Cliquez ou glissez votre fichier ici'}
                </p>
                <p className={`text-sm ${fileError ? 'text-red-500' : 'text-gray-500'}`}>
                  PDF uniquement — 5MB maximum
                </p>
              </div>

              {fileError && (
                <p className="text-sm text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={14} /> {fileError}
                </p>
              )}

              {/* Uploaded files list */}
              <AnimatePresence>
                {uploadedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pt-2"
                  >
                    <h4 className="text-sm font-semibold text-gray-700">Fichiers ajoutés :</h4>
                    {uploadedFiles.map((f, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm group hover:border-[#0F766E] transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText size={20} className="text-red-500 shrink-0" />
                          <div className="truncate">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {f.file.name}
                            </p>
                            <p className="text-xs text-gray-500">{formatSize(f.file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                          className="p-1.5 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                          aria-label="Supprimer le fichier"
                        >
                          <X size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 5 — Boutons d’action premium */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-6">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3.5 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0F766E] text-white rounded-lg font-semibold hover:bg-[#0d6e66] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer ma candidature'
              )}
            </button>
          </div>
        </form>

      </div>

      {/* --- NOUVEAU : Bouton flottant Guide --- */}
      <Link
        to="/guide-candidature"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-full shadow-xl hover:bg-gray-800 hover:scale-105 transition-transform focus:ring-4 focus:ring-gray-300"
      >
        <BookOpen size={20} />
        <span className="font-semibold hidden sm:inline">Guide de candidature</span>
      </Link>
    </div>
  );
};

export default CandidaturePage;
