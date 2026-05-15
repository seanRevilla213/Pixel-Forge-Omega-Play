import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiStar, FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useResponsive, useAnimationSettings } from '../hooks/useResponsive';
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <PageTransition>
      <div className={`min-h-screen pt-24 pb-24 lg:pb-16 px-4 sm:px-6 lg:px-8 ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'} mx-auto`}>
        {/* Header - Fluid Typography */}
        <div className="mb-10">
          <h1 className="font-heading font-bold text-text-primary mb-3 leading-tight" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
            Game <span className="bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">Store</span>
          </h1>
          <p className="text-text-secondary" style={{ fontSize: 'var(--font-size-fluid-body)' }}>Discover your next favorite game</p>
        </div>

        {/* Filters - Responsive Layout */}
        <div className="glass rounded-2xl p-4 mb-10 sticky top-20 z-30 backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search games..."
                className="w-full pl-11 pr-4 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
              />
            </form>
            <div className="flex gap-3 overflow-x-auto pb-1 touch-scroll scrollbar-hide">
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="pl-4 pr-10 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 appearance-none cursor-pointer flex-shrink-0"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="pl-4 pr-10 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 appearance-none cursor-pointer flex-shrink-0"
              >
                <option value="">Featured</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid - Fluid Layout */}
        {loading ? (
          <div className="responsive-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-3xl overflow-hidden h-[380px]">
                <div className="skeleton h-48 rounded-none" />
                <div className="p-5 space-y-4">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-text-secondary text-lg mb-6">No games found matches your criteria</p>
            <button onClick={() => { setSearch(''); setCategory(''); setSort(''); }} className="px-6 py-3 rounded-xl border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-all">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="responsive-grid">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 * anim.intensity }}
                className="group glass rounded-3xl overflow-hidden hover:border-neon-cyan/20 transition-all duration-500 gpu"
              >
                <Link to={`/products/${product.slug}`} className="block relative h-48 overflow-hidden bg-dark-700">
                  <img src={product.image_url} alt={product.name} className={`w-full h-full object-cover transition-transform duration-700 ${!isTouch && 'group-hover:scale-110'}`} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                  {product.badge && (
                    <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-widest ${
                      product.badge === 'SALE' ? 'bg-neon-red/90 text-white' : 'bg-neon-cyan/90 text-dark-900'
                    }`}>{product.badge}</span>
                  )}
                </Link>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] text-neon-cyan/70 font-bold uppercase tracking-widest">{product.category}</span>
                    <span className="text-text-muted">·</span>
                    <span className="flex items-center gap-1 text-[10px] text-neon-gold font-bold"><FiStar size={12} fill="currentColor" /> {product.rating}</span>
                  </div>
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-heading text-base font-bold text-text-primary group-hover:text-neon-cyan transition-colors mb-4 truncate">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-heading text-xl font-bold text-neon-cyan">
                        {product.price === 0 ? 'FREE' : `$${product.price.toFixed(2)}`}
                      </span>
                      {product.original_price && (
                        <span className="text-[10px] text-text-muted line-through">${product.original_price.toFixed(2)}</span>
                      )}
                    </div>
                    <button onClick={() => addItem(product)} className="p-3.5 rounded-2xl bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-dark-900 transition-all duration-300">
                      <FiShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination - Large Touch Targets */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-16 mb-8 overflow-x-auto py-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-12 h-12 flex items-center justify-center rounded-2xl glass text-text-secondary hover:text-neon-cyan disabled:opacity-30 transition-all">
              <FiChevronLeft size={22} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all ${p === page ? 'bg-neon-cyan text-dark-900 shadow-lg shadow-neon-cyan/20' : 'glass text-text-secondary hover:text-neon-cyan'}`}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-12 h-12 flex items-center justify-center rounded-2xl glass text-text-secondary hover:text-neon-cyan disabled:opacity-30 transition-all">
              <FiChevronRight size={22} />
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Products;
