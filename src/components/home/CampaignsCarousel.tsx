import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Eye, Sparkles, Camera } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface CampaignImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

const campaignImages: CampaignImage[] = [
  {
    id: "distribution-flyers",
    src: "/Distribution-de-flyers.jpg",
    alt: "Distribution de flyers ASFO",
    title: "Distribution de flyers",
    description: "Campagne de sensibilisation et distribution de supports informatifs"
  },
  {
    id: "whatsapp-image-1",
    src: "/WhatsApp Image 2025-07-08 à 14.13.20_c02d6957.jpg",
    alt: "Affiche campagne ASFO 2025",
    title: "Campagne ASFO 2025",
    description: "Affiche officielle de la campagne médicale 2025"
  },
  {
    id: "whatsapp-image-2",
    src: "/WhatsApp Image 2025-07-08 à 14.13.28_d7461dff copy.jpg",
    alt: "Affiche Campagne ASFO Podor 2024 - Visuel 1",
    title: "Campagne ASFO Podor 2024",
    description: "Premier visuel de la campagne médicale à Podor"
  },
  {
    id: "whatsapp-image-3",
    src: "/WhatsApp Image 2025-07-08 à 14.13.29_ba872763 copy.jpg",
    alt: "Affiche Campagne ASFO Podor 2024 - Visuel 2",
    title: "Campagne ASFO Podor 2024",
    description: "Deuxième visuel de la campagne médicale à Podor"
  }
];

const CampaignsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CampaignImage | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [carouselRef, carouselInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused || isLightboxOpen) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === campaignImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, isLightboxOpen]);

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === campaignImages.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? campaignImages.length - 1 : prevIndex - 1
    );
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Lightbox functions
  const openLightbox = useCallback((image: CampaignImage) => {
    setSelectedImage(image);
    setImageLoaded(false);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setImageLoaded(false);
    setTimeout(() => {
      setSelectedImage(null);
      document.body.style.overflow = 'auto';
    }, 300);
  }, []);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isLightboxOpen) return;
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closeLightbox();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        goToPrev();
        break;
    }
  }, [isLightboxOpen, closeLightbox, goToNext, goToPrev]);

  useEffect(() => {
    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isLightboxOpen, handleKeyDown]);

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Section Title */}
          <div 
            ref={titleRef}
            className={`text-center mb-16 transition-all duration-1000 transform ${
              titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Floating Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6 transform hover:scale-105 transition-transform duration-300">
              <Camera className="text-teal-600 mr-3 animate-pulse" size={20} />
              <span className="text-teal-700 font-semibold">Nos Communications</span>
            </div>

            {/* Main Title with Gradient */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6 leading-tight">
              Campagnes
            </h2>
            
            {/* Subtitle with Enhanced Typography */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Découvrez nos supports de communication et affiches de campagnes médicales
            </p>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center mt-8">
              <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
              <div className="w-3 h-3 bg-teal-400 rounded-full mx-4 animate-pulse"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
            </div>
          </div>

          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className={`max-w-4xl mx-auto transition-all duration-1000 transform ${
              carouselInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Carousel Content */}
              <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
                {campaignImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentIndex 
                        ? 'opacity-100 translate-x-0' 
                        : index < currentIndex 
                          ? 'opacity-0 -translate-x-full' 
                          : 'opacity-0 translate-x-full'
                    }`}
                  >
                    <div 
                      className="relative w-full h-full cursor-pointer group"
                      onClick={() => openLightbox(image)}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-contain bg-gray-50 transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
                            <div className="flex items-center text-teal-600">
                              <Eye size={20} className="mr-2" />
                              <span className="font-medium">Cliquez pour agrandir</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Decorative corner sparkle */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        <Sparkles size={24} className="text-teal-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:text-white hover:bg-teal-500 transition-all duration-300 hover:scale-110 border border-gray-200 hover:border-teal-500 z-10"
                aria-label="Image précédente"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:text-white hover:bg-teal-500 transition-all duration-300 hover:scale-110 border border-gray-200 hover:border-teal-500 z-10"
                aria-label="Image suivante"
              >
                <ChevronRight size={24} />
              </button>

              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {campaignImages[currentIndex].title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {campaignImages[currentIndex].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {campaignImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex 
                      ? 'w-12 h-4 bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg' 
                      : 'w-4 h-4 bg-gray-300 hover:bg-teal-200 hover:scale-125'
                  }`}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 bg-gray-200 rounded-full h-1 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-300 ease-linear"
                style={{
                  width: isPaused ? '100%' : `${((currentIndex + 1) / campaignImages.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Bottom decorative element */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Camera className="text-white" size={20} />
                </div>
                <div className="text-left">
                  <p className="text-gray-800 font-semibold text-lg">
                    Nos campagnes en images
                  </p>
                  <p className="text-gray-600 text-sm">
                    Communication visuelle de nos actions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeLightbox();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-90 transition-opacity duration-300"></div>
          
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 z-20 text-white bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 transition-all duration-300 shadow-lg transform hover:scale-110"
            onClick={closeLightbox}
            aria-label="Fermer la vue agrandie"
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons in Lightbox */}
          {campaignImages.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/60 backdrop-blur-sm rounded-full p-3 hover:bg-black/80 transition-all duration-300 shadow-lg hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                  const prevIndex = currentIndex === 0 ? campaignImages.length - 1 : currentIndex - 1;
                  setSelectedImage(campaignImages[prevIndex]);
                  setImageLoaded(false);
                }}
                aria-label="Image précédente"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/60 backdrop-blur-sm rounded-full p-3 hover:bg-black/80 transition-all duration-300 shadow-lg hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                  const nextIndex = currentIndex === campaignImages.length - 1 ? 0 : currentIndex + 1;
                  setSelectedImage(campaignImages[nextIndex]);
                  setImageLoaded(false);
                }}
                aria-label="Image suivante"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading Indicator */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Main Image */}
            <div className="relative bg-transparent rounded-lg overflow-hidden shadow-2xl">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[80vh] object-contain bg-transparent"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                  setImageLoaded(true);
                }}
                style={{ 
                  opacity: imageLoaded ? 1 : 0.3,
                  transition: 'opacity 0.3s ease-in-out',
                  backgroundColor: 'transparent'
                }}
              />
            </div>
            
            {/* Image Info Panel */}
            <div className="mt-4 bg-black/60 backdrop-blur-md p-6 rounded-lg border border-white/10 shadow-xl max-w-full z-10">
              <h3 id="lightbox-title" className="text-xl font-bold text-white mb-2 text-center">
                {selectedImage.title}
              </h3>
              <p className="text-white/90 text-center">
                {selectedImage.description}
              </p>
            </div>
          </div>

          {/* Keyboard Instructions */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-sm text-center z-10">
            <p>Utilisez les flèches ← → pour naviguer • Échap pour fermer</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignsCarousel;