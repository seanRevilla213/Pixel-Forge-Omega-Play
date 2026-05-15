import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LogOut, LayoutGrid, Home, MessageSquare, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ResponsiveShow } from './ResponsiveWrapper';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 20);
    if (currentScrollY > lastScrollY && currentScrollY > 80) setIsVisible(false);
    else setIsVisible(true);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => setIsMobileOpen(false), [location]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Shop', icon: LayoutGrid },
    { to: '/contact', label: 'Contact', icon: MessageSquare },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 20 : -100 }}
        transition={{ type: 'spring', stiffness: 120, damping: 25 }}
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl px-6 py-3 rounded-[2rem] transition-all duration-500 ${
          isScrolled ? 'glass-strong shadow-2xl shadow-black/50' : 'glass border-transparent'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-neon-cyan/20">
              <span className="font-heading font-black text-white text-xl">Ω</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading text-sm font-black tracking-widest text-white group-hover:text-neon-cyan transition-colors">
                PIXEL FORGE
              </h1>
              <p className="text-[9px] tracking-[0.4em] text-neon-purple font-bold uppercase">Omega Play</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-xl ${
                  location.pathname === link.to ? 'text-neon-cyan' : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex p-2.5 rounded-xl text-text-secondary hover:text-neon-cyan transition-all">
              <Search size={20} />
            </button>
            
            <Link to="/cart" className="relative p-2.5 rounded-xl text-text-secondary hover:text-neon-cyan transition-all bg-white/5">
              <ShoppingCart size={20} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-neon-pink to-neon-purple text-white text-[9px] font-black rounded-lg flex items-center justify-center shadow-lg"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <ResponsiveShow isNot="mobile">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="p-2.5 rounded-xl text-text-secondary hover:text-neon-cyan transition-all">
                    <User size={20} />
                  </Link>
                  <button onClick={logout} className="p-2.5 rounded-xl text-text-secondary hover:text-neon-pink transition-all">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-cyan/50 rounded-xl text-xs font-black tracking-widest text-white transition-all uppercase">
                  Sign In
                </Link>
              )}
            </ResponsiveShow>

            <ResponsiveShow is="mobile">
              <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2.5 rounded-xl text-text-secondary hover:text-neon-cyan">
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </ResponsiveShow>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-[60] glass-strong rounded-[3rem] flex flex-col p-10 overflow-hidden"
          >
            <div className="scanline" />
            <div className="flex justify-between items-center mb-16">
              <span className="font-heading font-black text-neon-cyan tracking-widest">SYSTEM MENU</span>
              <button onClick={() => setIsMobileOpen(false)} className="p-3 bg-white/5 rounded-2xl text-text-muted">✕</button>
            </div>
            <div className="space-y-8">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="block text-4xl font-heading font-black text-white hover:text-neon-cyan transition-colors tracking-tighter">
                  {link.label}
                </Link>
              ))}
              <div className="pt-10 border-t border-white/10">
                {isAuthenticated ? (
                  <div className="space-y-6">
                    <Link to="/dashboard" className="block text-2xl text-text-secondary font-bold">DASHBOARD</Link>
                    <button onClick={logout} className="text-2xl text-neon-pink font-bold">TERMINATE SESSION</button>
                  </div>
                ) : (
                  <Link to="/login" className="block text-2xl text-neon-cyan font-bold tracking-widest">INITIALIZE AUTH</Link>
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
