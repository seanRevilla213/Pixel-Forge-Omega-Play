import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LogOut, LayoutGrid, Home, MessageSquare, Search, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { usePerformance } from '../../context/PerformanceContext';
import { ResponsiveShow } from './ResponsiveWrapper';
import { CartSidebar } from './CartSidebar';
import pixelForgeLogo from '../../assets/logo-pixel-forge.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { performanceMode, setPerformanceMode } = usePerformance();
  const location = useLocation();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 20);
    if (currentScrollY > lastScrollY && currentScrollY > 100) setIsVisible(false);
    else setIsVisible(true);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => setIsMobileOpen(false), [location]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const navLinks = [
    { to: '/', label: 'HOME', icon: Home },
    { to: '/products', label: 'INVENTORY', icon: LayoutGrid },
    { to: '/contact', label: 'SUPPORT', icon: MessageSquare },
  ];

  const perfLabel =
    performanceMode === 'performance' ? 'SYSTEM: LITE'
    : performanceMode === 'premium' ? 'SYSTEM: ULTRA'
    : 'SYSTEM: AUTO';

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/*
        Outer band: full viewport width, no overflow-x, handles show/hide animation.
        The pill appearance lives on the inner container.
      */}
      <header role="banner">
        <motion.nav
          aria-label="Main navigation"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: isVisible ? 0 : -120, opacity: isVisible ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          style={{ overflow: 'hidden' }}
          className="fixed top-0 left-0 right-0 z-50 w-full pt-4 px-4 sm:px-6 lg:px-8"
        >
          {/*
            Inner pill container:
            - max-w-7xl + mx-auto keeps content centred on wide screens
            - clamp-based px ensures consistent padding at every breakpoint
            - items-center + h ensures all icons/text stay vertically centred
          */}
          <div
            className={`
              relative flex items-center justify-between
              max-w-7xl mx-auto
              px-5 sm:px-7 lg:px-9
              py-3.5
              rounded-3xl
              transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
              ${isScrolled ? 'glasswave-strong shadow-2xl backdrop-blur-3xl' : 'bg-transparent border-transparent'}
            `}
          >
            {/* ── Logo ── */}
            <Link to="/" aria-label="Pixel Forge Omega Play — Home" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 overflow-hidden">
                <img
                  src={pixelForgeLogo}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="hidden sm:block leading-none">
                <span className="font-heading text-sm font-black tracking-[0.3em] text-white block">
                  PIXEL<span className="text-luxury-violet">FORGE</span>
                </span>
                <p className="text-[8px] tracking-[0.4em] text-luxury-cyan font-bold uppercase opacity-80">Omega Play Store</p>
              </div>
            </Link>

            {/* ── Desktop Nav Links — absolutely centred inside the pill ── */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={location.pathname === link.to ? 'page' : undefined}
                  className={`relative text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 hover:text-white whitespace-nowrap ${
                    location.pathname === link.to ? 'text-white' : 'text-text-secondary'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-luxury-violet to-luxury-cyan shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 shrink-0">

              {/* System Performance Mode Toggle */}
              <button
                onClick={() => {
                  const nextMode = performanceMode === 'premium'
                    ? 'performance'
                    : performanceMode === 'performance'
                      ? 'auto'
                      : 'premium';
                  setPerformanceMode(nextMode);
                }}
                aria-label={`Toggle system performance mode. Current: ${perfLabel}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 text-[9px] font-black tracking-widest uppercase cursor-pointer hover:scale-105 active:scale-95 select-none ${
                  performanceMode === 'performance'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : performanceMode === 'premium'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                }`}
              >
                <Cpu size={12} aria-hidden="true" className={performanceMode === 'performance' ? 'animate-pulse' : ''} />
                <span className="hidden lg:inline" aria-hidden="true">
                  {perfLabel}
                </span>
              </button>

              {/* Search — hidden on xs */}
              <button
                aria-label="Search"
                className="hidden sm:flex items-center text-text-secondary hover:text-white transition-colors"
              >
                <Search size={18} aria-hidden="true" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label={itemCount > 0 ? `Open cart — ${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Open cart'}
                className="relative text-text-secondary hover:text-white transition-all group"
              >
                <ShoppingCart size={20} aria-hidden="true" className="group-hover:scale-110 transition-transform" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      key={itemCount}
                      aria-hidden="true"
                      className="absolute -top-2 -right-2 w-5 h-5 bg-white text-matte-black text-[9px] font-black rounded-full flex items-center justify-center shadow-xl"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Login / User — desktop only */}
              <ResponsiveShow isNot="mobile">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                    <Link
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                      aria-label={user?.role === 'admin' ? 'Admin dashboard' : 'User dashboard'}
                      className="text-text-secondary hover:text-white transition-all"
                    >
                      <User size={20} aria-hidden="true" />
                    </Link>
                    <button
                      onClick={logout}
                      aria-label="Log out"
                      className="text-text-secondary hover:text-red-400 transition-all"
                    >
                      <LogOut size={20} aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="px-6 py-2.5 bg-white text-matte-black hover:bg-opacity-90 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase text-center whitespace-nowrap"
                  >
                    LOGIN
                  </Link>
                )}
              </ResponsiveShow>

              {/* Hamburger — mobile only */}
              <ResponsiveShow is="mobile">
                <button
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                  aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileOpen}
                  aria-controls="mobile-nav"
                  className="text-text-secondary hover:text-white transition-colors p-1"
                >
                  {isMobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                </button>
              </ResponsiveShow>
            </div>
          </div>
        </motion.nav>
      </header>

      {/* ── Mobile Full-Screen Overlay ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[60] bg-matte-black/40 flex flex-col items-center justify-center p-12"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-10 right-10 p-4 glasswave rounded-full text-white"
            >
              ✕
            </button>
            <div className="space-y-12 text-center w-full max-w-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={location.pathname === link.to ? 'page' : undefined}
                  className="block text-5xl font-heading font-black text-white hover:text-luxury-cyan transition-all tracking-tighter"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="py-6 px-6 glasswave rounded-3xl border border-white/10 flex flex-col items-center gap-4">
                <span className="text-[9px] font-black tracking-widest text-text-muted uppercase">SYSTEM PREFERENCE</span>
                <div className="flex gap-2" role="group" aria-label="System performance mode">
                  {(['premium', 'performance', 'auto'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPerformanceMode(mode)}
                      aria-pressed={performanceMode === mode}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all ${
                        performanceMode === mode
                          ? 'bg-white text-black font-black'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setIsMobileOpen(false); }}
                    className="text-xl text-red-400 font-bold tracking-widest uppercase"
                  >
                    TERMINATE SESSION
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="text-xl text-luxury-cyan font-bold tracking-[0.2em] uppercase"
                  >
                    LOGIN
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
