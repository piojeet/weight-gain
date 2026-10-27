"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { FiZap } from "react-icons/fi";
import type { Product } from "@/app/types/shop";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { useCart } from "@/app/hooks/useCart";
import { QuantityStepper } from "@/components/spectrumui/quantity-stepper";
import { ShareButton, type ShareAction } from "@/components/spectrumui/share-button";
import { Mail, MessageCircle } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { StarRating } from "@/components/spectrumui/star-rating";
import { animateCartAddition } from "@/lib/cart-animation";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState<string | undefined>(product.variants?.[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addError, setAddError] = useState("");
  const { addItem, items: cartItems, loading: cartLoading } = useCart();
  const alreadyInCart = cartItems.some((item) => item.productId === String(product.id));
  const canAddToCart = product.inStock && !cartLoading && !alreadyInCart && !addingToCart;
  const shareUrl = typeof window === "undefined" ? `/product/${product.slug}` : window.location.href;
  const shareActions: ShareAction[] = [
    {
      icon: <FaXTwitter className="size-4" />,
      label: "Share on X",
      onSelect: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(product.name)}`, "_blank", "noopener,noreferrer"),
    },
    {
      icon: <Mail className="size-4" />,
      label: "Email",
      onSelect: () => window.location.assign(`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(shareUrl)}`),
    },
    {
      icon: <MessageCircle className="size-4" />,
      label: "Message",
      onSelect: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${product.name} ${shareUrl}`)}`, "_blank", "noopener,noreferrer"),
    },
  ];

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          {product.badge && (
            <span className="rounded-md bg-green-600 px-2 py-1 text-[10px] font-bold text-white">
              {product.badge}
            </span>
          )}
          <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">{product.name}</h1>
          <p className="mt-1 text-sm text-slate-soft">{product.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton copyValue={shareUrl} actions={shareActions} />
          <WishlistButton productId={product.id} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-sm text-slate-soft">
        <StarRating value={product.rating} readOnly size="xs" />
        <strong className="text-navy">{product.rating}</strong>
        <span>({product.reviews} reviews)</span>
        <a href="#reviews" className="ml-2 text-green-600 underline">Write a Review</a>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-b border-line pb-5">
        <span className="text-2xl font-extrabold text-navy">₹{product.price.toLocaleString("en-IN")}</span>
        {product.mrp && <span className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString("en-IN")}</span>}
        {product.discountPercent && <span className="rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-500">{product.discountPercent}% OFF</span>}
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x rounded-xl border border-line bg-white">
        {product.stats.map((stat) => (
          <div key={stat.label} className="p-3 text-center">
            <p className="font-bold text-navy">{stat.value}</p>
            <p className="mt-1 text-[10px] text-slate-soft">{stat.label}</p>
          </div>
        ))}
      </div>

      {product.variants?.length ? <OptionGroup label="Select variant">
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => <button key={variant.id} type="button" onClick={() => setVariantId(variant.id)} className={`rounded-lg border px-4 py-2 text-xs ${variantId === variant.id ? "border-blue-400 bg-blue-50 text-navy" : "border-line text-slate-soft"}`}>{Object.values(variant.attributes).join(" / ") || variant.id}</button>)}
        </div>
      </OptionGroup> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <QuantityStepper value={quantity} onValueChange={setQuantity} min={1} max={10} />
        <button
          type="button"
          disabled={!canAddToCart}
          onClick={async (event) => {
            if (!canAddToCart) return;
            const button = event.currentTarget;
            setAddingToCart(true);
            setAddError("");
            try {
              await animateCartAddition(button, () => addItem(product.id, variantId, quantity));
            } catch (cause) {
              setAddError(cause instanceof Error ? cause.message : "Unable to add this product to your cart.");
            } finally {
              setAddingToCart(false);
            }
          }}
          aria-busy={addingToCart}
          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold text-white disabled:bg-gray-300 ${alreadyInCart ? "bg-green-600" : "bg-navy-900"}`}
        >
          {addingToCart ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <HiOutlineShoppingCart />}
          {!product.inStock ? "Out of Stock" : cartLoading ? "Checking Cart..." : addingToCart ? "Adding..." : alreadyInCart ? "Already in Cart" : "Add to Cart"}
        </button>
        <button type="button" disabled={!product.inStock} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-5 text-sm font-bold text-white disabled:bg-gray-300">Buy Now <FiZap /></button>
      </div>
      {addError && <p role="alert" className="mt-2 text-xs text-red-600">{addError}</p>}
    </div>
  );
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mt-5"><p className="mb-2 text-xs font-bold text-navy">{label}</p>{children}</div>;
}
