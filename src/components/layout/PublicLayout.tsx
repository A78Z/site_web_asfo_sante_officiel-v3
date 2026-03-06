import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SponsorBanner from '../common/SponsorBanner';
import CandidaturePopup from '../common/CandidaturePopup';

const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 w-full flex flex-col">
        <SponsorBanner />
        <Header />
      </div>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CandidaturePopup />
    </div>
  );
};

export default PublicLayout;
