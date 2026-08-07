import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import ScrollToTop from './utils/ScrollToTop';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ConsultationsPage = lazy(() => import('./pages/ConsultationsPage'));
const AwarenessPage = lazy(() => import('./pages/AwarenessPage'));
const TrainingPage = lazy(() => import('./pages/TrainingPage'));
const ArchivesPage = lazy(() => import('./pages/ArchivesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const SingleNewsPage = lazy(() => import('./pages/SingleNewsPage'));
const DonatePage = lazy(() => import('./pages/DonatePage'));
const DonateSuccessPage = lazy(() => import('./pages/DonateSuccessPage'));
const DonateErrorPage = lazy(() => import('./pages/DonateErrorPage'));
const JoinPage = lazy(() => import('./pages/JoinPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PresidentMessagePage = lazy(() => import('./pages/PresidentMessagePage'));
const SanteHubPage = lazy(() =>
  import('./pages/InfoPages').then(({ SanteHubPage: Page }) => ({ default: Page })),
);
const GestesQuiSauventPage = lazy(() =>
  import('./pages/InfoPages').then(({ GestesQuiSauventPage: Page }) => ({ default: Page })),
);
const FaqSantePage = lazy(() =>
  import('./pages/InfoPages').then(({ FaqSantePage: Page }) => ({ default: Page })),
);
const NewsletterCenterPage = lazy(() => import('./pages/NewsletterCenterPage'));
const PresidentsPage = lazy(() => import('./pages/PresidentsPage'));
const ImpactPagePremium = lazy(() => import('./pages/ImpactPage'));
const UpcomingCampaignPage = lazy(() => import('./pages/UpcomingCampaignPage'));
const InterventionsMapPage = lazy(() => import('./pages/InterventionsMapPage'));
const SponsorshipPage = lazy(() => import('./pages/SponsorshipPage'));
const OrganizationPage = lazy(() => import('./pages/OrganizationPage'));
const PressePage = lazy(() => import('./pages/PressePage'));
const DocumentairePage = lazy(() => import('./pages/DocumentairePage'));
const FichesSantePage = lazy(() => import('./pages/FichesSantePage'));
const PreventionPage = lazy(() => import('./pages/PreventionPage'));
const VaccinationPage = lazy(() => import('./pages/VaccinationPage'));
const HistoriquePage = lazy(() => import('./pages/HistoriquePage'));
const PartenairesPage = lazy(() => import('./pages/PartenairesPage'));
const SingleArchivePage = lazy(() => import('./pages/SingleArchivePage'));
const MedicalTeamPage = lazy(() => import('./pages/MedicalTeamPage'));
const MemberCardPage = lazy(() => import('./pages/MemberCardPage'));
const VerifyMemberPage = lazy(() => import('./pages/VerifyMemberPage'));
const CandidaturePage = lazy(() => import('./pages/CandidaturePage'));
const GuideCandidaturePage = lazy(() => import('./pages/GuideCandidaturePage'));
const FirstAidGuidePage = lazy(() => import('./pages/FirstAidGuidePage'));
const RecrutementMedicalPage = lazy(() => import('./pages/RecrutementMedicalPage'));
const RecrutementApplicationPage = lazy(() => import('./pages/RecrutementApplicationPage'));
const AdminRecruitmentPage = lazy(() => import('./pages/AdminRecruitmentPage'));
const AdminCandidaturesPage = lazy(() => import('./pages/AdminCandidaturesPage'));
const AdminMemberRequestsPage = lazy(() => import('./pages/AdminMemberRequestsPage'));
const AdminVolunteersPage = lazy(() => import('./pages/AdminVolunteersPage'));
const AdminMessagesPage = lazy(() => import('./pages/AdminMessagesPage'));
const AdminNewsletterPage = lazy(() => import('./pages/AdminNewsletterPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminArchivesPage = lazy(() => import('./pages/AdminArchivesPage'));
const AdminGalleryPage = lazy(() => import('./pages/AdminGalleryPage'));
const AdminStatisticsPage = lazy(() => import('./pages/AdminStatisticsPage'));
const AdminNewsPage = lazy(() => import('./pages/AdminNewsPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));

const routeFallback = (
  <div className="flex min-h-[45vh] items-center justify-center bg-white" role="status">
    <span className="sr-only">Chargement de la page…</span>
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-teal-100 border-t-teal-600 motion-reduce:animate-none" aria-hidden="true" />
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={routeFallback}>
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
          <Route path="/donate/success" element={<DonateSuccessPage />} />
          <Route path="/donate/error" element={<DonateErrorPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/rapport" element={<ReportsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/member-card" element={<MemberCardPage />} />
          <Route path="/verify/:id" element={<VerifyMemberPage />} />
          <Route path="/candidature" element={<CandidaturePage />} />
          <Route path="/recrutement-medical" element={<RecrutementMedicalPage />} />
          <Route
            path="/recrutement-medical/:specialite"
            element={<RecrutementApplicationPage />}
          />
          <Route path="/guide-candidature" element={<GuideCandidaturePage />} />
          <Route path="/presidents" element={<PresidentsPage />} />
          <Route path="/impact" element={<ImpactPagePremium />} />
          <Route path="/documentaire" element={<DocumentairePage />} />
          <Route path="/presse" element={<PressePage />} />
          <Route path="/newsletter" element={<NewsletterCenterPage />} />
          <Route path="/parrainer" element={<SponsorshipPage />} />
          <Route path="/missions/prochaine-campagne" element={<UpcomingCampaignPage />} />
          <Route path="/missions/carte" element={<InterventionsMapPage />} />
          <Route path="/sante" element={<SanteHubPage />} />
          <Route path="/sante/fiches" element={<FichesSantePage />} />
          <Route path="/sante/prevention" element={<PreventionPage />} />
          <Route path="/sante/vaccination" element={<VaccinationPage />} />
          <Route path="/sante/gestes-qui-sauvent" element={<GestesQuiSauventPage />} />
          <Route path="/sante/gestes-qui-sauvent/:slug" element={<FirstAidGuidePage />} />
          <Route path="/sante/faq" element={<FaqSantePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Login (no layout wrapper) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/candidatures" element={<AdminCandidaturesPage />} />
          <Route path="/admin/recrutement" element={<AdminRecruitmentPage />} />
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
          <Route path="/admin/news" element={<AdminNewsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
