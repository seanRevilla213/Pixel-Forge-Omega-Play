import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiZap, FiTruck, FiStar, FiShoppingCart } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import api from '../api/axiosInstance';

const Landing = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    api.get('/products/featured').then(({ data }) => {
      setFeatured(data.products);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[150px]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-cyan/20 text-neon-cyan text-xs font-medium tracking-wider uppercase mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              Now Live — Season 2 Collection
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6"
            >
              <span className="text-text-primary">PIXEL </span>
              <span className="bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-purple bg-clip-text text-transparent">
                FORGE
              </span>
              <br />
              <span className="text-text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">OMEGA PLAY</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto text-text-secondary text-lg md:text-xl leading-relaxed mb-10"
            >
              Your premium destination for next-gen gaming. Discover curated titles,
              exclusive deals, and instant digital delivery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/products"
                className="group relative px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl text-dark-900 font-bold text-base tracking-wide btn-hover-lift overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Browse Shop
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              <Link
                to="/products"
                className="px-8 py-4 rounded-xl border border-glass-border text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/30 transition-all duration-300 font-medium btn-hover-lift"
              >
                View Deals
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-text-muted flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                transition={{ delay: i * 0.15 }}
                className="glass rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-500 group cursor-default"
              >
                <div className={`w-14 h-14 rounded-xl bg-${feat.color}/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feat.Icon className={`text-${feat.color}`} size={24} />
                </div>
                <h3 className="font-heading text-lg font-bold text-text-primary mb-2">{feat.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-2">
                Featured <span className="text-neon-cyan">Games</span>
              </h2>
              <p className="text-text-secondary">Handpicked titles for the ultimate gaming experience</p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-neon-cyan hover:text-neon-magenta transition-colors text-sm font-medium"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <div className="skeleton h-48 rounded-none" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-8 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group glass rounded-2xl overflow-hidden hover:border-neon-cyan/20 transition-all duration-500"
                >
                  <Link to={`/products/${product.slug}`} className="block">
                    <div className="relative h-48 overflow-hidden bg-dark-700">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                      {product.badge && (
                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold tracking-wider ${
                          product.badge === 'SALE' ? 'bg-neon-red/90 text-white' :
                          product.badge === 'NEW' ? 'bg-neon-green/90 text-dark-900' :
                          product.badge === 'HOT' ? 'bg-neon-gold/90 text-dark-900' :
                          'bg-neon-cyan/90 text-dark-900'
                        }`}>
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-neon-cyan/70 font-medium uppercase tracking-wider">{product.category}</span>
                      <span className="text-text-muted">·</span>
                      <span className="flex items-center gap-1 text-xs text-neon-gold">
                        <FiStar size={12} fill="currentColor" /> {product.rating}
                      </span>
                    </div>
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="font-heading text-base font-bold text-text-primary group-hover:text-neon-cyan transition-colors mb-3">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-xl font-bold text-neon-cyan">${product.price.toFixed(2)}</span>
                        {product.original_price && (
                          <span className="text-sm text-text-muted line-through">${product.original_price.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addItem(product)}
                        className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-dark-900 transition-all duration-300"
                      >
                        <FiShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-magenta transition-colors text-sm font-medium"
            >
              View All Games <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-neon-magenta/20 to-neon-purple/20" />
            <div className="absolute inset-0 glass" />
            <div className="relative p-10 md:p-16 text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Ready to <span className="neon-text-cyan">Level Up</span>?
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
                Join thousands of gamers who trust Pixel Forge for their gaming needs. Create an account today.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl text-dark-900 font-bold btn-hover-lift"
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
