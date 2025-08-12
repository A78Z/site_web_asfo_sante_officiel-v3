import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, Calendar, Tag, Filter, Image, Eye, Sparkles, Camera, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  year: string;
  category: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  categories: string[];
  years: string[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images, categories, years }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(images);
  const [isFiltering, setIsFiltering] = useState(false);
  const [totalCount, setTotalCount] = useState(images.length);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setIsFiltering(true);
    
    // Delay filtering to allow for transition animation
    const timer = setTimeout(() => {
      const filtered = images.filter((image) => {
        const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
        const matchesYear = selectedYear === 'all' || image.year === selectedYear;
        return matchesCategory && matchesYear;
      });
      
      setFilteredImages(filtered);
      setIsFiltering(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedYear, images]);

  useEffect(() => {
    setTotalCount(images.length);
  }, [images]);

  // Fonction pour ouvrir le lightbox avec une image spécifique
  const openLightbox = useCallback((image: GalleryImage) => {
    const imageIndex = filteredImages.findIndex(img => img.id === image.id);
    setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0);
    setSelectedImage(image);
    setImageLoaded(false);
    
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, [filteredImages]);

  // Fonction pour fermer le lightbox
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setImageLoaded(false);
    
    setTimeout(() => {
      setSelectedImage(null);
      document.body.style.overflow = 'auto';
    }, 300);
  }, []);

  // Navigation dans le lightbox
  const goToNextImage = useCallback(() => {
    if (filteredImages.length === 0) return;
    
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
    setImageLoaded(false);
  }, [currentImageIndex, filteredImages]);

  const goToPrevImage = useCallback(() => {
    if (filteredImages.length === 0) return;
    
    const prevIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
    setImageLoaded(false);
  }, [currentImageIndex, filteredImages]);

  // Gestion des événements clavier
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isLightboxOpen) return;
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closeLightbox();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNextImage();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevImage();
        break;
    }
  }, [isLightboxOpen, closeLightbox, goToNextImage, goToPrevImage]);

  // Ajout/suppression des event listeners
  useEffect(() => {
    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isLightboxOpen, handleKeyDown]);

  // Fonction pour gérer le clic sur l'image dans la grille
  const handleImageClick = useCallback((image: GalleryImage, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Image clicked:', image.id); // Debug log
    openLightbox(image);
  }, [openLightbox]);

  // Fonction pour gérer le clic sur l'overlay du lightbox
  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeLightbox();
    }
  }, [closeLightbox]);

  // Fonction pour gérer le chargement de l'image
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <div className="w-full">
      {/* Gallery Header with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl shadow-sm border border-teal-100">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
            <Camera className="text-teal-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Galerie de photos</h3>
            <p className="text-gray-600">
              <span className="font-medium text-teal-600">{totalCount}</span> photos disponibles
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Filtres actifs :</span>
          <div className="flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              selectedCategory !== 'all' 
                ? 'bg-teal-100 text-teal-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {selectedCategory === 'all' ? 'Toutes catégories' : selectedCategory}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              selectedYear !== 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {selectedYear === 'all' ? 'Toutes années' : selectedYear}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-full md:w-1/2">
          <label htmlFor="category-filter" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Tag size={16} className="mr-2 text-teal-500" />
            Catégorie
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={16} className="text-gray-400 group-hover:text-teal-500 transition-colors" />
              </div>
              <select
                id="category-filter"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm hover:shadow-md transition-all"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <label htmlFor="year-filter" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="mr-2 text-blue-500" />
            Année
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <select
                id="year-filter"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="all">Toutes les années</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${
          isFiltering ? 'opacity-50' : 'opacity-100'
        }`}>
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-xl shadow-md cursor-pointer transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] border border-gray-100 pointer-events-auto"
              onClick={(e) => handleImageClick(image, e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleImageClick(image, e as any);
                }
              }}
              aria-label={`Agrandir l'image: ${image.alt}`}
            >
              <div className="relative h-64 overflow-hidden bg-gray-100 pointer-events-none">
                {/* Loading Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
                
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                  onLoad={(e) => {
                    // Hide shimmer effect when image loads
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      const shimmer = parent.querySelector('div:first-child');
                      if (shimmer) shimmer.classList.add('opacity-0');
                    }
                  }}
                  onError={(e) => {
                    // Handle image loading errors
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-teal-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  {image.category}
                </div>
                
                {/* Year Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  {image.year}
                </div>
                
                {/* Hover Content Overlay */}
                <div className="absolute inset-0 flex items-end p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                  <div className="w-full">
                    {/* Title with Animation */}
                    <h3 className="text-white font-medium mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 line-clamp-2">
                      {image.alt}
                    </h3>
                    
                    {/* View Button */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-xs">Cliquez pour agrandir</span>
                        <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
                          <Eye size={16} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Corner Elements */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                  <Sparkles size={20} className="text-white/60 animate-pulse" />
                </div>
              </div>

              {/* Bottom Glow Effect */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="text-gray-400" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Aucune image trouvée</h3>
          <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
            Aucune image ne correspond à vos filtres actuels.<br />
            Essayez de modifier vos critères de recherche.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedYear('all');
            }}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Enhanced Lightbox Modal - CORRECTION DU PROBLÈME DE PAGE NOIRE */}
      {isLightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          {/* Overlay de fond */}
          <div className="absolute inset-0 bg-black bg-opacity-90 transition-opacity duration-300"></div>
          
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 z-20 text-white bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 transition-all duration-300 shadow-lg transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Fermer la vue agrandie"
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons */}
          {filteredImages.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/60 backdrop-blur-sm rounded-full p-3 hover:bg-black/80 transition-all duration-300 shadow-lg hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                aria-label="Image précédente"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/60 backdrop-blur-sm rounded-full p-3 hover:bg-black/80 transition-all duration-300 shadow-lg hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
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
                onLoad={handleImageLoad}
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
                {selectedImage.alt}
              </h3>
              
              <div className="flex flex-wrap justify-center gap-3 mt-3">
                <div className="flex items-center bg-teal-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-teal-400/30">
                  <Tag size={14} className="text-teal-300 mr-2" />
                  <span className="text-white text-sm">{selectedImage.category}</span>
                </div>
                <div className="flex items-center bg-blue-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-400/30">
                  <Calendar size={14} className="text-blue-300 mr-2" />
                  <span className="text-white text-sm">{selectedImage.year}</span>
                </div>
                <div className="flex items-center bg-purple-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-purple-400/30">
                  <Image size={14} className="text-purple-300 mr-2" />
                  <span className="text-white text-sm">
                    {currentImageIndex + 1} / {filteredImages.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Instructions */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-sm text-center z-10">
            <p>Utilisez les flèches ← → pour naviguer • Échap pour fermer</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;