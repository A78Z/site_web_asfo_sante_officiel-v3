import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AnnouncementBar from '../common/AnnouncementBar';
import CandidaturePopup from '../common/CandidaturePopup';

const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div id="site-header" className="sticky top-0 z-50 w-full flex flex-col">
        <AnnouncementBar />
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
