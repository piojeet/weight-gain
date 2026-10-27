"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { commerceApi, type CommerceProduct } from "@/lib/api/commerce";
import { ApiError } from "@/lib/api/client";

type CartItem = {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  product?: CommerceProduct;
  variant?: Record<string, unknown> | null;
  unitPrice?: number;
  subtotal?: number;
  available?: boolean;
};
type ProductId = string | number;
type CartContextValue = {
  items: CartItem[];
  loading: boolean;
  addItem: (productId: ProductId, variantId?: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: ProductId, quantity: number, variantId?: string | null) => Promise<void>;
  removeItem: (productId: ProductId, variantId?: string | null) => Promise<void>;
  clearCart: () => Promise<void>;
  error: string | null;
  reload: () => Promise<void>;
};

function getErrorMessage(cause: unknown) {
  if (cause instanceof ApiError && cause.status > 0) {
    return `${cause.message} (HTTP ${cause.status}, ${cause.code})`;
  }
  return cause instanceof Error ? cause.message : "Unable to load your cart.";
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyCart = useCallback((cart: { items?: Array<{ id: string; productId: string; variantId: string | null; quantity: number; product?: CommerceProduct; variant?: Record<string, unknown> | null; unitPrice?: number; subtotal?: number; available?: boolean }> } | null) => {
    if (!cart || !Array.isArray(cart.items)) {
      throw new Error("Cart API response is missing its items list.");
    }
    setItems(
      cart.items.map(({ id, productId, variantId, quantity, product, variant, unitPrice, subtotal, available }) => ({
        id,
        productId,
        variantId,
        quantity,
        product,
        variant,
        unitPrice,
        subtotal,
        available,
      })),
    );
    setError(null);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      applyCart(await commerceApi.cart());
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setLoading(false);
    }
  }, [applyCart]);

  useEffect(() => {
    let active = true;
    commerceApi.cart()
      .then((cart) => {
        if (active) applyCart(cart);
      })
      .catch((cause: unknown) => {
        if (active) setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [applyCart]);

  const addItem = useCallback(
    async (productId: ProductId, variantId?: string, quantity = 1) => {
      try {
        const nextCart = await commerceApi.addCartItem({ productId: String(productId), variantId, quantity });
        applyCart(nextCart);
      } catch (cause) {
        setError(getErrorMessage(cause));
        throw cause;
      }
    },
    [applyCart],
  );

  const updateQuantity = useCallback(
    async (productId: ProductId, quantity: number, variantId?: string | null) => {
      const item = items.find((entry) => entry.productId === String(productId) && (variantId === undefined || entry.variantId === variantId));
      if (!item?.id) return;
      try {
        const nextCart = await commerceApi.updateCartItem(item.id, quantity);
        applyCart(nextCart);
      } catch (cause) {
        setError(getErrorMessage(cause));
        throw cause;
      }
    },
    [applyCart, items],
  );

  const removeItem = useCallback(
    async (productId: ProductId, variantId?: string | null) => {
      const item = items.find((entry) => entry.productId === String(productId) && (variantId === undefined || entry.variantId === variantId));
      if (!item?.id) return;
      try {
        const nextCart = await commerceApi.removeCartItem(item.id);
        applyCart(nextCart);
      } catch (cause) {
        setError(getErrorMessage(cause));
        throw cause;
      }
    },
    [applyCart, items],
  );

  const clearCart = useCallback(async () => {
    try {
      const nextCart = await commerceApi.clearCart();
      applyCart(nextCart);
    } catch (cause) {
      setError(getErrorMessage(cause));
      throw cause;
    }
  }, [applyCart]);

  const value = useMemo(
    () => ({ items, loading, addItem, updateQuantity, removeItem, clearCart, error, reload }),
    [addItem, clearCart, error, items, loading, reload, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
