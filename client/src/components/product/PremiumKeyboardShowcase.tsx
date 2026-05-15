import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Plus, Minus, Loader2, Check, Sparkles, Eye, ShieldCheck, Zap } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { AuroraBackground } from '../ui/ImmersiveEffects';
import api from '../../api/axiosInstance';
import gsap from 'gsap';

interface PremiumKeyboardShowcaseProps {
  product: Product;
}

export const PremiumKeyboardShowcase: React.FC<PremiumKeyboardShowcaseProps> = ({ product: initialProduct }) => {
  const { addItem, formatPHP } = useCart();
  const [currentProduct, setCurrentProduct] = useState<Product>(initialProduct);
  const [allKeyboards, setAllKeyboards] = useState<Product[]>([]);
  const [angles, setAngles] = useState<any[]>([]);
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Mouse tracking for spotlight and floating effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Magnetic button effect values
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const btnSpringX = useSpring(btnX, { stiffness: 100, damping: 10 });
  const btnSpringY = useSpring(btnY, { stiffness: 100, damping: 10 });

  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  const brands = [
    'Redragon', 'Razer', 'Logitech', 'Keychron', 
    'Royal Kludge', 'Corsair', 'SteelSeries', 'HyperX'
  ];

  useEffect(() => {
    api.get(`/products?category=${encodeURIComponent('Mechanical Keyboards')}&limit=50`).then(({ data }) => {
      setAllKeyboards(data.products);
    });
  }, []);

  useEffect(() => {
    if (currentProduct.variants) {
      try {
        setAngles(JSON.parse(currentProduct.variants));
        setActiveAngleIndex(0);
      } catch (e) {
        setAngles([]);
      }
    }
  }, [currentProduct]);

  const activeAngle = angles[activeAngleIndex] || { 
    name: 'Default View', 
    color: '#ff8c00', 
    glow: 'rgba(255, 140, 0, 0.3)', 
    image_url: currentProduct.image_url 
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);

    if (keyboardRef.current) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) / 40;
      const moveY = (y - centerY) / 40;
      gsap.to(keyboardRef.current, {
        rotateX: -moveY,
        rotateY: moveX,
        duration: 1.2,
        ease: "power3.out"
      });
    }
  };

  const handleMagneticMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    btnX.set(x * 0.4);
    btnY.set(y * 0.4);
  };

  const handleMagneticLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };

  const handleBrandSwitch = (brand: string) => {
    const target = allKeyboards.find(k => k.brand === brand);
    if (target) {
      setLoading(true);
      setTimeout(() => {
        setCurrentProduct(target);
        setLoading(false);
      }, 600);
    }
  };

  const handleAddToCart = () => {
    setAdding(true);
    setTimeout(() => {
      for(let i=0; i<quantity; i++) {
        addItem(currentProduct, activeAngle as any);
      }
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 1200);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-matte-black overflow-hidden flex flex-col pt-32 pb-12 px-6"
    >
      <AuroraBackground />
      
      {/* Orange Ambient Glow Spheroids */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 2000, 
              y: Math.random() * 1000,
              opacity: 0.1,
              scale: Math.random() * 0.5
            }}
            animate={{
              y: [null, -200],
              opacity: [0.1, 0]
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-amber-400 rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Brand Selection Overlay */}
      <div className="relative z-30 max-w-7xl mx-auto w-full mb-16">
        <div className="flex flex-col gap-6">
          <p className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase text-center lg:text-left">Select Manufacturer</p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => handleBrandSwitch(brand)}
                disabled={!allKeyboards.some(k => k.brand === brand)}
                className={`relative px-8 py-4 rounded-3xl text-[10px] font-black tracking-widest uppercase transition-all duration-700 ${
                  currentProduct.brand === brand 
                    ? 'bg-white text-matte-black scale-110 shadow-[0_20px_40px_rgba(255,165,0,0.2)]' 
                    : 'glasswave text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-20'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative z-10 flex-1">
        
        {/* Left Side: Perspective Stage (7/12 cols) */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-h-[500px] lg:min-h-[700px]">
          {/* Mouse-follow Ambient Spotlight */}
          <motion.div 
            style={{ 
              left: springX, 
              top: springY,
              background: `radial-gradient(600px circle at center, ${activeAngle.glow}, transparent 80%)`
            }}
            className="absolute pointer-events-none w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 z-0 opacity-40 blur-[120px]"
          />

          <AnimatePresence mode="wait">
            {!loading && (
              <motion.div
                key={currentProduct.id + activeAngleIndex}
                initial={{ rotateY: -45, opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                animate={{ rotateY: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ rotateY: 45, opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-20 w-full flex items-center justify-center perspective-2000"
              >
                <div ref={keyboardRef} className="relative preserve-3d">
                  <motion.img 
                    src={activeAngle.image_url} 
                    alt={currentProduct.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = currentProduct.image_url;
                    }}
                    className="max-w-[110%] h-auto drop-shadow-[0_100px_120px_rgba(0,0,0,0.7)] rounded-[3rem]"
                  />
                  
                  {/* Floating Idle Loop */}
                  <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-8 border border-white/5 rounded-[4rem] pointer-events-none"
                  />

                  {/* Dynamic RGB Reflections */}
                  <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-orange-500/10 via-transparent to-white/5 pointer-events-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Product Matrix (5/12 cols) */}
        <div className="lg:col-span-5 space-y-16">
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black tracking-[0.6em] text-orange-500 uppercase">{currentProduct.brand} // ELITE</span>
              <div className="h-px flex-1 bg-gradient-to-r from-orange-500/30 to-transparent" />
            </div>
            
            <h1 className="font-heading text-6xl lg:text-8xl font-black text-white leading-none tracking-tighter">
              {currentProduct.name}
            </h1>
            
            <p className="text-text-secondary text-xl leading-relaxed font-medium opacity-50 max-w-lg">
              {currentProduct.description}
            </p>
          </div>

          {/* VIEW OTHER ANGLE Gallery System */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">VIEW OTHER ANGLE</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-orange-500">
                <Eye size={14} /> <span>INTERACTIVE PREVIEW</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {angles.map((angle, i) => (
                <button
                  key={angle.id}
                  onClick={() => setActiveAngleIndex(i)}
                  className={`group relative aspect-[4/3] rounded-[2rem] overflow-hidden transition-all duration-700 ${
                    activeAngleIndex === i ? 'glasswave-strong scale-105 shadow-[0_0_40px_rgba(255,165,0,0.3)]' : 'glasswave hover:bg-white/5'
                  }`}
                >
                  <img 
                    src={angle.image_url} 
                    alt={angle.name} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = currentProduct.image_url;
                    }}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity duration-700"
                  />
                  <div className={`absolute inset-0 transition-all duration-700 ${activeAngleIndex === i ? 'bg-orange-500/10' : 'bg-transparent group-hover:bg-white/5'}`} />
                  
                  {/* Active Indicator */}
                  {activeAngleIndex === i && (
                    <motion.div 
                      layoutId="angle-active-indicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 shadow-[0_-5px_15px_rgba(249,115,22,0.5)]"
                    />
                  )}

                  {/* Spotlight Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-orange-500/20 to-transparent pointer-events-none" />
                </button>
              ))}
            </div>
          </div>

          {/* Luxury Purchase Panel */}
          <div className="glasswave-strong rounded-[4rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group/panel">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover/panel:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 flex flex-col gap-12">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[9px] font-black tracking-[0.4em] text-white/30 uppercase">Unit Valuation</p>
                  <p className="text-5xl font-black text-white tracking-tighter">
                    {formatPHP(currentProduct.price * quantity)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-white/40 uppercase">Verified Stock</span>
                  </div>
                  <p className="text-[10px] font-bold text-orange-500 tracking-widest uppercase">READY FOR DISPATCH</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center glasswave rounded-3xl h-20 p-2 border-white/10">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-16 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors"><Minus size={20} /></button>
                  <span className="px-6 font-black text-2xl text-white min-w-[60px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(99, q + 1))} className="w-16 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors"><Plus size={20} /></button>
                </div>

                <motion.button
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  style={{ x: btnSpringX, y: btnSpringY }}
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`luxury-btn flex-1 h-20 rounded-[2.5rem] font-black text-[11px] tracking-[0.4em] uppercase transition-all duration-700 ${
                    added ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white text-matte-black'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {adding ? (
                      <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3"><Loader2 size={20} className="animate-spin" /> SYNCING</motion.div>
                    ) : added ? (
                      <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3"><Check size={20} /> ACQUIRED</motion.div>
                    ) : (
                      "INITIALIZE ACQUISITION"
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3 text-[8px] font-black uppercase text-white/30 tracking-widest">
                  <ShieldCheck size={14} className="text-orange-500" /> Secure Protocol
                </div>
                <div className="flex items-center gap-3 text-[8px] font-black uppercase text-white/30 tracking-widest">
                  <Zap size={14} className="text-orange-500" /> Priority Build
                </div>
                <div className="flex items-center gap-3 text-[8px] font-black uppercase text-white/30 tracking-widest">
                  <Sparkles size={14} className="text-orange-500" /> Elite Grade
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
