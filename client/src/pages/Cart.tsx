import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-700 flex items-center justify-center">
              <FiShoppingBag className="text-text-muted" size={32} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-3">Your Cart is Empty</h2>
            <p className="text-text-secondary mb-6">Discover amazing games and add them to your cart</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl text-dark-900 font-bold btn-hover-lift">
              Browse Shop <FiArrowRight />
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-3xl font-bold text-text-primary">Shopping <span className="text-neon-cyan">Cart</span></h1>
            <button onClick={clearCart} className="text-sm text-text-muted hover:text-neon-red transition-colors">Clear All</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item.product.id} layout exit={{ opacity: 0, x: -100 }} className="glass rounded-2xl p-4 flex gap-4">
                    <img src={item.product.image_url} alt={item.product.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product.slug}`} className="font-heading text-sm font-bold text-text-primary hover:text-neon-cyan transition-colors block truncate">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-text-muted mt-1">{item.product.category} · {item.product.platform}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-0 glass rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1.5 text-text-secondary hover:text-neon-cyan"><FiMinus size={14} /></button>
                          <span className="px-3 py-1.5 text-sm font-medium text-text-primary">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1.5 text-text-secondary hover:text-neon-cyan"><FiPlus size={14} /></button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-heading text-lg font-bold text-neon-cyan">${(item.product.price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeItem(item.product.id)} className="p-2 text-text-muted hover:text-neon-red transition-colors"><FiTrash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-6">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-text-secondary">Items ({itemCount})</span><span className="text-text-primary">${total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-text-secondary">Delivery</span><span className="text-neon-green">Digital</span></div>
                  <div className="border-t border-glass-border pt-3 flex justify-between"><span className="font-medium text-text-primary">Total</span><span className="font-heading text-xl font-bold text-neon-cyan">${total.toFixed(2)}</span></div>
                </div>
                <Link to="/checkout" className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl text-dark-900 font-bold flex items-center justify-center gap-2 btn-hover-lift block text-center">
                  Proceed to Checkout <FiArrowRight />
                </Link>
                <Link to="/products" className="w-full py-3 mt-3 border border-glass-border rounded-xl text-text-secondary text-sm text-center block hover:text-neon-cyan hover:border-neon-cyan/30 transition-all">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
