
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
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
import HistoriquePage from './pages/HistoriquePage';
import PartenairesPage from './pages/PartenairesPage';
import SingleArchivePage from './pages/SingleArchivePage';
import MedicalTeamPage from './pages/MedicalTeamPage';
import MemberCardPage from './pages/MemberCardPage';
import CandidaturePage from './pages/CandidaturePage';
import GuideCandidaturePage from './pages/GuideCandidaturePage';
import AdminCandidaturesPage from './pages/AdminCandidaturesPage';
import AdminMemberRequestsPage from './pages/AdminMemberRequestsPage';
import AdminVolunteersPage from './pages/AdminVolunteersPage';
import AdminMessagesPage from './pages/AdminMessagesPage';
import AdminNewsletterPage from './pages/AdminNewsletterPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminArchivesPage from './pages/AdminArchivesPage';
import AdminGalleryPage from './pages/AdminGalleryPage';
import AdminStatisticsPage from './pages/AdminStatisticsPage';
import AdminNewsPage from './pages/AdminNewsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminAnnouncementsPage from './pages/AdminAnnouncementsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ScrollToTop from './utils/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/mission" element={<AboutPage />} />
          <Route path="/about/historique" element={<HistoriquePage />} />
          <Route path="/about/organisation" element={<OrganizationPage />} />
          <Route path="/about/partenaires" element={<PartenairesPage />} />
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
          <Route path="/candidature" element={<CandidaturePage />} />
          <Route path="/guide-candidature" element={<GuideCandidaturePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Login (no layout wrapper) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/candidatures" element={<AdminCandidaturesPage />} />
          <Route path="/admin/cartes-membres" element={<AdminMemberRequestsPage />} />
          <Route path="/admin/members" element={<AdminMemberRequestsPage />} />
          <Route path="/admin/benevoles" element={<AdminVolunteersPage />} />
          <Route path="/admin/volunteers" element={<AdminVolunteersPage />} />
          <Route path="/admin/messages" element={<AdminMessagesPage />} />
          <Route path="/admin/newsletter" element={<AdminNewsletterPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/archives" element={<AdminArchivesPage />} />
          <Route path="/admin/archives-missions" element={<AdminArchivesPage />} />
          <Route path="/admin/gallery" element={<AdminGalleryPage />} />
          <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
          <Route path="/admin/annonces" element={<AdminAnnouncementsPage />} />
          <Route path="/admin/news" element={<AdminNewsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;