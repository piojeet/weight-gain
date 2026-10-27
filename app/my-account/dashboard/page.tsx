"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiHeart, FiShoppingBag, FiTarget, FiTruck } from "react-icons/fi";
import { authApi } from "@/lib/api/auth";
import { commerceApi, normalizeCommerceProduct } from "@/lib/api/commerce";
import type { Product } from "@/app/types/shop";
import { useWishlist } from "@/app/hooks/useWishlist";
import AddToCartButton from "@/components/cart/AddToCartButton";

type Order = Record<string, any>;
const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function DashboardPage() {
  const { productIds, isWishlisted, toggleWishlist } = useWishlist();
  const [user, setUser] = useState<{ fullName: string; email: string; phone: string | null; membershipTier?: string | null; totalOrders?: number; totalSpent?: number } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([authApi.me(), commerceApi.orders(), commerceApi.products("?pageSize=100")])
      .then(([profile, orderData, productData]) => {
        setUser(profile.user);
        setOrders(orderData.orders);
        setProducts(productData.products.map(normalizeCommerceProduct));
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load your dashboard"));
  }, []);

  const wishlistProducts = products.filter((product) => productIds.includes(String(product.id)));
  const totalSpent = user?.totalSpent ?? orders.reduce((sum, order) => sum + Number(order.totalAmount ?? 0), 0);
  const recentOrders = orders.slice(0, 5);
  const recommended = products.filter((product) => !productIds.includes(String(product.id))).slice(0, 6);

  return (
    <section className="bg-[#fbfcfe] py-7 text-navy">
      <div>
        <div className="mb-5 text-[10px] text-slate-soft">Home <span className="mx-2">›</span> My Account <span className="mx-2">›</span> <span className="text-navy">Dashboard</span></div>
        <h1 className="text-[22px] font-extrabold tracking-tight">My Dashboard</h1>
        <p className="mt-1 text-xs text-slate-soft">Welcome back{user ? `, ${user.fullName}` : ""}.</p>
        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            ["Total Orders", String(user?.totalOrders ?? orders.length), "/my-account/orders", FiTruck],
            ["Total Spent", money(totalSpent), "/my-account/orders", FiShoppingBag],
            ["Wishlist Items", String(productIds.length), "/wishlist", FiHeart],
            ["Membership", user?.membershipTier ? user.membershipTier[0].toUpperCase() + user.membershipTier.slice(1) : "Unavailable", "/my-account", FiTarget],
          ].map(([label, value, href, Icon]) => {
            const StatIcon = Icon as typeof FiTruck;
            return <div key={String(label)} className="rounded-lg border border-line bg-white p-4 shadow-sm"><div className="mb-3 flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600"><StatIcon size={16} /></div><p className="text-[10px] text-slate-soft">{String(label)}</p><p className="mt-1 text-lg font-extrabold">{String(value)}</p><Link href={String(href)} className="mt-2 flex items-center gap-1 text-[9px] font-bold text-green-600">View details <FiArrowRight /></Link></div>;
          })}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(235px,0.75fr)]">
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-extrabold">Recent Orders</h2><Link href="/my-account/orders" className="text-[9px] font-bold text-green-600">View all <FiArrowRight className="inline" /></Link></div><div className="grid gap-2">{recentOrders.map((order) => <div key={String(order.id)} className="flex items-center justify-between gap-3 rounded-md border border-[#edf0f4] px-3 py-3 text-[9px]"><div><p className="font-bold">{String(order.orderNumber ?? order.id)}</p><p className="mt-1 text-slate-soft">{Array.isArray(order.items) ? order.items.length : 0} item(s)</p></div><div className="text-right"><p className="font-bold">{money(Number(order.totalAmount ?? 0))}</p><p className="text-slate-soft">{String(order.status ?? "Pending")}</p></div></div>)}</div>{!recentOrders.length && !error && <p className="text-sm text-slate-soft">No orders found.</p>}</div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Account Overview</h2>{user ? <div className="mt-4 grid gap-3 text-[9px]"><p><span className="text-slate-soft">Name</span><b className="float-right">{user.fullName}</b></p><p><span className="text-slate-soft">Email</span><b className="float-right font-medium">{user.email}</b></p><p><span className="text-slate-soft">Phone</span><b className="float-right font-medium">{user.phone || "Not provided"}</b></p></div> : <p className="mt-4 text-sm text-slate-soft">Loading profile...</p>}<Link href="/my-account/profile" className="mt-4 block rounded border border-green-500 py-1.5 text-center text-[9px] font-bold text-green-600">Edit Profile</Link></div>
        </div>

        <div className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-extrabold">My Wishlist <span className="font-normal text-slate-soft">({wishlistProducts.length} items)</span></h2><Link href="/wishlist" className="text-[9px] font-bold text-green-600">View wishlist <FiArrowRight className="inline" /></Link></div><div className="grid gap-2 sm:grid-cols-3">{wishlistProducts.map((product) => <div key={product.id} className="relative rounded-md border border-[#edf0f4] p-2"><button onClick={() => void toggleWishlist(product.id)} aria-label="Remove from wishlist" className="absolute right-2 top-2 text-red-400"><FiHeart fill={isWishlisted(product.id) ? "currentColor" : "none"} /></button><img src={product.image} alt={product.name} className="mx-auto h-16 object-contain" /><p className="truncate text-[9px] font-bold">{product.name}</p><p className="mt-1 text-[10px] font-extrabold">{money(product.price)}</p><AddToCartButton productId={product.id} inStock={product.inStock} className="mt-2 w-full rounded border border-[#bdc8d6] py-1.5 text-[8px] font-bold" /></div>)}</div>{!wishlistProducts.length && !error && <p className="text-sm text-slate-soft">Your wishlist is empty.</p>}</div>

        <div className="mt-4"><div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-extrabold">Recommended for You</h2><Link href="/shop" className="text-[9px] font-bold text-green-600">Shop all <FiArrowRight className="inline" /></Link></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{recommended.map((product) => <div key={product.id} className="rounded-md border border-line bg-white p-2 shadow-sm"><img src={product.image} alt={product.name} className="mx-auto h-20 object-contain" /><p className="truncate text-[9px] font-bold">{product.name}</p><p className="mt-1 text-[10px] font-extrabold">{money(product.price)}</p><AddToCartButton productId={product.id} inStock={product.inStock} className="mt-2 w-full rounded border border-[#bdc8d6] py-1.5 text-[8px] font-bold" /></div>)}</div></div>
      </div>
    </section>
  );
}
