import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiStar, FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
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

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    params.set('page', page.toString());
    params.set('limit', '12');

    api.get(`/products?${params}`).then(({ data }) => {
      setProducts(data.products);
      setCategories(data.categories);
      setTotalPages(data.pagination.totalPages);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, category, sort, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-text-primary mb-3">
              Game <span className="bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">Store</span>
            </h1>
            <p className="text-text-secondary text-lg">Discover your next favorite game</p>
          </div>

          {/* Filters */}
          <div className="glass rounded-2xl p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search games..."
                  className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                />
              </form>
              <div className="flex gap-3">
                <div className="relative">
                  <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="pl-9 pr-8 py-3 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="px-4 py-3 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 appearance-none cursor-pointer"
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

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <div className="skeleton h-48 rounded-none" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-8 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg mb-4">No games found</p>
              <button onClick={() => { setSearch(''); setCategory(''); setSort(''); }} className="text-neon-cyan hover:text-neon-magenta transition-colors text-sm">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group glass rounded-2xl overflow-hidden hover:border-neon-cyan/20 transition-all duration-500"
                >
                  <Link to={`/products/${product.slug}`} className="block">
                    <div className="relative h-44 overflow-hidden bg-dark-700">
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                      {product.badge && (
                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold ${
                          product.badge === 'SALE' ? 'bg-neon-red/90 text-white' :
                          product.badge === 'NEW' ? 'bg-neon-green/90 text-dark-900' :
                          product.badge === 'HOT' ? 'bg-neon-gold/90 text-dark-900' :
                          product.badge === 'FREE' ? 'bg-neon-cyan/90 text-dark-900' :
                          'bg-neon-purple/90 text-white'
                        }`}>{product.badge}</span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      <span className="text-neon-cyan/70 font-medium uppercase tracking-wider">{product.category}</span>
                      <span className="text-text-muted">·</span>
                      <span className="flex items-center gap-1 text-neon-gold"><FiStar size={11} fill="currentColor" /> {product.rating}</span>
                      <span className="text-text-muted">·</span>
                      <span className="text-text-muted">{product.review_count} reviews</span>
                    </div>
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="font-heading text-sm font-bold text-text-primary group-hover:text-neon-cyan transition-colors mb-3 truncate">{product.name}</h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-lg font-bold text-neon-cyan">
                          {product.price === 0 ? 'FREE' : `$${product.price.toFixed(2)}`}
                        </span>
                        {product.original_price && (
                          <span className="text-xs text-text-muted line-through">${product.original_price.toFixed(2)}</span>
                        )}
                      </div>
                      <button onClick={() => addItem(product)} className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-dark-900 transition-all duration-300">
                        <FiShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg glass text-text-secondary hover:text-neon-cyan disabled:opacity-30 transition-all">
                <FiChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-neon-cyan text-dark-900' : 'glass text-text-secondary hover:text-neon-cyan'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg glass text-text-secondary hover:text-neon-cyan disabled:opacity-30 transition-all">
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Products;
