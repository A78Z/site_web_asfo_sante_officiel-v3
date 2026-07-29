import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Calendar, Tag, Filter, Image, Eye, Sparkles, Camera, ChevronLeft, ChevronRight, Download } from 'lucide-react';

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

  // zoom/pan state for lightbox
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ dragging: boolean; startX: number; startY: number; startOX: number; startOY: number }>({
    dragging: false, startX: 0, startY: 0, startOX: 0, startOY: 0
  });

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      const filtered = images.filter((image) => {
        const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
        const matchesYear = selectedYear === 'all' || image.year === selectedYear;
        return matchesCategory && matchesYear;
      });
      setFilteredImages(filtered);
      setIsFiltering(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedYear, images]);

  useEffect(() => {
    setTotalCount(images.length);
  }, [images]);

  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const openLightbox = useCallback((image: GalleryImage) => {
    const imageIndex = images.findIndex(img => img.id === image.id);
    setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0);
    setSelectedImage(image);
    setImageLoaded(false);
    resetZoom();
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, [images]);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setImageLoaded(false);
    setTimeout(() => {
      setSelectedImage(null);
      document.body.style.overflow = 'auto';
    }, 200);
  }, []);

  const goToNextImage = useCallback(() => {
    if (filteredImages.length === 0) return;
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
    setImageLoaded(false);
    resetZoom();
  }, [currentImageIndex, filteredImages]);

  const goToPrevImage = useCallback(() => {
    if (filteredImages.length === 0) return;
    const prevIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
    setImageLoaded(false);
    resetZoom();
  }, [currentImageIndex, filteredImages]);

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

  useEffect(() => {
    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isLightboxOpen, handleKeyDown]);

  const handleImageClick = useCallback((image: GalleryImage, event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    openLightbox(image);
  }, [openLightbox]);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  // Zoom with wheel / pinch
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.1 : 0.9;
    setScale(prev => {
      const next = Math.min(5, Math.max(1, prev * factor));
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  };

  // Drag to pan when zoomed
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startOX: offset.x,
      startOY: offset.y
    };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset({ x: dragRef.current.startOX + dx, y: dragRef.current.startOY + dy });
  };
  const endDrag = () => { dragRef.current.dragging = false; };

  // Touch (basic pinch/drag)
  const pinchRef = useRef<{ d?: number; sx?: number; sy?: number; sox?: number; soy?: number }>({});
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      pinchRef.current = { sx: e.touches[0].clientX, sy: e.touches[0].clientY, sox: offset.x, soy: offset.y };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current.d = Math.hypot(dx, dy);
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && scale > 1 && pinchRef.current.sx !== undefined) {
      const dx = e.touches[0].clientX - (pinchRef.current.sx ?? 0);
      const dy = e.touches[0].clientY - (pinchRef.current.sy ?? 0);
      setOffset({ x: (pinchRef.current.sox ?? 0) + dx, y: (pinchRef.current.soy ?? 0) + dy });
    } else if (e.touches.length === 2 && pinchRef.current.d) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const nd = Math.hypot(dx, dy);
      const factor = nd / pinchRef.current.d;
      setScale(prev => Math.min(5, Math.max(1, prev * factor)));
      pinchRef.current.d = nd;
    }
  };

  const onDoubleClick = () => {
    setScale(prev => (prev === 1 ? 2 : 1));
    if (scale !== 1) setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="w-full">
      {/* Header */}
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
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedCategory !== 'all' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600'}`}>
              {selectedCategory === 'all' ? 'Toutes catégories' : selectedCategory}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedYear !== 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
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
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
            <select
              id="category-filter"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
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

        <div className="w-full md:w-1/2">
          <label htmlFor="year-filter" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="mr-2 text-blue-500" />
            Année
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <select
              id="year-filter"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
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

      {/* Grid */}
      {filteredImages.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-xl shadow-md cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
              onClick={(e) => handleImageClick(image, e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleImageClick(image, e);
                }
              }}
              aria-label={`Agrandir l'image: ${image.alt}`}
            >
              <div className="relative h-64 overflow-hidden bg-gray-100">
                {/* shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onLoad={(e) => {
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) parent.firstElementChild?.classList.add('opacity-0');
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full">{image.category}</div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">{image.year}</div>
                <div className="absolute inset-0 flex items-end p-4">
                  <div className="w-full bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium line-clamp-2">{image.alt}</h3>
                      <div className="w-8 h-8 bg-teal-500/30 rounded-full flex items-center justify-center">
                        <Eye size={16} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles size={20} className="text-white/70" />
                </div>
              </div>
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
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Lightbox via portal */}
      {isLightboxOpen && selectedImage && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onClick={closeLightbox}
        >
          {/* close */}
          <button
            className="absolute top-5 right-5 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 shadow"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            aria-label="Fermer la vue agrandie"
          >
            <X size={22} />
          </button>

          {/* nav */}
          {filteredImages.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-white bg-black/60 rounded-full p-3 hover:bg-black/80 shadow"
                onClick={(e) => { e.stopPropagation(); goToPrevImage(); }}
                aria-label="Image précédente"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-white bg-black/60 rounded-full p-3 hover:bg-black/80 shadow"
                onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
                aria-label="Image suivante"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* download */}
          <a
            href={selectedImage.src}
            download
            className="absolute top-5 left-5 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 shadow"
            onClick={(e) => e.stopPropagation()}
            aria-label="Télécharger l'image"
          >
            <Download size={20} />
          </a>

          {/* container */}
          <div
            className="relative max-w-[95vw] max-h-[90vh] select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/60 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              loading="eager"
              decoding="async"
              onLoad={handleImageLoad}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                setImageLoaded(true);
              }}
              onWheel={onWheel}
              onDoubleClick={onDoubleClick}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={() => (pinchRef.current = {})}
              className="block max-w-full max-h-[90vh] object-contain transition-opacity duration-300"
              style={{
                opacity: imageLoaded ? 1 : 0.25,
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                willChange: 'transform'
              }}
            />
            <div className="mt-4 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 shadow-xl max-w-full">
              <h3 id="lightbox-title" className="text-center text-white font-semibold">
                {selectedImage.alt}
              </h3>
              <div className="flex flex-wrap justify-center gap-3 mt-3">
                <span className="flex items-center bg-teal-500/20 px-3 py-1.5 rounded-full border border-teal-400/30 text-white text-sm">
                  <Tag size={14} className="mr-2 text-teal-300" /> {selectedImage.category}
                </span>
                <span className="flex items-center bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-400/30 text-white text-sm">
                  <Calendar size={14} className="mr-2 text-blue-300" /> {selectedImage.year}
                </span>
                <span className="flex items-center bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-400/30 text-white text-sm">
                  <Image size={14} className="mr-2 text-purple-300" /> {currentImageIndex + 1} / {filteredImages.length}
                </span>
                {scale > 1 && (
                  <button
                    className="ml-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm"
                    onClick={resetZoom}
                  >
                    Réinitialiser le zoom
                  </button>
                )}
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs text-center pointer-events-none">
              Double-cliquez pour zoomer • Molette pour zoom • Faites glisser pour déplacer • Échap pour fermer
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PhotoGallery;
