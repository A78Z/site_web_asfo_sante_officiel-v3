import React, { useState, useEffect } from 'react';
import SplashScreen from '../components/common/SplashScreen';
import Hero from '../components/home/Hero';
import PresidentMessage from '../components/home/PresidentMessage';
import AboutPreview from '../components/home/AboutPreview';
import ImpactStats from '../components/home/ImpactStats';
import MedicalTeamPreview from '../components/home/MedicalTeamPreview';
import MemberCardSection from '../components/home/MemberCardSection';
import LatestMission from '../components/home/LatestMission';
import ArchivesPreview from '../components/home/ArchivesPreview';
import GalleryPreview from '../components/home/GalleryPreview';
import NewsPreview from '../components/home/NewsPreview';
import CandidatureSection from '../components/home/CandidatureSection';
import DocumentarySection from '../components/home/DocumentarySection';
import Partners from '../components/home/Partners';
import TestimonialsSection from '../components/home/TestimonialsSection';
import AdvertisementSection from '../components/home/AdvertisementSection';
import JoinCTA from '../components/home/JoinCTA';

const HomePage: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.title = 'ASFO | Action Sanitaire pour le Fouta';
  }, []);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('asfo-visited');
    if (hasVisited) {
      setShowSplash(false);
      setIsLoaded(true);
    } else {
      sessionStorage.setItem('asfo-visited', 'true');
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setTimeout(() => setIsLoaded(true), 100);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Hero />
      <PresidentMessage />
      <AboutPreview />
      <ImpactStats />
      <MedicalTeamPreview />
      <MemberCardSection />
      <LatestMission />
      <ArchivesPreview />
      <GalleryPreview />
      <NewsPreview />
      <CandidatureSection />
      <DocumentarySection />
      <Partners />
      <TestimonialsSection />
      <AdvertisementSection />
      <JoinCTA />
    </div>
  );
};

export default HomePage;
