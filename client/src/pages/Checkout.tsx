import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { sanitizeInput } from '../lib/sanitize';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ address: '', paymentMethod: 'digital_wallet' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login', { state: { from: { pathname: '/checkout' } } }); return; }
    if (items.length === 0) return;

    setLoading(true);
    try {
      await api.post('/orders/checkout', {
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        shippingAddress: sanitizeInput(form.address),
        paymentMethod: form.paymentMethod,
      });
      setSuccess(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center glass rounded-3xl p-12 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center">
              <FiCheckCircle className="text-neon-green" size={40} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-3">Order Confirmed!</h2>
            <p className="text-text-secondary mb-6">Your digital keys will be delivered to your dashboard.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/dashboard" className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl text-dark-900 font-bold btn-hover-lift">My Orders</Link>
              <Link to="/products" className="px-6 py-3 border border-glass-border rounded-xl text-text-secondary hover:text-neon-cyan transition-all">Keep Shopping</Link>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-text-primary mb-8">Checkout</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Delivery Info</h3>
                <label className="block mb-1 text-sm text-text-secondary">Email / Delivery Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))}
                  required minLength={10} maxLength={500}
                  className="w-full p-3 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 resize-none h-24"
                  placeholder="Your email or delivery details..."
                />
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Payment Method</h3>
                {['digital_wallet', 'credit_card', 'crypto'].map((m) => (
                  <label key={m} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-2 transition-all ${form.paymentMethod === m ? 'bg-neon-cyan/10 border border-neon-cyan/30' : 'hover:bg-white/5 border border-transparent'}`}>
                    <input type="radio" name="payment" value={m} checked={form.paymentMethod === m} onChange={(e) => setForm(f => ({ ...f, paymentMethod: e.target.value }))} className="accent-neon-cyan" />
                    <span className="text-sm text-text-primary capitalize">{m.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Summary</h3>
                <div className="space-y-3 mb-4">
                  {items.map((i) => (
                    <div key={i.product.id} className="flex justify-between text-sm">
                      <span className="text-text-secondary truncate mr-2">{i.product.name} × {i.quantity}</span>
                      <span className="text-text-primary flex-shrink-0">${(i.product.price * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-glass-border pt-3 flex justify-between mb-6">
                  <span className="font-medium text-text-primary">Total</span>
                  <span className="font-heading text-xl font-bold text-neon-cyan">${total.toFixed(2)}</span>
                </div>
                <button type="submit" disabled={loading || items.length === 0} className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl text-dark-900 font-bold btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default Checkout;
