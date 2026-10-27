"use client";

import { useWishlist } from "@/app/hooks/useWishlist";
import { commerceApi, normalizeCommerceProduct } from "@/lib/api/commerce";
import type { Product } from "@/app/types/shop";
import WishlistItemRow from "@/components/wishlist/WishlistItemRow";
import WishlistSummary from "@/components/wishlist/WishlistSummary";
import { FiArrowRight, FiShare2, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HoldToConfirm } from "@/components/ui/hold-to-confirm";

export default function WishlistPage() {
  const { productIds, loading, clearWishlist, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");
  useEffect(() => {
    if (!productIds.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProducts([]);
      return;
    }
    setProductsLoading(true);
    setProductsError("");
    commerceApi.products("?pageSize=100")
      .then(({ products: rows }) => setProducts(rows.filter((product) => productIds.includes(product.id)).map(normalizeCommerceProduct)))
      .catch((cause) => setProductsError(cause instanceof Error ? cause.message : "Unable to load wishlist products"))
      .finally(() => setProductsLoading(false));
  }, [productIds]);
  const savings = products.reduce((total, product) => total + (product.mrp ? product.mrp - product.price : 0), 0);
  const total = products.reduce((sum, product) => sum + product.price, 0);

  const shareWishlist = async () => {
    await navigator.clipboard?.writeText(window.location.href);
  };

  return (
    <section className="container-page py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><nav className="mb-3 flex items-center gap-2 text-xs text-slate-soft"><Link href="/">Home</Link><span>/</span><span className="text-navy">Wishlist</span></nav><h1 className="text-2xl font-extrabold text-navy sm:text-3xl">My Wishlist ({products.length})</h1><p className="mt-1 text-xs text-slate-soft">Products you&apos;ve saved for later</p></div>
        <div className="flex gap-3"><button type="button" onClick={shareWishlist} className="flex items-center gap-2 rounded-md border border-line px-4 py-2 text-xs font-semibold text-navy hover:border-navy"><FiShare2 /> Share Wishlist</button><HoldToConfirm onConfirm={() => void clearWishlist()} disabled={!products.length} className="flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 disabled:opacity-50">
          <span className="flex items-center gap-2"><FiTrash2 /> Hold to Clear</span>
          </HoldToConfirm></div>
      </div>
      {loading || productsLoading ? (
        <p className="mt-6 text-sm text-slate-soft">Loading wishlist...</p>
      ) : productsError ? (
        <p role="alert" className="mt-6 text-sm text-red-600">{productsError}</p>
      ) : products.length === 0 ? (
        <p className="mt-6 text-sm text-slate-soft">Your wishlist is empty.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="overflow-hidden rounded-xl border border-line bg-white"><div className="hidden grid-cols-[minmax(260px,1.6fr)_150px_150px_130px_170px_42px] gap-4 border-b border-line bg-[#fbfcfd] px-6 py-3 text-[10px] font-bold uppercase text-slate-soft sm:grid"><span>Product</span><span>Price</span><span>Variant</span><span>Status</span><span>Actions</span><span /></div>{products.map((product) => <WishlistItemRow key={product.id} product={product} onRemove={() => void toggleWishlist(product.id)} />)}</div>
          <WishlistSummary itemCount={products.length} savings={savings} total={total} onAddAll={() => {}} />
        </div>
      )}
      {products.length > 0 && <div className="mt-6 flex items-center justify-between rounded-xl bg-linear-to-r from-[#f4faf8] to-white p-5 sm:px-8"><div><p className="text-sm font-bold text-navy">Looks like you love good health!</p><p className="mt-1 text-xs text-slate-soft">Add more products to your cart and start your wellness journey today.</p></div><Link href="/shop" className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-3 text-xs font-bold text-white">Continue Shopping <FiArrowRight /></Link></div>}
    </section>
  );
}
