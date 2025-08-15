import React from 'react';
import ImageCard from '../common/ImageCard';

const presidents = [
  {
    name: "Dr Bouna NDIAYE",
    years: "2000 - 2001",
    role: "Spécialiste en Santé Publique",
    image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg"
  },
  {
    name: "Dr Moussa Baba DIALLO",
    years: "2001 - 2002", 
    role: "Chirurgien orthopédiste, Traumatologue",
    image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg"
  },
  {
    name: "Dr Aminata DIOP",
    years: "2002 - 2003",
    role: "Cardiologue",
    image: "https://images.pexels.com/photos/5722164/pexels-photo-5722164.jpeg"
  },
  {
    name: "Dr Ibrahima SOW",
    years: "2003 - 2004",
    role: "Pédiatre",
    image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg"
  }
];

const PresidentsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {presidents.map((president, index) => (
        <ImageCard
          key={index}
          image={president.image}
          title={president.name}
          description={`${president.role}\n${president.years}`}
          imageAlt={president.name}
          className="transform transition-all duration-300 hover:-translate-y-2"
        />
      ))}
    </div>
  );
};

export default PresidentsGrid;