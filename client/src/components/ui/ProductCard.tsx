import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronRight, Star, Zap } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { LuxuryCartButton } from './LuxuryCartButton';
import gsap from 'gsap';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { formatPHP } = useCart();
  const [currentVariant, setCurrentVariant] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const variants = product.variants ? JSON.parse(product.variants) : [{ name: 'Default', image_url: product.image_url }];
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);

    // Spotlight effect
    const spotlight = cardRef.current.querySelector('.card-spotlight') as HTMLElement;
    if (spotlight) {
      gsap.to(spotlight, {
        opacity: 0.15,
        left: mouseXPos,
        top: mouseYPos,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    const spotlight = cardRef.current?.querySelector('.card-spotlight') as HTMLElement;
    if (spotlight) {
      gsap.to(spotlight, { opacity: 0, duration: 0.5 });
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRotating) return;
    
    setIsRotating(true);
    setCurrentVariant((prev) => (prev + 1) % variants.length);
    setTimeout(() => setIsRotating(false), 800);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group glasswave-card p-8 flex flex-col relative overflow-hidden transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5"
    >
      {/* Spotlight Effect */}
      <div className="card-spotlight absolute pointer-events-none opacity-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-luxury-cyan blur-[80px] z-0 rounded-full" />

      <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-white/[0.03] mb-10 flex items-center justify-center border border-white/5 shadow-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${product.id}-${currentVariant}`}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full p-2 flex items-center justify-center relative z-10"
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.15 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.25, rotate: 2 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              src={variants[currentVariant].image_url}
              alt={`${product.name} - ${variants[currentVariant].name}`}
              className="max-w-[120%] max-h-[120%] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_50px_80px_rgba(0,240,255,0.3)] transition-all duration-700"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Cinematic Floor Reflection */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-luxury-cyan/30 blur-[20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
          <span className="glasswave-strong px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest text-white uppercase border border-white/10">
            {product.category}
          </span>
          <span className="text-luxury-cyan text-[8px] font-black tracking-[0.3em] uppercase bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/5">
            {variants[currentVariant].name}
          </span>
        </div>

        {/* Next Button for Variants */}
        {variants.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glasswave-strong flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-30 shadow-[0_0_30px_rgba(0,240,255,0.2)] border border-white/20"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
      
      <div className="space-y-6 relative z-10 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
              <Star size={10} className="text-luxury-violet fill-luxury-violet" />
              <span className="text-[10px] font-black text-white">{product.rating}</span>
            </div>
            {product.badge && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-luxury-cyan/10 border border-luxury-cyan/20">
                <Zap size={10} className="text-luxury-cyan fill-luxury-cyan" />
                <span className="text-[9px] font-black text-luxury-cyan uppercase tracking-widest">{product.badge}</span>
              </div>
            )}
          </div>
          {product.brand && (
            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{product.brand}</span>
          )}
        </div>
        
        <h3 className="font-heading text-2xl font-black text-white leading-none group-hover:text-luxury-cyan transition-colors line-clamp-1">
          {product.name}
        </h3>
      </div>
      
      <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/5 px-2">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Acquisition</span>
          <span className="text-4xl font-black text-white tracking-tighter leading-none">
            {formatPHP(product.price)}
          </span>
        </div>
        <LuxuryCartButton product={product} className="w-16 h-16 !px-0 rounded-2xl shadow-2xl hover:shadow-luxury-cyan/30 active:scale-90 transition-all" />
      </div>
    </motion.div>
  );
};
