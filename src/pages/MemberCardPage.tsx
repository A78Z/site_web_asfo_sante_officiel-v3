import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Mail, Phone, Camera, CheckCircle, User, CreditCard, MapPin, FileText, Heart } from 'lucide-react';

interface FormInputs {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  profession: string;
  address: string;
  photo: FileList;
  idNumber: string;
  message?: string;
  acceptTerms: boolean;
}

const MemberCardPage: React.FC = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<FormInputs>();

  // Set page title
  React.useEffect(() => {
    document.title = 'Commander ma carte membre | ASFO - Action Sanitaire pour le Fouta';
  }, []);

  // Watch for photo changes to show preview
  const photoFile = watch('photo');
  
  React.useEffect(() => {
    if (photoFile && photoFile[0]) {
      const file = photoFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  }, [photoFile]);

  const onSubmit = async (data: FormInputs) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Member card request submitted:', data);
      setSubmitSuccess(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        reset();
        setPhotoPreview(null);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (submitSuccess) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Demande envoyée avec succès !
          </h2>
          <p className="text-gray-600 mb-6">
            ✅ Votre demande de carte membre a bien été envoyée. Nous vous contacterons sous peu.
          </p>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <p className="text-teal-800 text-sm">
              Vous recevrez un email de confirmation dans les prochaines minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="/medicalteam.webp" 
            alt="Équipe médicale ASFO" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/60"></div>
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
                  📜 Critères d'adhésion à l'Action Sanitaire pour le Fouta
                </h3>

                <p className="text-lg text-gray-700 mb-6">
                  Cher nouveau adhérent,
                </p>

                <p className="text-lg text-gray-700 mb-6">
                  Nous sommes ravis de votre intérêt pour rejoindre l'Action Sanitaire pour le Fouta (ASFO) et de contribuer à notre mission d'amélioration de la santé de la population du Sénégal et du Fouta en particulier.
                </p>

                <p className="text-lg text-gray-700 mb-8">
                  Pour être considéré comme membre de notre association, il faut remplir les critères suivants : 👇
                </p>

                <div className="space-y-6">
                  <div className="flex items-start bg-teal-50 p-6 rounded-xl border border-teal-100">
                    <span className="text-2xl mr-4">👉</span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Adhésion aux valeurs et à la mission de l'association</h4>
                      <p className="text-gray-700">Partager notre engagement envers l'amélioration de la santé et du bien-être des populations du Fouta, et adhérer à nos valeurs de solidarité, d'équité et de respect des droits humains.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <span className="text-2xl mr-4">👉</span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Engagement à contribuer activement</h4>
                      <p className="text-gray-700">Participer aux initiatives (sensibilisation, consultations gratuites, collectes de fonds, missions, etc.) selon ses compétences et disponibilités.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-purple-50 p-6 rounded-xl border border-purple-100">
                    <span className="text-2xl mr-4">👉</span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Respect des règles et des statuts</h4>
                      <p className="text-gray-700">Suivre le règlement, respecter la confidentialité et les décisions collectives, ainsi que les autres membres.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-green-50 p-6 rounded-xl border border-green-100">
                    <span className="text-2xl mr-4">👉</span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Participation aux réunions et activités</h4>
                      <p className="text-gray-700">Prendre part aux rencontres régulières et événements organisés par l'association.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                    <span className="text-2xl mr-4">👉</span>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Disposer d'une carte de membre</h4>
                      <p className="text-gray-700">Carte obligatoire, coût fixé à <strong className="text-red-600">2500 F CFA</strong>.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-orange-50 p-6 rounded-xl border border-orange-100">
                    <span className="text-2xl mr-4">👉</span>
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
                    <div className="w-20 h-0.5 bg-teal-500 ml-auto mt-2"></div>
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Nom et Prénom */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-2 text-teal-500" />
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300`}
                        placeholder="Votre nom de famille"
                        {...register("lastName", { required: "Le nom est requis" })}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-2 text-teal-500" />
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300`}
                        placeholder="Votre prénom"
                        {...register("firstName", { required: "Le prénom est requis" })}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email et Téléphone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-2 text-teal-500" />
                        Adresse e-mail <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300`}
                        placeholder="votre.email@exemple.com"
                        {...register("email", {
                          required: "L'email est requis",
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
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-2 text-teal-500" />
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300`}
                        placeholder="+221 XX XXX XX XX"
                        {...register("phone", {
                          required: "Le téléphone est requis",
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

                  {/* Profession */}
                  <div>
                    <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                      <Heart className="inline w-4 h-4 mr-2 text-teal-500" />
                      Profession <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="profession"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.profession ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300`}
                      {...register("profession", { required: "La profession est requise" })}
                    >
                      <option value="">Sélectionnez votre profession</option>
                      <option value="medecin">Médecin</option>
                      <option value="infirmier">Infirmier</option>
                      <option value="pharmacien">Pharmacien</option>
                      <option value="benevole">Membre bénévole</option>
                      <option value="autre">Autre</option>
                    </select>
                    {errors.profession && (
                      <p className="mt-1 text-sm text-red-600">{errors.profession.message}</p>
                    )}
                  </div>

                  {/* Adresse */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-2 text-teal-500" />
                      Adresse complète
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                      placeholder="Votre adresse complète"
                      {...register("address")}
                    ></textarea>
                  </div>

                  {/* Photo d'identité */}
                  <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                      <Camera className="inline w-4 h-4 mr-2 text-teal-500" />
                      Photo d'identité <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <div className={`relative border-2 border-dashed rounded-lg p-6 ${
                          errors.photo ? 'border-red-500' : 'border-gray-300'
                        } hover:border-teal-500 transition-colors`}>
                          <input
                            type="file"
                            id="photo"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            {...register("photo", {
                              required: "La photo est requise",
                              validate: {
                                fileFormat: (files) => {
                                  if (!files?.[0]) return true;
                                  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                                  return allowedTypes.includes(files[0].type) || "Seuls les fichiers JPG, JPEG et PNG sont acceptés";
                                },
                                fileSize: (files) => {
                                  if (!files?.[0]) return true;
                                  return files[0].size <= 2000000 || "Le fichier ne doit pas dépasser 2Mo";
                                }
                              }
                            })}
                          />
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                              Cliquez ou glissez votre photo ici
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              JPG, JPEG, PNG - 2Mo maximum
                            </p>
                          </div>
                        </div>
                        {errors.photo && (
                          <p className="mt-1 text-sm text-red-600">{errors.photo.message}</p>
                        )}
                      </div>

                      {/* Photo Preview */}
                      {photoPreview && (
                        <div className="w-32 h-32 flex-shrink-0">
                          <div className="w-full h-full rounded-lg overflow-hidden border-2 border-teal-200 shadow-md">
                            <img
                              src={photoPreview}
                              alt="Aperçu"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs text-gray-500 text-center mt-2">Aperçu</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Acceptation des conditions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <input
                        id="acceptTerms"
                        type="checkbox"
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
                        {...register("acceptTerms", {
                          required: "Vous devez accepter les critères d'adhésion"
                        })}
                      />
                      <label htmlFor="acceptTerms" className="ml-3 block text-sm text-gray-700">
                        <span className="font-semibold">J'ai lu et j'accepte les critères d'adhésion</span>
                        <span className="text-red-500"> *</span>
                      </label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="mt-2 text-sm text-red-600">{errors.acceptTerms.message}</p>
                    )}
                  </div>

                  {/* Coût de la carte */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CreditCard className="text-yellow-600 mr-3" size={20} />
                      <div>
                        <p className="font-semibold text-yellow-800">Coût de la carte membre</p>
                        <p className="text-yellow-700 text-sm">2500 F CFA (paiement à effectuer après validation de votre dossier)</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
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