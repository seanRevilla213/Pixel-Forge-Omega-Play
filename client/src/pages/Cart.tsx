import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import { useCart } from '../context/CartContext';
import { useResponsive, useAnimationSettings } from '../hooks/useResponsive';

const Cart = () => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const { isMobile, device } = useResponsive();
  const anim = useAnimationSettings();

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-24 pb-24 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-dark-700 flex items-center justify-center">
              <FiShoppingBag className="text-text-muted" size={40} />
            </div>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">Your Cart is Empty</h2>
            <p className="text-text-secondary mb-8 max-w-sm mx-auto">Discover amazing games and start building your collection today.</p>
            <Link to="/products" className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-2xl text-dark-900 font-bold btn-hover-lift">
              Browse Store <FiArrowRight />
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className={`min-h-screen pt-24 pb-24 px-6 ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'} mx-auto`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
            Shopping <span className="text-neon-cyan">Cart</span>
          </h1>
          <button onClick={clearCart} className="text-sm font-bold text-text-muted hover:text-neon-red transition-colors uppercase tracking-widest">
            Clear All Items
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 * anim.intensity }}
                  className="glass rounded-3xl p-5 flex gap-6 group"
                >
                  <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link to={`/products/${item.product.slug}`} className="font-heading text-base sm:text-lg font-bold text-text-primary hover:text-neon-cyan transition-colors truncate">
                          {item.product.name}
                        </Link>
                        <button onClick={() => removeItem(item.product.id)} className="p-2 text-text-muted hover:text-neon-red transition-all">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                      <p className="text-[10px] sm:text-xs text-text-muted font-bold uppercase tracking-widest mt-1">
                        {item.product.category} · {item.product.platform}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center glass rounded-xl overflow-hidden h-10">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-10 h-full flex items-center justify-center text-text-muted hover:text-neon-cyan transition-colors"><FiMinus size={14} /></button>
                        <span className="px-2 font-bold text-sm text-text-primary min-w-[30px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-10 h-full flex items-center justify-center text-text-muted hover:text-neon-cyan transition-colors"><FiPlus size={14} /></button>
                      </div>
                      <span className="font-heading text-lg sm:text-xl font-bold text-neon-cyan">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary - Sticky on Desktop, Static on Mobile */}
          <div className="lg:col-span-1">
            <div className={`glass-strong rounded-[2rem] p-8 ${isMobile ? '' : 'sticky top-24'}`}>
              <h3 className="font-heading text-xl font-bold text-text-primary mb-8">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary font-medium">Subtotal ({itemCount} items)</span>
                  <span className="text-text-primary font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary font-medium">Digital Processing</span>
                  <span className="text-neon-green font-bold">FREE</span>
                </div>
                <div className="pt-4 border-t border-glass-border flex justify-between">
                  <span className="text-lg font-bold text-text-primary">Total</span>
                  <span className="font-heading text-2xl font-black text-neon-cyan">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link to="/checkout" className="w-full py-5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-2xl text-dark-900 font-black flex items-center justify-center gap-3 btn-hover-lift transition-all">
                Proceed to Checkout <FiArrowRight size={20} />
              </Link>
              
              <Link to="/products" className="w-full py-4 mt-4 border border-glass-border rounded-2xl text-text-muted text-sm font-bold uppercase tracking-widest text-center block hover:text-neon-cyan hover:border-neon-cyan/20 transition-all">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
