import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { items, total, updateQuantity, removeItem, formatPHP } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-matte-black/60 backdrop-blur-sm z-[70]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glasswave-strong z-[80] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ShoppingBag className="text-luxury-cyan" size={24} />
                <h2 className="font-heading text-xl font-black text-white uppercase tracking-tighter">Acquisition Queue</h2>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-text-muted transition-colors active:scale-95">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                    <ShoppingBag size={32} className="text-text-muted opacity-30" />
                  </div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">No Gear Detected In Queue</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: 50 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex gap-6 group relative p-4 rounded-2xl glasswave border border-white/5 hover:border-white/10 shadow-xl transition-all duration-300 hover:bg-white/[0.03]"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center p-2">
                        <img src={item.selectedVariant?.image_url || item.product.image_url} alt={item.product.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 hover:scale-105" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-xs font-black text-white uppercase tracking-tight line-clamp-1">{item.product.name}</h3>
                            
                            {/* Premium Glassmorphism Remove Button */}
                            <button 
                              onClick={() => removeItem(item.id)} 
                              aria-label="Remove item"
                              className="w-8 h-8 rounded-xl glasswave border border-white/10 flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] group/btn active:scale-95 shrink-0 shadow-md"
                            >
                              <Trash2 size={14} className="group-hover/btn:animate-pulse" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[8px] text-text-muted font-black uppercase tracking-widest">{item.product.category}</p>
                            {item.selectedVariant && (
                              <>
                                <span className="text-white/20">•</span>
                                <p className="text-[8px] text-luxury-cyan font-black uppercase tracking-widest">{item.selectedVariant.name}</p>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 gap-2">
                          <div className="flex items-center glasswave rounded-xl h-8 border border-white/5 shadow-inner">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-text-muted hover:text-white transition-colors hover:bg-white/5 rounded-l-xl"><Minus size={12} /></button>
                            <span className="px-3 text-[10px] font-black text-white tabular-nums">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-text-muted hover:text-white transition-colors hover:bg-white/5 rounded-r-xl"><Plus size={12} /></button>
                          </div>
                          <span className="text-sm font-black text-white tabular-nums">{formatPHP(item.product.price * item.quantity)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div className="p-8 glasswave border-t border-white/5 space-y-6 shadow-2xl">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Total Credits</span>
                <span className="font-heading text-3xl font-black text-white tabular-nums">{formatPHP(total)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={onClose}
                className="luxury-btn w-full py-5 text-xs tracking-widest uppercase shadow-[0_0_30px_rgba(124,58,237,0.2)] block text-center"
              >
                Initialize Checkout <ArrowRight size={16} className="inline ml-2" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
