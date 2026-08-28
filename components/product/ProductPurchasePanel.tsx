"use client";

import { useState } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { FiZap } from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import type { Product } from "@/app/types/shop";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { useCart } from "@/app/hooks/useCart";

const flavors = ["Chocolate", "Vanilla", "Strawberry"];
const sizes = ["1 kg", "2 kg", "3 kg", "5 kg"];

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const [flavor, setFlavor] = useState(flavors[0]);
  const [size, setSize] = useState(sizes[2]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

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
        <WishlistButton productId={product.id} />
      </div>

      <div className="mt-4 flex items-center gap-1 text-sm text-slate-soft">
        <FaStar className="text-gold-400" />
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

      <OptionGroup label="Select Flavor">
        <div className="flex flex-wrap gap-2">
          {flavors.map((item) => <button key={item} type="button" onClick={() => setFlavor(item)} className={`rounded-lg border px-4 py-2 text-xs ${flavor === item ? "border-blue-400 bg-blue-50 text-navy" : "border-line text-slate-soft"}`}>{item}</button>)}
        </div>
      </OptionGroup>

      <OptionGroup label="Select Size">
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((item) => <button key={item} type="button" onClick={() => setSize(item)} className={`rounded-lg border px-2 py-3 text-xs font-semibold ${size === item ? "border-blue-400 bg-blue-50 text-navy" : "border-line text-slate-soft"}`}>{item}</button>)}
        </div>
      </OptionGroup>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="flex h-11 items-center rounded-lg border border-line">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 text-lg text-slate-soft">-</button>
          <span className="w-8 text-center text-sm font-semibold text-navy">{quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)} className="px-3 text-lg text-slate-soft">+</button>
        </div>
        <button type="button" disabled={!product.inStock} onClick={() => { for (let index = 0; index < quantity; index += 1) addItem(product.id); }} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-navy-900 px-5 text-sm font-bold text-white disabled:bg-gray-300"><HiOutlineShoppingCart />{product.inStock ? "Add to Cart" : "Out of Stock"}</button>
        <button type="button" disabled={!product.inStock} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-5 text-sm font-bold text-white disabled:bg-gray-300">Buy Now <FiZap /></button>
      </div>
    </div>
  );
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mt-5"><p className="mb-2 text-xs font-bold text-navy">{label}</p>{children}</div>;
}
