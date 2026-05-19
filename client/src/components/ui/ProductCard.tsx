import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronRight, ChevronLeft, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { usePerformance } from '../../context/PerformanceContext';
import { LuxuryCartButton } from './LuxuryCartButton';
import gsap from 'gsap';

// Local High-Resolution Asset Fallbacks
import hyperxMain from '../../assets/hyperx_cloud_alpha_black_1_main.png';
import qckMain from '../../assets/qck_xxl_cs2_dragon_lore_pdp_img_buy_01.png';
import dragonLoreMouseMain from '../../assets/wireless_mouse_cs2_dragon_lore_pdp_img_buy_01.png';
import redragonMain from '../../assets/keyboard-top.jpg';
import logitechMain from '../../assets/pro-x-superlight-gallery-2.png';

interface ProductCardProps {
  product: Product;
  index: number;
}

const getLocalImageUrl = (url: string, slug?: string, name?: string) => {
  const targetStr = `${url} ${slug} ${name}`.toLowerCase();
  if (targetStr.includes('hyperx') || targetStr.includes('cloud-alpha')) return hyperxMain;
  if (targetStr.includes('cs2-dragon-lore-wireless-mouse') || targetStr.includes('dragon lore wireless') || targetStr.includes('cs2 dragon lore')) return dragonLoreMouseMain;
  if (targetStr.includes('steelseries') || targetStr.includes('mouse-pad') || targetStr.includes('qck')) return qckMain;
  if (targetStr.includes('redragon') || targetStr.includes('k670')) return redragonMain;
  if (targetStr.includes('logitech') || targetStr.includes('superlight')) return logitechMain;
  return url;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { formatPHP } = useCart();
  const { isLowEnd } = usePerformance();
  const [currentVariant, setCurrentVariant] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  
  const cardRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], isLowEnd ? [0, 0] : [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], isLowEnd ? [0, 0] : [-10, 10]);

  let rawVariants: any[] = [];
  try {
    rawVariants = product.variants ? JSON.parse(product.variants) : [];
  } catch (e) {
    console.error("Failed to parse variants JSON:", e);
  }
  if (!Array.isArray(rawVariants) || rawVariants.length === 0) {
    rawVariants = [{ name: 'Default', image_url: product.image_url }];
  }

  const variants = rawVariants.map((v: any) => ({
    ...v,
    image_url: getLocalImageUrl(v.image_url || product.image_url, product.slug, product.name),
    name: v.name || 'Default'
  }));
  
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLowEnd || !cardRef.current) return;
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
    if (isLowEnd) return;
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

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRotating) return;
    
    setIsRotating(true);
    setCurrentVariant((prev) => (prev - 1 + variants.length) % variants.length);
    setTimeout(() => setIsRotating(false), 800);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group glasswave-card p-8 flex flex-col relative overflow-hidden transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5 no-underline block"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05, duration: isLowEnd ? 0.4 : 0.8 }}
        style={isLowEnd ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full flex flex-col"
      >
      {/* Spotlight Effect */}
      {!isLowEnd && (
        <div className="card-spotlight absolute pointer-events-none opacity-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-luxury-cyan blur-[80px] z-0 rounded-full" />
      )}

      <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-white/[0.03] mb-10 flex items-center justify-center border border-white/5 shadow-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${product.id}-${currentVariant}`}
            animate={isLowEnd ? { y: 0 } : { y: [0, -8, 0] }}
            transition={isLowEnd ? {} : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full p-2 flex items-center justify-center relative z-10"
          >
            <motion.img
              initial={isLowEnd ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={isLowEnd ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              whileHover={isLowEnd ? {} : { scale: 1.05 }}
              transition={isLowEnd ? { duration: 0.2 } : { duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              src={variants[currentVariant].image_url}
              alt={`${product.name} - ${variants[currentVariant].name}`}
              loading="lazy"
              className={isLowEnd 
                ? "w-full h-full object-contain" 
                : "w-full h-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_50px_80px_rgba(0,240,255,0.3)] transition-all duration-700"}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Cinematic Floor Reflection */}
        {!isLowEnd && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-luxury-cyan/30 blur-[20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
          <span className="glasswave-strong px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest text-white uppercase border border-white/10">
            {product.category}
          </span>
          <span className="text-luxury-cyan text-[8px] font-black tracking-[0.3em] uppercase bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/5">
            {variants[currentVariant].name}
          </span>
        </div>

        {/* Navigation Buttons for Variants */}
        {variants.length > 1 && (
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full glasswave-strong flex items-center justify-center text-white hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(0,240,255,0.2)] border border-white/20 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full glasswave-strong flex items-center justify-center text-white hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(0,240,255,0.2)] border border-white/20 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* Variant Color Selector (Bubbles) */}
        {variants.length > 1 && (
          <div className="absolute bottom-6 right-6 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            {variants.map((v: any, i: number) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentVariant(i);
                }}
                className={`w-4 h-4 rounded-full border border-white/20 transition-all ${
                  currentVariant === i ? 'scale-125 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: v.color || '#fff' }}
              />
            ))}
          </div>
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
    </Link>
  );
};
