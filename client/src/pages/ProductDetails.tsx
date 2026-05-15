import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Monitor, Tag, ArrowLeft, Plus, Minus, Share2, ShieldCheck, Zap } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useResponsive } from '../hooks/useResponsive';
import { MouseGlow, FloatingParticles } from '../components/ui/ImmersiveEffects';
import api from '../api/axiosInstance';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  
  const { device, isMobile } = useResponsive();

  useEffect(() => {
    api.get(`/products/slug/${slug}`).then(({ data }) => {
      setProduct(data.product);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-navy pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="glass rounded-[3rem] h-[500px] animate-pulse" />
          <div className="space-y-8">
            <div className="h-16 w-3/4 bg-white/5 rounded-2xl" />
            <div className="h-4 w-1/4 bg-white/5 rounded-xl" />
            <div className="h-32 w-full bg-white/5 rounded-[2rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  return (
    <PageTransition>
      <div className="relative bg-dark-navy min-h-screen pt-32 pb-24 px-6 overflow-hidden">
        <MouseGlow />
        <FloatingParticles />
        <div className="scanline" />

        <div className={`mx-auto relative z-10 ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
          <Link to="/products" className="inline-flex items-center gap-3 text-text-muted hover:text-neon-cyan transition-colors mb-12 text-[10px] font-black uppercase tracking-[0.3em]">
            <ArrowLeft size={16} /> RE-INITIALIZE STORE
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
            {/* Immersive Image Display */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
              className="relative rounded-[3rem] overflow-hidden glass gpu h-fit aspect-square lg:aspect-auto lg:h-[600px]"
            >
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/60 via-transparent to-transparent" />
              {product.badge && (
                <div className="absolute top-8 right-8 rgb-border bg-dark-navy/80 px-6 py-2 rounded-2xl text-[10px] font-black tracking-[0.4em] text-white uppercase shadow-2xl">
                  {product.badge}
                </div>
              )}
            </motion.div>

            {/* Tactical Info Panel */}
            <div className="space-y-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-xl bg-neon-cyan/10 text-neon-cyan text-[10px] font-black tracking-widest uppercase border border-neon-cyan/20">{product.category}</span>
                  <span className="px-4 py-1.5 rounded-xl bg-white/5 text-text-muted text-[10px] font-black tracking-widest uppercase border border-white/5">PRO SERIES</span>
                </div>
                <h1 className="font-heading font-black text-white leading-none mb-6" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
                  {product.name}
                </h1>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 text-neon-purple">
                    <Star size={18} fill="currentColor" />
                    <span className="font-black text-lg">{product.rating}</span>
                    <span className="text-text-muted font-bold text-xs ml-2 uppercase tracking-widest">({product.review_count} REVIEWS)</span>
                  </div>
                  <button className="flex items-center gap-2 text-text-muted hover:text-neon-cyan transition-colors text-[10px] font-black uppercase tracking-widest">
                    <Share2 size={16} /> SHARE GEAR
                  </button>
                </div>
              </motion.div>

              <p className="text-text-secondary leading-relaxed font-medium" style={{ fontSize: 'var(--font-size-fluid-body)' }}>
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="glass rounded-[2rem] p-6 flex items-center gap-4 group hover:border-neon-cyan/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan group-hover:scale-110 transition-transform">
                    <Monitor size={22} />
                  </div>
                  <div>
                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-1">Architecture</p>
                    <p className="text-sm font-black text-white uppercase tracking-tighter">{product.platform}</p>
                  </div>
                </div>
                <div className="glass rounded-[2rem] p-6 flex items-center gap-4 group hover:border-neon-purple/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 flex items-center justify-center text-neon-purple group-hover:scale-110 transition-transform">
                    <Tag size={22} />
                  </div>
                  <div>
                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-1">Class</p>
                    <p className="text-sm font-black text-white uppercase tracking-tighter">{product.genre}</p>
                  </div>
                </div>
              </div>

              {/* Action Console */}
              <div className={`${isMobile ? 'fixed bottom-0 left-0 right-0 p-8 glass-strong z-50 rounded-t-[3rem] border-t border-white/10' : 'glass-strong rounded-[3rem] p-10 border border-white/10 shadow-2xl'}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
                  <div className="flex flex-col items-center sm:items-start">
                    <span className="text-[10px] text-text-muted font-black tracking-[0.4em] uppercase mb-2">Unit Price</span>
                    <div className="flex items-center gap-4">
                      <span className="font-heading text-5xl font-black text-white tracking-tighter">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.original_price && (
                        <div className="flex flex-col">
                          <span className="text-sm text-text-muted line-through font-bold">${product.original_price.toFixed(2)}</span>
                          <span className="text-[10px] font-black text-neon-cyan tracking-widest uppercase">-{discount}% REDUCTION</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="flex items-center glass rounded-2xl overflow-hidden h-16 border-white/5">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-14 h-full flex items-center justify-center text-text-muted hover:text-neon-cyan transition-colors"><Minus size={18} /></button>
                      <span className="px-6 font-black text-xl text-white min-w-[60px] text-center">{quantity}</span>
                      <button onClick={() => setQuantity(q => Math.min(99, q + 1))} className="w-14 h-full flex items-center justify-center text-text-muted hover:text-neon-cyan transition-colors"><Plus size={18} /></button>
                    </div>

                    <button
                      onClick={() => { for (let i = 0; i < quantity; i++) addItem(product); }}
                      className="neon-btn flex-1 sm:flex-none px-12 h-16 text-lg tracking-[0.2em]"
                    >
                      <ShoppingCart size={22} />
                      {isMobile ? 'ADD' : 'ACQUIRE GEAR'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              {!isMobile && (
                <div className="flex items-center gap-10 pt-6">
                  <div className="flex items-center gap-3 text-text-muted font-bold text-[10px] uppercase tracking-widest">
                    <ShieldCheck size={16} className="text-neon-cyan" /> Secure Encryption
                  </div>
                  <div className="flex items-center gap-3 text-text-muted font-bold text-[10px] uppercase tracking-widest">
                    <Zap size={16} className="text-neon-purple" /> Instant Delivery
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetails;
