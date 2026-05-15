import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import { useCart } from '../context/CartContext';
import { useResponsive, useAnimationSettings } from '../hooks/useResponsive';
import { MouseGlow, FloatingParticles } from '../components/ui/ImmersiveEffects';

const Cart = () => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const { isMobile, device } = useResponsive();
  const anim = useAnimationSettings();

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="relative bg-dark-navy min-h-screen flex items-center justify-center px-6 overflow-hidden">
          <MouseGlow />
          <FloatingParticles />
          <div className="scanline" />
          
          <div className="text-center relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 mx-auto mb-10 rounded-[2.5rem] glass-strong flex items-center justify-center border-white/5"
            >
              <ShoppingBag className="text-text-muted" size={48} />
            </motion.div>
            <h2 className="font-heading text-4xl font-black text-white mb-6 tracking-tighter">STORAGE EMPTY</h2>
            <p className="text-text-secondary mb-10 max-w-sm mx-auto font-medium uppercase tracking-widest text-[10px]">Your equipment bay is currently inactive. Re-initialize shopping to add gear.</p>
            <Link to="/products" className="neon-btn mx-auto max-w-[280px]">
              INITIALIZE STORE <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="relative bg-dark-navy min-h-screen pt-32 pb-32 px-6 overflow-hidden">
        <MouseGlow />
        <FloatingParticles />
        <div className="scanline" />

        <div className={`mx-auto relative z-10 ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-6">
            <div>
              <h1 className="font-heading text-4xl font-black text-white tracking-tighter">
                EQUIPMENT <span className="text-neon-cyan">BAY</span>
              </h1>
              <p className="text-text-muted font-bold tracking-[0.3em] uppercase text-[9px] mt-2">Active session: {(itemCount)} items selected</p>
            </div>
            <button onClick={clearCart} className="text-[10px] font-black text-text-muted hover:text-neon-pink transition-colors uppercase tracking-[0.3em] px-6 py-3 glass rounded-xl">
              PURGE ALL GEAR
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items Console */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 * anim.intensity }}
                    className="glass rounded-[2.5rem] p-6 flex gap-8 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors" />
                    <img src={item.product.image_url} alt={item.product.name} className="w-24 h-24 sm:w-40 sm:h-40 rounded-2xl object-cover flex-shrink-0 relative z-10" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between relative z-10">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link to={`/products/${item.product.slug}`} className="font-heading text-lg sm:text-xl font-black text-white hover:text-neon-cyan transition-colors truncate tracking-tighter">
                            {item.product.name}
                          </Link>
                          <button onClick={() => removeItem(item.product.id)} className="p-3 bg-white/5 rounded-xl text-text-muted hover:text-neon-pink transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-2">
                          {item.product.category} // {item.product.platform}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center glass rounded-2xl overflow-hidden h-12 border-white/5">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-12 h-full flex items-center justify-center text-text-muted hover:text-neon-cyan transition-colors"><Minus size={16} /></button>
                          <span className="px-4 font-black text-base text-white min-w-[40px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-12 h-full flex items-center justify-center text-text-muted hover:text-neon-cyan transition-colors"><Plus size={16} /></button>
                        </div>
                        <span className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tighter">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Console */}
            <div className="lg:col-span-1">
              <div className={`glass-strong rounded-[3rem] p-10 border border-white/10 shadow-2xl ${isMobile ? '' : 'sticky top-32'}`}>
                <h3 className="font-heading text-xl font-black text-white mb-10 tracking-widest uppercase border-b border-white/5 pb-6 text-center">ORDER MANIFEST</h3>
                <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-muted font-bold tracking-widest uppercase">Units Base Cost</span>
                    <span className="text-white font-black">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-muted font-bold tracking-widest uppercase">Network Protocol</span>
                    <span className="text-neon-cyan font-black tracking-widest uppercase">DIGITAL DELIVERY</span>
                  </div>
                  <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-text-muted font-black tracking-[0.4em] uppercase mb-1">Total Credits</span>
                      <span className="font-heading text-4xl font-black text-white tracking-tighter">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Link to="/checkout" className="neon-btn w-full py-5 text-base tracking-[0.3em] mb-6 shadow-[0_0_30px_rgba(0,210,255,0.2)]">
                  FINALIZE PURCHASE <ArrowRight size={20} />
                </Link>
                
                <div className="flex items-center justify-center gap-2 text-[9px] font-black text-text-muted tracking-widest uppercase">
                  <ShieldCheck size={14} className="text-neon-cyan" /> Encrypted Transaction Channel
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
