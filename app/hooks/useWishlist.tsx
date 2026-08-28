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

type WishlistContextValue = {
  productIds: number[];
  loading: boolean;
  error: string | null;
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const productIdsRef = useRef<number[]>([]);
  const requestQueue = useRef(Promise.resolve());
  const hasPendingMutation = useRef(false);

  useEffect(() => {
    productIdsRef.current = productIds;
  }, [productIds]);

  useEffect(() => {
    fetch("/api/wishlist")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load wishlist");
        return response.json() as Promise<{ productIds: number[] }>;
      })
      .then((data) => {
        if (!hasPendingMutation.current) {
          productIdsRef.current = data.productIds;
          setProductIds(data.productIds);
        }
      })
      .catch(() => setError("Unable to load wishlist"))
      .finally(() => setLoading(false));
  }, []);

  const toggleWishlist = useCallback(
    (productId: number) => {
      hasPendingMutation.current = true;
      const request = requestQueue.current.then(async () => {
        const currentIds = productIdsRef.current;
        const isSaved = currentIds.includes(productId);
        const nextIds = isSaved
          ? currentIds.filter((id) => id !== productId)
          : [...currentIds, productId];

        productIdsRef.current = nextIds;
        setProductIds(nextIds);
        setError(null);

        try {
          const response = await fetch("/api/wishlist", {
            method: isSaved ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, productIds: nextIds }),
          });
          if (!response.ok) throw new Error("Unable to update wishlist");
          const data = (await response.json()) as { productIds: number[] };
          productIdsRef.current = data.productIds;
          setProductIds(data.productIds);
        } catch {
          productIdsRef.current = currentIds;
          setProductIds(currentIds);
          setError("Unable to update wishlist");
        }
      });

      requestQueue.current = request.catch(() => undefined);
      return request;
    },
    [],
  );

  const clearWishlist = useCallback(async () => {
    hasPendingMutation.current = true;
    const previousIds = productIds;
    setProductIds([]);
    try {
      const response = await fetch("/api/wishlist", { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to clear wishlist");
    } catch {
      setProductIds(previousIds);
      setError("Unable to clear wishlist");
    }
  }, [productIds]);

  const value = useMemo(
    () => ({
      productIds,
      loading,
      error,
      isWishlisted: (productId: number) => productIds.includes(productId),
      toggleWishlist,
      clearWishlist,
    }),
    [clearWishlist, error, loading, productIds, toggleWishlist],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
}
