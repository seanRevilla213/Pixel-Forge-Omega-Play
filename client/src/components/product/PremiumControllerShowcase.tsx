import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ChevronRight, ChevronLeft, Plus, Minus, Loader2, Check, Star } from 'lucide-react';
import type { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { AuroraBackground } from '../ui/ImmersiveEffects';

interface PremiumControllerShowcaseProps {
  product: Product;
}

export const PremiumControllerShowcase: React.FC<PremiumControllerShowcaseProps> = ({ product }) => {
  const { addItem, formatPHP } = useCart();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const activeVariant = variants[currentIndex] || { name: 'Standard', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.3)', image_url: product.image_url };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleNext = () => {
    if (isRotating) return;
    setIsRotating(true);
    setCurrentIndex((prev) => (prev + 1) % variants.length);
    setTimeout(() => setIsRotating(false), 800);
  };

  const handlePrev = () => {
    if (isRotating) return;
    setIsRotating(true);
    setCurrentIndex((prev) => (prev - 1 + variants.length) % variants.length);
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
      className="relative min-h-screen bg-matte-black overflow-hidden flex flex-col items-center justify-center pt-24 pb-12 px-6"
    >
      <AuroraBackground />
      
      {/* Dynamic Spotlight */}
      <motion.div 
        style={{ 
          left: springX, 
          top: springY,
          background: `radial-gradient(600px circle at center, ${activeVariant.glow}, transparent 80%)`
        }}
        className="fixed pointer-events-none w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 z-0 opacity-40 blur-[100px]"
      />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Cinematic Stage */}
        <div className="relative flex items-center justify-center aspect-square">
          {/* Stage Glow */}
          <div 
            className="absolute inset-0 rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
            style={{ backgroundColor: activeVariant.color }}
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ rotateY: -45, opacity: 0, scale: 0.8, x: -100 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1, x: 0 }}
              exit={{ rotateY: 45, opacity: 0, scale: 0.8, x: 100 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="relative z-20 w-full h-full flex items-center justify-center perspective-1000"
            >
              {/* Product Image with Hover Tilt */}
              <motion.div
                whileHover={{ rotateX: 10, rotateY: 10 }}
                style={{ rotateX: 0, rotateY: 0 }}
                className="relative transition-transform duration-500 ease-out preserve-3d"
              >
                <img 
                  src={activeVariant.image_url} 
                  alt={activeVariant.name}
                  className="max-w-full h-auto drop-shadow-[0_50px_50px_rgba(0,0,0,0.5)] transition-all duration-700"
                />
                
                {/* Dynamic Reflection/Shadow */}
                <div 
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-10 blur-3xl opacity-50 rounded-full"
                  style={{ backgroundColor: activeVariant.color }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-30">
            <button 
              onClick={handlePrev}
              className="w-14 h-14 rounded-full glasswave flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleNext}
              className="w-14 h-14 rounded-full glasswave flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all group"
            >
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Side: Info & Selection */}
        <div className="space-y-10 text-center lg:text-left">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
              <span className="text-[10px] font-black tracking-[0.5em] text-luxury-cyan uppercase">Premium Hardware</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1.5 text-[10px] font-black text-luxury-violet uppercase tracking-widest">
                <Star size={14} fill="currentColor" /> {product.rating} SERIES
              </div>
            </motion.div>
            
            <motion.h1 
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-heading text-5xl lg:text-7xl font-black text-white leading-tight tracking-tighter"
            >
              {product.name}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              className="text-text-secondary text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Experience elite precision and cinematic ergonomics. Hand-crafted for the ultimate interactive experience across all platforms.
            </motion.p>
          </div>

          {/* Variant Selector */}
          <div className="space-y-6">
            <p className="text-[9px] text-text-muted font-black tracking-[0.4em] uppercase">Select Edition</p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`relative group flex items-center gap-4 p-4 rounded-3xl transition-all duration-500 ${
                    currentIndex === i ? 'glasswave-strong scale-105' : 'glasswave hover:bg-white/5'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      currentIndex === i ? 'scale-110' : 'scale-90 group-hover:scale-100'
                    }`}
                    style={{ backgroundColor: v.color, boxShadow: currentIndex === i ? `0 0 20px ${v.glow}` : 'none' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                    currentIndex === i ? 'text-white' : 'text-text-secondary'
                  }`}>
                    {v.name}
                  </span>
                  {currentIndex === i && (
                    <motion.div 
                      layoutId="variant-ring"
                      className="absolute inset-0 rounded-3xl border-2 border-white/20 pointer-events-none"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="pt-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start">
              <div className="flex items-center glasswave rounded-3xl h-20 p-2">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-16 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors"
                >
                  <Minus size={24} />
                </button>
                <span className="px-6 font-black text-2xl text-white min-w-[80px] text-center">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(q => Math.min(99, q + 1))}
                  className="w-16 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors"
                >
                  <Plus size={24} />
                </button>
              </div>

              <div className="text-center sm:text-left min-w-[200px]">
                <p className="text-[9px] text-text-muted font-black tracking-[0.4em] uppercase mb-1">Total Valuation</p>
                <span className="text-4xl font-black text-white tracking-tighter">
                  {formatPHP(product.price * quantity)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`relative group h-24 w-full lg:w-auto min-w-[320px] rounded-[2rem] font-black text-xs tracking-[0.4em] uppercase transition-all duration-700 overflow-hidden ${
                added ? 'bg-green-500' : 'bg-white text-matte-black hover:scale-105 active:scale-95'
              }`}
            >
              <AnimatePresence mode="wait">
                {adding ? (
                  <motion.div 
                    key="adding"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <Loader2 size={24} className="animate-spin" /> SYNCING UNIT
                  </motion.div>
                ) : added ? (
                  <motion.div 
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-3 text-white"
                  >
                    <Check size={24} /> GEAR ACQUIRED
                  </motion.div>
                ) : (
                  <motion.div 
                    key="standard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-3"
                  >
                    INITIALIZE ACQUISITION
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Animated Background Effect */}
              {!added && !adding && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Specs Footer */}
      <div className="fixed bottom-12 left-12 right-12 z-20 flex flex-wrap items-center justify-between gap-8 opacity-30 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="flex gap-12">
          <div className="space-y-1">
            <p className="text-[8px] font-black tracking-widest uppercase">Connectivity</p>
            <p className="text-[10px] font-bold uppercase">2.4GHz Wireless / BT 5.2</p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black tracking-widest uppercase">Response</p>
            <p className="text-[10px] font-bold uppercase">0.1ms Ultra-Low Latency</p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black tracking-widest uppercase">Precision</p>
            <p className="text-[10px] font-bold uppercase">Haptic Engine Elite</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-[8px] font-black tracking-widest uppercase mb-1">Edition Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase">Verified Stock</span>
          </div>
        </div>
      </div>
    </div>
  );
};
