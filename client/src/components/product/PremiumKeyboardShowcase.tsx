import { useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Plus, Minus, Loader2, Check, Sparkles, Eye, ShieldCheck, Zap } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { AuroraBackground } from '../ui/ImmersiveEffects';
import gsap from 'gsap';

interface PremiumKeyboardShowcaseProps {
  product: Product;
}

const KEYBOARD_ANGLES = [
  { id: 'front', name: 'Front RGB Keyboard View', rotateX: 2, rotateY: -2, scale: 1.05, image_url: '/products/keyboard-front.jpg' },
  { id: 'top', name: 'Top Angle Keyboard View', rotateX: 8, rotateY: 0, scale: 1.0, image_url: '/products/keyboard-top.jpg' },
  { id: 'perspective', name: 'Perspective Side Angle', rotateX: 5, rotateY: -5, scale: 1.1, image_url: '/products/keyboard-perspective.jpg' },
  { id: 'side', name: 'Side Profile Keyboard View', rotateX: 0, rotateY: -8, scale: 1.15, image_url: '/products/keyboard-side.jpg' }
];

export const PremiumKeyboardShowcase: React.FC<PremiumKeyboardShowcaseProps> = ({ product: initialProduct }) => {
  const { addItem, formatPHP } = useCart();
  const [currentProduct] = useState<Product>(initialProduct);
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const btnSpringX = useSpring(btnX, { stiffness: 100, damping: 10 });
  const btnSpringY = useSpring(btnY, { stiffness: 100, damping: 10 });

  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  const activeAngle = KEYBOARD_ANGLES[activeAngleIndex];

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
      const moveX = (x - centerX) / 50;
      const moveY = (y - centerY) / 50;
      gsap.to(keyboardRef.current, {
        rotateX: -moveY,
        rotateY: moveX,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  };

  const handleMagneticMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    btnX.set(x * 0.35);
    btnY.set(y * 0.35);
  };

  const handleMagneticLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };

  const handleAddToCart = () => {
    setAdding(true);
    setTimeout(() => {
      for(let i=0; i<quantity; i++) {
        addItem(currentProduct);
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
      className="relative min-h-screen bg-[#050505] overflow-hidden flex flex-col pt-40 pb-20 px-8"
    >
      <AuroraBackground />
      
      {/* Premium Orange Ambient Lighting */}
      <div className="absolute top-[10%] left-[-5%] w-[800px] h-[800px] bg-orange-600/10 blur-[160px] rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none opacity-40" />

      <div className="w-full mx-auto flex flex-col xl:flex-row gap-16 items-center relative z-20 min-h-[85vh]">
        
        {/* Left: Product Stage & Gallery */}
        <div className="flex-1 flex flex-col items-center gap-12 w-full h-[85vh]">
          {/* Main Stage */}
          <div className="relative flex items-center justify-center w-full flex-1">
          {/* Mouse-follow spotlight */}
          <motion.div 
            style={{ 
              left: springX, 
              top: springY,
              background: `radial-gradient(500px circle at center, rgba(255,140,0,0.2), transparent 80%)`
            }}
            className="absolute pointer-events-none w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 z-0 opacity-40 blur-[100px]"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id + activeAngleIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20, rotateX: -10 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full flex flex-col items-center justify-center perspective-3000"
            >
              <div ref={keyboardRef} className="relative preserve-3d group/keyboard">
                <motion.img 
                  src={activeAngle.image_url} 
                  alt={currentProduct.name}
                  animate={{
                    rotateX: activeAngle.rotateX,
                    rotateY: activeAngle.rotateY,
                    scale: activeAngle.scale
                  }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-contain drop-shadow-[0_80px_100px_rgba(0,0,0,0.8)] select-none z-20 relative"
                />
                
                {/* Cinematic Floating Shadow */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.15, 0.25, 0.15]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-24 bg-black/60 blur-[60px] rounded-full pointer-events-none z-10"
                />

                {/* Active Variant Glow Floor */}
                <motion.div 
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3/4 h-[8px] blur-3xl rounded-full pointer-events-none bg-orange-500/40"
                />
              </div>
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Horizontal Angle Gallery */}
          <div className="w-full max-w-4xl px-4 space-y-6">
            <div className="flex items-center gap-4 px-2">
              <Eye size={16} className="text-orange-500" />
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">VIEW OTHER ANGLE</h3>
            </div>
            
            <div className="flex flex-row gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {KEYBOARD_ANGLES.map((angle, i) => (
                <button
                  key={angle.id}
                  onClick={() => setActiveAngleIndex(i)}
                  className={`flex-shrink-0 group relative w-32 h-32 rounded-[2rem] overflow-hidden transition-all duration-700 border ${
                    activeAngleIndex === i 
                      ? 'glasswave-strong scale-105 shadow-[0_20px_40px_rgba(255,165,0,0.2)] border-orange-500' 
                      : 'glasswave border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="relative z-20 w-full h-full flex items-center justify-center p-4">
                    <img 
                      src={angle.image_url} 
                      alt={angle.name} 
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        activeAngleIndex === i ? 'scale-110' : 'opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0'
                      }`}
                    />
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 z-30 text-center">
                    <span className={`text-[7px] font-black tracking-widest uppercase transition-all ${
                      activeAngleIndex === i ? 'text-white' : 'text-white/20 group-hover:text-white/60'
                    }`}>
                      {angle.name.replace(' Keyboard View', '').replace(' Angle', '')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interaction Console */}
        <div className="xl:w-[550px] 2xl:w-[650px] shrink-0 space-y-16 bg-midnight/20 p-10 rounded-[3rem] backdrop-blur-3xl border border-white/5">
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <span className="text-[11px] font-black tracking-[0.5em] text-orange-500 uppercase">{currentProduct.brand} Core Series</span>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-orange-500/20 to-transparent" />
            </div>
            
            <h1 className="font-heading text-7xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter">
              {currentProduct.name}
            </h1>
            
            <p className="text-white/40 text-xl leading-relaxed font-medium max-w-lg">
              {currentProduct.description}
            </p>
          </div>

          {/* Dynamic Specs */}
          <div className="grid grid-cols-2 gap-6">
             <div className="glasswave rounded-3xl p-8 border border-white/5 space-y-3 group hover:bg-white/5 transition-all">
                <Zap size={20} className="text-orange-500/60 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Response Time</p>
                  <p className="text-xs font-black text-white uppercase tracking-widest">1ms Wireless</p>
                </div>
              </div>
              <div className="glasswave rounded-3xl p-8 border border-white/5 space-y-3 group hover:bg-white/5 transition-all">
                <Sparkles size={20} className="text-orange-500/60 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Lighting</p>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Aura RGB</p>
                </div>
              </div>
          </div>

          {/* Purchase Controller */}
          <div className="glasswave-strong rounded-[4rem] p-16 border border-white/5 relative overflow-hidden group/panel">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.07] to-transparent opacity-0 group-hover/panel:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 space-y-12">
              <div className="flex items-end justify-between">
                <div className="space-y-3">
                  <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Acquisition Value</p>
                  <p className="text-6xl font-black text-white tracking-tighter">
                    {formatPHP(currentProduct.price * quantity)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-3 glasswave px-4 py-2 rounded-full border-white/5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">Live Stock</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-6">
                <div className="flex items-center glasswave rounded-[2.5rem] h-24 px-4 border-white/5">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-16 h-full flex items-center justify-center text-white/30 hover:text-white transition-colors"><Minus size={22} /></button>
                  <span className="px-8 font-black text-3xl text-white min-w-[80px] text-center tabular-nums">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(99, q + 1))} className="w-16 h-full flex items-center justify-center text-white/30 hover:text-white transition-colors"><Plus size={22} /></button>
                </div>

                <motion.button
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  style={{ x: btnSpringX, y: btnSpringY }}
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`relative flex-1 h-24 rounded-[2.5rem] font-black text-[11px] tracking-[0.5em] uppercase transition-all duration-700 flex items-center justify-center gap-4 ${
                    added ? 'bg-green-500 text-black shadow-[0_0_50px_rgba(34,197,94,0.4)]' : 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_40px_80px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {adding ? (
                      <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4"><Loader2 size={24} className="animate-spin" /> SYNCHRONIZING</motion.div>
                    ) : added ? (
                      <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4"><Check size={24} /> ACQUIRED</motion.div>
                    ) : (
                      <>INITIALIZE ACQUISITION <Zap size={18} className="text-orange-500" /></>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Verified Badge Row */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
                <div className="flex flex-col items-center gap-3 text-center">
                  <ShieldCheck size={20} className="text-orange-500/60" />
                  <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">Secure Build</span>
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                  <Zap size={20} className="text-orange-500/60" />
                  <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">Instant Sync</span>
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                  <Sparkles size={20} className="text-orange-500/60" />
                  <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">Elite Grade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
