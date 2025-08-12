import React, { useEffect, useState } from 'react';
import { X, Upload, Loader2, FileText, MapPin, Users, Phone, Mail, CheckCircle, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface CandidatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormInputs {
  villageName: string;
  commune: string;
  region: string;
  amicaleName: string;
  contactName: string;
  email: string;
  phone: string;
  description: string;
  file: FileList;
  feesConfirmation: boolean;
}

const senegalRegions = [
  "Région de Dakar",
  "Région de Thiès",
  "Région de Saint-Louis",
  "Région de Diourbel",
  "Région de Louga",
  "Région de Tambacounda",
  "Région de Kaolack",
  "Région de Kolda",
  "Région de Ziguinchor",
  "Région de Fatick",
  "Région de Kaffrine",
  "Région de Kédougou",
  "Région de Matam",
  "Région de Sédhiou",
  "Mauritanie"
];

const CandidatureModal: React.FC<CandidatureModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<FormInputs>();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [candidatureNumber, setCandidatureNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const generateCandidatureNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ASFO-CAND-${random}`;
  };

  const onSubmit = async (data: FormInputs) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const number = generateCandidatureNumber();
      setCandidatureNumber(number);
      setSubmitSuccess(true);
      
      console.log('Candidature submitted:', { ...data, candidatureNumber: number });
    } catch (error) {
      console.error('Error submitting candidature:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleClose = () => {
    if (submitSuccess) {
      setSubmitSuccess(false);
      setCandidatureNumber('');
      reset();
    }
    onClose();
  };

  const downloadRecapitulatif = () => {
    // Simulate PDF download
    alert(`Téléchargement du récapitulatif pour la candidature ${candidatureNumber}`);
  };

  if (!isOpen) return null;

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>
        
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div 
            className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Candidature soumise avec succès !
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Votre numéro de candidature :</p>
                <p className="text-xl font-bold text-teal-600">{candidatureNumber}</p>
              </div>
              
              <p className="text-gray-600 mb-6">
                Votre candidature a été enregistrée. Vous recevrez une confirmation par email dans les plus brefs délais.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={downloadRecapitulatif}
                  className="w-full flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  <Download size={18} className="mr-2" />
                  Télécharger le récapitulatif
                </button>
                
                <button
                  onClick={handleClose}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl transform transition-all max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* Header avec accroche */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-full mb-4">
                  <FileText className="mr-2" size={20} />
                  <span className="font-semibold">Caravane de Santé ASFO</span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  🚑 Dépôt de candidature pour la Caravane de Santé de l'ASFO
                </h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                  <p className="text-gray-700 mb-4">
                    Vous êtes membre de l'Amicale des étudiants de votre village et souhaitez accueillir la prochaine campagne médicale de l'ASFO dans votre localité ?
                  </p>
                  <p className="text-gray-700 mb-4">
                    Merci de remplir ce formulaire et de fournir les documents demandés.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 font-semibold">
                      ⚠️ Toutes les candidatures se font exclusivement via ce portail.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">📋 Dossier à fournir :</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✔️</span>
                        Lettre adressée au Président de l'ASFO
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✔️</span>
                        Situation géographique du village
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✔️</span>
                        Situation sanitaire du village
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✔️</span>
                        <span>Paiement des frais de dossier : <strong className="text-red-600">20 000 F</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Informations du village */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <MapPin className="mr-2 text-teal-600" size={24} />
                  Informations du village
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="villageName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du village <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="villageName"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.villageName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      {...register("villageName", { required: "Ce champ est requis" })}
                    />
                    {errors.villageName && (
                      <p className="mt-1 text-sm text-red-600">{errors.villageName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="commune" className="block text-sm font-medium text-gray-700 mb-1">
                      Commune ou Département <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="commune"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.commune ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      {...register("commune", { required: "Ce champ est requis" })}
                    />
                    {errors.commune && (
                      <p className="mt-1 text-sm text-red-600">{errors.commune.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      Région <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="region"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.region ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      {...register("region", { required: "Ce champ est requis" })}
                    >
                      <option value="">Sélectionnez une région</option>
                      {senegalRegions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {errors.region && (
                      <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations de l'Amicale */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Users className="mr-2 text-teal-600" size={24} />
                  Informations de l'Amicale
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="amicaleName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de l'Amicale étudiante déposant la candidature <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="amicaleName"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.amicaleName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      placeholder="Ex: Amicale des Étudiants de [Nom du village]"
                      {...register("amicaleName", { required: "Ce champ est requis" })}
                    />
                    {errors.amicaleName && (
                      <p className="mt-1 text-sm text-red-600">{errors.amicaleName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du contact principal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.contactName ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        {...register("contactName", { required: "Ce champ est requis" })}
                      />
                      {errors.contactName && (
                        <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        placeholder="+221 XX XXX XX XX"
                        {...register("phone", {
                          required: "Ce champ est requis",
                          pattern: {
                            value: /^[0-9+\s-]{8,}$/,
                            message: "Numéro de téléphone invalide"
                          }
                        })}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      {...register("email", {
                        required: "Ce champ est requis",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Adresse email invalide"
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description synthétique du village <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Situation géographique, sanitaire, contexte spécifique
                </p>
                <textarea
                  id="description"
                  rows={5}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  placeholder="Décrivez la situation géographique, l'état des infrastructures sanitaires, les besoins spécifiques de votre village..."
                  {...register("description", {
                    required: "Ce champ est requis",
                    minLength: {
                      value: 100,
                      message: "La description doit contenir au moins 100 caractères"
                    }
                  })}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Upload de fichier */}
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléversement du dossier complet <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  PDF uniquement, 5Mo maximum
                </p>
                <div className={`relative border-2 border-dashed rounded-lg p-6 ${
                  errors.file ? 'border-red-500' : 'border-gray-300'
                } hover:border-teal-500 transition-colors`}>
                  <input
                    type="file"
                    id="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf"
                    {...register("file", {
                      required: "Ce champ est requis",
                      validate: {
                        fileFormat: (files) => {
                          if (!files?.[0]) return true;
                          return files[0].type === 'application/pdf' || "Seuls les fichiers PDF sont acceptés";
                        },
                        fileSize: (files) => {
                          if (!files?.[0]) return true;
                          return files[0].size <= 5000000 || "Le fichier ne doit pas dépasser 5Mo";
                        }
                      }
                    })}
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Cliquez ou glissez votre dossier complet ici
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Doit inclure : lettre au Président, situation géographique et sanitaire
                    </p>
                  </div>
                </div>
                {errors.file && (
                  <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>
                )}
              </div>

              {/* Confirmation des frais */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <input
                    id="feesConfirmation"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
                    {...register("feesConfirmation", {
                      required: "Vous devez confirmer le paiement des frais de dossier"
                    })}
                  />
                  <label htmlFor="feesConfirmation" className="ml-3 block text-sm text-gray-700">
                    <span className="font-semibold">Je certifie avoir réglé les frais de dossier de 20 000 F.</span>
                    <span className="text-red-500"> *</span>
                  </label>
                </div>
                {errors.feesConfirmation && (
                  <p className="mt-2 text-sm text-red-600">{errors.feesConfirmation.message}</p>
                )}
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <FileText size={20} className="mr-2" />
                      Soumettre la candidature
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatureModal;