import React from 'react';
import SectionTitle from '../components/common/SectionTitle';
import PhotoGallery from '../components/gallery/PhotoGallery';
import { Camera, Image, Calendar, Tag } from 'lucide-react';

const GalleryPage: React.FC = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Galerie Photos | ASFO | Action Sanitaire pour le Fouta';
  }, []);

  // Sample gallery images
  const galleryImages = [
    // 2024 Images
    {
      id: "img2024-1",
      src: "/gv1.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-2",
      src: "/gv2.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-3",
      src: "/gv3.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-4",
      src: "/gv4.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-5",
      src: "/gv5.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-6",
      src: "/gv6.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-7",
      src: "/gv7.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-8",
      src: "/gv8.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-9",
      src: "/gv9.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-10",
      src: "/gv10.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-11",
      src: "/gv11.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-12",
      src: "/gv12.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-13",
      src: "/gv13.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-14",
      src: "/gv14.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-15",
      src: "/gv15.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-16",
      src: "/gv16.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-17",
      src: "/gv17.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-18",
      src: "/gv18.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-19",
      src: "/gv19.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-20",
      src: "/gv20.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-21",
      src: "/gv21.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-22",
      src: "/gv22.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-23",
      src: "/gv23.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-24",
      src: "/gv24.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-25",
      src: "/gv25.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-26",
      src: "/gv26.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-27",
      src: "/gv27.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-28",
      src: "/gv28.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-29",
      src: "/gv29.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-30",
      src: "/gv30.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    }, 
     {
      id: "img2024-31",
      src: "/gv31.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-32",
      src: "/gv32.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-33",
      src: "/gv33.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-34",
      src: "/gv34.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-35",
      src: "/gv35.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-36",
      src: "/gv36.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-37",
      src: "/gv37.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-38",
      src: "/gv38.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-39",
      src: "/gv39.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-40",
      src: "/gv30.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    }, 
    {
      id: "img2024-41",
      src: "/gv41.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-42",
      src: "/gv42.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-43",
      src: "/gv43.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-44",
      src: "/gv44.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-45",
      src: "/gv45.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-46",
      src: "/gv46.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-47",
      src: "/gv47.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-48",
      src: "/gv48.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-49",
      src: "/gv49.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-50",
      src: "/gv30.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    }, 

    {
      id: "img2024-51",
      src: "/gv51.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-52",
      src: "/gv52.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-53",
      src: "/gv53.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-54",
      src: "/gv54.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-55",
      src: "/gv55.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    },
    {
      id: "img2024-56",
      src: "/gv56.webp",
      alt: "Caravane médicale à Guedé Village 2024",
      year: "2024",
      category: "Guédé Village"
    }, 
    // Existing 2024 Images
    {
      id: "img1-2024",
      src: "/1.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img2-2024",
      src: "/2.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img3-2024",
      src: "/3.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img4-2024",
      src: "/4.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img5-2024",
      src: "/5.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img7-2024",
      src: "/7.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img8-2024",
      src: "/8.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img9-2024",
      src: "/9.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img10-2024",
      src: "/10.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img11-2024",
      src: "/11.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img12-2024",
      src: "/12.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img13-2024",
      src: "/13.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img14-2024",
      src: "/14.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img15-2024",
      src: "/15.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img16-2024",
      src: "/16.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img17-2024",
      src: "/17.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img18-2024",
      src: "/18.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img19-2024",
      src: "/19.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img20-2024",
      src: "/20.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },

     {
      id: "img21-2024",
      src: "/21.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img22-2024",
      src: "/22.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img23-2024",
      src: "/23.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img24-2024",
      src: "/24.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img25-2024",
      src: "/25.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img26-2024",
      src: "/26.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img27-2024",
      src: "/27.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img28-2024",
      src: "/28.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img29-2024",
      src: "/29.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img30-2024",
      src: "/30.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img31-2024",
      src: "/31.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img32-2024",
      src: "/32.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img33-2024",
      src: "/33.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img34-2024",
      src: "/34.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img35-2024",
      src: "/35.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },

    {
      id: "img36-2024",
      src: "/36.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img37-2024",
      src: "/37.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img38-2024",
      src: "/38.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img39-2024",
      src: "/39.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img40-2024",
      src: "/40.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    {
      id: "img41-2024",
      src: "/41.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
     category: "Village Diaba"
    },
    {
      id: "img42-2024",
      src: "/42.webp",
      alt: "Caravane médicale à Diaba 2024",
      year: "2024",
      category: "Village Diaba"
    },
    // 2024 Images village Bode Lao
    {
      id: "img1-bl-2024",
      src: "/bode1.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
     id: "img2-bl-2024",
      src: "/bode2.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
     id: "img3-bl-2024",
      src: "/bode3.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
     category: "Village Bodé Lao"
    },
    {
      id: "img4-bl-2024",
      src: "/bode4.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
      id: "img5-bl-2024",
      src: "/bode5.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
      id: "img6-bl-2024",
      src: "/bode6.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
     id: "img7-bl-2024",
      src: "/bode7.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
      id: "img8-bl-2024",
      src: "/bode8.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
     id: "img9-bl-2024",
      src: "/bode9.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
     category: "Village Bodé Lao"
    },
    {
      id: "img10-bl-2024",
      src: "/bode10.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
      id: "img11-bl-2024",
      src: "/bode11.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
      id: "img12-bl-2024",
      src: "/bode12.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
     category: "Village Bodé Lao"
    },
    {
     id: "img13-bl-2024",
      src: "/bode13.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
     id: "img14-bl-2024",
      src: "/bode14.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
      id: "img15-bl-2024",
      src: "/bode15.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
     category: "Village Bodé Lao"
    },
    {
      id: "img16-bl-2024",
      src: "/bode16.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
      id: "img17-bl-2024",
      src: "/bode17.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
     id: "img18-bl-2024",
      src: "/bode18.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
      id: "img19-bl-2024",
      src: "/bode19.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    {
     id: "img20-bl-2024",
      src: "/bode20.webp",
      alt: "Caravane médicale à Bodé Lao 2024",
      year: "2024",
      category: "Village Bodé Lao"
    },
    // 2024 Images village Tatqui
    {
      id: "img1-Tatqui-2024",
      src: "/tekti1.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
     id: "img2-Tatqui-2024",
      src: "/tekti2.webp",
     alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
     id: "img3-Tatqui-2024",
      src: "/tekti3.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
      id: "img4-Tatqui-2024",
      src: "/tekti4.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
      id: "img5-Tatqui-2024",
      src: "/tekti5.webp",
     alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
      id: "img6-Tatqui-2024",
      src: "/tekti6.webp",
     alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
     id: "img7-Tatqui-2024",
      src: "/tekti7.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
      id: "img8-Tatqui-2024",
      src: "/tekti8.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
     id: "img9-Tatqui-2024",
      src: "/tekti9.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
      id: "img10-Tatqui-2024",
      src: "/tekti10.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
      id: "img11-Tatqui-2024",
      src: "/tekti11.webp",
     alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
      id: "img12-Tatqui-2024",
      src: "/tekti12.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
     id: "img13-Tatqui-2024",
      src: "/tekti13.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
     id: "img14-Tatqui-2024",
      src: "/tekti14.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
      id: "img15-Tatqui-2024",
      src: "/tekti15.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
      id: "img16-Tatqui-2024",
      src: "/tekti16.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
      id: "img17-Tatqui-2024",
      src: "/tekti17.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
     id: "img18-Tatqui-2024",
      src: "/tekti18.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
      id: "img19-Tatqui-2024",
      src: "/tekti19.webp",
      alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    {
     id: "img20-Tatqui-2024",
      src: "/tekti20.webp",
     alt: "Caravane médicale à Tatqui 2024",
      year: "2024",
      category: "Village Tatqui"
    },
    // 2024 Images Village Diatar
    {
      id: "img1-Tatqui-2024",
      src: "/diatar1.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
     id: "img2-Tatqui-2024",
      src: "/diatar2.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
     id: "img3-Tatqui-2024",
      src: "/diatar3.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
      id: "img4-Tatqui-2024",
      src: "/diatar4.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
      id: "img5-Tatqui-2024",
      src: "/diatar5.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
      id: "img6-Tatqui-2024",
      src: "/diatar6.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
     id: "img7-Tatqui-2024",
      src: "/diatar7.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
      id: "img8-Tatqui-2024",
      src: "/diatar8.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
     id: "img9-Tatqui-2024",
      src: "/diatar9.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
      id: "img10-Tatqui-2024",
      src: "/diatar10.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
      id: "img11-Tatqui-2024",
      src: "/diatar11.webp",
     alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
      id: "img12-Tatqui-2024",
      src: "/diatar12.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
     id: "img13-Tatqui-2024",
      src: "/diatar13.webp",
      alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    },
    {
     id: "img14-Tatqui-2024",
      src: "/diatar14.webp",
     alt: "Caravane médicale à Diatar 2024",
      year: "2024",
      category: "Village de Diatar"
    }
  ];

  // Extract unique years and categories
  const years = Array.from(new Set(galleryImages.map(img => img.year))).sort((a, b) => parseInt(b) - parseInt(a));
  const categories = Array.from(new Set(galleryImages.map(img => img.category))).sort();

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="/medicalteam.webp" 
            alt="Medical team" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/60"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 transform hover:scale-105 transition-transform duration-300">
              <Camera className="mr-2 text-white/80" size={16} />
              <span>Explorez nos missions en images</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Notre Médiathèque
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Découvrez en images les missions et actions menées par ASFO dans différentes régions du Sénégal.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Image className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">{galleryImages.length}+</h3>
                <p className="text-white/80">Photos disponibles</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Calendar className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">{years.length}</h3>
                <p className="text-white/80">Années couvertes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Tag className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-2xl font-bold text-white mb-2">{categories.length}</h3>
                <p className="text-white/80">Catégories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/20 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-100 mb-6 transform hover:scale-105 transition-transform duration-300">
              <Camera className="text-teal-600 mr-3 animate-pulse" size={20} />
              <span className="text-teal-700 font-semibold">Nos Activités en Images</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-teal-700 to-gray-800 bg-clip-text text-transparent mb-6 leading-tight">
              Galerie de photos
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Parcourez notre collection de <span className="font-semibold text-teal-600">{galleryImages.length}+ photos</span> illustrant les différentes missions et activités d'ASFO à travers le Sénégal
            </p>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center mt-8">
              <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
              <div className="w-3 h-3 bg-teal-400 rounded-full mx-4 animate-pulse"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent w-32"></div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
            <PhotoGallery 
              images={galleryImages}
              categories={categories}
              years={years}
            />
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
                    Revivez nos missions en images
                  </p>
                  <p className="text-gray-600 text-sm">
                    Des moments inoubliables capturés sur le terrain
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;