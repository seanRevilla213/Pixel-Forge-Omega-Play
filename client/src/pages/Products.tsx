import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Sparkles } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import type { Product } from '../types';
import { useResponsive } from '../hooks/useResponsive';
import { usePerformance } from '../context/PerformanceContext';
import { AuroraBackground, AmbientGlow } from '../components/ui/ImmersiveEffects';
import { PremiumControllerShowcase } from '../components/product/PremiumControllerShowcase';
import { PremiumKeyboardShowcase } from '../components/product/PremiumKeyboardShowcase';
import { PremiumMouseShowcase } from '../components/product/PremiumMouseShowcase';
import { PremiumHeadsetShowcase } from '../components/product/PremiumHeadsetShowcase';
import { PremiumAccessoryShowcase } from '../components/product/PremiumAccessoryShowcase';
import { PremiumHardwareShowcase } from '../components/product/PremiumHardwareShowcase';
import { productsData } from '../data/products';
import api from '../api/axiosInstance';
import gsap from 'gsap';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { isLowEnd } = usePerformance();
  const FIXED_CATEGORIES = [
    { id: 'controllers', name: 'Controllers', glow: 'rgba(0, 240, 255, 0.4)', color: '#00f0ff' },
    { id: 'keyboards', name: 'Mechanical Keyboards', glow: 'rgba(255, 140, 0, 0.3)', color: '#ff8c00' },
    { id: 'mice', name: 'Gaming Mouse', glow: 'rgba(168, 85, 247, 0.3)', color: '#a855f7' },
    { id: 'headsets', name: 'Headsets', glow: 'rgba(34, 197, 94, 0.3)', color: '#22c55e' },
    { id: 'consoles', name: 'Consoles', glow: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' },
    { id: 'accessories', name: 'Accessories', glow: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }
  ];
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local states for instant, bulletproof UI updates
  const [search, setSearchLocal] = useState(searchParams.get('search') || '');
  const [category, setCategoryLocal] = useState(searchParams.get('category') || '');
  const [brand, setBrandLocal] = useState(searchParams.get('brand') || '');
  const [page, setPageLocal] = useState(parseInt(searchParams.get('page') || '1', 10));

  const setSearch = (val: string) => {
    setSearchLocal(val);
    setPageLocal(1);
    const next = new URLSearchParams(searchParams);
    if (val) next.set('search', val); else next.delete('search');
    next.set('page', '1');
    setSearchParams(next);
  };
  const setCategory = (val: string) => {
    setCategoryLocal(val);
    setBrandLocal('');
    setPageLocal(1);
    const next = new URLSearchParams(searchParams);
    if (val) next.set('category', val); else next.delete('category');
    next.delete('brand');
    next.set('page', '1');
    setSearchParams(next);
  };
  const setBrand = (val: string) => {
    setBrandLocal(val);
    setPageLocal(1);
    const next = new URLSearchParams(searchParams);
    if (val) next.set('brand', val); else next.delete('brand');
    next.set('page', '1');
    setSearchParams(next);
  };
  const setPage = (val: number) => {
    setPageLocal(val);
    const next = new URLSearchParams(searchParams);
    next.set('page', val.toString());
    setSearchParams(next);
  };

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { device } = useResponsive();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (brand) params.set('brand', brand);
    params.set('page', page.toString());
    params.set('limit', device === 'ultrawide' ? '16' : '12');

    api.get(`/products?${params}`).then(({ data }) => {
      setProducts(data.products || []);
      setBrands(data.brands || []);
      setLoading(false);
    }).catch(() => {
      // API failed, fallback to local static data
      console.warn("Products API call failed. Using local static fallback data.");
      let filtered = [...productsData];
      if (search) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) || 
          p.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (category) {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (brand) {
        filtered = filtered.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
      }
      setProducts(filtered);
      setBrands(Array.from(new Set(productsData.map(p => p.brand).filter(Boolean))) as string[]);
      setLoading(false);
    });
  }, [search, category, brand, page, device]);

  useEffect(() => {
    if (!loading && !isLowEnd) {
      gsap.fromTo(".product-card", 
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.8, ease: "power4.out" }
      );
    }
  }, [loading, products, isLowEnd]);

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
            <h1 className="font-heading font-black text-white leading-tight uppercase tracking-tighter" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
              SYSTEM <span className="italic opacity-50">MANIFEST</span>
            </h1>
            <p className="text-text-secondary font-medium mt-4 max-w-xl opacity-60 mx-auto lg:mx-0">Hand-selected gaming hardware for the discerning professional.</p>
          </div>

          {/* Luxury Filter Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            {/* Desktop Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block lg:col-span-1 space-y-12 sticky top-40 h-[calc(100vh-200px)] overflow-y-auto pr-4 hide-scrollbar"
            >
              <div className="space-y-6">
                <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase flex items-center gap-3">
                  <Search size={14} className="text-luxury-cyan" /> catalog search
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search query..."
                    className="w-full bg-white/5 border-b border-white/10 py-4 text-white text-[10px] font-black tracking-[0.3em] focus:outline-none focus:border-luxury-cyan transition-all placeholder:text-white/20 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-10">
                <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase flex items-center gap-3">
                  <Filter size={14} className="text-luxury-cyan" /> Category Index
                </h3>
                <div className="flex flex-col gap-6">
                  {/* All Systems - Minimal */}
                  <button 
                    onClick={() => { setCategory(''); setBrand(''); setPage(1); }}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all border ${
                      category === '' 
                        ? 'bg-white text-matte-black border-white shadow-[0_20px_40px_rgba(255,255,255,0.15)]' 
                        : 'glasswave text-text-secondary border-white/5 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    All Archives
                  </button>

                  {/* Featured: Controllers */}
                  <button
                    onClick={() => { setCategory('Controllers'); setBrand(''); setPage(1); }}
                    className={`relative group overflow-hidden py-8 rounded-[2.5rem] transition-all duration-700 border-2 ${
                      category === 'Controllers'
                        ? 'bg-midnight border-luxury-cyan shadow-[0_0_50px_rgba(0,240,255,0.2)]'
                        : 'glasswave-strong border-white/5 hover:border-luxury-cyan/50'
                    }`}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-luxury-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <span className={`text-[12px] font-black tracking-[0.3em] uppercase transition-all duration-500 ${
                        category === 'Controllers' ? 'text-luxury-cyan scale-110' : 'text-white/60 group-hover:text-white'
                      }`}>
                        Controllers
                      </span>
                      <div className={`h-1 w-8 rounded-full transition-all duration-500 ${
                        category === 'Controllers' ? 'bg-luxury-cyan w-16' : 'bg-white/10 group-hover:bg-luxury-cyan/40'
                      }`} />
                    </div>
                    {category === 'Controllers' && (
                      <div className="absolute inset-0 border-2 border-luxury-cyan animate-pulse rounded-[2.5rem] opacity-20" />
                    )}
                  </button>

                  {/* Other Categories - Compact Slots */}
                  <div className="space-y-3">
                    {FIXED_CATEGORIES.filter(c => c.name !== 'Controllers').map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setCategory(cat.name); setBrand(''); setPage(1); }}
                        className={`w-full py-5 px-8 rounded-3xl text-[10px] font-black tracking-widest uppercase transition-all duration-500 border flex items-center justify-between group ${
                          category === cat.name
                            ? 'bg-white/10 border-white text-white shadow-xl'
                            : 'glasswave border-white/5 text-white/40 hover:text-white hover:border-white/20'
                        }`}
                        style={{ boxShadow: category === cat.name ? `0 0 30px ${cat.glow}` : 'none' }}
                      >
                        <span>{cat.name}</span>
                        <div 
                          className={`w-2 h-2 rounded-full transition-all duration-500 ${
                            category === cat.name ? 'scale-150' : 'scale-0 group-hover:scale-100 opacity-20'
                          }`}
                          style={{ backgroundColor: cat.color }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Brand Filters */}
              {brands.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-[10px] font-black tracking-[0.3em] text-white opacity-40 uppercase flex items-center gap-3">
                    <Sparkles size={14} /> Brands
                  </h3>
                  <div className="flex flex-wrap lg:flex-col gap-3">
                    <button 
                      onClick={() => { setBrand(''); setPage(1); }}
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${brand === '' ? 'bg-white/20 text-white shadow-xl' : 'glasswave text-text-secondary hover:text-white'}`}
                    >
                      All Brands
                    </button>
                    {brands.map((b) => (
                      <button 
                        key={b}
                        onClick={() => { setBrand(b); setPage(1); }}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${brand === b ? 'bg-white text-matte-black shadow-xl' : 'glasswave text-text-secondary hover:text-white'}`}
                      >
                        {b.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="glasswave-strong px-8 py-5 rounded-full flex items-center gap-3 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 transition-all"
              >
                <Filter size={18} className="text-luxury-cyan" />
                <span className="text-[10px] font-black tracking-widest text-white uppercase">Filter Selection</span>
              </button>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
              {showMobileFilters && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowMobileFilters(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] lg:hidden"
                  />
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-matte-black z-[80] lg:hidden p-10 overflow-y-auto"
                  >
                    <div className="flex flex-col gap-12">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Filters</h2>
                        <button onClick={() => setShowMobileFilters(false)} className="text-white/40 hover:text-white">Close</button>
                      </div>
                      
                      {/* Search */}
                      <div className="space-y-6">
                        <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">catalog search</h3>
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                          placeholder="Search query..."
                          className="w-full bg-white/5 border-b border-white/10 py-4 text-white text-[10px] font-black tracking-[0.3em] focus:outline-none focus:border-luxury-cyan transition-all placeholder:text-white/20 uppercase"
                        />
                      </div>

                      {/* Categories */}
                      <div className="space-y-8">
                        <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">Category Index</h3>
                        <div className="flex flex-col gap-4">
                          <button 
                            onClick={() => { setCategory(''); setBrand(''); setPage(1); setShowMobileFilters(false); }}
                            className={`w-full py-4 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${
                              category === '' ? 'bg-white text-black border-white' : 'glasswave text-white/40 border-white/5'
                            }`}
                          >
                            All Archives
                          </button>
                          {FIXED_CATEGORIES.map(cat => (
                            <button
                              key={cat.id}
                              onClick={() => { setCategory(cat.name); setBrand(''); setPage(1); setShowMobileFilters(false); }}
                              className={`w-full py-5 px-8 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all border flex items-center justify-between ${
                                category === cat.name ? 'bg-white/10 border-white text-white' : 'glasswave border-white/5 text-white/40'
                              }`}
                            >
                              <span>{cat.name}</span>
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main Showcase Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-[70vh] flex items-center justify-center"
                  >
                    <div className="w-16 h-16 border-4 border-luxury-cyan/20 border-t-luxury-cyan rounded-full animate-spin" />
                  </motion.div>
                ) : (!products || products.length === 0) ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-40 glasswave rounded-[4rem]"
                  >
                    <p className="text-text-muted text-lg font-black tracking-[0.3em] uppercase italic opacity-40">Archive Not Found</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={products[0]?.id || 'unknown'}
                    initial={isLowEnd ? { opacity: 0 } : { opacity: 0, scale: 0.8, rotateY: -20 }}
                    animate={{ opacity: 1, scale: 1.1, rotateY: 0 }}
                    exit={isLowEnd ? { opacity: 0 } : { opacity: 0, scale: 1.2, rotateY: 20 }}
                    transition={{ duration: isLowEnd ? 0.35 : 1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                    style={isLowEnd ? {} : { perspective: '2000px' }}
                  >
                    {products[0]?.category === 'Controllers' ? (
                      <PremiumControllerShowcase product={products[0]} />
                    ) : products[0]?.category === 'Mechanical Keyboards' ? (
                      <PremiumKeyboardShowcase product={products[0]} hideSidebar={true} />
                    ) : products[0]?.category === 'Gaming Mouse' ? (
                      <PremiumMouseShowcase product={products[0]} hideSidebar={true} />
                    ) : products[0]?.category === 'Headsets' ? (
                      <PremiumHeadsetShowcase product={products[0]} hideSidebar={true} />
                    ) : products[0]?.category === 'Accessories' ? (
                      <PremiumAccessoryShowcase product={products[0]} hideSidebar={true} />
                    ) : products[0] ? (
                      <PremiumHardwareShowcase product={products[0]} />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Products;
