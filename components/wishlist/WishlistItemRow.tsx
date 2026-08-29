"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { HiOutlineShoppingCart, HiOutlineTrash } from "react-icons/hi2";
import type { Product } from "@/app/types/shop";
import { Select } from "@/components/ui/select";

export default function WishlistItemRow({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: () => void;
}) {
  const discount = product.mrp ? product.mrp - product.price : 0;

  return (
    <article className="grid gap-4 border-b border-line p-4 last:border-b-0 sm:grid-cols-[minmax(260px,1.6fr)_150px_150px_130px_170px_42px] sm:items-center sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link href={`/product/${product.slug}`} className="relative size-20 shrink-0 rounded-lg bg-[#f7fafc]">
          <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
        </Link>
        <div className="min-w-0">
          {product.badge && <span className="rounded bg-green-600 px-2 py-1 text-[9px] font-bold text-white">{product.badge}</span>}
          <Link href={`/product/${product.slug}`} className="mt-2 block truncate text-sm font-bold text-navy hover:text-green-600">{product.name}</Link>
          <p className="mt-1 text-xs text-slate-soft">{product.description}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-soft"><FaStar className="text-gold-400" /><strong className="text-navy">{product.rating}</strong><span>({product.reviews} Reviews)</span></div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:block">
        <span className="text-[10px] font-semibold uppercase text-slate-soft sm:hidden">Price</span>
        <div><strong className="text-base text-navy">₹{product.price.toLocaleString("en-IN")}</strong>{product.mrp && <><span className="ml-2 text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString("en-IN")}</span><span className="ml-2 rounded bg-red-50 px-1.5 py-1 text-[10px] font-bold text-red-500">{Math.round((discount / product.mrp) * 100)}% OFF</span></>}</div>
      </div>

      <div className="flex items-center justify-between sm:block"><span className="text-[10px] font-semibold uppercase text-slate-soft sm:hidden">Variant</span><Select aria-label={`${product.name} variant`} defaultValue="default" className="text-xs"><option value="default">Standard option</option><option>1 unit</option><option>3 kg</option></Select></div>

      <div className="flex items-center justify-between sm:block"><span className="text-[10px] font-semibold uppercase text-slate-soft sm:hidden">Status</span><div><p className={`text-xs font-bold ${product.inStock ? "text-green-600" : "text-red-500"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</p><p className="mt-1 text-[10px] text-slate-soft">{product.inStock ? "Ready to ship" : "Currently unavailable"}</p></div></div>

      <button type="button" disabled={!product.inStock} className="flex items-center justify-center gap-2 rounded-md bg-navy-900 py-2 text-xs font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-gray-300"><HiOutlineShoppingCart />{product.inStock ? "Add to Cart" : "Unavailable"}</button>

      <button type="button" aria-label={`Remove ${product.name} from wishlist`} onClick={onRemove} className="flex size-9 items-center justify-center rounded-md border border-line text-navy hover:border-red-200 hover:text-red-500"><HiOutlineTrash /></button>
    </article>
  );
}
