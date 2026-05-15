import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';

interface LuxuryCartButtonProps {
  product: Product;
  className?: string;
}

export const LuxuryCartButton = ({ product, className = "" }: LuxuryCartButtonProps) => {
  const { addItem } = useCart();
  const [status, setStatus] = useState<'idle' | 'loading' | 'added'>('idle');

  const handleAdd = () => {
    setStatus('loading');
    // Simulate luxury loading
    setTimeout(() => {
      addItem(product);
      setStatus('added');
      setTimeout(() => setStatus('idle'), 2000);
    }, 800);
  };

  return (
    <motion.button
      onClick={handleAdd}
      disabled={status !== 'idle'}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`luxury-btn group relative overflow-hidden ${status === 'added' ? 'border-green-500/50' : ''} ${className}`}
    >
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="tracking-widest text-[10px] font-black">ACQUIRE GEAR</span>
          </motion.div>
        )}

        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 size={18} className="animate-spin text-luxury-cyan" />
            <span className="tracking-widest text-[10px] font-black uppercase">Syncing...</span>
          </motion.div>
        )}

        {status === 'added' && (
          <motion.div
            key="added"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="flex items-center gap-2 text-green-400"
          >
            <Check size={18} />
            <span className="tracking-widest text-[10px] font-black uppercase">Added Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Liquid Hover Effect */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.button>
  );
};
