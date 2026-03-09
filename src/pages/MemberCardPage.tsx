import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Upload, Mail, Phone, Camera, CheckCircle, User, CreditCard,
  MapPin, Heart, Loader2, AlertCircle, Home, RotateCcw, Copy, ExternalLink, Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { uploadFile, createObject } from '../lib/parse';

const WAVE_PHONE = '+221 77 650 73 36';
const WAVE_PHONE_RAW = '221776507336';

interface FormInputs {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  profession: string;
  address: string;
  photo: FileList;
  acceptTerms: boolean;
}

const MemberCardPage: React.FC = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormInputs>();

  React.useEffect(() => {
    document.title = 'Commander ma carte membre | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  // Photo preview
  const photoFile = watch('photo');
  React.useEffect(() => {
    if (photoFile && photoFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(photoFile[0]);
    } else {
      setPhotoPreview(null);
    }
  }, [photoFile]);

  const onSubmit = async (data: FormInputs) => {
    setSubmitError('');

    try {
      let parsedPhoto = undefined;
      if (data.photo?.[0]) {
        const file = data.photo[0];
        parsedPhoto = await uploadFile(file.name, file);
      }

      await createObject('MemberRequests', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        profession: data.profession,
        village: data.address || '',
        photo: parsedPhoto,
        status: 'En attente',
      });

      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting member card request:', error);
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      setSubmitError(`Erreur lors de l'envoi : ${message}. Veuillez réessayer.`);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setSubmitSuccess(false);
    setSubmitError('');
    setPhotoPreview(null);
    reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [copied, setCopied] = useState(false);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(WAVE_PHONE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = WAVE_PHONE;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header vert */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Demande envoyée avec succès
            </h2>
            <p className="text-white/80 text-sm">
              Votre demande de carte membre a été enregistrée.
            </p>
          </div>

          <div className="p-8 space-y-6">

            {/* Instructions de paiement */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Smartphone className="text-amber-600 shrink-0 mt-0.5" size={22} />
                <div>
                  <p className="font-bold text-gray-900 mb-1">Finalisez votre inscription</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Pour valider votre carte membre, envoyez <strong className="text-amber-700">2 500 FCFA via Wave</strong> à :
                  </p>
                </div>
              </div>

              {/* Carte contact Wave */}
              <div className="bg-white border border-amber-100 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Mr DONGO</p>
                <p className="text-2xl font-extrabold text-gray-900 font-mono tracking-tight mb-4">
                  {WAVE_PHONE}
                </p>

                {/* Boutons copier + Wave */}
                <div className="flex gap-3">
                  <button
                    onClick={copyPhone}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all touch-manipulation ${
                      copied
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 active:bg-gray-300'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={16} />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copier le n°
                      </>
                    )}
                  </button>

                  <a
                    href={`https://pay.wave.com/m/${WAVE_PHONE_RAW}/2500`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1DC3E3] text-white rounded-xl font-semibold text-sm hover:bg-[#19b0ce] active:bg-[#1599b3] transition-colors touch-manipulation"
                  >
                    <ExternalLink size={16} />
                    Ouvrir Wave
                  </a>
                </div>
              </div>
            </div>

            {/* Info validation */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <p className="text-teal-800 text-sm text-center leading-relaxed">
                Votre carte sera validée après confirmation du paiement. Vous recevrez un email de notification.
              </p>
            </div>

            {/* Boutons navigation */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
              >
                <RotateCcw size={18} />
                Nouvelle demande
              </button>
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation"
              >
                <Home size={18} />
                Accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="absolute inset-0 z-0">
          <img
            src="/medicalteam.webp"
            alt="Équipe médicale ASFO"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/60" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <CreditCard className="mr-2 text-white" size={16} />
              <span>Rejoignez notre communauté</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Commander ma carte membre
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Devenez membre officiel de l'ASFO et participez activement à notre mission humanitaire
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Criteria Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12 border border-gray-100">
              <div className="prose prose-lg max-w-none">

                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  Critères d'adhésion à l'Action Sanitaire pour le Fouta
                </h3>

                <p className="text-lg text-gray-700 mb-6">
                  Cher nouveau adhérent,
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Nous sommes ravis de votre intérêt pour rejoindre l'Action Sanitaire pour le Fouta (ASFO) et de contribuer à notre mission d'amélioration de la santé de la population du Sénégal et du Fouta en particulier.
                </p>
                <p className="text-lg text-gray-700 mb-8">
                  Pour être considéré comme membre de notre association, il faut remplir les critères suivants :
                </p>

                <div className="space-y-6">
                  <div className="flex items-start bg-teal-50 p-6 rounded-xl border border-teal-100">
                    <span className="text-2xl mr-4 shrink-0">1.</span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Adhésion aux valeurs et à la mission</h4>
                      <p className="text-gray-700">Partager notre engagement envers l'amélioration de la santé et du bien-être des populations du Fouta, et adhérer à nos valeurs de solidarité, d'équité et de respect des droits humains.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <span className="text-2xl mr-4 shrink-0">2.</span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Engagement à contribuer activement</h4>
                      <p className="text-gray-700">Participer aux initiatives (sensibilisation, consultations gratuites, collectes de fonds, missions, etc.) selon ses compétences et disponibilités.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-purple-50 p-6 rounded-xl border border-purple-100">
                    <span className="text-2xl mr-4 shrink-0">3.</span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Respect des règles et des statuts</h4>
                      <p className="text-gray-700">Suivre le règlement, respecter la confidentialité et les décisions collectives, ainsi que les autres membres.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-green-50 p-6 rounded-xl border border-green-100">
                    <span className="text-2xl mr-4 shrink-0">4.</span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Participation aux réunions et activités</h4>
                      <p className="text-gray-700">Prendre part aux rencontres régulières et événements organisés par l'association.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                    <span className="text-2xl mr-4 shrink-0">5.</span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Disposer d'une carte de membre</h4>
                      <p className="text-gray-700">Carte obligatoire, coût fixé à <strong className="text-red-600">2 500 F CFA</strong>.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-orange-50 p-6 rounded-xl border border-orange-100">
                    <span className="text-2xl mr-4 shrink-0">6.</span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Cotisation annuelle</h4>
                      <p className="text-gray-700">Montant fixé par le bureau, obligatoire pour soutenir les actions.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 mt-8">
                  <p className="text-lg text-gray-700 mb-4">
                    En remplissant ces critères, vous deviendrez un membre actif et engagerez un impact concret.
                  </p>
                  <p className="text-xl font-bold text-teal-700 mb-4">
                    Rejoignez-nous dès aujourd'hui et faisons ensemble une réelle différence dans le Fouta.
                  </p>
                  <div className="text-right">
                    <p className="text-gray-600 italic">Avec enthousiasme,</p>
                    <p className="font-bold text-gray-800">Mamadou THIOYE</p>
                    <div className="w-20 h-0.5 bg-teal-500 ml-auto mt-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="text-teal-600" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Formulaire de demande de carte membre
                  </h2>
                  <p className="text-gray-600">
                    Remplissez tous les champs obligatoires pour obtenir votre carte membre ASFO
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit, () => {
                    setSubmitError('Veuillez corriger les erreurs dans le formulaire.');
                    const firstError = document.querySelector('[class*="border-red"]');
                    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  })}
                  className="space-y-6"
                >

                  {/* Nom et Prénom */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-1.5 text-teal-500" />
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${
                          errors.lastName ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Votre nom de famille"
                        {...register('lastName', { required: 'Le nom est requis' })}
                      />
                      {errors.lastName && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-1.5 text-teal-500" />
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${
                          errors.firstName ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Votre prénom"
                        {...register('firstName', { required: 'Le prénom est requis' })}
                      />
                      {errors.firstName && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.firstName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email et Téléphone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-1.5 text-teal-500" />
                        Adresse e-mail <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="votre.email@exemple.com"
                        {...register('email', {
                          required: "L'email est requis",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Adresse email invalide',
                          },
                        })}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-1.5 text-teal-500" />
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${
                          errors.phone ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="+221 77 123 45 67"
                        {...register('phone', {
                          required: 'Le téléphone est requis',
                          pattern: {
                            value: /^[0-9+\s-]{8,}$/,
                            message: 'Numéro de téléphone invalide',
                          },
                        })}
                      />
                      {errors.phone && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Profession */}
                  <div>
                    <label htmlFor="profession" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Heart className="inline w-4 h-4 mr-1.5 text-teal-500" />
                      Profession <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="profession"
                      className={`w-full px-4 py-3 rounded-lg border bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none ${
                        errors.profession ? 'border-red-300' : 'border-gray-200'
                      }`}
                      {...register('profession', { required: 'La profession est requise' })}
                    >
                      <option value="">Sélectionnez votre profession</option>
                      <option value="medecin">Médecin</option>
                      <option value="infirmier">Infirmier(ère)</option>
                      <option value="pharmacien">Pharmacien(ne)</option>
                      <option value="sage-femme">Sage-femme</option>
                      <option value="dentiste">Chirurgien-dentiste</option>
                      <option value="kinesitherapeute">Kinésithérapeute</option>
                      <option value="laborantin">Laborantin(e)</option>
                      <option value="etudiant-sante">Étudiant(e) en santé</option>
                      <option value="benevole">Membre bénévole</option>
                      <option value="autre">Autre</option>
                    </select>
                    {errors.profession && (
                      <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.profession.message}
                      </p>
                    )}
                  </div>

                  {/* Adresse */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1.5 text-teal-500" />
                      Adresse / Ville
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                      placeholder="Votre adresse complète"
                      {...register('address')}
                    />
                  </div>

                  {/* Photo d'identité */}
                  <div>
                    <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Camera className="inline w-4 h-4 mr-1.5 text-teal-500" />
                      Photo d'identité <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <div
                          className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
                            errors.photo
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50'
                          }`}
                        >
                          <input
                            type="file"
                            id="photo"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/jpeg,image/jpg,image/png"
                            {...register('photo', {
                              required: 'La photo est requise',
                              validate: {
                                fileFormat: (files) => {
                                  if (!files?.[0]) return true;
                                  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                                  return (
                                    allowedTypes.includes(files[0].type) ||
                                    'Seuls les fichiers JPG, JPEG et PNG sont acceptés'
                                  );
                                },
                                fileSize: (files) => {
                                  if (!files?.[0]) return true;
                                  return files[0].size <= 2_000_000 || 'Le fichier ne doit pas dépasser 2 Mo';
                                },
                              },
                            })}
                          />
                          <div className="text-center">
                            <Upload className="mx-auto h-10 w-10 text-gray-400" />
                            <p className="mt-2 text-sm font-medium text-gray-600">
                              Cliquez ou glissez votre photo ici
                            </p>
                            <p className="mt-1 text-xs text-gray-500">JPG, JPEG, PNG — 2 Mo maximum</p>
                          </div>
                        </div>
                        {errors.photo && (
                          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.photo.message}
                          </p>
                        )}
                      </div>

                      {/* Photo Preview */}
                      {photoPreview && (
                        <div className="w-32 h-32 flex-shrink-0">
                          <div className="w-full h-full rounded-xl overflow-hidden border-2 border-teal-200 shadow-md">
                            <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs text-gray-500 text-center mt-2">Aperçu</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acceptation des conditions */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start">
                      <input
                        id="acceptTerms"
                        type="checkbox"
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
                        {...register('acceptTerms', {
                          required: "Vous devez accepter les critères d'adhésion",
                        })}
                      />
                      <label htmlFor="acceptTerms" className="ml-3 block text-sm text-gray-700">
                        <span className="font-semibold">J'ai lu et j'accepte les critères d'adhésion</span>
                        <span className="text-red-500"> *</span>
                      </label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.acceptTerms.message}
                      </p>
                    )}
                  </div>

                  {/* Coût de la carte */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <CreditCard className="text-yellow-600 mr-3 shrink-0" size={20} />
                      <div>
                        <p className="font-semibold text-yellow-800">Coût de la carte membre</p>
                        <p className="text-yellow-700 text-sm">
                          2 500 F CFA (paiement à effectuer après validation de votre dossier)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Error message */}
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-red-800 text-sm font-semibold mb-0.5">Échec de l'envoi</p>
                        <p className="text-red-700 text-sm">{submitError}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4 pb-16 sm:pb-0">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 bg-[#0F766E] text-white rounded-xl font-semibold hover:bg-[#0d6e66] active:bg-[#0b5f58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-md transition-colors touch-manipulation"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin mr-3" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} className="mr-3" />
                          Envoyer ma demande
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberCardPage;
