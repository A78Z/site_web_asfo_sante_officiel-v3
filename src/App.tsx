import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SponsorBanner from './components/common/SponsorBanner';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ConsultationsPage from './pages/ConsultationsPage';
import AwarenessPage from './pages/AwarenessPage';
import TrainingPage from './pages/TrainingPage';
import ArchivesPage from './pages/ArchivesPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import NewsPage from './pages/NewsPage';
import SingleNewsPage from './pages/SingleNewsPage';
import DonatePage from './pages/DonatePage';
import JoinPage from './pages/JoinPage';
import ReportsPage from './pages/ReportsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import PresidentMessagePage from './pages/PresidentMessagePage';
import OrganizationPage from './pages/OrganizationPage';
import SingleArchivePage from './pages/SingleArchivePage';
import MedicalTeamPage from './pages/MedicalTeamPage';
import MemberCardPage from './pages/MemberCardPage';
import ScrollToTop from './utils/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <SponsorBanner />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/president-message" element={<PresidentMessagePage />} />
            <Route path="/organization" element={<OrganizationPage />} />
            <Route path="/notre-equipe-medicale" element={<MedicalTeamPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/consultations" element={<ConsultationsPage />} />
            <Route path="/services/awareness" element={<AwarenessPage />} />
            <Route path="/services/training" element={<TrainingPage />} />
            <Route path="/archives" element={<ArchivesPage />} />
            <Route path="/archives/:id" element={<SingleArchivePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<SingleNewsPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/rapport" element={<ReportsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/member-card" element={<MemberCardPage />} />
            <Route path="/member-card" element={<MemberCardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;