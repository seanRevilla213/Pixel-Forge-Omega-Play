import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiGrid, FiHome, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useResponsive } from '../../hooks/useResponsive';
import { ResponsiveShow } from './ResponsiveWrapper';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const { device } = useResponsive();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Scrolled state for styling
    setIsScrolled(currentScrollY > 20);

    // Visibility state (hide on scroll down, show on scroll up)
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => setIsMobileOpen(false), [location]);

  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/products', label: 'Shop', icon: FiGrid },
    { to: '/contact', label: 'Contact', icon: FiMessageSquare },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ type: 'spring', stiffness: 120, damping: 25 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass-strong shadow-lg shadow-black/30' : 'bg-transparent'
        }`}
      >
        <div className={`mx-auto px-4 sm:px-6 lg:px-12 ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <span className="font-heading font-bold text-dark-900 text-lg">P</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading text-sm font-bold tracking-wider text-text-primary group-hover:text-neon-cyan transition-colors">
                  PIXEL FORGE
                </h1>
                <p className="text-[10px] tracking-[0.3em] text-neon-cyan/60 uppercase">Omega Play</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-6 py-2 text-sm font-medium tracking-wide transition-colors duration-300 rounded-lg ${
                    location.pathname === link.to ? 'text-neon-cyan' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <Link to="/cart" className="relative p-2.5 rounded-xl text-text-secondary hover:text-neon-cyan transition-all">
                <FiShoppingCart size={22} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-neon-magenta text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-dark-900"
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <ResponsiveShow isNot="mobile">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-neon-cyan hover:bg-white/5 transition-all">
                      {user?.role === 'admin' ? <FiGrid size={16} /> : <FiUser size={16} />}
                      <span className="max-w-[100px] truncate">{user?.username}</span>
                    </Link>
                    <button onClick={logout} className="p-2.5 rounded-xl text-text-secondary hover:text-neon-red transition-all">
                      <FiLogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 hover:from-neon-cyan/30 hover:to-neon-magenta/30 border border-neon-cyan/30 rounded-xl text-sm font-medium text-neon-cyan transition-all btn-hover-lift">
                    <FiUser size={16} /> Sign In
                  </Link>
                )}
              </ResponsiveShow>

              <ResponsiveShow is="mobile">
                <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2.5 rounded-xl text-text-secondary hover:text-neon-cyan">
                  {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </ResponsiveShow>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation (Better Ergonomics) */}
      <ResponsiveShow is="mobile">
        <nav className="fixed bottom-0 left-0 right-0 h-16 glass-strong border-t border-glass-border z-50 px-6 flex items-center justify-between">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === link.to ? 'text-neon-cyan' : 'text-text-muted'}`}>
              <link.icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{link.label}</span>
            </Link>
          ))}
          <Link to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/login'} className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/login' || location.pathname === '/dashboard' ? 'text-neon-cyan' : 'text-text-muted'}`}>
            <FiUser size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{isAuthenticated ? 'Profile' : 'Auth'}</span>
          </Link>
        </nav>
      </ResponsiveShow>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-dark-900/95 flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-heading font-bold text-neon-cyan">MENU</span>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 text-text-muted">✕</button>
            </div>
            <div className="space-y-6">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="block text-3xl font-heading font-bold text-text-primary hover:text-neon-cyan transition-colors">
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-glass-border">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="block text-xl text-text-secondary mb-4">My Dashboard</Link>
                    <button onClick={logout} className="text-xl text-neon-red">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="block text-xl text-neon-cyan">Sign In</Link>
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
