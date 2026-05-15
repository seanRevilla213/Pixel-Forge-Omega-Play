import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiMonitor, FiTag, FiArrowLeft, FiPlus, FiMinus, FiShare2 } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useResponsive, useAnimationSettings } from '../hooks/useResponsive';
import api from '../api/axiosInstance';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  
  const { device, isMobile } = useResponsive();
  const anim = useAnimationSettings();

  useEffect(() => {
    api.get(`/products/slug/${slug}`).then(({ data }) => {
      setProduct(data.product);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="skeleton h-[300px] md:h-[500px] rounded-3xl" />
            <div className="space-y-6">
              <div className="skeleton h-12 w-3/4" />
              <div className="skeleton h-4 w-1/4" />
              <div className="skeleton h-32 w-full" />
              <div className="skeleton h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-text-primary mb-6">Game Not Found</h2>
          <Link to="/products" className="px-6 py-3 rounded-xl bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-dark-900 transition-all">
            Browse Store
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  return (
    <PageTransition>
      <div className={`min-h-screen pt-24 pb-24 lg:pb-16 px-6 ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'} mx-auto`}>
        <Link to="/products" className="inline-flex items-center gap-2 text-text-muted hover:text-neon-cyan transition-colors mb-10 text-sm font-bold uppercase tracking-widest">
          <FiArrowLeft size={18} /> Back to Store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image - Responsive Sizing */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 * anim.intensity }}
            className="relative rounded-[2rem] overflow-hidden glass gpu h-fit"
          >
            <img src={product.image_url} alt={product.name} className="w-full h-auto min-h-[300px] max-h-[600px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent" />
            {product.badge && (
              <span className="absolute top-6 right-6 px-6 py-2 rounded-2xl text-xs font-black tracking-widest bg-neon-cyan text-dark-900 shadow-xl shadow-neon-cyan/20">
                {product.badge}
              </span>
            )}
          </motion.div>

          {/* Info - Fluid Typography */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-xl bg-neon-cyan/10 text-neon-cyan text-[10px] font-bold uppercase tracking-widest">{product.category}</span>
                <span className="px-4 py-1.5 rounded-xl bg-dark-600 text-text-muted text-[10px] font-bold uppercase tracking-widest">{product.genre}</span>
              </div>
              <h1 className="font-heading font-black text-text-primary mb-4 leading-tight" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-neon-gold">
                  <FiStar fill="currentColor" size={16} />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-text-muted font-medium ml-1">({product.review_count} reviews)</span>
                </div>
                <button className="flex items-center gap-2 text-text-muted hover:text-neon-cyan transition-colors text-xs font-bold uppercase tracking-widest">
                  <FiShare2 size={16} /> Share
                </button>
              </div>
            </div>

            <p className="text-text-secondary leading-relaxed" style={{ fontSize: 'var(--font-size-fluid-body)' }}>
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan">
                  <FiMonitor size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Platform</p>
                  <p className="text-sm font-bold text-text-primary">{product.platform}</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon-magenta/10 flex items-center justify-center text-neon-magenta">
                  <FiTag size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Genre</p>
                  <p className="text-sm font-bold text-text-primary">{product.genre}</p>
                </div>
              </div>
            </div>

            {/* Sticky Actions on Mobile */}
            <div className={`${isMobile ? 'fixed bottom-20 left-0 right-0 p-6 glass-strong z-40 border-t border-glass-border' : 'glass-strong rounded-3xl p-8'}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">Final Price</span>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-4xl font-black text-neon-cyan">
                      {product.price === 0 ? 'FREE' : `$${product.price.toFixed(2)}`}
                    </span>
                    {product.original_price && (
                      <div className="flex flex-col">
                        <span className="text-sm text-text-muted line-through">${product.original_price.toFixed(2)}</span>
                        <span className="text-[10px] font-black text-neon-green">-{discount}% OFF</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="flex items-center glass rounded-2xl overflow-hidden h-14">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center text-text-muted hover:text-neon-cyan transition-colors">
                      <FiMinus size={18} />
                    </button>
                    <span className="px-4 font-bold text-lg text-text-primary min-w-[50px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(99, q + 1))} className="w-12 h-full flex items-center justify-center text-text-muted hover:text-neon-cyan transition-colors">
                      <FiPlus size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => { for (let i = 0; i < quantity; i++) addItem(product); }}
                    className="flex-1 sm:flex-none px-8 h-14 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-2xl text-dark-900 font-black text-base flex items-center justify-center gap-3 btn-hover-lift"
                  >
                    <FiShoppingCart size={22} />
                    {isMobile ? 'Add' : 'Add to Cart'}
                  </button>
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
