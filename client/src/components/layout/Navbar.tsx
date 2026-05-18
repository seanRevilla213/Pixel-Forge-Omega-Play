import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LogOut, LayoutGrid, Home, MessageSquare, Search, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { usePerformance } from '../../context/PerformanceContext';
import { ResponsiveShow } from './ResponsiveWrapper';
import { CartSidebar } from './CartSidebar';

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

  const navLinks = [
    { to: '/', label: 'HOME', icon: Home },
    { to: '/products', label: 'INVENTORY', icon: LayoutGrid },
    { to: '/contact', label: 'SUPPORT', icon: MessageSquare },
  ];

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isVisible ? 20 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl px-8 py-4 rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isScrolled ? 'glasswave-strong shadow-2xl backdrop-blur-3xl' : 'bg-transparent border-transparent'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Minimal Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 overflow-hidden">
              <img 
                src="https://images.mirror.co.uk/mirror/xbox-360-controller.jpg" 
                alt="Pixel Forge Logo" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading text-sm font-black tracking-[0.3em] text-white">
                PIXEL<span className="text-luxury-violet">FORGE</span>
              </h1>
              <p className="text-[8px] tracking-[0.4em] text-luxury-cyan font-bold uppercase opacity-80">Omega Play Store</p>
            </div>
          </Link>

          {/* Luxury Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 hover:text-white ${
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

          {/* Actions */}
          <div className="flex items-center gap-6">
            {/* System Performance Mode Switcher */}
            <button 
              onClick={() => {
                const nextMode = performanceMode === 'premium' 
                  ? 'performance' 
                  : performanceMode === 'performance' 
                    ? 'auto' 
                    : 'premium';
                setPerformanceMode(nextMode);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 text-[9px] font-black tracking-widest uppercase cursor-pointer hover:scale-105 active:scale-95 select-none ${
                performanceMode === 'performance' 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                  : performanceMode === 'premium'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}
              title="Toggle system visuals to save RAM and processor overhead"
            >
              <Cpu size={12} className={performanceMode === 'performance' ? 'animate-pulse' : ''} />
              <span className="hidden sm:inline">
                {performanceMode === 'performance' 
                  ? 'SYSTEM: LITE' 
                  : performanceMode === 'premium'
                    ? 'SYSTEM: ULTRA'
                    : 'SYSTEM: AUTO'}
              </span>
            </button>

            <button className="hidden sm:block text-text-secondary hover:text-white transition-colors">
              <Search size={18} />
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-text-secondary hover:text-white transition-all group"
            >
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    exit={{ scale: 0 }}
                    key={itemCount} // Triggers animation on count change
                    className="absolute -top-2 -right-2 w-5 h-5 bg-white text-matte-black text-[9px] font-black rounded-full flex items-center justify-center shadow-xl"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <ResponsiveShow isNot="mobile">
              {isAuthenticated ? (
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="text-text-secondary hover:text-white transition-all">
                    <User size={20} />
                  </Link>
                  <button onClick={logout} className="text-text-secondary hover:text-red-400 transition-all">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="px-8 py-2.5 bg-white text-matte-black hover:bg-opacity-90 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase text-center">
                  ENTER
                </Link>
              )}
            </ResponsiveShow>

            <ResponsiveShow is="mobile">
              <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-text-secondary hover:text-white">
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </ResponsiveShow>
          </div>
        </div>
      </motion.nav>

      {/* Luxury Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[60] bg-matte-black/40 flex flex-col items-center justify-center p-12"
          >
            <button onClick={() => setIsMobileOpen(false)} className="absolute top-10 right-10 p-4 glasswave rounded-full text-white">✕</button>
            <div className="space-y-12 text-center w-full max-w-sm">
              {navLinks.map((link) => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className="block text-5xl font-heading font-black text-white hover:text-luxury-cyan transition-all tracking-tighter"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="py-6 px-6 glasswave rounded-3xl border border-white/10 flex flex-col items-center gap-4">
                <span className="text-[9px] font-black tracking-widest text-text-muted uppercase">SYSTEM PREFERENCE</span>
                <div className="flex gap-2">
                  {(['premium', 'performance', 'auto'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPerformanceMode(mode)}
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
                  <button onClick={() => { logout(); setIsMobileOpen(false); }} className="text-xl text-red-400 font-bold tracking-widest uppercase">TERMINATE SESSION</button>
                ) : (
                  <Link to="/login" className="text-xl text-luxury-cyan font-bold tracking-[0.2em] uppercase">SYSTEM AUTH</Link>
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
