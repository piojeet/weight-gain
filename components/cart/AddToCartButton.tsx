"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useCart } from "@/app/hooks/useCart";
import { animateCartAddition } from "@/lib/cart-animation";

type AddToCartButtonProps = {
  productId: string | number;
  inStock?: boolean;
  variantId?: string;
  quantity?: number;
  className?: string;
};

export default function AddToCartButton({
  productId,
  inStock = true,
  variantId,
  quantity = 1,
  className = "",
}: AddToCartButtonProps) {
  const { addItem, items, loading: cartLoading } = useCart();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const alreadyInCart = items.some((item) => item.productId === String(productId));
  const disabled = !inStock || cartLoading || alreadyInCart || adding;

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;

    const button = event.currentTarget;
    setAdding(true);
    setError("");
    try {
      await animateCartAddition(button, () => addItem(productId, variantId, quantity));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to add this product to your cart.");
    } finally {
      setAdding(false);
    }
  };

  const label = !inStock
    ? "Unavailable"
    : cartLoading
      ? "Checking Cart..."
      : adding
        ? "Adding..."
        : alreadyInCart
          ? "Already in Cart"
          : "Add to Cart";

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        aria-busy={adding}
        onClick={(event) => void handleClick(event)}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {adding && <LoaderCircle aria-hidden="true" className="mr-1 inline size-3 animate-spin" />}
        {label}
      </button>
      {error && <p role="alert" className="mt-1 text-[10px] text-red-600">{error}</p>}
    </div>
  );
}
