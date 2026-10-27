"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { commerceApi } from "@/lib/api/commerce";

type ProductId = string | number;
type WishlistContextValue = {
  productIds: string[];
  loading: boolean;
  error: string | null;
  isWishlisted: (productId: ProductId) => boolean;
  toggleWishlist: (productId: ProductId) => Promise<void>;
  clearWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const productIdsRef = useRef<string[]>([]);
  const requestQueue = useRef(Promise.resolve());
  const hasPendingMutation = useRef(false);

  const mergeProductIds = useCallback((...lists: Array<Array<string | undefined> | undefined>) => {
    const next = new Set<string>();
    for (const list of lists) {
      for (const id of list ?? []) {
        if (id) next.add(String(id));
      }
    }
    return Array.from(next);
  }, []);

  useEffect(() => {
    productIdsRef.current = productIds;
  }, [productIds]);

  useEffect(() => {
    let active = true;

    commerceApi
      .wishlist()
      .then((data) => {
        if (!active || hasPendingMutation.current) return;
        const nextIds = mergeProductIds(data.productIds ?? []);
        productIdsRef.current = nextIds;
        setProductIds(nextIds);
      })
      .catch(() => {
        if (active) setError("Unable to load wishlist");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [mergeProductIds]);

  const toggleWishlist = useCallback(
    (rawProductId: ProductId) => {
      const productId = String(rawProductId);
      hasPendingMutation.current = true;
      const request = requestQueue.current.then(async () => {
        const currentIds = [...productIdsRef.current];
        const isSaved = currentIds.includes(productId);
        const optimisticIds = isSaved
          ? currentIds.filter((id) => id !== productId)
          : mergeProductIds(currentIds, [productId]);

        productIdsRef.current = optimisticIds;
        setProductIds(optimisticIds);
        setError(null);

        try {
          const data = isSaved
            ? await commerceApi.removeWishlist(productId)
            : await commerceApi.addWishlist(productId);

          const nextIds = mergeProductIds(optimisticIds, data.productIds ?? []);
          productIdsRef.current = nextIds;
          setProductIds(nextIds);
        } catch {
          productIdsRef.current = currentIds;
          setProductIds(currentIds);
          setError("Unable to update wishlist");
        } finally {
          hasPendingMutation.current = false;
        }
      });

      requestQueue.current = request.catch(() => undefined);
      return request;
    },
    [mergeProductIds],
  );

  const clearWishlist = useCallback(async () => {
    hasPendingMutation.current = true;
    const previousIds = [...productIds];
    setProductIds([]);

    try {
      await commerceApi.removeWishlist();
      productIdsRef.current = [];
    } catch {
      setProductIds(previousIds);
      productIdsRef.current = previousIds;
      setError("Unable to clear wishlist");
    } finally {
      hasPendingMutation.current = false;
    }
  }, [productIds]);

  const value = useMemo(
    () => ({
      productIds,
      loading,
      error,
      isWishlisted: (productId: ProductId) => productIds.includes(String(productId)),
      toggleWishlist,
      clearWishlist,
    }),
    [clearWishlist, error, loading, productIds, toggleWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
}
