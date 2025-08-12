import React from 'react';
import { useState, useEffect } from 'react';
import SplashScreen from '../components/common/SplashScreen';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import LatestMission from '../components/home/LatestMission';
import JoinCTA from '../components/home/JoinCTA';
import NewsPreview from '../components/home/NewsPreview';
import DocumentarySection from '../components/home/DocumentarySection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import Partners from '../components/home/Partners';
import CampaignsCarousel from '../components/home/CampaignsCarousel';

const HomePage: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Set page title
  React.useEffect(() => {
    document.title = 'ASFO | Action Sanitaire pour le Fouta';
  }, []);

  useEffect(() => {
    // Vérifier si c'est la première visite ou un rafraîchissement
    const hasVisited = sessionStorage.getItem('asfo-visited');
    
    if (hasVisited) {
      setShowSplash(false);
      setIsLoaded(true);
    } else {
      // Marquer comme visité pour cette session
      sessionStorage.setItem('asfo-visited', 'true');
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  };

  // Afficher le splash screen si nécessaire
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Hero />
      <NewsPreview />
      <ImpactStats />
      <LatestMission />
      <DocumentarySection />
     <TestimonialsSection />
      <Partners />
      <CampaignsCarousel />
      <JoinCTA />
    </div>
  );
};

export default HomePage;