import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Star, ShoppingCart, Gamepad2, Keyboard, Headphones, Mouse, Cpu } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAnimationSettings } from '../hooks/useResponsive';
import { MouseGlow, FloatingParticles } from '../components/ui/ImmersiveEffects';
import api from '../api/axiosInstance';

const Landing = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const anim = useAnimationSettings();
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    api.get('/products/featured').then(({ data }) => {
      setFeatured(data.products);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = [
    { name: 'Playstation Controllers', icon: Gamepad2, color: 'neon-cyan' },
    { name: 'Xbox Controllers', icon: Gamepad2, color: 'neon-purple' },
    { name: 'Gaming Keyboards', icon: Keyboard, color: 'neon-pink' },
    { name: 'Gaming Mouse', icon: Mouse, color: 'neon-blue' },
    { name: 'Gaming Headsets', icon: Headphones, color: 'neon-cyan' },
    { name: 'Gaming Accessories', icon: Cpu, color: 'neon-purple' },
  ];

  return (
    <PageTransition>
      <div className="relative bg-dark-navy min-h-screen overflow-x-hidden">
        <MouseGlow />
        <FloatingParticles />
        <div className="scanline" />

        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-dark-navy" />
            
            {/* Floating Hero Elements */}
            <motion.div 
              animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[20%] right-[10%] opacity-20 lg:opacity-40"
            >
              <Gamepad2 size={300} className="text-neon-cyan blur-sm" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[15%] left-[5%] opacity-10 lg:opacity-30"
            >
              <Keyboard size={250} className="text-neon-pink blur-md" />
            </motion.div>
          </motion.div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 * anim.intensity, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                animate={{ opacity: 1, letterSpacing: "0.5em" }}
                className="text-neon-cyan text-[10px] sm:text-xs font-black uppercase mb-6"
              >
                Welcome to the Future of Play
              </motion.div>

              <h1 className="font-heading font-black tracking-tighter leading-[0.9] mb-8" 
                  style={{ fontSize: 'var(--font-size-fluid-h1)' }}>
                <span className="text-white">PIXEL </span>
                <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(188,19,254,0.3)]">
                  FORGE
                </span>
                <br />
                <span className="text-white/80 opacity-90" style={{ fontSize: '0.5em' }}>OMEGA PLAY</span>
              </h1>

              <p className="max-w-2xl mx-auto text-text-secondary font-medium leading-relaxed mb-12" 
                 style={{ fontSize: 'var(--font-size-fluid-body)' }}>
                The luxury gaming store for the elite. Frosted glass, neon glows, and next-gen hardware. 
                Experience immersive shopping like never before.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/products" className="neon-btn min-w-[220px]">
                  <span>INITIALIZE SHOP</span>
                  <ChevronRight size={18} />
                </Link>
                <Link to="/products" className="glass px-10 py-4 rounded-2xl text-white font-bold tracking-widest text-xs hover:bg-white/10 transition-all border-white/5 uppercase">
                  VIEW COLLECTIONS
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-text-muted"
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/10 flex justify-center pt-2">
              <div className="w-1 h-2 bg-neon-cyan rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* Categories Section */}
        <section className="py-32 relative px-6 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-6 rounded-[2rem] flex flex-col items-center gap-4 group cursor-pointer hover:border-neon-cyan/50 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${cat.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <cat.icon className={`text-${cat.color}`} size={24} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-center text-text-secondary group-hover:text-white transition-colors">{cat.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-32 relative px-6 z-10 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="font-heading font-black text-white leading-tight" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
                  ELITE <span className="text-neon-cyan">HARDWARE</span>
                </h2>
                <p className="text-text-muted font-bold tracking-widest uppercase text-xs mt-2">Curated for top-tier performance</p>
              </div>
              <Link to="/products" className="text-neon-cyan font-black tracking-widest text-xs uppercase hover:text-neon-pink transition-colors">
                FULL INVENTORY →
              </Link>
            </div>

            <div className="responsive-grid">
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="glass rounded-[2rem] h-[450px] animate-pulse overflow-hidden">
                    <div className="h-64 bg-white/5" />
                  </div>
                ))
              ) : (
                featured.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group glass-card overflow-hidden h-full flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden bg-white/5">
                      <motion.img 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.8 }}
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-navy to-transparent opacity-60" />
                      {product.badge && (
                        <div className="absolute top-6 right-6 rgb-border bg-dark-navy/80 px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest">
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] text-neon-cyan font-black tracking-widest uppercase">{product.category}</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <div className="flex items-center gap-1 text-[10px] text-neon-purple font-black">
                          <Star size={10} fill="currentColor" /> {product.rating}
                        </div>
                      </div>
                      <h3 className="font-heading text-xl font-black text-white mb-6 group-hover:text-neon-cyan transition-colors">{product.name}</h3>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-3xl font-heading font-black text-white">${product.price.toFixed(2)}</span>
                          {product.original_price && <span className="text-[10px] text-text-muted line-through font-bold">${product.original_price.toFixed(2)}</span>}
                        </div>
                        <button 
                          onClick={() => addItem(product)}
                          className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-neon-cyan hover:text-dark-navy transition-all duration-500 shadow-xl"
                        >
                          <ShoppingCart size={22} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Experience CTA */}
        <section className="py-40 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[4rem] overflow-hidden p-12 lg:p-24 text-center"
            >
              <div className="absolute inset-0 glass-strong" />
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10" />
              <div className="relative z-10">
                <h2 className="font-heading font-black text-white mb-6 leading-tight" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
                  UNLEASH <span className="text-neon-pink">POWER</span>
                </h2>
                <p className="text-text-secondary text-lg mb-12 max-w-2xl mx-auto font-medium">
                  Join the elite league of gamers. Get exclusive access to limited edition hardware and zero-latency gear.
                </p>
                <Link to="/register" className="neon-btn mx-auto max-w-[300px]">
                  CREATE YOUR ID
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Landing;
