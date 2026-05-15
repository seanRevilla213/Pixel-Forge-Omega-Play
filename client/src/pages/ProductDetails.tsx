import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiMonitor, FiTag, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import api from '../api/axiosInstance';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    api.get(`/products/slug/${slug}`).then(({ data }) => {
      setProduct(data.product);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="skeleton h-96 rounded-2xl" />
            <div className="space-y-4">
              <div className="skeleton h-8 w-2/3" />
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-20 w-full" />
              <div className="skeleton h-12 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-text-primary mb-4">Product Not Found</h2>
          <Link to="/products" className="text-neon-cyan hover:text-neon-magenta transition-colors">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-8 text-sm">
            <FiArrowLeft size={16} /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative rounded-2xl overflow-hidden glass">
              <img src={product.image_url} alt={product.name} className="w-full h-80 lg:h-[450px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
              {product.badge && (
                <span className={`absolute top-4 right-4 px-4 py-1.5 rounded-lg text-sm font-bold ${
                  product.badge === 'SALE' ? 'bg-neon-red text-white' :
                  product.badge === 'NEW' ? 'bg-neon-green text-dark-900' :
                  'bg-neon-cyan text-dark-900'
                }`}>{product.badge}</span>
              )}
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-lg bg-neon-cyan/10 text-neon-cyan text-xs font-medium uppercase tracking-wider">{product.category}</span>
                  <span className="px-3 py-1 rounded-lg bg-dark-600 text-text-secondary text-xs">{product.genre}</span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-neon-gold"><FiStar fill="currentColor" size={14} /> {product.rating} ({product.review_count} reviews)</span>
                </div>
              </div>

              <p className="text-text-secondary leading-relaxed">{product.description}</p>

              <div className="glass rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm"><FiMonitor className="text-neon-cyan" size={16} /><span className="text-text-secondary">Platforms:</span><span className="text-text-primary">{product.platform}</span></div>
                <div className="flex items-center gap-2 text-sm"><FiTag className="text-neon-magenta" size={16} /><span className="text-text-secondary">Genre:</span><span className="text-text-primary">{product.genre}</span></div>
              </div>

              {/* Price & Actions */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-end gap-3 mb-6">
                  <span className="font-heading text-4xl font-bold text-neon-cyan">
                    {product.price === 0 ? 'FREE' : `$${product.price.toFixed(2)}`}
                  </span>
                  {product.original_price && (
                    <>
                      <span className="text-lg text-text-muted line-through">${product.original_price.toFixed(2)}</span>
                      <span className="px-2 py-1 rounded-md bg-neon-green/20 text-neon-green text-xs font-bold">-{discount}%</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-0 glass rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-3 text-text-secondary hover:text-neon-cyan transition-colors"><FiMinus size={16} /></button>
                    <span className="px-4 py-3 font-medium text-text-primary min-w-[50px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(99, q + 1))} className="px-3 py-3 text-text-secondary hover:text-neon-cyan transition-colors"><FiPlus size={16} /></button>
                  </div>
                </div>

                <button
                  onClick={() => { for (let i = 0; i < quantity; i++) addItem(product); }}
                  className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl text-dark-900 font-bold text-base flex items-center justify-center gap-2 btn-hover-lift"
                >
                  <FiShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetails;
