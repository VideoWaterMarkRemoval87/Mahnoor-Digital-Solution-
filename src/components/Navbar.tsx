import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { LanguageTranslator } from './LanguageTranslator';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Skills & Tools', path: '/skills' },
    { name: 'Client Request', path: '/client-request' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-[#064946]/95 backdrop-blur-md shadow-lg shadow-[#033B39]/25 border-b border-[#0B706A]/40'
            : 'py-5 bg-[#064946]/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border-b border-white/5 md:border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between" aria-label="Main Navigation">
            {/* Brand Logo */}
            <Link
              id="brand-logo"
              to="/"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] rounded-lg p-1"
            >
              <BrandLogo variant="light" size="md" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-[#033B39]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-inner">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  id={`nav-link-${link.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 relative ${
                      isActive
                        ? 'bg-[#F5A623] text-[#172222] font-semibold shadow-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Right Action CTA */}
            <div className="hidden md:flex items-center gap-2">
              {/* Website Language Translator Widget */}
              <LanguageTranslator variant="navbar" />

              <Link
                id="btn-header-cta"
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-semibold text-sm px-4.5 py-2.5 rounded-full transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F5A623]"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Actions: Language Selector + Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageTranslator variant="compact" />

              <button
                id="btn-mobile-menu-toggle"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-backdrop"
          className="fixed inset-0 z-40 bg-[#033B39]/85 backdrop-blur-md md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            id="mobile-nav-drawer"
            className="fixed top-20 right-4 left-4 max-h-[85vh] overflow-y-auto bg-[#064946] border border-[#0B706A] rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F5A623]" />
                <span className="font-bold text-white tracking-wide">Navigation Menu</span>
              </div>
              <button
                id="btn-close-mobile-drawer"
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Language Switcher */}
            <div className="pb-2">
              <span className="text-[11px] text-white/70 font-semibold uppercase tracking-wider block mb-1.5">
                Select Website Language
              </span>
              <LanguageTranslator variant="drawer" />
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  id={`mobile-link-${link.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-2xl text-base font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-[#F5A623] text-[#172222]'
                        : 'text-white hover:bg-white/10'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </NavLink>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 mt-2">
              <Link
                id="btn-mobile-drawer-cta"
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-sm py-3 px-6 rounded-2xl transition-transform active:scale-[0.98] shadow-lg"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
