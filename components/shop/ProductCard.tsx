"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { HiOutlineShoppingCart, HiOutlineEye } from "react-icons/hi2";
import { Product } from "@/app/types/shop";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { useCart } from "@/app/hooks/useCart";

const BADGE_STYLES: Record<NonNullable<Product["badge"]>, string> = {
  BESTSELLER: "bg-green-500",
  NEW: "bg-blue-400",
  "LAB TESTED": "bg-navy",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
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
    reviews,
    price,
    mrp,
    discountPercent,
    inStock,
  } = product;

  return (
    <Link
      href={`/product/${slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-white p-4 shadow-soft transition-shadow hover:shadow-md"
    >
      <div className="relative">
        <div className="flex items-start justify-between">
          {badge ? (
            <span
              className={`rounded-md px-2 py-1 text-[10px] font-bold text-white ${BADGE_STYLES[badge]}`}
            >
              {badge}
            </span>
          ) : discountPercent ? (
            <span className="rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
              {discountPercent}% OFF
            </span>
          ) : (
            <span />
          )}
          <WishlistButton productId={id} />
        </div>

        {!inStock && (
          <span className="absolute top-10 left-0 z-10 rounded-md bg-gray-600 px-2 py-1 text-[10px] font-bold text-white">
            OUT OF STOCK
          </span>
        )}

        <div className="relative mt-2 h-40 w-full sm:h-44">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="flex-1">
        <p className="text-[10px] font-semibold tracking-wide text-green-600 uppercase">
          {categoryLabel}
        </p>
        <p className="mt-1 text-sm font-semibold text-navy">{name}</p>
        <p className="mt-0.5 text-xs text-slate-soft">{description}</p>

        {stats.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-1 border-t border-line pt-3">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-xs font-bold text-navy">{s.value}</p>
                <p className="text-[10px] text-slate-soft">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-1 text-xs text-slate-soft">
          <FaStar className="text-gold-400" />
          <span className="font-medium text-navy">{rating}</span>
          <span>({reviews})</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-extrabold text-navy">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {mrp && (
            <span className="text-xs text-gray-400 line-through">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
          )}
          {discountPercent && (
            <span className="text-xs font-semibold text-red-500">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={!inStock}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (inStock) addItem(id);
        }}
        className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-navy-900 py-2 text-xs font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        <HiOutlineShoppingCart /> {inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    </Link>
  );
}
