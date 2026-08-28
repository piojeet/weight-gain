"use client";

import { FiHeart } from "react-icons/fi";
import { useWishlist } from "@/app/hooks/useWishlist";

export default function WishlistButton({ productId }: { productId: number }) {
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
        void toggleWishlist(productId);
      }}
      className="flex size-8 items-center justify-center rounded-full text-navy hover:bg-gray-50"
    >
      <FiHeart className={wishlisted ? "fill-red-500 text-red-500" : ""} />
    </button>
  );
}
