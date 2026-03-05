import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SponsorBanner from '../common/SponsorBanner';

const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SponsorBanner />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
