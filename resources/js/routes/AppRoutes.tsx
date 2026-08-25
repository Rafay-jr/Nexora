import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import BackButton from '../components/common/BackButton';
import CustomCursor from '../components/common/CustomCursor';
import GlobalBackground3D from '../components/3d/GlobalBackground3D';
import { playClickSound } from '../utils/soundEffects';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import EventsPage from '../pages/public/EventsPage';
import EventDetailPage from '../pages/public/EventDetailPage';
import GalleryPage from '../pages/public/GalleryPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';
import FaqPage from '../pages/public/FaqPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import SitemapPage from '../pages/public/SitemapPage';

// Participant Pages
import ParticipantDashboard from '../pages/participant/ParticipantDashboard';
import MyRegistrationsPage from '../pages/participant/MyRegistrationsPage';
import MyCertificatesPage from '../pages/participant/MyCertificatesPage';
import SavedMediaPage from '../pages/participant/SavedMediaPage';
import ProfileSettingsPage from '../pages/participant/ProfileSettingsPage';

// Organizer Pages
import OrganizerDashboard from '../pages/organizer/OrganizerDashboard';
import CreateEventPage from '../pages/organizer/CreateEventPage';
import EditEventPage from '../pages/organizer/EditEventPage';
import ManageRegistrationsPage from '../pages/organizer/ManageRegistrationsPage';
import CertificateUploadPage from '../pages/organizer/CertificateUploadPage';
import OrganizerMediaPage from '../pages/organizer/OrganizerMediaPage';
import OrganizerAnnouncementsPage from '../pages/organizer/OrganizerAnnouncementsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import PendingApprovalsPage from '../pages/admin/PendingApprovalsPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';

const AppRoutes: React.FC = () => {
  const location = useLocation();

  // Root dashboards do NOT need back buttons
  const isRootPage = ['/', '/admin/dashboard', '/organizer/dashboard', '/participant/dashboard'].includes(location.pathname);
  const showBackButton = !isRootPage;

  // Global Mouse Click Sound Listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input[type="submit"], select, [role="button"]')) {
        playClickSound();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative bg-slate-50 dark:bg-[#070a13] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 3D WebGL Animated Background Canvas */}
      <GlobalBackground3D />

      {/* Animated Custom Cursor Follower */}
      <CustomCursor />

      {/* Floating Liquid Glass Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8 relative z-10 page-fade-enter">
        {/* Single Global Floating Back Button on sub-pages */}
        {showBackButton && (
          <div className="mb-6">
            <BackButton label="Back" />
          </div>
        )}

        <Routes>
          {/* Public Visitor Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Participant Routes */}
          <Route element={<ProtectedRoute allowedRoles={['participant', 'organizer', 'admin']} />}>
            <Route path="/participant/dashboard" element={<ParticipantDashboard />} />
            <Route path="/participant/registrations" element={<MyRegistrationsPage />} />
            <Route path="/participant/certificates" element={<MyCertificatesPage />} />
            <Route path="/participant/saved-media" element={<SavedMediaPage />} />
            <Route path="/participant/profile" element={<ProfileSettingsPage />} />
          </Route>

          {/* Organizer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['organizer', 'admin']} />}>
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            <Route path="/organizer/events/create" element={<CreateEventPage />} />
            <Route path="/organizer/events/:id/edit" element={<EditEventPage />} />
            <Route path="/organizer/events/:id/registrations" element={<ManageRegistrationsPage />} />
            <Route path="/organizer/certificates/upload" element={<CertificateUploadPage />} />
            <Route path="/organizer/media/upload" element={<OrganizerMediaPage />} />
            <Route path="/organizer/announcements" element={<OrganizerAnnouncementsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/pending-approvals" element={<PendingApprovalsPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default AppRoutes;
