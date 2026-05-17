import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Star, Layout, Globe, Cpu } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { usePerformance } from '../context/PerformanceContext';
import { AuroraBackground, AmbientGlow } from '../components/ui/ImmersiveEffects';
import api from '../api/axiosInstance';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProductCard } from '../components/ui/ProductCard';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { } = useCart();
  const { isLowEnd } = usePerformance();
  
  const mainRef = useRef(null);
  const heroTextRef = useRef(null);

  useEffect(() => {
    api.get('/products/featured').then(({ data }) => {
      setFeatured(data.products);
      setLoading(false);
    }).catch(() => setLoading(false));

    // GSAP Hero Reveal
    if (!isLowEnd) {
      gsap.fromTo(heroTextRef.current, 
        { opacity: 0, y: 100, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "expo.out" }
      );
    }
  }, [isLowEnd]);

  const { scrollYProgress } = useScroll({ target: mainRef, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <PageTransition>
      <div ref={mainRef} className="relative bg-matte-black min-h-screen">
        <AuroraBackground />
        <AmbientGlow />

        {/* Hero Section */}
        <section className="relative min-h-[110vh] flex items-center justify-center pt-20 px-6">
          <motion.div style={isLowEnd ? {} : { scale, opacity }} className="relative z-10 max-w-7xl mx-auto text-center">
            <div ref={heroTextRef} className="space-y-12">
              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, letterSpacing: "1.0em" }}
                transition={{ duration: isLowEnd ? 0.5 : 2 }}
                className="text-text-secondary text-[10px] font-black uppercase"
              >
                The Architecture of Play
              </motion.div>

              <h1 className="font-heading font-black tracking-tight leading-[0.85] text-white" 
                  style={{ fontSize: 'var(--font-size-fluid-h1)' }}>
                PIXEL<br />
                <span className="bg-gradient-to-r from-luxury-violet via-white to-luxury-cyan bg-clip-text text-transparent italic px-4">FORGE</span>
              </h1>

              <p className="max-w-2xl mx-auto text-text-secondary font-medium leading-relaxed opacity-80" 
                 style={{ fontSize: 'var(--font-size-fluid-body)' }}>
                Redefining the digital frontier through a luxury interactive glasswave aesthetic. 
                Experience elite performance wrapped in cinematic elegance.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
                <Link to="/products" className="luxury-btn min-w-[280px]">
                  <span>ACCESS COLLECTIONS</span>
                  <ArrowRight size={20} />
                </Link>
                <Link to="/contact" className="text-white font-bold tracking-widest text-xs uppercase hover:text-luxury-cyan transition-colors flex items-center gap-2 group text-center">
                  REQUEST CUSTOM BUILD <Layout size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Floating Element */}
          <motion.div 
            animate={isLowEnd ? { y: 0 } : { y: [0, -40, 0] }}
            transition={isLowEnd ? {} : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-[10%] w-[400px] h-[400px] glasswave rounded-full opacity-20 hidden lg:block"
          />
        </section>

        {/* Asymmetric Product Showcase */}
        <section className="py-40 px-6 relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-10">
              <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
                <h2 className="font-heading font-black text-white leading-none mb-8" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
                  ELEVATED <span className="text-luxury-violet">ESSENTIALS</span>
                </h2>
                <p className="text-text-secondary font-medium">Every piece is hand-selected and verified through our elite quality protocols.</p>
              </div>
              <div className="flex gap-4 mx-auto lg:mx-0">
                <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div style={{ scaleX: scrollYProgress }} className="h-full bg-luxury-cyan origin-left" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glasswave rounded-[3rem] h-[500px] animate-pulse" />
                ))
              ) : (
                featured?.map((product, i) => (
                  <ProductCard key={product?.id || i} product={product} index={i} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Cinematic Experience Block */}
        <section className="py-60 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-violet/[0.03] to-transparent" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex flex-wrap justify-center gap-12 sm:gap-16 mb-20 opacity-30">
                <Zap size={32} />
                <ShieldCheck size={32} />
                <Star size={32} />
                <Globe size={32} />
                <Cpu size={32} />
              </div>
              <h2 className="font-heading font-black text-white leading-tight" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
                THE <span className="italic text-luxury-cyan">INTERACTIVE</span> STANDARD
              </h2>
              <p className="text-text-secondary text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                We believe gaming is the pinnacle of human-machine interaction. Our platform reflects that ambition through sophisticated glasswave architecture and unparalleled fluid motion.
              </p>
              <div className="pt-10">
                <Link to="/register" className="luxury-btn mx-auto max-w-[320px] text-center">
                  JOIN THE OMEGA ELITE
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
