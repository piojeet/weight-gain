"use client";

import { FiHeart } from "react-icons/fi";
import { useWishlist } from "@/app/hooks/useWishlist";
import { animateCartAddition } from "@/lib/cart-animation";

export default function WishlistButton({ productId }: { productId: string | number }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(productId);

  return (
    <button
      type="button"
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void animateCartAddition(event.currentTarget, () => toggleWishlist(productId), {
          dotClass: "wishlist-animation-dot",
          dotViewTransitionName: "wishlist-dot",
          targetId: "wishlist-animation-target",
          reverse: wishlisted,
        });
      }}
      className="relative flex size-8 items-center justify-center rounded-md text-navy hover:bg-gray-50 border border-gray-200 cursor-pointer bg-white"
    >
      <FiHeart className={wishlisted ? "fill-green-600 text-green-600" : ""} />
    </button>
  );
}
