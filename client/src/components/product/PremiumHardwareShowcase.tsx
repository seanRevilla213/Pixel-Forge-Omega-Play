import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Minus, ShieldCheck, Zap, Box, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useResponsive } from '../../hooks/useResponsive';
import { LuxuryCartButton } from '../ui/LuxuryCartButton';

interface PremiumHardwareShowcaseProps {
  product: any;
}

export const PremiumHardwareShowcase: React.FC<PremiumHardwareShowcaseProps> = ({ product }) => {
  const { formatPHP } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Theme colors based on category
  const getThemeColor = () => {
    switch (product.category) {
      case 'Gaming Mouse': return '#00f0ff'; // Cyan
      case 'Headsets': return '#a855f7'; // Purple
      case 'Consoles': return '#0047AB'; // Blue
      case 'Accessories': return '#ffffff'; // White
      case 'Mechanical Keyboards': return '#ff8c00'; // Orange
      default: return '#00f0ff';
    }
  };

  const themeColor = getThemeColor();

  return (
    <div className="w-full flex flex-col xl:flex-row gap-16 items-center min-h-[80vh] py-10">
      
      {/* Left: Interactive Stage */}
      <div className="flex-1 relative flex items-center justify-center w-full h-[60vh] min-h-[500px]">
        {/* Ambient Glow */}
        <div 
          className="absolute inset-0 blur-[150px] opacity-20 rounded-full transition-colors duration-1000"
          style={{ backgroundColor: themeColor }}
        />

        {/* Floating Product */}
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1.1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 1.2, rotateY: 20 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 w-full h-full flex items-center justify-center"
          >
            <motion.img
              animate={{ y: [0, -25, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              src={product.image_url}
              alt={product.name}
              className="max-w-[90%] max-h-[90%] object-contain drop-shadow-[0_80px_100px_rgba(0,0,0,0.8)]"
            />
            
            {/* Spotlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-white/10 to-transparent pointer-events-none opacity-40" />
          </motion.div>
        </AnimatePresence>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-0 right-0 glasswave px-6 py-2 rounded-2xl border border-white/10 z-30">
            <span className="text-[10px] font-black tracking-widest text-white uppercase">{product.badge}</span>
          </div>
        )}
      </div>

      {/* Right: Information Panel */}
      <div className="xl:w-[550px] 2xl:w-[650px] shrink-0 space-y-12 bg-midnight/30 p-12 rounded-[3.5rem] backdrop-blur-3xl border border-white/5 relative z-30">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase" style={{ color: themeColor }}>{product.category}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
              <Star size={12} className="text-luxury-violet" fill="currentColor" /> {product.rating} RATING
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-white leading-none tracking-tight uppercase italic">
            {product.name}
          </h1>
          
          <p className="text-text-secondary font-medium leading-relaxed opacity-70 line-clamp-3">
            {product.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="glasswave rounded-3xl p-6 border border-white/5 space-y-3 group hover:bg-white/5 transition-all">
            <Box size={20} className="text-white/20 group-hover:text-luxury-cyan transition-colors" />
            <div>
              <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Status</p>
              <p className="text-xs font-black text-white uppercase tracking-widest">In Storage</p>
            </div>
          </div>
          <div className="glasswave rounded-3xl p-6 border border-white/5 space-y-3 group hover:bg-white/5 transition-all">
            <Info size={20} className="text-white/20 group-hover:text-luxury-violet transition-colors" />
            <div>
              <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Network</p>
              <p className="text-xs font-black text-white uppercase tracking-widest">{product.platform}</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-10">
          <div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mb-3">Unit Cost</p>
            <div className="text-5xl font-black text-white tracking-tighter">
              {formatPHP(product.price)}
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center glasswave rounded-2xl h-14 border-white/5">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors"><Minus size={16} /></button>
                <span className="px-4 font-black text-lg text-white min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(99, q + 1))} className="w-12 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors"><Plus size={16} /></button>
              </div>
            <LuxuryCartButton product={product} className="h-14 px-10 text-[10px] tracking-widest" />
          </div>
        </div>

        <div className="flex items-center gap-8 pt-4">
          <div className="flex items-center gap-2 text-[8px] font-black text-white/30 uppercase tracking-widest">
            <ShieldCheck size={14} style={{ color: themeColor }} /> Secure Channel
          </div>
          <div className="flex items-center gap-2 text-[8px] font-black text-white/30 uppercase tracking-widest">
            <Zap size={14} className="text-luxury-violet" /> Express Build
          </div>
        </div>
      </div>
    </div>
  );
};
