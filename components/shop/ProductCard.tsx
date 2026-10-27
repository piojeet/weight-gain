"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { FaStar } from "react-icons/fa6";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { Product } from "@/app/types/shop";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { useCart } from "@/app/hooks/useCart";
import { animateCartAddition } from "@/lib/cart-animation";

const BADGE_STYLES: Record<NonNullable<Product["badge"]>, string> = {
  BESTSELLER: "bg-green-500",
  NEW: "bg-blue-400",
  "LAB TESTED": "bg-navy",
};

export default function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { addItem, items: cartItems, loading: cartLoading } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addError, setAddError] = useState("");
  const {
    id,
    slug,
    name,
    description,
    image,
    categoryLabel,
    badge,
    stats,
    rating,
    price,
    mrp,
    discountPercent,
    inStock,
  } = product;
  const alreadyInCart = cartItems.some((item) => item.productId === String(id));
  const canAddToCart = inStock && !cartLoading && !alreadyInCart && !addingToCart;

  const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!canAddToCart) return;

    const button = event.currentTarget;
    setAddingToCart(true);
    setAddError("");
    try {
      await animateCartAddition(button, () => addItem(id));
    } catch (cause) {
      setAddError(cause instanceof Error ? cause.message : "Unable to add this product to your cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Link
      href={`/product/${slug}`}
      className="group flex h-full flex-col rounded-lg border border-line bg-white shadow-soft transition-shadow hover:shadow-md overflow-hidden"
    >
      <div className="relative">
        <div className="flex items-start justify-between px-4 pt-4 absolute top left-0 w-full z-10">
          {!inStock ? (
            <span className="rounded-md bg-foreground px-2 py-1 text-[8px] font-bold text-white tracking-wider font-jetbrains">
              OUT OF STOCK
            </span>
          ) : discountPercent ? (
            <span
              className="rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white"
            >
              {discountPercent}% OFF
            </span>
          ) : badge ? (
            <span
              className={`rounded-md px-2 py-1 text-xs font-bold text-white ${BADGE_STYLES[badge]}`}
            >
              {badge}
            </span>
          ) : (
            <span />
          )}
          <WishlistButton productId={id} />
        </div>

        <div className="relative w-full aspect-4/4 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 639px) calc(50vw - 1.5rem), (max-width: 1023px) calc(50vw - 2rem), (max-width: 1279px) calc(25vw - 5rem), 240px"
            className="object-cover transition-transform duration-300 group-hover:scale-105 h-full w-full"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4">
        <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
          {categoryLabel}
        </p>
        <p className="mt-3 text-base font-bold text-foreground font-sora">{name}</p>
        {!compact && <p className="mt-0.5 text-xs font-manrope text-muted-foreground">{description}</p>}

        {!compact && rating > 0 && (
          <div className="mt-auto flex items-center gap-1 pt-1.5 text-xs text-slate-soft">
            <FaStar className="text-[10px] text-gold-400" />
            <span className="text-xs font-semibold text-foreground font-mono">{rating.toFixed(1)}</span>
          </div>
         )}

        {!compact && !rating && stats.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-1 border-t border-line pt-3">
            {stats.slice(0, 2).map((s) => (
              <div key={s.label}>
                <p className="text-xs font-bold text-navy">{s.value}</p>
                <p className="text-xs text-slate-soft">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 flex min-h-7 items-center gap-2 text-xs">
          <span className="text-sm font-semibold text-foreground font-mono">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {mrp && (
            <span className="text-xs text-gray-400 line-through font-mono font-semibold">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 w-full">
      <button
        type="button"
        disabled={!canAddToCart}
        onClick={(event) => void handleAddToCart(event)}
        aria-busy={addingToCart}
        className={`mt-3 flex items-center justify-center gap-2 rounded-md py-2 text-xs font-semibold text-white disabled:cursor-not-allowed w-full cursor-pointer ${alreadyInCart ? "bg-green-600" : "bg-navy-900 hover:bg-navy-800 disabled:bg-gray-300"}`}
      >
        {addingToCart ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <HiOutlineShoppingCart aria-hidden="true" />}
        {!inStock ? "Out of Stock" : cartLoading ? "Checking Cart..." : addingToCart ? "Adding..." : alreadyInCart ? "Already in Cart" : "Add to Cart"}
      </button>
      {addError && <p role="alert" className="mt-2 text-center text-[10px] text-red-600">{addError}</p>}
      </div>
    </Link>
  );
}
