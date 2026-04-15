import React from 'react';
import { createBrowserRouter, Outlet, useLocation } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';

const SignupPage = React.lazy(() => import('./pages/SignupPage').then((m) => ({ default: m.SignupPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const SharePage = React.lazy(() => import('./pages/SharePage').then((m) => ({ default: m.SharePage })));

const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const UploadPage = React.lazy(() => import('./pages/UploadPage').then((m) => ({ default: m.UploadPage })));
const ProcessPage = React.lazy(() => import('./pages/ProcessPage').then((m) => ({ default: m.ProcessPage })));
const ResultPage = React.lazy(() => import('./pages/ResultPage').then((m) => ({ default: m.ResultPage })));
const PaymentPage = React.lazy(() => import('./pages/PaymentPage').then((m) => ({ default: m.PaymentPage })));
const SuccessPage = React.lazy(() => import('./pages/SuccessPage').then((m) => ({ default: m.SuccessPage })));
const FailurePage = React.lazy(() => import('./pages/FailurePage').then((m) => ({ default: m.FailurePage })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));

function ScrollToTop() {
  const location = useLocation();

  const forceTop = React.useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Mobile browsers can re-apply previous scroll position on navigation; re-assert on next frame.
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, []);

  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  React.useEffect(() => {
    const handleInternalLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const internalLink = target?.closest('a[href^="/"]');
      if (!internalLink) return;

      forceTop();
    };

    document.addEventListener('click', handleInternalLinkClick, true);
    return () => document.removeEventListener('click', handleInternalLinkClick, true);
  }, [forceTop]);

  React.useEffect(() => {
    forceTop();
  }, [location.pathname, location.search, location.hash, forceTop]);

  return null;
}

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite" aria-label="Loading page">
        <div className="h-10 w-10 rounded-full border-2 border-blue-500/40 border-t-blue-400 animate-spin" />
      </div>
    </div>
  );
}

function LazyPage({ Component }: { Component: React.LazyExoticComponent<React.ComponentType<any>> }) {
  return (
    <React.Suspense fallback={<RouteFallback />}>
      <Component />
    </React.Suspense>
  );
}

function RootLayout() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col w-full">
        <Outlet />
      </div>
    </AuthProvider>
  );
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      // Public routes
      { index: true, element: <LandingPage /> },
      { path: 'signup', element: <LazyPage Component={SignupPage} /> },
      { path: 'login', element: <LazyPage Component={LoginPage} /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'share/:reportId', element: <LazyPage Component={SharePage} /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'about', element: <AboutPage /> },
      // Protected routes
      {
        Component: ProtectedLayout,
        children: [
          { path: 'dashboard', element: <LazyPage Component={DashboardPage} /> },
          { path: 'upload', element: <LazyPage Component={UploadPage} /> },
          { path: 'process/:id', element: <LazyPage Component={ProcessPage} /> },
          { path: 'result/:id', element: <LazyPage Component={ResultPage} /> },
          { path: 'payment', element: <LazyPage Component={PaymentPage} /> },
          { path: 'success', element: <LazyPage Component={SuccessPage} /> },
          { path: 'failure', element: <LazyPage Component={FailurePage} /> },
          { path: 'profile', element: <LazyPage Component={ProfilePage} /> },
        ],
      },
    ],
  },
]);