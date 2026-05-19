import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Monitor, Tag, ArrowLeft, Plus, Minus, ShieldCheck, Zap, Sparkles, Loader2, Check } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useResponsive } from '../hooks/useResponsive';
import { AuroraBackground, AmbientGlow } from '../components/ui/ImmersiveEffects';
import api from '../api/axiosInstance';
import gsap from 'gsap';

import { PremiumControllerShowcase } from '../components/product/PremiumControllerShowcase';
import { PremiumKeyboardShowcase } from '../components/product/PremiumKeyboardShowcase';

import { productsData } from '../data/products';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem, formatPHP } = useCart();
  const { device, isMobile } = useResponsive();
  const contentRef = useRef(null);

  useEffect(() => {
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data.product);
      setLoading(false);
    }).catch(() => {
      console.warn("Product details API call failed. Using local static fallback data.");
      const match = productsData.find(p => p.slug === slug);
      setProduct(match || null);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (!loading && contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1, ease: "expo.out" }
      );
    }
  }, [loading]);

  const handleAdd = () => {
    if (!product) return;
    setAdding(true);
    setTimeout(() => {
      for (let i = 0; i < quantity; i++) addItem(product);
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-matte-black pt-40 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-[50vh]">
          <Loader2 size={48} className="animate-spin text-luxury-cyan" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  if (product.category === 'Controllers') {
    return (
      <PageTransition>
        <PremiumControllerShowcase product={product} />
      </PageTransition>
    );
  }

  if (product.category === 'Mechanical Keyboards') {
    return (
      <PageTransition>
        <PremiumKeyboardShowcase product={product} />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="relative bg-matte-black min-h-screen pt-40 pb-32 px-6 overflow-hidden">
      <AuroraBackground />
      <AmbientGlow />

      <div className={`mx-auto relative z-10 ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
        <Link to="/products" className="inline-flex items-center gap-4 text-text-secondary hover:text-white transition-all mb-16 text-[10px] font-black uppercase tracking-[0.4em] group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO CATALOG
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32 items-start">
          {/* Minimal Image Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 1.2,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="relative rounded-[4rem] overflow-hidden glasswave-strong aspect-square group"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-matte-black/60 via-transparent to-transparent opacity-40" />


            {product.badge && (
              <div className="absolute top-10 right-10 glasswave-strong px-6 py-2 rounded-2xl text-[9px] font-black tracking-[0.4em] text-white uppercase shadow-2xl">
                {product.badge}
              </div>
            )}
          </motion.div>

          {/* Elegant Info Architecture */}
          <div ref={contentRef} className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black tracking-widest text-luxury-cyan uppercase">{product.category}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5 text-[10px] font-black text-luxury-violet uppercase tracking-widest">
                  <Star size={14} fill="currentColor" /> {product.rating} RATING
                </div>
              </div>
              <h1 className="font-heading font-black text-white leading-none tracking-tight" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
                {product.name}
              </h1>
              <p className="text-text-secondary leading-relaxed font-medium text-lg opacity-80">
                {product.description}
              </p>

            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="glasswave rounded-[2.5rem] p-8 space-y-4 group hover:bg-white/5 transition-all">
                <Monitor size={24} className="text-luxury-cyan group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-1">Architecture</p>
                  <p className="text-sm font-black text-white uppercase tracking-widest">{product.platform}</p>
                </div>
              </div>
              <div className="glasswave rounded-[2.5rem] p-8 space-y-4 group hover:bg-white/5 transition-all">
                <Tag size={24} className="text-luxury-violet group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-1">Class</p>
                  <p className="text-sm font-black text-white uppercase tracking-widest">{product.genre}</p>
                </div>
              </div>
            </div>

            {/* Purchase Console */}
            <div className={`${isMobile ? 'fixed bottom-0 left-0 right-0 p-8 glasswave-strong z-50 rounded-t-[4rem] border-t border-white/10' : 'glasswave-strong rounded-[3.5rem] p-12 shadow-2xl border border-white/5'}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-12">
                <div className="text-center sm:text-left">
                  <p className="text-[9px] text-text-muted font-black tracking-[0.4em] uppercase mb-3">Unit Valuation</p>
                  <div className="flex items-center gap-6 justify-center sm:justify-start">
                    <span className="font-heading text-6xl font-black text-white tracking-tighter">
                      {formatPHP(product.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full sm:w-auto">
                  <div className="flex items-center glasswave rounded-2xl h-16 border-white/5">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-16 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors"><Minus size={20} /></button>
                    <span className="px-6 font-black text-xl text-white min-w-[60px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(99, q + 1))} className="w-16 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors"><Plus size={20} /></button>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={adding}
                    className={`luxury-btn flex-1 sm:flex-none h-16 px-12 text-xs tracking-[0.3em] ${added ? 'border-green-500/50' : ''}`}
                  >
                    {adding ? (
                      <div className="flex items-center gap-2">
                        <Loader2 size={20} className="animate-spin text-luxury-cyan" /> SYNCING
                      </div>
                    ) : added ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <Check size={20} /> GEAR ADDED
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        INITIALIZE ACQUISITION
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="flex items-center justify-center sm:justify-start gap-12 pt-4">
              <div className="flex items-center gap-3 text-text-muted font-black text-[9px] uppercase tracking-widest">
                <ShieldCheck size={16} className="text-luxury-cyan" /> Secure Channel
              </div>
              <div className="flex items-center gap-3 text-text-muted font-black text-[9px] uppercase tracking-widest">
                <Zap size={16} className="text-luxury-violet" /> Priority Build
              </div>
              <div className="flex items-center gap-3 text-text-muted font-black text-[9px] uppercase tracking-widest">
                <Sparkles size={16} className="text-white opacity-40" /> Elite Grade
              </div>
            </div>
        </div>
      </div>
    </div>
    </div>
    </PageTransition>
  );
};

export default ProductDetails;
