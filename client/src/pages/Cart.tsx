import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Command } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import { useCart } from '../context/CartContext';
import { useResponsive } from '../hooks/useResponsive';
import { AuroraBackground, AmbientGlow } from '../components/ui/ImmersiveEffects';

const Cart = () => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart, formatPHP } = useCart();
  const { isMobile, device } = useResponsive();

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="relative bg-matte-black min-h-screen flex items-center justify-center px-6 overflow-hidden">
          <AuroraBackground />
          <AmbientGlow />
          
          <div className="text-center relative z-10 space-y-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-40 h-40 mx-auto rounded-[3rem] glasswave flex items-center justify-center border-white/5 shadow-2xl"
            >
              <ShoppingBag className="text-text-muted" size={56} />
            </motion.div>
            <div className="space-y-4">
              <h2 className="font-heading text-5xl font-black text-white tracking-tighter uppercase">Bay Inactive</h2>
              <p className="text-text-secondary max-w-sm mx-auto font-medium uppercase tracking-[0.3em] text-[10px] opacity-60">Your luxury acquisition queue is currently empty.</p>
            </div>
            <Link to="/products" className="luxury-btn mx-auto min-w-[280px] text-center">
              VIEW INVENTORY <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="relative bg-matte-black min-h-screen pt-40 pb-32 px-6 overflow-hidden">
        <AuroraBackground />
        <AmbientGlow />

        <div className={`mx-auto relative z-10 ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-widest text-luxury-violet uppercase"
              >
                <Command size={12} /> Acquisition Queue
              </motion.div>
              <h1 className="font-heading text-5xl font-black text-white tracking-tighter uppercase">
                YOUR <span className="text-luxury-cyan italic">SELECTION</span>
              </h1>
              <p className="text-text-muted font-bold tracking-[0.4em] uppercase text-[9px] opacity-60">Session active // {itemCount} premium units</p>
            </div>
            <button onClick={clearCart} className="text-[10px] font-black text-text-muted hover:text-white transition-all uppercase tracking-[0.4em] px-8 py-4 glasswave rounded-2xl border-white/5 hover:border-white/20 active:scale-95 shadow-lg">
              CLEAR SELECTION
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* Premium Item List */}
            <div className="relative lg:col-span-2 space-y-8">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -100 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="glasswave rounded-[3rem] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-10 group relative transition-all duration-500 hover:bg-white/[0.04] border border-white/5 hover:border-white/10 shadow-xl"
                  >
                    <div className="relative w-full sm:w-44 h-40 sm:h-44 rounded-[2rem] overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center p-4">
                      <img src={item.selectedVariant?.image_url || item.product.image_url} alt={item.product.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <Link to={`/products/${item.product.slug}`} className="font-heading text-xl sm:text-2xl font-black text-white hover:text-luxury-cyan transition-colors tracking-tight leading-tight line-clamp-2">
                            {item.product.name}
                          </Link>
                          
                          {/* Premium Glassmorphism Remove Button */}
                          <button 
                            onClick={() => removeItem(item.id)} 
                            aria-label="Remove item"
                            className="w-12 h-12 rounded-2xl glasswave border border-white/10 flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] group/btn active:scale-95 shrink-0 shadow-md"
                          >
                            <Trash2 size={18} className="group-hover/btn:animate-pulse" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-[9px] text-text-muted font-black uppercase tracking-[0.4em] opacity-60">
                            {item.product.category} // {item.product.platform}
                          </p>
                          {item.selectedVariant && (
                            <>
                              <div className="w-1 h-1 rounded-full bg-white/20" />
                              <p className="text-[9px] text-luxury-cyan font-black uppercase tracking-[0.4em]">
                                {item.selectedVariant.name} EDITION
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between mt-8 gap-4">
                        <div className="flex items-center glasswave rounded-2xl h-12 border-white/5 shadow-inner">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-12 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors hover:bg-white/5 rounded-l-2xl"><Minus size={16} /></button>
                          <span className="px-6 font-black text-lg text-white min-w-[50px] text-center tabular-nums">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-12 h-full flex items-center justify-center text-text-muted hover:text-white transition-colors hover:bg-white/5 rounded-r-2xl"><Plus size={16} /></button>
                        </div>
                        <span className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tighter opacity-80 tabular-nums">{formatPHP(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <div className={`glasswave-strong rounded-[4rem] p-8 sm:p-12 border border-white/5 shadow-2xl space-y-12 ${isMobile ? '' : 'sticky top-40'}`}>
                <div className="space-y-2 text-center">
                  <h3 className="font-heading text-2xl font-black text-white tracking-tighter uppercase">Total Valuation</h3>
                  <p className="text-[9px] text-text-muted font-black tracking-[0.4em] uppercase opacity-40">Order Manifest Finalized</p>
                </div>
                
                <div className="space-y-6 border-y border-white/5 py-10">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-text-muted font-black tracking-widest uppercase">Units Subtotal</span>
                    <span className="text-white font-black tabular-nums">{formatPHP(total)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-text-muted font-black tracking-widest uppercase">Protocol Allocation</span>
                    <span className="text-luxury-cyan font-black tracking-widest uppercase">FREE PRIORITY</span>
                  </div>
                  <div className="pt-6 flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[8px] text-text-muted font-black tracking-[0.5em] uppercase opacity-40">Credits Total</span>
                      <p className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tighter tabular-nums">{formatPHP(total)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Link to="/checkout" className="luxury-btn w-full text-xs sm:text-sm tracking-[0.3em] shadow-2xl py-6 text-center block">
                    PROCEED TO ACQUISITION <ArrowRight size={20} className="inline ml-2" />
                  </Link>
                  <div className="flex items-center justify-center gap-3 text-[9px] font-black text-text-muted tracking-widest uppercase opacity-40">
                    <ShieldCheck size={14} className="text-luxury-cyan" /> Encrypted Transmission Channel
                  </div>
                  <div className="flex items-center justify-center gap-3 text-[9px] font-black text-text-muted tracking-widest uppercase opacity-40">
                    <Sparkles size={14} className="text-luxury-violet" /> Quality Verified Build
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
