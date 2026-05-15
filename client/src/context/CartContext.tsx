import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      // Prevent duplicate bug by checking ID
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + 1, 99) }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: Math.min(quantity, 99) } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const formatPHP = useCallback((amount: number) => {
    // Assuming base prices were in USD, multiply by 50 for realistic Peso values
    // If prices are already in Peso, this can be removed. 
    // Given the previous design, they were likely USD ($29.99 -> ₱1,499).
    const pesoAmount = amount * 56; 
    return phpFormatter.format(pesoAmount);
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
