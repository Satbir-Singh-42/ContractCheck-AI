import React from 'react';
import { Link, useLocation } from 'react-router';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../context/AuthContext';

function BrandLogo({ size = 24 }: { size?: number }) {
  return (
    <div
      className="rounded-lg bg-blue-600 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <Shield size={size * 0.6} className="text-white" />
    </div>
  );
}

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About Us' },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const { user } = useAuth();

  React.useEffect(() => {
    let rafId = 0;

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const nextScrolled = window.scrollY > 20;
        setScrolled(prev => (prev === nextScrolled ? prev : nextScrolled));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b transition-colors duration-200',
      scrolled
        ? 'border-white/[0.08] bg-[#060608]/95 md:backdrop-blur-xl md:shadow-lg md:shadow-black/20'
        : 'border-transparent bg-transparent'
    )}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <BrandLogo size={28} />
          <span className="font-bold text-lg tracking-tight">ContractCheck</span>
          <span className="hidden sm:inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 text-[10px] font-semibold uppercase tracking-wider">
            AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/5',
                location.pathname === link.to
                  ? 'text-white bg-white/10'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="hidden sm:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
              Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                Sign in
              </Link>
              <Link to="/signup" className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
                Get Started Free
              </Link>
            </>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#060608]">
          <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'text-sm font-medium transition-colors px-4 py-3 rounded-lg',
                  location.pathname === link.to
                    ? 'text-white bg-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/[0.06] mt-2 pt-3 flex flex-col gap-2">
              {user ? (
                <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-full text-sm font-semibold transition-all text-center flex items-center justify-center gap-2">
                  Go to Dashboard <ArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-3 rounded-lg hover:bg-white/5">
                    Sign in
                  </Link>
                  <Link to="/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-full text-sm font-semibold transition-all text-center">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}