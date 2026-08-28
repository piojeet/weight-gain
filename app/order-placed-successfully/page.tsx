"use client";

import Link from "next/link";
import { FiCalendar, FiCheck, FiClipboard, FiCreditCard, FiTruck } from "react-icons/fi";
import { PRODUCTS } from "@/app/data/products";
import { useCart } from "@/app/hooks/useCart";
import OrderDetails from "@/components/order-success/OrderDetails";
import OrderAddress from "@/components/order-success/OrderAddress";
import OrderTimeline from "@/components/order-success/OrderTimeline";
import OrderTrustStrip from "@/components/order-success/OrderTrustStrip";

export default function OrderPlacedSuccessfullyPage() {
  const { items } = useCart();
  const products = items.map((item) => ({ product: PRODUCTS.find((product) => product.id === item.productId), quantity: item.quantity })).filter((item): item is { product: (typeof PRODUCTS)[number]; quantity: number } => Boolean(item.product));
  const orderProducts = products.length ? products : [{ product: PRODUCTS[0], quantity: 1 }];
  const subtotal = orderProducts.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const savings = orderProducts.reduce((total, item) => total + (item.product.mrp ? item.product.mrp - item.product.price : 0) * item.quantity, 0);
  const orderNumber = "NG-2024-05-18-12345";

  return <main className="container-page py-6 sm:py-10"><nav className="mb-6 flex items-center gap-2 text-[11px] text-slate-soft"><Link href="/">Home</Link><span>/</span><span className="text-navy">Order Placed</span></nav><section className="rounded-2xl border border-line bg-white p-5 sm:p-8"><div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]"><div className="text-center"><span className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-600 text-4xl text-white"><FiCheck /></span><h1 className="mt-5 text-2xl font-extrabold text-navy sm:text-3xl">Order Placed <span className="text-green-600">Successfully!</span></h1><p className="mx-auto mt-3 max-w-md text-xs leading-5 text-slate-soft">Thank you for your order. We&apos;ve received your order and it is being processed.</p><div className="mx-auto mt-5 max-w-sm rounded-lg bg-green-soft p-3"><p className="text-[10px] text-slate-soft">Your order number is</p><strong className="text-base text-green-600">{orderNumber}</strong><button type="button" aria-label="Copy order number" className="ml-2 text-green-600"><FiClipboard className="inline" /></button></div></div><div className="flex min-h-48 items-center justify-center rounded-xl bg-linear-to-br from-[#f3faf6] to-[#f1f7fc] p-5 text-center"><div><div className="text-7xl">📦</div><p className="mt-2 text-sm font-bold text-navy">Your wellness order is on its way</p></div></div></div><div className="mt-8 grid gap-3 border-t border-line pt-5 sm:grid-cols-3"><Meta icon={<FiCalendar />} title="Order Date" value="18 May 2024, 10:30 AM" /><Meta icon={<FiCreditCard />} title="Payment Status" value="Paid" accent /><Meta icon={<FiTruck />} title="Payment Method" value="UPI" /></div><p className="mt-6 text-center text-[11px] text-slate-soft">You will receive an order confirmation email and SMS shortly.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><Link href="/order-tracking" className="flex items-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-xs font-bold text-white">Track Your Order <FiTruck /></Link><Link href="/shop" className="flex items-center gap-2 rounded-md border border-navy px-5 py-3 text-xs font-bold text-navy">Continue Shopping</Link></div></section><div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><OrderDetails products={orderProducts} subtotal={subtotal} savings={savings} /><OrderAddress /></div><div className="mt-6"><OrderTimeline /></div><div className="mt-6"><OrderTrustStrip /></div></main>;
}

function Meta({ icon, title, value, accent = false }: { icon: React.ReactNode; title: string; value: string; accent?: boolean }) { return <div className="flex items-center gap-3 rounded-lg bg-[#fbfcfd] p-3"><span className="text-green-600">{icon}</span><div><p className="text-[10px] text-slate-soft">{title}</p><p className={`mt-1 text-xs font-bold ${accent ? "text-green-600" : "text-navy"}`}>{value}</p></div></div>; }
