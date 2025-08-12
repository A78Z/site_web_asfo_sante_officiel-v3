import React, { useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface PartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormInputs {
  organizationName: string;
  type: string;
  contactName: string;
  email: string;
  phone: string;
  description: string;
  file: FileList;
}

const PartnershipModal: React.FC<PartnershipModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormInputs>();

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

  const onSubmit = async (data: FormInputs) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', data);
      reset();
      onClose();
      alert('Votre demande de partenariat a été soumise avec succès !');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all"
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Devenir partenaire
            </h2>
            <p className="text-gray-600 mb-6">
              Remplissez ce formulaire pour nous proposer un partenariat. Notre équipe vous contactera dans les plus brefs délais.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'organisation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="organizationName"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.organizationName ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  {...register("organizationName", { required: "Ce champ est requis" })}
                />
                {errors.organizationName && (
                  <p className="mt-1 text-sm text-red-600">{errors.organizationName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'organisation <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  {...register("type", { required: "Ce champ est requis" })}
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="amicale">Amicale étudiante</option>
                  <option value="ong">ONG</option>
                  <option value="public">Structure publique</option>
                  <option value="private">Structure privée</option>
                  <option value="other">Autre</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du contact <span className="text-red-500">*</span>
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

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description du partenariat proposé <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500`}
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

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                  Document de présentation (PDF) <span className="text-red-500">*</span>
                </label>
                <div className={`relative border-2 border-dashed rounded-lg p-4 ${
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
                      Cliquez ou glissez votre fichier ici
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF uniquement, 5Mo maximum
                    </p>
                  </div>
                </div>
                {errors.file && (
                  <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Soumettre la demande'
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

export default PartnershipModal;