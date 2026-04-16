import React from 'react';
import { Link, createBrowserRouter, isRouteErrorResponse, Outlet, useLocation, useRouteError } from 'react-router';
import { AlertTriangle, Home, RefreshCw, Search } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicFooter } from './components/PublicFooter';
import { PublicNavbar } from './components/PublicNavbar';
import { Seo, type SeoProps } from './components/Seo';
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';

const LAZY_RETRY_FLAG = 'contractcheck-lazy-retry-once';
const DYNAMIC_IMPORT_FAILURE_RE = /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk [\w-]+ failed|ChunkLoadError/i;

type LazyModule = { default: React.ComponentType<any> };

function lazyWithRefreshRetry(loader: () => Promise<LazyModule>) {
  return async (): Promise<LazyModule> => {
    try {
      const module = await loader();

      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(LAZY_RETRY_FLAG);
      }

      return module;
    } catch (error) {
      if (
        typeof window !== 'undefined' &&
        error instanceof Error &&
        DYNAMIC_IMPORT_FAILURE_RE.test(error.message)
      ) {
        const alreadyRetried = window.sessionStorage.getItem(LAZY_RETRY_FLAG) === '1';

        if (!alreadyRetried) {
          window.sessionStorage.setItem(LAZY_RETRY_FLAG, '1');
          window.location.reload();
          return new Promise<never>(() => undefined);
        }
      }

      throw error;
    }
  };
}

const SignupPage = React.lazy(lazyWithRefreshRetry(() => import('./pages/SignupPage').then((m) => ({ default: m.SignupPage }))));
const LoginPage = React.lazy(lazyWithRefreshRetry(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage }))));
const SharePage = React.lazy(lazyWithRefreshRetry(() => import('./pages/SharePage').then((m) => ({ default: m.SharePage }))));

const DashboardPage = React.lazy(lazyWithRefreshRetry(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))));
const UploadPage = React.lazy(lazyWithRefreshRetry(() => import('./pages/UploadPage').then((m) => ({ default: m.UploadPage }))));
const ProcessPage = React.lazy(lazyWithRefreshRetry(() => import('./pages/ProcessPage').then((m) => ({ default: m.ProcessPage }))));
const ResultPage = React.lazy(lazyWithRefreshRetry(() => import('./pages/ResultPage').then((m) => ({ default: m.ResultPage }))));
const PaymentPage = React.lazy(lazyWithRefreshRetry(() => import('./pages/PaymentPage').then((m) => ({ default: m.PaymentPage }))));
const SuccessPage = React.lazy(lazyWithRefreshRetry(() => import('./pages/SuccessPage').then((m) => ({ default: m.SuccessPage }))));
const FailurePage = React.lazy(lazyWithRefreshRetry(() => import('./pages/FailurePage').then((m) => ({ default: m.FailurePage }))));
const ProfilePage = React.lazy(lazyWithRefreshRetry(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))));

function isDynamicImportError(error: unknown) {
  if (!(error instanceof Error)) return false;

  return DYNAMIC_IMPORT_FAILURE_RE.test(error.message);
}

function getRouteErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected routing error occurred.';
}

function RouteErrorBoundary() {
  const error = useRouteError();
  const dynamicImportError = isDynamicImportError(error);

  return (
    <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-[640px] rounded-2xl border border-white/[0.08] bg-[#0B0B0E] p-6 sm:p-8 text-center">
        <div className="mx-auto mb-5 h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center">
          <AlertTriangle size={22} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          {dynamicImportError ? 'App Updated - Reload Required' : 'Unexpected Application Error'}
        </h1>

        <p className="text-slate-300 mb-2">
          {dynamicImportError
            ? 'A newer deployment is available. Reload the page to fetch the latest app files.'
            : 'Something went wrong while loading this route.'}
        </p>

        <p className="text-xs sm:text-sm text-slate-500 break-all mb-6">{getRouteErrorMessage(error)}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            <RefreshCw size={16} /> Reload App
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.12] text-slate-200 hover:bg-white/5 transition-colors"
          >
            <Home size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-blue-500/30">
      <PublicNavbar />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl sm:h-96 sm:w-96" />
          <div className="absolute bottom-8 right-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <section className="relative max-w-[900px] mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="mx-auto mb-6 h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 flex items-center justify-center">
            <Search size={24} />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300/80 mb-3">Page Not Found</p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">404</h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-[560px] mx-auto mb-8">
            The page you requested does not exist or may have been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
            >
              <Home size={16} /> Go to Home
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/[0.12] text-slate-200 hover:bg-white/5 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

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
    const handleInternalLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const internalLink = target?.closest('a[href^="/"]');
      if (!internalLink) return;

      forceTop();
    };

    document.addEventListener('click', handleInternalLinkClick, true);
    return () => document.removeEventListener('click', handleInternalLinkClick, true);
  }, [forceTop]);

  React.useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  React.useLayoutEffect(() => {
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
  function RouteSeo() {
    const { pathname } = useLocation();
    const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
    const toAbsoluteUrl = (path: string) => `${siteUrl}${path}`;

    const baseKeywords = 'contract compliance checker, indian law compliance, dpdp act compliance, gst contract review, legal ai india';
    const indexablePaths = new Set(['/','/pricing','/about','/contact','/privacy']);

    const noIndexRoutes = [
      '/login',
      '/signup',
      '/dashboard',
      '/upload',
      '/process/',
      '/result/',
      '/payment',
      '/success',
      '/failure',
      '/profile',
      '/share/',
    ];

    const matchesNoIndexRoute = noIndexRoutes.some((route) => (
      route.endsWith('/') ? pathname.startsWith(route) : pathname === route
    ));

    const baseStructuredData: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ContractCheck AI',
      url: siteUrl,
      logo: toAbsoluteUrl('/favicon.png'),
    };

    let seo: SeoProps = {
      title: 'ContractCheck AI | AI Contract Compliance Checker for Indian Businesses',
      description: 'Analyze contracts against DPDP Act, GST, Indian Contract Act, and labour laws with AI-powered clause risk detection and fix suggestions.',
      canonicalPath: pathname,
      keywords: baseKeywords,
      noIndex: matchesNoIndexRoute || !indexablePaths.has(pathname),
      structuredData: baseStructuredData,
    };

    if (pathname === '/') {
      seo = {
        title: 'AI Contract Compliance Checker for Indian Businesses | ContractCheck AI',
        description: 'Review contracts in minutes with AI-powered compliance checks for DPDP Act, GST, Contract Act, and labour laws.',
        canonicalPath: '/',
        keywords: `${baseKeywords}, ai contract checker india, contract risk scoring`,
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'ContractCheck AI',
            url: siteUrl,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'ContractCheck AI',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            url: siteUrl,
            description: 'AI-powered contract compliance checker for Indian businesses.',
          },
        ],
      };
    } else if (pathname === '/pricing') {
      seo = {
        title: 'Pricing | ContractCheck AI',
        description: 'Choose the right ContractCheck AI plan for startups, legal teams, and enterprises needing Indian contract compliance automation.',
        canonicalPath: '/pricing',
        keywords: `${baseKeywords}, contract compliance pricing`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'ContractCheck AI Pricing',
          url: toAbsoluteUrl('/pricing'),
          isPartOf: {
            '@type': 'WebSite',
            name: 'ContractCheck AI',
            url: siteUrl,
          },
        },
      };
    } else if (pathname === '/about') {
      seo = {
        title: 'About ContractCheck AI',
        description: 'Learn how ContractCheck AI helps businesses reduce legal risk by checking contract clauses against Indian regulations.',
        canonicalPath: '/about',
        keywords: `${baseKeywords}, about contractcheck ai`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About ContractCheck AI',
          url: toAbsoluteUrl('/about'),
          isPartOf: {
            '@type': 'WebSite',
            name: 'ContractCheck AI',
            url: siteUrl,
          },
        },
      };
    } else if (pathname === '/contact') {
      seo = {
        title: 'Contact ContractCheck AI',
        description: 'Get in touch with ContractCheck AI for support, product inquiries, and enterprise deployment questions.',
        canonicalPath: '/contact',
        keywords: `${baseKeywords}, contact contractcheck ai`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact ContractCheck AI',
          url: toAbsoluteUrl('/contact'),
        },
      };
    } else if (pathname === '/privacy') {
      seo = {
        title: 'Privacy Policy | ContractCheck AI',
        description: 'Read the ContractCheck AI privacy policy to understand how your contracts and personal data are handled securely.',
        canonicalPath: '/privacy',
        keywords: `${baseKeywords}, privacy policy`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy | ContractCheck AI',
          url: toAbsoluteUrl('/privacy'),
        },
      };
    } else if (matchesNoIndexRoute) {
      seo = {
        ...seo,
        noIndex: true,
      };
    }

    return <Seo {...seo} />;
  }

  return (
    <AuthProvider>
      <RouteSeo />
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
    errorElement: <RouteErrorBoundary />,
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
      { path: '*', element: <NotFoundPage /> },
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