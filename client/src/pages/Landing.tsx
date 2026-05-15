import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiZap, FiTruck, FiStar, FiShoppingCart } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAnimationSettings, useResponsive } from '../hooks/useResponsive';
import api from '../api/axiosInstance';

const Landing = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const anim = useAnimationSettings();
  const { device, isTouch } = useResponsive();

  useEffect(() => {
    api.get('/products/featured').then(({ data }) => {
      setFeatured(data.products);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-6">
        {/* Animated background */}
        <div className="absolute inset-0 gpu">
          <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className={`relative z-10 mx-auto text-center ${device === 'ultrawide' ? 'max-w-7xl' : 'max-w-4xl'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 * anim.intensity, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-cyan/20 text-neon-cyan text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              Now Live — Season 2 Collection
            </div>

            <h1 className="font-heading font-black tracking-tight mb-6 leading-tight" 
                style={{ fontSize: 'var(--font-size-fluid-h1)' }}>
              <span className="text-text-primary">PIXEL </span>
              <span className="bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-purple bg-clip-text text-transparent">
                FORGE
              </span>
              <br />
              <span className="text-text-primary opacity-90" style={{ fontSize: '0.6em' }}>OMEGA PLAY</span>
            </h1>

            <p className="max-w-2xl mx-auto text-text-secondary leading-relaxed mb-10" 
               style={{ fontSize: 'var(--font-size-fluid-body)' }}>
              Your premium destination for next-gen gaming. Discover curated titles,
              exclusive deals, and instant digital delivery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto group relative px-10 py-5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-2xl text-dark-900 font-bold tracking-wide btn-hover-lift overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Browse Shop
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-glass-border text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/30 transition-all duration-300 font-medium btn-hover-lift flex items-center justify-center"
              >
                View Deals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features - Adaptive Grid */}
      <section className="py-20 relative px-6">
        <div className={`mx-auto ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { Icon: FiZap, title: 'Instant Delivery', desc: 'Digital keys delivered to your account instantly', color: 'neon-cyan' },
              { Icon: FiShield, title: 'Secure Payments', desc: 'Military-grade encryption on every transaction', color: 'neon-magenta' },
              { Icon: FiTruck, title: 'Best Prices', desc: 'Competitive pricing with exclusive member deals', color: 'neon-purple' },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 * anim.intensity }}
                className="glass rounded-3xl p-8 hover:bg-white/[0.04] transition-all duration-500 group cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${feat.color}/10 flex items-center justify-center mb-6 ${!isTouch && 'group-hover:scale-110'} transition-transform duration-300`}>
                  <feat.Icon className={`text-${feat.color}`} size={24} />
                </div>
                <h3 className="font-heading text-xl font-bold text-text-primary mb-3">{feat.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Fluid Grid */}
      <section className="py-20 relative px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/[0.01] to-transparent" />
        <div className={`mx-auto relative ${device === 'ultrawide' ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-heading font-bold text-text-primary leading-tight" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
                Featured <span className="text-neon-cyan">Games</span>
              </h2>
              <p className="text-text-secondary mt-2">Handpicked titles for the ultimate gaming experience</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-2 text-neon-cyan hover:text-neon-magenta transition-colors text-sm font-medium"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="responsive-grid">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="glass rounded-3xl overflow-hidden h-[400px]">
                  <div className="skeleton h-56 rounded-none" />
                  <div className="p-6 space-y-4">
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-10 w-full" />
                  </div>
                </div>
              ))
            ) : (
              featured.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 * anim.intensity }}
                  className="group glass rounded-3xl overflow-hidden hover:border-neon-cyan/20 transition-all duration-500 gpu"
                >
                  <Link to={`/products/${product.slug}`} className="block relative h-60 overflow-hidden bg-dark-700">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-transform duration-700 ${!isTouch && 'group-hover:scale-110'}`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                    {product.badge && (
                      <span className={`absolute top-4 right-4 px-4 py-1.5 rounded-xl text-[10px] font-bold tracking-widest ${
                        product.badge === 'SALE' ? 'bg-neon-red/90 text-white' :
                        'bg-neon-cyan/90 text-dark-900'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] text-neon-cyan/70 font-bold uppercase tracking-widest">{product.category}</span>
                      <span className="text-text-muted">·</span>
                      <span className="flex items-center gap-1 text-[10px] text-neon-gold font-bold">
                        <FiStar size={12} fill="currentColor" /> {product.rating}
                      </span>
                    </div>
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="font-heading text-lg font-bold text-text-primary group-hover:text-neon-cyan transition-colors mb-4 line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-heading text-2xl font-bold text-neon-cyan">${product.price.toFixed(2)}</span>
                        {product.original_price && (
                          <span className="text-xs text-text-muted line-through">${product.original_price.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addItem(product)}
                        className="p-4 rounded-2xl bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-dark-900 transition-all duration-300"
                      >
                        <FiShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA - Responsive Layout */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-neon-magenta/20 to-neon-purple/20" />
            <div className="absolute inset-0 glass" />
            <div className="relative p-10 md:p-20 text-center">
              <h2 className="font-heading font-bold text-text-primary mb-6 leading-tight" style={{ fontSize: 'var(--font-size-fluid-h2)' }}>
                Ready to <span className="neon-text-cyan">Level Up</span>?
              </h2>
              <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
                Join thousands of gamers who trust Pixel Forge for their gaming needs. Create an account today.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-2xl text-dark-900 font-bold text-lg btn-hover-lift w-full sm:w-auto"
              >
                Create Account <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Landing;
