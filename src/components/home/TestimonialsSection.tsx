import React, { useState, useEffect } from 'react';
import SectionTitle from '../common/SectionTitle';
import { ChevronLeft, ChevronRight, Quote, Sparkles, Heart, User } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
}

const testimonials: TestimonialProps[] = [
  {
    content: "Masha Allah, que la bénédiction d'Allah vous accompagne et vous élève. Vos actions sont d'une portée admirable et témoignent d'un engagement profondément inspirant.",
    author: "Serigne Modou Babou",
    role: "UCAD FMPOS, Région de Dakar",
  },
  {
    content: "Mâcha Allah, toutes nos félicitations à l'ensemble de l'équipe ! Un grand merci à toutes celles et ceux qui ont contribué, de près ou de loin, au succès de cette belle campagne. Cap sur l'horizon 2025 pour un Matam uni et ambitieux !",
    author: "Oumou Bocoum",
    role: "",
  },
  {
    content: "L'ASFO incarne l'espoir et les aspirations d'un peuple tout entier. Véritable joyau du Fouta, elle symbolise notre fierté collective et notre engagement commun pour un avenir meilleur. Merci pour votre dévouement indéfectible.",
    author: "Abdoul Baba Poulo Gaynako",
    role: "Faculté de médecine de dakar, Thilogne",
  }
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 8000); // Augmenté à 8 secondes

    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextTestimonial = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const prevTestimonial = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const goToTestimonial = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-white via-teal-50/30 to-blue-50/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Title */}
        <div 
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-1000 transform ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Floating Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6 transform hover:scale-105 transition-transform duration-300">
            <Heart className="text-teal-600 mr-3 animate-pulse" size={20} />
            <span className="text-teal-700 font-semibold">Témoignages</span>
          </div>

          {/* Main Title with Gradient */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6 leading-tight">
            Ce qu'ils pensent de l'ASFO
          </h2>
          
          {/* Subtitle with Enhanced Typography */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Découvrez les témoignages de ceux qui ont bénéficié de nos services et de ceux qui nous accompagnent dans notre mission
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full mx-4 animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div 
            ref={cardRef}
            className={`relative transition-all duration-1000 transform ${
              cardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Main testimonial card with enhanced design */}
            <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 overflow-hidden">
              
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-white to-blue-50/50 opacity-60"></div>
              
              {/* Decorative quote icon */}
              <div className="absolute -top-6 -left-6 text-teal-500/20 transform -rotate-12">
                <Quote size={120} className="fill-current" />
              </div>

              {/* Floating sparkles */}
              <div className="absolute top-8 right-8 opacity-30">
                <Sparkles size={24} className="text-teal-600 animate-pulse" />
              </div>

              <div className="relative z-10">
                <div className={`transition-all duration-500 ${
                  isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                }`}>
                  
                  {/* Enhanced quote text */}
                  <blockquote className="text-xl md:text-2xl lg:text-3xl text-gray-700 italic mb-10 leading-relaxed font-light text-center">
                    "{testimonials[currentIndex].content}"
                  </blockquote>

                  {/* Redesigned author section - centered without image */}
                  <div className="flex flex-col items-center justify-center mt-8">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                      <User className="text-teal-600" size={24} />
                    </div>
                    <div className="text-center">
                      <div className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                        {testimonials[currentIndex].author}
                      </div>
                      {testimonials[currentIndex].role && (
                        <div className="text-base md:text-lg text-teal-600 font-medium">
                          {testimonials[currentIndex].role}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced navigation arrows */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-6">
                <button 
                  onClick={prevTestimonial}
                  className="group w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-gray-600 hover:text-white hover:bg-teal-500 transition-all duration-300 transform hover:scale-110 hover:-translate-x-1 border border-gray-200 hover:border-teal-500"
                  aria-label="Témoignage précédent"
                >
                  <ChevronLeft size={24} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                </button>
              </div>
              
              <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6">
                <button 
                  onClick={nextTestimonial}
                  className="group w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-gray-600 hover:text-white hover:bg-teal-500 transition-all duration-300 transform hover:scale-110 hover:translate-x-1 border border-gray-200 hover:border-teal-500"
                  aria-label="Témoignage suivant"
                >
                  <ChevronRight size={24} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Enhanced pagination dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex 
                      ? 'w-12 h-4 bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg' 
                      : 'w-4 h-4 bg-gray-300 hover:bg-teal-200 hover:scale-125'
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="text-gray-800 font-semibold text-lg">
                  Ils nous font confiance
                </p>
                <p className="text-gray-600 text-sm">
                  Rejoignez notre communauté engagée
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;