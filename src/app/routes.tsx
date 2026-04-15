import React from 'react';
import { createBrowserRouter, Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';
import { SharePage } from './pages/SharePage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AboutPage } from './pages/AboutPage';

// Protected Pages
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { ProcessPage } from './pages/ProcessPage';
import { ResultPage } from './pages/ResultPage';
import { PaymentPage } from './pages/PaymentPage';
import { SuccessPage } from './pages/SuccessPage';
import { FailurePage } from './pages/FailurePage';
import { ProfilePage } from './pages/ProfilePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RootLayout() {
  const location = useLocation();
  return (
    <AuthProvider>
      <ScrollToTop />
      <AnimatePresence>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="min-h-screen flex flex-col w-full"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
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
      { index: true, Component: LandingPage },
      { path: 'signup', Component: SignupPage },
      { path: 'login', Component: LoginPage },
      { path: 'pricing', Component: PricingPage },
      { path: 'share/:reportId', Component: SharePage },
      { path: 'contact', Component: ContactPage },
      { path: 'privacy', Component: PrivacyPage },
      { path: 'about', Component: AboutPage },
      // Protected routes
      {
        Component: ProtectedLayout,
        children: [
          { path: 'dashboard', Component: DashboardPage },
          { path: 'upload', Component: UploadPage },
          { path: 'process/:id', Component: ProcessPage },
          { path: 'result/:id', Component: ResultPage },
          { path: 'payment', Component: PaymentPage },
          { path: 'success', Component: SuccessPage },
          { path: 'failure', Component: FailurePage },
          { path: 'profile', Component: ProfilePage },
        ],
      },
    ],
  },
]);