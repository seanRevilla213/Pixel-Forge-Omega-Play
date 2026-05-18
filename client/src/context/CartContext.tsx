import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product, variant?: ProductVariant) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        // Ensure legacy items have a unique top-level id
        return parsed.map(item => ({
          ...item,
          id: item.id || `${item.product.id}-${item.selectedVariant?.id || 'default'}`
        }));
      }
      return [];
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
      const targetId = `${product.id}-${selectedVariant?.id || 'default'}`;
      const existing = prev.find((i) => i.id === targetId);
      
      if (existing) {
        return prev.map((i) =>
          i.id === targetId
            ? { ...i, quantity: Math.min(i.quantity + 1, 99) }
            : i
        );
      }
      return [...prev, { id: targetId, product, quantity: 1, selectedVariant }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.min(quantity, 99) } : item))
        .filter((item) => item.quantity > 0)
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
