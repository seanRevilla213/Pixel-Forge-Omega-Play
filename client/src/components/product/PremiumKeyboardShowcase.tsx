import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Plus, Minus, Loader2, Check, Star, Cpu, Sparkles, Layers } from 'lucide-react';
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
  const [variants, setVariants] = useState<any[]>([]);
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Mouse tracking for spotlight and floating effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  // Brands requested by user
  const brands = [
    'Redragon', 'Razer', 'Logitech', 'Keychron', 
    'Royal Kludge', 'Corsair', 'SteelSeries', 'HyperX'
  ];

  useEffect(() => {
    // Fetch all keyboards in this category for filtering
    api.get(`/products?category=${encodeURIComponent('Mechanical Keyboards')}&limit=50`).then(({ data }) => {
      setAllKeyboards(data.products);
    });
  }, []);

  useEffect(() => {
    if (currentProduct.variants) {
      try {
        setVariants(JSON.parse(currentProduct.variants));
        setVariantIndex(0);
      } catch (e) {
        setVariants([]);
      }
    }
  }, [currentProduct]);

  const activeVariant = variants[variantIndex] || { 
    name: 'Standard', 
    color: '#00f0ff', 
    glow: 'rgba(0, 240, 255, 0.3)', 
    description: 'Original configuration' 
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);

    // Floating parallax for the keyboard
    if (keyboardRef.current) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) / 30;
      const moveY = (y - centerY) / 30;
      gsap.to(keyboardRef.current, {
        rotateX: -moveY,
        rotateY: moveX,
        duration: 1,
        ease: "power2.out"
      });
    }
  };

  const handleBrandSwitch = (brand: string) => {
    const target = allKeyboards.find(k => k.brand === brand);
    if (target) {
      setLoading(true);
      setTimeout(() => {
        setCurrentProduct(target);
        setLoading(false);
      }, 500);
    }
  };

  const handleAddToCart = () => {
    setAdding(true);
    setTimeout(() => {
      for(let i=0; i<quantity; i++) {
        addItem(currentProduct, activeVariant as any);
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
      className="relative min-h-screen bg-matte-black overflow-hidden flex flex-col pt-32 pb-12 px-6"
    >
      <AuroraBackground />
      
      {/* Premium Glass Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.3,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Dynamic Brand Filter Drawer */}
      <div className="relative z-30 max-w-7xl mx-auto w-full mb-12">
        <div className="flex flex-col gap-6">
          <p className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase text-center lg:text-left">Engineered By</p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => handleBrandSwitch(brand)}
                disabled={!allKeyboards.some(k => k.brand === brand)}
                className={`relative px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-500 overflow-hidden ${
                  currentProduct.brand === brand 
                    ? 'bg-white text-matte-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                    : 'glasswave text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-20'
                }`}
              >
                {brand}
                {currentProduct.brand === brand && (
                  <motion.div 
                    layoutId="active-brand-glow"
                    className="absolute inset-0 bg-white/20 blur-xl"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 flex-1">
        
        {/* Left Side: 3D Cinematic Display */}
        <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-[600px]">
          {/* Spotlight Glow */}
          <motion.div 
            style={{ 
              left: springX, 
              top: springY,
              background: `radial-gradient(500px circle at center, ${activeVariant.glow}, transparent 80%)`
            }}
            className="absolute pointer-events-none w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 z-0 opacity-30 blur-[80px]"
          />

          <AnimatePresence mode="wait">
            {!loading && (
              <motion.div
                key={currentProduct.id}
                initial={{ rotateX: 20, rotateY: -30, opacity: 0, scale: 0.8, y: 50 }}
                animate={{ rotateX: 0, rotateY: 0, opacity: 1, scale: 1, y: 0 }}
                exit={{ rotateX: -20, rotateY: 30, opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-20 w-full flex items-center justify-center perspective-2000"
              >
                <div 
                  ref={keyboardRef}
                  className="relative preserve-3d group cursor-none"
                >
                  <img 
                    src={currentProduct.image_url} 
                    alt={currentProduct.name}
                    className="max-w-full h-auto drop-shadow-[0_80px_100px_rgba(0,0,0,0.6)] rounded-[2rem]"
                  />
                  
                  {/* Floating Idle Animation */}
                  <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-4 border border-white/5 rounded-[2.5rem] pointer-events-none"
                  />

                  {/* Glass Reflection Overlay */}
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-50" />
                  
                  {/* Shadow Bloom */}
                  <div 
                    className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-4/5 h-20 blur-[100px] opacity-40 transition-colors duration-1000"
                    style={{ backgroundColor: activeVariant.color }}
                  />
                </div>
              </motion.div>
            )}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <Loader2 size={48} className="animate-spin text-luxury-cyan" />
                <p className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">Reconfiguring Matrix</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Configuration Interface */}
        <div className="space-y-12">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Cpu size={12} className="text-luxury-cyan" />
                <span className="text-[9px] font-black tracking-widest text-white uppercase">{currentProduct.brand} SERIES</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-luxury-violet">
                <Star size={12} fill="currentColor" />
                <span className="text-[9px] font-black tracking-widest uppercase">{currentProduct.rating} / 5.0</span>
              </div>
            </motion.div>
            
            <h1 className="font-heading text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              {currentProduct.name.split(' ').map((word, i) => (
                <span key={i} className={i === 0 ? "" : "opacity-40 italic block ml-8"}>{word} </span>
              ))}
            </h1>
            
            <p className="text-text-secondary text-lg leading-relaxed max-w-xl font-medium opacity-60">
              {currentProduct.description}
            </p>
          </div>

          {/* Switch Selector - User requested specific styles */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Switch Architecture</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-luxury-cyan">
                <Sparkles size={14} /> <span>{activeVariant.type} FEEL</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setVariantIndex(i)}
                  className={`relative p-6 rounded-[2rem] transition-all duration-700 text-left overflow-hidden group ${
                    variantIndex === i ? 'glasswave-strong border-white/20' : 'glasswave border-transparent hover:bg-white/5'
                  }`}
                >
                  <div 
                    className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-all duration-700 ${
                      variantIndex === i ? 'scale-110 rotate-12' : 'scale-90 opacity-40 group-hover:opacity-100'
                    }`}
                    style={{ backgroundColor: v.color, boxShadow: variantIndex === i ? `0 0 30px ${v.glow}` : 'none' }}
                  >
                    <Layers size={20} className="text-white" />
                  </div>
                  <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${variantIndex === i ? 'text-white' : 'text-text-muted'}`}>
                    {v.name}
                  </h4>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter line-clamp-1">{v.description}</p>
                  
                  {variantIndex === i && (
                    <motion.div 
                      layoutId="switch-indicator"
                      className="absolute bottom-0 left-0 w-full h-1 bg-white"
                      style={{ backgroundColor: v.color }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Acquisition Module */}
          <div className="glasswave-strong rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group/module">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/module:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-2 text-center md:text-left">
                <p className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">Investment</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white tracking-tighter">
                    {formatPHP(currentProduct.price * quantity)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center glasswave rounded-2xl h-16 border-white/10">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-14 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors"><Minus size={18} /></button>
                  <span className="px-4 font-black text-xl text-white min-w-[50px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(99, q + 1))} className="w-14 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors"><Plus size={18} /></button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`luxury-btn h-16 px-10 min-w-[220px] text-[10px] tracking-[0.3em] font-black ${
                    added ? 'bg-green-500/20 border-green-500/50 text-green-400' : ''
                  }`}
                >
                  {adding ? (
                    <div className="flex items-center gap-3"><Loader2 size={18} className="animate-spin" /> SYNCING</div>
                  ) : added ? (
                    <div className="flex items-center gap-3"><Check size={18} /> ACQUIRED</div>
                  ) : (
                    "INITIALIZE ORDER"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic HUD Footer */}
      <div className="max-w-7xl mx-auto w-full mt-12 pt-12 border-t border-white/5 flex flex-wrap justify-between gap-12 opacity-40 hover:opacity-100 transition-opacity duration-1000">
        <div className="flex gap-16">
          <div className="space-y-2">
            <p className="text-[8px] font-black tracking-[0.4em] uppercase text-luxury-cyan">Polling Rate</p>
            <p className="text-xs font-bold text-white tracking-widest">8000Hz HYPER-POLLING</p>
          </div>
          <div className="space-y-2">
            <p className="text-[8px] font-black tracking-[0.4em] uppercase text-luxury-violet">Response</p>
            <p className="text-xs font-bold text-white tracking-widest">0.2ms OPTICAL ACTUATION</p>
          </div>
          <div className="space-y-2">
            <p className="text-[8px] font-black tracking-[0.4em] uppercase text-indigo-400">Durability</p>
            <p className="text-xs font-bold text-white tracking-widest">100M KEYPRESS LIFESPAN</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 glasswave px-6 py-4 rounded-3xl">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
          <p className="text-[9px] font-black tracking-widest text-white uppercase">Neural Link Established / Secure Protocol</p>
        </div>
      </div>
    </div>
  );
};
