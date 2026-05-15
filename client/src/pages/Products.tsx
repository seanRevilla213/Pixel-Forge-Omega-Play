import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, ChevronLeft, ChevronRight, Grid, Filter, Sparkles } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useResponsive } from '../hooks/useResponsive';
import { AuroraBackground, AmbientGlow } from '../components/ui/ImmersiveEffects';
import { LuxuryCartButton } from '../components/ui/LuxuryCartButton';
import api from '../api/axiosInstance';
import gsap from 'gsap';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { formatPHP } = useCart();
  
  const { device } = useResponsive();

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

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(".product-card", 
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.8, ease: "power4.out" }
      );
    }
  }, [loading, products]);

  return (
    <PageTransition>
      <div className="relative bg-matte-black min-h-screen pt-40 pb-24 px-6 overflow-hidden">
        <AuroraBackground />
        <AmbientGlow />

        <div className={`mx-auto relative z-10 ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
          {/* Elegant Header */}
          <div className="mb-20 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-widest text-luxury-cyan uppercase mb-6"
            >
              <Sparkles size={12} /> Curated Inventory
            </motion.div>
            <h1 className="font-heading font-black text-white leading-tight" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
              SYSTEM <span className="italic opacity-50">MANIFEST</span>
            </h1>
            <p className="text-text-secondary font-medium mt-4 max-w-xl opacity-60 mx-auto lg:mx-0">Hand-selected gaming hardware for the discerning professional.</p>
          </div>

          {/* Luxury Filter Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            {/* Side Filters */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-12 lg:sticky lg:top-40"
            >
              <div className="space-y-6">
                <h3 className="text-[10px] font-black tracking-[0.3em] text-white opacity-40 uppercase flex items-center gap-3">
                  <Search size={14} /> CATALOG SEARCH
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="ENTER QUERY..."
                    className="w-full bg-white/5 border-b border-white/10 py-4 text-white text-xs font-black tracking-widest focus:outline-none focus:border-luxury-cyan transition-all placeholder-text-muted uppercase"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black tracking-[0.3em] text-white opacity-40 uppercase flex items-center gap-3">
                  <Filter size={14} /> CATEGORY
                </h3>
                <div className="flex flex-wrap lg:flex-col gap-3">
                  <button 
                    onClick={() => setCategory('')}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${category === '' ? 'bg-white text-matte-black shadow-xl' : 'glasswave text-text-secondary hover:text-white'}`}
                  >
                    ALL SYSTEMS
                  </button>
                  {categories.map((c) => (
                    <button 
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${category === c ? 'bg-white text-matte-black shadow-xl' : 'glasswave text-text-secondary hover:text-white'}`}
                    >
                      {c.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-text-secondary">
                  <Grid size={16} /> SHOWING {products.length} ARCHIVES
                </div>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="bg-transparent text-[10px] font-black tracking-widest text-white focus:outline-none appearance-none cursor-pointer border-b border-white/10 pb-1 uppercase"
                >
                  <option value="" className="bg-matte-black">DEFAULT SEQUENCE</option>
                  <option value="price_asc" className="bg-matte-black">COST: ASCENDING</option>
                  <option value="price_desc" className="bg-matte-black">COST: DESCENDING</option>
                  <option value="rating" className="bg-matte-black">ELITE RATING</option>
                </select>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glasswave rounded-[3rem] h-[500px] animate-pulse" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-40 glasswave rounded-[4rem]">
                  <p className="text-text-muted text-lg font-black tracking-[0.3em] uppercase">SYSTEM MATCH NOT FOUND</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      className="product-card group glasswave-card p-6 flex flex-col h-full"
                    >
                      <Link to={`/products/${product.slug}`} className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 mb-8">
                        <motion.img 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-matte-black/40 to-transparent" />
                      </Link>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[9px] font-black text-luxury-cyan uppercase tracking-widest">{product.category}</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <div className="flex items-center gap-1 text-[9px] font-black text-luxury-violet">
                          <Star size={10} fill="currentColor" /> {product.rating}
                        </div>
                      </div>

                      <h3 className="font-heading text-xl font-black text-white mb-6 group-hover:text-luxury-cyan transition-colors leading-tight line-clamp-2">{product.name}</h3>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-2xl font-black text-white opacity-80 tracking-tight">{formatPHP(product.price)}</span>
                        <LuxuryCartButton product={product} className="w-12 h-12 !px-0 rounded-full" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 mt-24">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-12 h-12 rounded-full glasswave flex items-center justify-center text-white hover:text-luxury-cyan disabled:opacity-20 transition-all">
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex gap-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button 
                        key={p} 
                        onClick={() => setPage(p)} 
                        className={`w-12 h-12 rounded-full font-black text-[10px] tracking-widest transition-all ${p === page ? 'bg-white text-matte-black shadow-2xl' : 'glasswave text-text-secondary hover:text-white'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-12 h-12 rounded-full glasswave flex items-center justify-center text-white hover:text-luxury-cyan disabled:opacity-20 transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Products;
