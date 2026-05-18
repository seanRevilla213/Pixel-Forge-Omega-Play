import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  Loader2, 
  Check, 
  Sparkles, 
  Gamepad, 
  Keyboard, 
  MousePointer, 
  Headphones, 
  Tv, 
  Sliders, 
  Maximize2, 
  Crosshair, 
  Anchor, 
  Flame, 
  Layers, 
  ShoppingCart, 
  Search, 
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { usePerformance } from '../../context/PerformanceContext';
import { AuroraBackground } from '../ui/ImmersiveEffects';
import gsap from 'gsap';

// Import local assets for correct Vite bundling
import accessoryGallery1 from '../../assets/qck_xxl_cs2_dragon_lore_pdp_img_buy_01.png';
import accessoryGallery2 from '../../assets/qck_xxl_cs2_dragon_lore_pdp_img_buy_02.png';
import accessoryGallery3 from '../../assets/qck_xxl_cs2_dragon_lore_pdp_img_buy_03.png';
import accessoryGallery4 from '../../assets/qck_xxl_cs2_dragon_lore_pdp_img_buy_04.png';
import accessoryGallery5 from '../../assets/qck_xxl_cs2_dragon_lore_pdp_img_buy_05.png';

interface PremiumAccessoryShowcaseProps {
  product: Product;
  hideSidebar?: boolean;
}

const ACCESSORY_ANGLES = [
  { id: 'main', name: 'Main Angle View', rotateX: 0, rotateY: 0, scale: 1.0, image_url: accessoryGallery1 },
  { id: 'perspective', name: 'Perspective View', rotateX: 5, rotateY: -5, scale: 1.05, image_url: accessoryGallery2 },
  { id: 'rolled', name: 'Rolled Profile View', rotateX: 0, rotateY: 5, scale: 1.05, image_url: accessoryGallery3 },
  { id: 'surface', name: 'Surface Texture', rotateX: -5, rotateY: 0, scale: 1.1, image_url: accessoryGallery4 },
  { id: 'packaging', name: 'Packaging View', rotateX: 0, rotateY: 0, scale: 1.05, image_url: accessoryGallery5 }
];

export const PremiumAccessoryShowcase: React.FC<PremiumAccessoryShowcaseProps> = ({ product, hideSidebar = false }) => {
  const { addItem, formatPHP } = useCart();
  const { isLowEnd } = usePerformance();
  const navigate = useNavigate();
  
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const btnSpringX = useSpring(btnX, { stiffness: 100, damping: 10 });
  const btnSpringY = useSpring(btnY, { stiffness: 100, damping: 10 });

  const containerRef = useRef<HTMLDivElement>(null);
  const accessoryRef = useRef<HTMLDivElement>(null);

  // Force reset indices and states when a new accessory product is mounted/selected
  useEffect(() => {
    setActiveAngleIndex(0);
    setQuantity(1);
  }, [product.id]);

  const activeAngle = ACCESSORY_ANGLES[activeAngleIndex];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isLowEnd || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);

    if (accessoryRef.current) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) / 60;
      const moveY = (y - centerY) / 60;
      gsap.to(accessoryRef.current, {
        rotateX: -moveY,
        rotateY: moveX,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  };

  const handleMagneticMove = (e: React.MouseEvent) => {
    if (isLowEnd) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    btnX.set(x * 0.35);
    btnY.set(y * 0.35);
  };

  const handleMagneticLeave = () => {
    if (isLowEnd) return;
    btnX.set(0);
    btnY.set(0);
  };

  const handleAddToCart = () => {
    setAdding(true);
    setTimeout(() => {
      for(let i = 0; i < quantity; i++) {
        addItem(product);
      }
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 1200);
  };

  const handleBuyNow = () => {
    for(let i = 0; i < quantity; i++) {
      addItem(product);
    }
    navigate('/cart');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  const handleCategoryClick = (catName: string) => {
    navigate(`/products?category=${encodeURIComponent(catName)}`);
  };

  const handleBrandClick = (brandName: string) => {
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#050505] overflow-x-hidden flex flex-col pt-32 pb-16 px-4 sm:px-8 lg:px-12"
    >
      <AuroraBackground />
      
      {/* Orange/Gold Ambient Lighting - Elegant, Subtle for Accessory */}
      {!isLowEnd && (
        <>
          <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none opacity-40 z-0 animate-pulse duration-[8000ms]" />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none opacity-30 z-0" />
        </>
      )}

      {/* Main Grid/Flex Container */}
      <div className="w-full max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-20 items-stretch">
        
        {/* ==================================================
            LEFT SIDEBAR: CATEGORY, SEARCH & BRAND FILTERS
           ================================================== */}
        {!hideSidebar && (
          <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-8 z-30">
            
            {/* Catalog Search */}
            <div className="glasswave-strong p-6 rounded-3xl border border-white/5 backdrop-blur-2xl space-y-4">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase flex items-center gap-3">
                <Search size={14} className="text-orange-500" /> catalog search
              </h3>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-[10px] font-bold tracking-widest focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all placeholder:text-white/20 uppercase"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-orange-500 transition-colors">
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>

            {/* Category Index */}
            <div className="glasswave-strong p-6 rounded-3xl border border-white/5 backdrop-blur-2xl space-y-6">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase flex items-center gap-3">
                <Sliders size={14} className="text-orange-500" /> CATEGORY INDEX
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Controllers', icon: Gamepad, glow: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff' },
                  { name: 'Mechanical Keyboards', icon: Keyboard, glow: 'rgba(255, 140, 0, 0.25)', color: '#ff8c00' },
                  { name: 'Gaming Mouse', icon: MousePointer, glow: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' },
                  { name: 'Headsets', icon: Headphones, glow: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' },
                  { name: 'Consoles', icon: Tv, glow: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' },
                  { name: 'Accessories', icon: Sparkles, glow: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isActive = cat.name === 'Accessories';
                  return (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`w-full py-3.5 px-5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 border flex items-center justify-between group ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-500/50 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                          : 'glasswave border-white/5 text-white/40 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={14} className={isActive ? 'text-orange-500' : 'text-white/40 group-hover:text-white transition-colors'} />
                        {cat.name}
                      </span>
                      <div 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          isActive ? 'scale-125 bg-orange-500' : 'scale-0 group-hover:scale-100 bg-white/30'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Index */}
            <div className="glasswave-strong p-6 rounded-3xl border border-white/5 backdrop-blur-2xl space-y-4">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase flex items-center gap-3">
                <Sparkles size={14} className="text-orange-500" /> BRANDS
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {['Redragon', 'Logitech', 'HyperX', 'Sony', 'SteelSeries', 'Xbox'].map((b) => {
                  const isActive = b.toLowerCase() === (product.brand || 'steelseries').toLowerCase();
                  return (
                    <button
                      key={b}
                      onClick={() => handleBrandClick(b)}
                      className={`py-3 rounded-xl text-[8px] font-black tracking-widest uppercase transition-all duration-300 text-center border ${
                        isActive
                          ? 'bg-white text-black border-white font-black shadow-lg'
                          : 'glasswave border-white/5 text-white/40 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ==================================================
            CENTER SHOWCASE: SPACIOUS ACCESSORY VIEWER & GALLERY
           ================================================== */}
        <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-8 relative min-h-[500px] lg:min-h-[680px] z-30">
          
          {/* Angle Gallery - Vertical track on Desktop, horizontal on Mobile */}
          <div className="flex xl:flex-col flex-row gap-4 justify-center z-40 shrink-0 w-full xl:w-24 order-2 xl:order-1 overflow-x-auto py-2 xl:py-0">
            {ACCESSORY_ANGLES.map((angle, idx) => (
              <button
                key={angle.id}
                onClick={() => setActiveAngleIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl glasswave overflow-hidden transition-all duration-500 group flex items-center justify-center p-2 border shrink-0 ${
                  activeAngleIndex === idx 
                    ? 'border-orange-500 scale-110 shadow-[0_0_25px_rgba(249,115,22,0.25)]' 
                    : 'border-white/5 hover:border-white/20 opacity-50 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img 
                  src={angle.image_url} 
                  alt={angle.name}
                  loading="lazy"
                  className={`w-full h-full object-contain transition-all duration-500 ${
                    activeAngleIndex === idx ? 'scale-110' : 'scale-100'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Main Showcase Stage */}
          <div className="flex-1 w-full h-full flex flex-col items-center justify-center relative min-h-[400px] order-1 xl:order-2">
            
            {/* Center Orange Subtle Spot Glow */}
            {!isLowEnd && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] bg-orange-500/10 pointer-events-none z-0 animate-pulse duration-[5000ms]" />
            )}
            
            {/* Main Stage Screen Container */}
            <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[550px] flex items-center justify-center z-10 select-none">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.id + '-' + activeAngleIndex}
                  initial={isLowEnd ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 15, rotateX: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                  exit={isLowEnd ? { opacity: 0 } : { opacity: 0, scale: 1.05, y: -15, rotateX: -5 }}
                  transition={{ duration: isLowEnd ? 0.3 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-20 w-full h-full flex flex-col items-center justify-center perspective-2000"
                >
                  {/* Floating Accessory Card */}
                  <motion.div 
                    animate={isLowEnd ? { y: 0 } : { y: [0, -12, 0] }}
                    transition={isLowEnd ? {} : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative preserve-3d w-full h-full flex items-center justify-center"
                  >
                    <div ref={accessoryRef} className="relative transition-transform duration-700 ease-out preserve-3d w-full h-full flex items-center justify-center">
                      <motion.img 
                        src={activeAngle.image_url} 
                        alt={product.name}
                        animate={isLowEnd ? {} : {
                          rotateX: activeAngle.rotateX,
                          rotateY: activeAngle.rotateY,
                          scale: activeAngle.scale * 1.05
                        }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={isLowEnd 
                          ? "max-h-[350px] sm:max-h-[420px] lg:max-h-[480px] w-full object-contain z-20 relative"
                          : "max-h-[350px] sm:max-h-[420px] lg:max-h-[480px] w-full object-contain drop-shadow-[0_45px_70px_rgba(0,0,0,0.85)] z-20 relative transition-all duration-700"}
                      />
                      
                      {/* Floating shadow */}
                      {!isLowEnd && (
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-black/70 blur-[40px] rounded-full pointer-events-none z-10 animate-pulse duration-[3000ms]" />
                      )}
                      
                      {/* Category Ambient Floor Glow */}
                      {!isLowEnd && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-orange-500/10 blur-[30px] rounded-full pointer-events-none z-10" />
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

            </div>

            {/* Ambient Spotlight following the mouse */}
            {!isLowEnd && (
              <motion.div 
                style={{ 
                  left: springX, 
                  top: springY,
                  background: `radial-gradient(400px circle at center, rgba(249,115,22,0.08), transparent 70%)`
                }}
                className="absolute pointer-events-none w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 z-0 opacity-40 blur-[80px]"
              />
            )}

          </div>
        </div>

        {/* ==================================================
            RIGHT PRODUCT PANEL: PRODUCT ARCHITECTURE & CONSOLE
           ================================================== */}
        <div className="w-full lg:w-[420px] shrink-0 z-30">
          <div className="glasswave-strong p-8 lg:p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-2xl flex flex-col justify-between space-y-8 h-full relative overflow-hidden">
            
            {/* Very subtle background light */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-orange-500/5 blur-[50px] pointer-events-none" />

            {/* Core Info */}
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black tracking-[0.4em] text-orange-500 uppercase flex items-center gap-2">
                  <Sparkles size={12} /> {product.badge || 'RGB ELITE'}
                </span>
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider">
                  ★ {product.rating || 4.9}
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="font-heading text-4xl sm:text-5xl font-black text-white leading-none tracking-tighter uppercase">
                  {product.name}
                </h1>
                <p className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                  BY {product.brand || 'STEELSERIES'} • {product.genre || 'GAMING SURFACE'}
                </p>
                <p className="text-[10px] font-bold tracking-wider text-orange-400 uppercase">
                  COMPATIBILITY: {product.platform || 'DESKTOP BATTLESTATION'}
                </p>
              </div>

              <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* View Other Angles Section */}
            <div className="space-y-4 pt-6 border-t border-white/5 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
                <span>VIEW OTHER ANGLES</span>
                <span className="text-orange-500">{ACCESSORY_ANGLES[activeAngleIndex].name}</span>
              </div>
              <div className="flex gap-3 overflow-x-auto py-1">
                {ACCESSORY_ANGLES.map((angle, idx) => (
                  <button
                    key={angle.id}
                    onClick={() => setActiveAngleIndex(idx)}
                    className={`w-10 h-10 rounded-full transition-all duration-300 border flex items-center justify-center overflow-hidden bg-white/5 shrink-0 ${
                      activeAngleIndex === idx 
                        ? 'border-orange-500 scale-115 shadow-md shadow-orange-500/20' 
                        : 'border-white/10 hover:border-white/30 hover:scale-105'
                    }`}
                    title={angle.name}
                  >
                    <img src={angle.image_url} alt={angle.name} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Grid (5 Feature Cards) */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 relative z-10">
              <div className="glasswave p-4 rounded-2xl flex flex-col gap-2 group hover:bg-white/5 transition-all duration-300 border border-white/5">
                <Maximize2 size={16} className="text-orange-500/70 group-hover:scale-115 transition-transform" />
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Dimensions</p>
                  <p className="text-xs font-black text-white uppercase tracking-widest">XXL Extended</p>
                </div>
              </div>
              <div className="glasswave p-4 rounded-2xl flex flex-col gap-2 group hover:bg-white/5 transition-all duration-300 border border-white/5">
                <Crosshair size={16} className="text-orange-500/70 group-hover:scale-115 transition-transform" />
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Performance</p>
                  <p className="text-xs font-black text-white uppercase tracking-widest">High Precision</p>
                </div>
              </div>
              <div className="glasswave p-4 rounded-2xl flex flex-col gap-2 group hover:bg-white/5 transition-all duration-300 border border-white/5">
                <Anchor size={16} className="text-orange-500/70 group-hover:scale-115 transition-transform" />
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Stability</p>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Anti-Slip Base</p>
                </div>
              </div>
              <div className="glasswave p-4 rounded-2xl flex flex-col gap-2 group hover:bg-white/5 transition-all duration-300 border border-white/5">
                <Flame size={16} className="text-orange-500/70 group-hover:scale-115 transition-transform" />
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Edition</p>
                  <p className="text-xs font-black text-white uppercase tracking-widest">CS2 Dragon Lore</p>
                </div>
              </div>
              <div className="glasswave p-4 rounded-2xl flex flex-col gap-2 group hover:bg-white/5 transition-all duration-300 border border-white/5 col-span-2">
                <Layers size={16} className="text-orange-500/70 group-hover:scale-115 transition-transform" />
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Material</p>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Premium Micro-Woven Cloth</p>
                </div>
              </div>
            </div>

            {/* Checkout Actions */}
            <div className="space-y-6 pt-6 border-t border-white/5 relative z-10">
              
              {/* Pricing & Quantity Row */}
              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Acquisition Value</p>
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {formatPHP(product.price * quantity)}
                  </span>
                </div>
                
                {/* Quantity Control */}
                <div className="flex items-center glasswave rounded-2xl h-14 px-2 border border-white/10 shrink-0">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center text-white/30 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 font-black text-lg text-white min-w-[40px] text-center tabular-nums">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(99, q + 1))}
                    className="w-10 h-full flex items-center justify-center text-white/30 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <motion.button
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  style={{ x: btnSpringX, y: btnSpringY }}
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`flex-1 h-16 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase transition-all duration-500 flex items-center justify-center gap-3 border shadow-lg ${
                    added 
                      ? 'bg-green-500 text-black border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-black border-transparent hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(249,115,22,0.2)]'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {adding ? (
                      <motion.div key="adding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin text-black" /> SYNCING
                      </motion.div>
                    ) : added ? (
                      <motion.div key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        <Check size={16} /> ACQUIRED
                      </motion.div>
                    ) : (
                      <span className="flex items-center gap-2">
                        ADD TO CART <ShoppingCart size={14} className="text-black" />
                      </span>
                    )}
                  </AnimatePresence>
                </motion.button>

               <button
                  onClick={handleBuyNow}
                  className="flex-1 h-16 rounded-2xl bg-white text-black font-black text-[10px] tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-md"
                >
                  BUY NOW
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
