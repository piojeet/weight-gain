"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type CartItem = { productId: number; quantity: number };
type CartContextValue = { items: CartItem[]; loading: boolean; addItem: (productId: number) => void; updateQuantity: (productId: number, quantity: number) => void; removeItem: (productId: number) => void; clearCart: () => void };
const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "nutrigain-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) setItems(JSON.parse(saved) as CartItem[]);
      } catch {
      } finally {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!loading) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loading]);

  const addItem = useCallback((productId: number) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      return existing ? current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { productId, quantity: 1 }];
    });
  }, []);
  const updateQuantity = useCallback((productId: number, quantity: number) => setItems((current) => quantity > 0 ? current.map((item) => item.productId === productId ? { ...item, quantity } : item) : current.filter((item) => item.productId !== productId)), []);
  const removeItem = useCallback((productId: number) => setItems((current) => current.filter((item) => item.productId !== productId)), []);
  const clearCart = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, loading, addItem, updateQuantity, removeItem, clearCart }), [addItem, clearCart, items, loading, removeItem, updateQuantity]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
