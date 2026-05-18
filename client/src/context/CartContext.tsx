import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  formatPHP: (amount: number) => string;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = 'pixel_forge_luxury_cart';

// PHP Currency Formatter
const phpFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, selectedVariant?: ProductVariant) => {
    setItems((prev) => {
      const existing = prev.find((i) => {
        const matchProduct = String(i.product.id) === String(product.id);
        const matchVariant = (!i.selectedVariant?.id && !selectedVariant?.id) || (String(i.selectedVariant?.id) === String(selectedVariant?.id));
        return matchProduct && matchVariant;
      });
      
      if (existing) {
        return prev.map((i) => {
          const matchProduct = String(i.product.id) === String(product.id);
          const matchVariant = (!i.selectedVariant?.id && !selectedVariant?.id) || (String(i.selectedVariant?.id) === String(selectedVariant?.id));
          if (matchProduct && matchVariant) {
            return { ...i, quantity: Math.min(i.quantity + 1, 99) };
          }
          return i;
        });
      }
      return [...prev, { product, quantity: 1, selectedVariant }];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems((prev) => prev.filter((i) => {
      const matchProduct = String(i.product.id) === String(productId);
      const matchVariant = (!i.selectedVariant?.id && !variantId) || (String(i.selectedVariant?.id) === String(variantId));
      return !(matchProduct && matchVariant);
    }));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        const matchProduct = String(i.product.id) === String(productId);
        const matchVariant = (!i.selectedVariant?.id && !variantId) || (String(i.selectedVariant?.id) === String(variantId));
        if (matchProduct && matchVariant) {
          return { ...i, quantity: Math.min(quantity, 99) };
        }
        return i;
      }).filter(i => i.quantity > 0)
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const formatPHP = useCallback((amount: number) => {
    return phpFormatter.format(amount);
  }, []);

  const total = items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, total, addItem, removeItem, updateQuantity, clearCart, formatPHP }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
