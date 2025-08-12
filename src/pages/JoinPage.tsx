import React, { useState } from 'react';
import SectionTitle from '../components/common/SectionTitle';
import Button from '../components/common/Button';
import { Users, Calendar, Map, Activity, Briefcase, Verified, Heart, User } from 'lucide-react';

const JoinPage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Nous rejoindre | ASFO | Action Sanitaire pour le Fouta';
  }, []);

  const volunteerProfiles = [
    {
      icon: <Activity size={24} />,
      title: "Professionnel de santé",
      description: "Médecins, infirmiers, dentistes, ophtalmologues, gynécologues, pharmaciens...",
      skills: ["Expertise médicale", "Expérience clinique", "Adaptabilité"]
    },
    {
      icon: <Briefcase size={24} />,
      title: "Étudiant en médecine",
      description: "Étudiants en médecine, pharmacie, dentisterie, sciences infirmières...",
      skills: ["Motivation", "Travail d'équipe", "Volonté d'apprendre"]
    },
    {
      icon: <Verified size={24} />,
      title: "Logistique & Administration",
      description: "Coordination, gestion de projet, logistique, communication...",
      skills: ["Organisation", "Communication", "Gestion"]
    },
    {
      icon: <Heart size={24} />,
      title: "Bénévole non médical",
      description: "Traduction, sensibilisation, éducation, soutien logistique...",
      skills: ["Engagement", "Polyvalence", "Initiative"]
    }
  ];

  // Composant pour le champ "Autre profil"
  const OtherProfileField: React.FC = () => {
    const [showOtherField, setShowOtherField] = useState(false);
    const [otherProfileValue, setOtherProfileValue] = useState('');

    const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value === 'other') {
        setShowOtherField(true);
      } else {
        setShowOtherField(false);
        setOtherProfileValue('');
      }
    };

    React.useEffect(() => {
      const profileSelect = document.getElementById('profile') as HTMLSelectElement;
      if (profileSelect) {
        profileSelect.addEventListener('change', handleProfileChange);
        return () => profileSelect.removeEventListener('change', handleProfileChange);
      }
    }, []);

    return (
      <>
        {showOtherField && (
          <div className="mb-6 animate-fade-in-up">
            <label htmlFor="other-profile" className="block text-sm font-medium text-gray-700 mb-1">
              Précisez votre profil <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="other-profile"
              name="other-profile"
              value={otherProfileValue}
              onChange={(e) => setOtherProfileValue(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
              placeholder="Décrivez votre profil (ex: Étudiant en pharmacie, Logisticien, etc.)"
              required
            />
          </div>
        )}
      </>
    );
  };

  // Composant pour le champ "Autre disponibilité"
  const OtherAvailabilityField: React.FC = () => {
    const [showOtherField, setShowOtherField] = useState(false);
    const [otherAvailabilityValue, setOtherAvailabilityValue] = useState('');

    const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value === 'other') {
        setShowOtherField(true);
      } else {
        setShowOtherField(false);
        setOtherAvailabilityValue('');
      }
    };

    React.useEffect(() => {
      const availabilitySelect = document.getElementById('availability') as HTMLSelectElement;
      if (availabilitySelect) {
        availabilitySelect.addEventListener('change', handleAvailabilityChange);
        return () => availabilitySelect.removeEventListener('change', handleAvailabilityChange);
      }
    }, []);

    return (
      <>
        {showOtherField && (
          <div className="mb-6 animate-fade-in-up">
            <label htmlFor="other-availability" className="block text-sm font-medium text-gray-700 mb-1">
              Précisez votre disponibilité <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="other-availability"
              name="other-availability"
              value={otherAvailabilityValue}
              onChange={(e) => setOtherAvailabilityValue(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
              placeholder="Précisez votre disponibilité (ex: Week-ends uniquement, Vacances scolaires, etc.)"
              required
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-teal-600">
        <div className="absolute inset-0 z-0">
          <img 
            src="/rejoindre-equipe.webp" 
            alt="ASFO volunteers team" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-700/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Users className="mr-2 text-white" size={16} />
              <span>Devenez acteur du changement</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Rejoignez notre équipe de bénévoles
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              ASFO mobilise régulièrement des bénévoles passionnés pour ses missions humanitaires. Que vous soyez professionnel de santé ou simplement motivé à aider, vous avez votre place parmi nous.
            </p>
            
            <Button 
              variant="accent" 
              size="large" 
              href="#volunteer-form"
              className="bg-red-500 hover:bg-red-600"
            >
              Je veux devenir bénévole
            </Button>
          </div>
        </div>
      </div>

      {/* Why Join Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Pourquoi Nous Rejoindre" 
            subtitle="Découvrez les avantages de devenir bénévole chez ASFO" 
            center
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6 text-teal-600">
                <Heart size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Faire une différence</h3>
              <p className="text-gray-600">
                Participez à des missions qui ont un impact direct sur la santé et le bien-être des populations défavorisées au Sénégal.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6 text-teal-600">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Développer vos compétences</h3>
              <p className="text-gray-600">
                Mettez en pratique vos connaissances dans un contexte différent et acquérez une expérience unique en santé internationale.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6 text-teal-600">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Rejoindre une communauté</h3>
              <p className="text-gray-600">
                Intégrez un réseau de professionnels et d'étudiants passionnés qui partagent les mêmes valeurs d'entraide et de solidarité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Comment ça marche" 
            subtitle="Le processus pour devenir bénévole chez ASFO" 
            center
          />
          
          <div className="max-w-4xl mx-auto mt-12">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-teal-200 hidden md:block"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {[
                  {
                    icon: <Users size={24} />,
                    title: "Candidature",
                    description: "Remplissez le formulaire de candidature en ligne pour nous faire part de votre intérêt et de vos compétences."
                  },
                  {
                    icon: <Calendar size={24} />,
                    title: "Entretien",
                    description: "Un membre de notre équipe vous contactera pour un entretien afin de mieux comprendre vos motivations et vos disponibilités."
                  },
                  {
                    icon: <Activity size={24} />,
                    title: "Formation",
                    description: "Participez à une session d'orientation pour vous familiariser avec notre mission, nos valeurs et nos méthodes de travail."
                  },
                  {
                    icon: <Map size={24} />,
                    title: "Préparation de mission",
                    description: "Une fois accepté, vous serez informé des prochaines missions disponibles et vous pourrez choisir celle qui vous convient."
                  },
                  {
                    icon: <Heart size={24} />,
                    title: "Participation à la mission",
                    description: "Rejoignez l'équipe sur le terrain pour contribuer à notre mission humanitaire au Sénégal."
                  }
                ].map((step, index) => (
                  <div key={index} className="flex items-start relative">
                    <div className="md:absolute md:left-0 flex-shrink-0 z-10">
                      <div className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-md border-4 border-white">
                        {step.icon}
                      </div>
                    </div>
                    <div className="ml-6 md:ml-24 bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex-grow">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Profiles */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Profils recherchés" 
            subtitle="ASFO a besoin de bénévoles aux compétences variées" 
            center
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {volunteerProfiles.map((profile, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-6 text-teal-600">
                  {profile.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{profile.title}</h3>
                <p className="text-gray-600 mb-4">{profile.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Compétences recherchées :</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex} 
                        className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="volunteer-form" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Devenir bénévole" 
            subtitle="Remplissez le formulaire ci-dessous pour nous rejoindre" 
            center
          />
          
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-12">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                    placeholder="Nom"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                    placeholder="Téléphone"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="profile" className="block text-sm font-medium text-gray-700 mb-1">
                  Profil <span className="text-red-500">*</span>
                </label>
                <select
                  id="profile"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionnez votre profil</option>
                  <option value="medical">Professionnel de santé</option>
                  <option value="student">Étudiant en médecine</option>
                  <option value="logistics">Logistique & Administration</option>
                  <option value="non-medical">Bénévole non médical</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              
              {/* Champ conditionnel pour "Autre" avec React state */}
              <OtherProfileField />
              
              <div className="mb-6">
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                  Spécialité / Domaine de compétence
                </label>
                <input
                  type="text"
                  id="specialty"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Spécialité"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Expérience humanitaire précédente
                </label>
                <textarea
                  id="experience"
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                   placeholder="Expérience humanitaire"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">
                  Motivation <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="motivation"
                  rows={5}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                  placeholder="Pourquoi souhaitez-vous rejoindre ASFO ?"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                  Disponibilité <span className="text-red-500">*</span>
                </label>
                <select
                  id="availability"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionnez votre disponibilité</option>
                  <option value="week">1 semaine</option>
                  <option value="two-weeks">2 semaines</option>
                  <option value="month">1 mois</option>
                  <option value="more">Plus d'un mois</option>
                  <option value="remote">Travail à distance</option>
                  <option value="grand-campagnes">Grandes Campagnes</option>
                  <option value="strat-campagnes">Strat-Campagnes</option>
                  <option value="pedagogique">Assistance aux activités pédagogiques</option>
                  <option value="sensibilisation">Pour la sensibilisation</option>
                  <option value="other">Autre</option>
                  </select>

              </div>
              
              {/* Champ conditionnel pour "Autre disponibilité" avec React state */}
              <OtherAvailabilityField />
              
              <div className="mb-6">
                <label htmlFor="workplace" className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu d'exercice
                </label>
                <input
                  type="text"
                  id="workplace"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Votre lieu de travail ou d'études (ex: Hôpital Principal de Dakar, UCAD, etc.)"
                />
              </div>
              
              <div className="mb-8">
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    {"J'accepte les "}
                    <a href="/privacy" className="text-teal-600 hover:text-teal-700">conditions d'utilisation</a>
                    {" et la "}
                    <a href="/terms" className="text-teal-600 hover:text-teal-700">politique de confidentialité</a>
                    {" d'ASFO."}
                  </label>
                </div>
              </div>
              
              <Button 
                type="submit"
                variant="primary" 
                size="large" 
                fullWidth
                icon={<Heart size={18} />}
              >
                Envoyer ma candidature
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Témoignages de bénévoles" 
            subtitle="Découvrez l'expérience de ceux qui ont rejoint nos missions" 
            center
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                name: "Dr. Fatou Ndiaye",
                role: "Médecin généraliste",
                quote: "Participer aux missions d'ASFO a été l'expérience la plus enrichissante de mon parcours médical. J'ai pu mettre en pratique mes connaissances tout en aidant des personnes qui en avaient vraiment besoin.",
                image: "/dr-fatou-ndiaye.webp"
              },
              {
                name: "Moussa Diop",
                role: "Étudiant en médecine",
                quote: "En tant qu'étudiant, ASFO m'a offert une opportunité unique d'apprendre sur le terrain et de développer mes compétences cliniques. C'est une expérience qui m'a marqué à vie et qui a confirmé ma vocation.",
                image: "/moussa-diop.webp"
              },
              {
                name: "Aminata Sow",
                role: "Infirmière",
                quote: "L'ambiance au sein des équipes d'ASFO est exceptionnelle. Malgré les conditions parfois difficiles, l'entraide et la bonne humeur sont toujours présentes. Je me suis fait des amis pour la vie.",
                image: "/Aminata-Sow.webp"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <div className="p-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="text-teal-600" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800 text-center">{testimonial.name}</h3>
                  <p className="text-teal-600 text-sm mb-4 text-center">{testimonial.role}</p>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinPage;