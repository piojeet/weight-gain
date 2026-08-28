"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineTrash } from "react-icons/hi2";
import type { Product } from "@/app/types/shop";

export default function CartItemRow({ product, quantity, onQuantityChange, onRemove }: { product: Product; quantity: number; onQuantityChange: (quantity: number) => void; onRemove: () => void }) {
  return <article className="grid gap-4 border-b border-line p-4 last:border-b-0 sm:grid-cols-[minmax(260px,1.6fr)_120px_130px_100px] sm:items-center sm:px-6">
    <div className="flex items-center gap-4"><Link href={`/product/${product.slug}`} className="relative size-20 shrink-0 rounded-lg bg-[#f7fafc]"><Image src={product.image} alt={product.name} fill className="object-contain p-2" /></Link><div className="min-w-0"><Link href={`/product/${product.slug}`} className="block truncate text-sm font-bold text-navy hover:text-green-600">{product.name}</Link><p className="mt-1 text-xs text-slate-soft">{product.categoryLabel}</p><p className="mt-1 text-[11px] text-slate-soft">Standard option</p></div></div>
    <div className="flex items-center justify-between sm:block"><span className="text-[10px] uppercase text-slate-soft sm:hidden">Price</span><div><p className="text-sm font-bold text-navy">₹{product.price.toLocaleString("en-IN")}</p>{product.mrp && <p className="text-[10px] text-gray-400 line-through">₹{product.mrp.toLocaleString("en-IN")}</p>}{product.discountPercent && <p className="text-[10px] font-bold text-red-500">{product.discountPercent}% OFF</p>}</div></div>
    <div className="flex items-center justify-between sm:block"><span className="text-[10px] uppercase text-slate-soft sm:hidden">Quantity</span><div className="flex h-9 w-fit items-center rounded-md border border-line"><button type="button" aria-label="Decrease quantity" onClick={() => onQuantityChange(quantity - 1)} className="px-3 text-navy">-</button><span className="w-8 text-center text-xs font-bold text-navy">{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => onQuantityChange(quantity + 1)} className="px-3 text-navy">+</button></div></div>
    <div className="flex items-center justify-between sm:block"><span className="text-[10px] uppercase text-slate-soft sm:hidden">Total</span><div className="flex items-center justify-between gap-3"><strong className="text-sm text-navy">₹{(product.price * quantity).toLocaleString("en-IN")}</strong><button type="button" aria-label={`Remove ${product.name}`} onClick={onRemove} className="text-navy hover:text-red-500"><HiOutlineTrash /></button></div></div>
  </article>;
}
