import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { LuxuryCartButton } from './LuxuryCartButton';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { formatPHP } = useCart();
  const [currentVariant, setCurrentVariant] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const variants = product.variants ? JSON.parse(product.variants) : [{ name: 'Default', image_url: product.image_url }];
  
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRotating) return;
    
    setIsRotating(true);
    setCurrentVariant((prev) => (prev + 1) % variants.length);
    
    // Reset rotation state after animation
    setTimeout(() => setIsRotating(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="group glasswave-card p-6 flex flex-col relative overflow-hidden"
    >
      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 mb-8">
        <AnimatePresence mode="wait">
          <motion.img
            key={`${product.id}-${currentVariant}`}
            initial={{ rotate: -15, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 15, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            src={variants[currentVariant].image_url}
            alt={`${product.name} - ${variants[currentVariant].name}`}
            className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black/40 to-transparent" />
        
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="glasswave-strong px-3 py-1 rounded-full text-[8px] font-black tracking-widest text-white uppercase">
            {product.category}
          </span>
          <span className="text-luxury-cyan text-[8px] font-bold tracking-[0.2em] uppercase">
            {variants[currentVariant].name}
          </span>
        </div>

        {/* Next Button for Variants */}
        {variants.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glasswave-strong flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-20"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-luxury-cyan uppercase">
          <span>{product.category}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-1 text-luxury-violet">
            <span className="text-[12px]">★</span>
            <span>{product.rating}</span>
          </div>
        </div>
        
        <h3 className="font-heading text-2xl font-black text-white leading-tight group-hover:text-luxury-cyan transition-colors line-clamp-2">
          {product.name}
        </h3>
      </div>
      
      <div className="mt-auto pt-8 flex items-center justify-between">
        <span className="text-2xl font-black text-white opacity-60 tracking-tight">
          {formatPHP(product.price)}
        </span>
        <LuxuryCartButton product={product} className="w-12 h-12 !px-0 rounded-full" />
      </div>
    </motion.div>
  );
};
