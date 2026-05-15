import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, ShoppingCart, ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useResponsive, useAnimationSettings } from '../hooks/useResponsive';
import { MouseGlow, FloatingParticles } from '../components/ui/ImmersiveEffects';
import api from '../api/axiosInstance';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addItem } = useCart();
  
  const { device, isTouch } = useResponsive();
  const anim = useAnimationSettings();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    params.set('page', page.toString());
    params.set('limit', device === 'ultrawide' ? '16' : '12');

    api.get(`/products?${params}`).then(({ data }) => {
      setProducts(data.products);
      setCategories(data.categories);
      setTotalPages(data.pagination.totalPages);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, category, sort, page, device]);

  return (
    <PageTransition>
      <div className="relative bg-dark-navy min-h-screen pt-32 pb-24 px-6 overflow-hidden">
        <MouseGlow />
        <FloatingParticles />
        <div className="scanline" />

        <div className={`mx-auto relative z-10 ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
          {/* Header */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-neon-cyan uppercase mb-4"
            >
              <Grid size={12} /> System Inventory
            </motion.div>
            <h1 className="font-heading font-black text-white leading-tight" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
              ELITE <span className="text-neon-cyan">GEAR</span>
            </h1>
            <p className="text-text-muted font-medium mt-2">Zero-latency hardware for professional dominance</p>
          </div>

          {/* Filters Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2.5rem] p-6 mb-16 flex flex-col lg:flex-row gap-6 sticky top-28 z-40"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="SEARCH SYSTEM DATABASE..."
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-text-muted text-xs font-black tracking-widest focus:outline-none focus:border-neon-cyan/30 transition-all uppercase"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
              <div className="relative flex-shrink-0">
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="pl-6 pr-12 py-4 bg-white/5 border border-white/5 rounded-2xl text-white text-[10px] font-black tracking-widest focus:outline-none focus:border-neon-cyan/30 appearance-none cursor-pointer uppercase"
                >
                  <option value="">ALL CATEGORIES</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="relative flex-shrink-0">
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="pl-6 pr-12 py-4 bg-white/5 border border-white/5 rounded-2xl text-white text-[10px] font-black tracking-widest focus:outline-none focus:border-neon-cyan/30 appearance-none cursor-pointer uppercase"
                >
                  <option value="">SORT BY: FEATURED</option>
                  <option value="price_asc">PRICE: LOW → HIGH</option>
                  <option value="price_desc">PRICE: HIGH → LOW</option>
                  <option value="rating">TOP RATED</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Product Grid */}
          {loading ? (
            <div className="responsive-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass rounded-[2rem] h-[450px] animate-pulse overflow-hidden">
                  <div className="h-64 bg-white/5" />
                  <div className="p-8 space-y-4">
                    <div className="h-4 w-1/2 bg-white/5 rounded" />
                    <div className="h-8 w-full bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-40">
              <p className="text-text-muted text-xl font-black tracking-widest mb-8 uppercase">NO GEAR MATCHES YOUR SEARCH</p>
              <button onClick={() => { setSearch(''); setCategory(''); setSort(''); }} className="neon-btn mx-auto">
                RESET SYSTEM FILTERS
              </button>
            </div>
          ) : (
            <div className="responsive-grid">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 * anim.intensity }}
                  className="group glass-card overflow-hidden flex flex-col h-full"
                >
                  <Link to={`/products/${product.slug}`} className="block relative h-64 overflow-hidden bg-white/5">
                    <motion.img 
                      whileHover={!isTouch ? { scale: 1.1, rotate: 5 } : {}}
                      transition={{ duration: 0.8 }}
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-navy to-transparent opacity-60" />
                    {product.badge && (
                      <div className="absolute top-6 right-6 rgb-border bg-dark-navy/80 px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest text-white uppercase">
                        {product.badge}
                      </div>
                    )}
                  </Link>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] text-neon-cyan font-black tracking-widest uppercase">{product.category}</span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-1 text-[10px] text-neon-purple font-black">
                        <Star size={10} fill="currentColor" /> {product.rating}
                      </div>
                    </div>
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="font-heading text-lg font-black text-white mb-6 group-hover:text-neon-cyan transition-colors line-clamp-1">{product.name}</h3>
                    </Link>
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
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-20">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-white hover:text-neon-cyan disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button 
                    key={p} 
                    onClick={() => setPage(p)} 
                    className={`w-14 h-14 rounded-2xl font-black text-xs transition-all ${p === page ? 'bg-neon-cyan text-dark-navy shadow-lg shadow-neon-cyan/20' : 'glass text-white hover:text-neon-cyan'}`}
                  >
                    {p < 10 ? `0${p}` : p}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
                className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-white hover:text-neon-cyan disabled:opacity-30 transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Products;
