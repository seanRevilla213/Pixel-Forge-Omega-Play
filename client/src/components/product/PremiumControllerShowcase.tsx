import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ChevronRight, ChevronLeft, Plus, Minus, Loader2, Check, Star, ShoppingCart, Zap, Battery, Crosshair, Shield, Truck, Package } from 'lucide-react';
import type { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { AuroraBackground } from '../ui/ImmersiveEffects';

interface PremiumControllerShowcaseProps {
  product: Product;
}

const ANGLES = [
  { id: 'front', name: 'Front View', rotateY: 0, rotateX: 0, scale: 1 },
  { id: 'side', name: 'Side View', rotateY: -35, rotateX: 5, scale: 0.9 },
  { id: 'back', name: 'Back View', rotateY: 180, rotateX: 0, scale: 0.95 },
  { id: 'top', name: 'Top Angle', rotateY: 0, rotateX: 45, scale: 0.85 },
  { id: 'detail', name: 'Close-up Detail', rotateY: 15, rotateX: 10, scale: 1.4 },
];

const FEATURES = [
  { icon: Zap, title: 'Wireless Connectivity', desc: 'Zero-latency 2.4GHz' },
  { icon: Battery, title: 'Long Battery Life', desc: 'Up to 40 hours' },
  { icon: Crosshair, title: 'Ergonomic Design', desc: 'Cinematic precision' },
  { icon: Shield, title: 'Stable Connection', desc: 'Anti-interference' }
];

export const PremiumControllerShowcase: React.FC<PremiumControllerShowcaseProps> = ({ product }) => {
  const { addItem, formatPHP } = useCart();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  
  // Mouse tracking for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product.variants) {
      setVariants(JSON.parse(product.variants));
    }
  }, [product.variants]);

  const activeVariant = variants[currentIndex] || { id: 'default', name: 'Carbon Black', color: '#080808', glow: 'rgba(255, 255, 255, 0.2)', image_url: product.image_url };
  const activeAngle = ANGLES[activeAngleIndex];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleNextAngle = () => {
    if (isRotating) return;
    setIsRotating(true);
    setActiveAngleIndex((prev) => (prev + 1) % ANGLES.length);
    setTimeout(() => setIsRotating(false), 800);
  };

  const handlePrevAngle = () => {
    if (isRotating) return;
    setIsRotating(true);
    setActiveAngleIndex((prev) => (prev - 1 + ANGLES.length) % ANGLES.length);
    setTimeout(() => setIsRotating(false), 800);
  };

  const handleAddToCart = () => {
    setAdding(true);
    setTimeout(() => {
      for(let i=0; i<quantity; i++) {
        addItem(product, activeVariant);
      }
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 1000);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-matte-black overflow-x-hidden flex flex-col pt-24 pb-12 px-6 lg:px-12"
    >
      <AuroraBackground />
      
      {/* Dynamic Spotlight */}
      <motion.div 
        style={{ 
          left: springX, 
          top: springY,
          background: `radial-gradient(800px circle at center, ${activeVariant.glow}, transparent 70%)`
        }}
        className="fixed pointer-events-none w-[1600px] h-[1600px] -translate-x-1/2 -translate-y-1/2 z-0 opacity-30 blur-[120px]"
      />

      <div className="w-full mx-auto flex flex-col xl:flex-row gap-12 relative z-10 min-h-screen items-center">
        
        {/* Left Side: Vertical Image Gallery */}
        <div className="hidden xl:flex flex-col gap-6 justify-center z-20 shrink-0 w-24">
          {ANGLES.map((angle, idx) => (
            <button
              key={angle.id}
              onClick={() => setActiveAngleIndex(idx)}
              className={`relative w-20 h-20 rounded-2xl glasswave overflow-hidden transition-all duration-300 group ${
                activeAngleIndex === idx ? 'border-2 border-white/50 scale-110 shadow-lg' : 'border border-white/10 hover:scale-105 opacity-60 hover:opacity-100'
              }`}
              style={{ boxShadow: activeAngleIndex === idx ? `0 0 20px ${activeVariant.glow}` : 'none' }}
            >
              <img 
                src={activeVariant.image_url} 
                alt={angle.name}
                className="w-full h-full object-contain p-2"
                style={{ transform: `rotateY(${angle.rotateY}deg) rotateX(${angle.rotateX}deg)` }}
              />
              {activeAngleIndex === idx && (
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
              )}
            </button>
          ))}
        </div>

        {/* Center: Main Cinematic Showcase */}
        <div className="flex-1 flex flex-col items-center justify-center relative w-full h-[80vh] min-h-[600px]">
          
          {/* Main Stage */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Stage Ambient Glow */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[100px] opacity-20 transition-colors duration-1000"
              style={{ backgroundColor: activeVariant.color }}
            />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentIndex}-${activeAngleIndex}`}
                initial={{ rotateY: -30, opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ rotateY: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ rotateY: 30, opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-20 w-full h-full flex items-center justify-center perspective-1000"
              >
                {/* Floating Controller with 3D Effect */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full h-full flex items-center justify-center preserve-3d"
                >
                  <motion.div
                    whileHover={{ rotateX: 5, rotateY: 5, scale: 1.05 }}
                    style={{ 
                      rotateX: activeAngle.rotateX, 
                      rotateY: activeAngle.rotateY,
                      scale: activeAngle.scale
                    }}
                    className="relative transition-transform duration-700 ease-out preserve-3d w-full h-full flex items-center justify-center p-8"
                  >
                    <img 
                      key={activeVariant.image_url}
                      src={activeVariant.image_url} 
                      alt={activeVariant.name}
                      className="w-full h-full object-contain drop-shadow-[0_80px_80px_rgba(0,0,0,0.8)] scale-125 hover:scale-[1.35] transition-transform duration-1000"
                    />
                    
                    {/* Shadow underneath */}
                    <div 
                      className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-12 blur-3xl opacity-50 rounded-[100%]"
                      style={{ backgroundColor: activeVariant.color }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* View Other Angles Carousel Navigation */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-10 z-30 pointer-events-none">
              <button 
                onClick={handlePrevAngle}
                className="w-16 h-16 rounded-full glasswave-strong flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all group pointer-events-auto"
              >
                <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={handleNextAngle}
                className="w-16 h-16 rounded-full glasswave-strong flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all group pointer-events-auto"
              >
                <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* View Other Angles Horizontal (Mobile/Tablet) */}
          <div className="xl:hidden w-full overflow-x-auto pb-4 hide-scrollbar flex justify-center gap-4 mt-8 z-20">
            {ANGLES.map((angle, idx) => (
              <button
                key={angle.id}
                onClick={() => setActiveAngleIndex(idx)}
                className={`flex-shrink-0 relative w-24 h-24 rounded-2xl glasswave overflow-hidden transition-all duration-300 group ${
                  activeAngleIndex === idx ? 'border-2 border-white/50 scale-105' : 'border border-white/10 opacity-60'
                }`}
              >
                <img 
                  src={activeVariant.image_url} 
                  alt={angle.name}
                  className="w-full h-full object-contain p-3"
                  style={{ transform: `rotateY(${angle.rotateY}deg) rotateX(${angle.rotateX}deg)` }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Information Panel */}
        <div className="xl:w-[500px] 2xl:w-[600px] shrink-0 flex flex-col justify-center space-y-8 z-20 bg-midnight/40 p-10 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
          
          {/* Header & Badges */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-luxury-violet/20 text-luxury-violet text-[10px] font-black tracking-widest border border-luxury-violet/30">
                {product.badge || 'PREMIUM'}
              </span>
              <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Star size={14} fill="currentColor" /> {product.rating} ({product.review_count} Reviews)
              </div>
              {product.in_stock ? (
                <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <Check size={14} /> In Stock
                </div>
              ) : null}
            </div>

            <h1 className="font-heading text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-end gap-4">
              <span className="text-4xl font-black text-white">
                {formatPHP(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xl font-bold text-text-muted line-through mb-1">
                  {formatPHP(product.original_price)}
                </span>
              )}
            </div>
            
            <p className="text-text-secondary text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Color Variant Selector */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-end">
              <p className="text-[10px] text-text-muted font-black tracking-[0.3em] uppercase">Color Variant</p>
              <p className="text-xs font-bold text-white">{activeVariant.name}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`relative w-12 h-12 rounded-full transition-all duration-300 ${
                    currentIndex === i ? 'scale-110 border-2 border-white' : 'scale-90 border border-white/20 hover:scale-100 hover:border-white/50'
                  }`}
                  style={{ backgroundColor: v.color, boxShadow: currentIndex === i ? `0 0 20px ${v.glow}` : 'none' }}
                >
                  <span className="sr-only">{v.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="glasswave p-3 rounded-2xl flex flex-col gap-2 hover:bg-white/5 transition-colors group">
                <feature.icon size={18} className="text-luxury-cyan group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="text-xs font-bold text-white">{feature.title}</h4>
                  <p className="text-[10px] text-text-muted">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Purchase Section */}
          <div className="space-y-4 pt-6">
            <div className="flex gap-4">
              <div className="flex items-center justify-between glasswave rounded-2xl p-2 w-32 shrink-0 border border-white/10">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-white transition-colors bg-white/5 rounded-lg"
                >
                  <Minus size={16} />
                </button>
                <span className="font-black text-white text-lg">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(q => Math.min(99, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-white transition-colors bg-white/5 rounded-lg"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || added}
                className={`relative flex-1 group h-14 rounded-2xl font-black text-sm tracking-widest uppercase transition-all duration-500 overflow-hidden ${
                  added ? 'bg-green-500 text-white' : 'bg-luxury-cyan text-midnight hover:scale-[1.02] active:scale-[0.98]'
                }`}
                style={{ boxShadow: added ? 'none' : '0 0 20px rgba(6, 182, 212, 0.4)' }}
              >
                <AnimatePresence mode="wait">
                  {adding ? (
                    <motion.div key="adding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" /> SYNCING
                    </motion.div>
                  ) : added ? (
                    <motion.div key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                      <Check size={18} /> ADDED TO CART
                    </motion.div>
                  ) : (
                    <motion.div key="standard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                      <ShoppingCart size={18} /> ADD TO CART
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
            
            <button className="w-full h-14 rounded-2xl font-black text-sm tracking-widest uppercase border-2 border-white/20 text-white hover:bg-white hover:text-midnight transition-all duration-300">
              BUY NOW
            </button>
          </div>

          {/* Shipping Info */}
          <div className="flex items-center justify-between pt-4 text-[10px] font-bold text-text-muted uppercase tracking-wider border-t border-white/10">
            <div className="flex items-center gap-2">
              <Truck size={14} /> Free Global Shipping
            </div>
            <div className="flex items-center gap-2">
              <Package size={14} /> Ships in 24h
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
