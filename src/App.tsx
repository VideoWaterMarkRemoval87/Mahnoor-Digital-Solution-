import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { SkillsPage } from './pages/SkillsPage';
import { ContactPage } from './pages/ContactPage';
import { ClientRequestPage } from './pages/ClientRequestPage';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { StickyMobileCTABar } from './components/StickyMobileCTABar';

function AppLayout() {
  const location = useLocation();
  // Check if current route is private owner dashboard / CRM
  const isDashboardRoute =
    location.pathname.startsWith('/owner-dashboard') ||
    location.pathname.startsWith('/crm') ||
    location.pathname.startsWith('/client-acquisition') ||
    location.pathname.startsWith('/client-hunter') ||
    location.pathname.startsWith('/hunter');

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2] text-[#172222] font-sans selection:bg-[#F5A623]/30 selection:text-[#064946]">
      {/* Floating Sticky Navigation Bar - Only for public pages (eliminates duplicate header on dashboard) */}
      {!isDashboardRoute && <Navbar />}

      {/* Multi-Page Route Switcher */}
      <main className={`flex-1 ${!isDashboardRoute ? 'pb-16 sm:pb-0' : ''}`}>
        <Routes>
          {/* Essential Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/client-request" element={<ClientRequestPage />} />
          <Route path="/client-action" element={<ClientRequestPage />} />

          {/* Private Owner-Only Dashboard */}
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/crm" element={<OwnerDashboard />} />
          <Route path="/client-acquisition" element={<OwnerDashboard />} />
          <Route path="/client-hunter" element={<Navigate to="/owner-dashboard" replace />} />
          <Route path="/hunter" element={<Navigate to="/owner-dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Floating WhatsApp Direct Contact - Only on public pages.
          Hidden on small screens (< sm) since StickyMobileCTABar replaces it there. */}
      {!isDashboardRoute && (
        <div className="hidden sm:block">
          <WhatsAppFloatingButton />
        </div>
      )}
      {!isDashboardRoute && <StickyMobileCTABar />}

      {/* Global Footer - Only on public pages */}
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}
