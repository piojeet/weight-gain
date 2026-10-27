"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { commerceApi } from "@/lib/api/commerce";

function OrderPlacedContent() {
  const orderId = useSearchParams().get("orderId");
  const [order, setOrder] = useState<Record<string, any> | null>(null);
  useEffect(() => { if (orderId) commerceApi.order(orderId).then(setOrder).catch(() => setOrder(null)); }, [orderId]);
  if (!orderId || !order) return <main className="container-page py-12"><h1 className="text-2xl font-bold text-navy">Order unavailable</h1><Link href="/my-account/orders" className="mt-4 inline-block text-green-600">View my orders</Link></main>;
  return <main className="container-page py-12"><section className="rounded-xl border border-line bg-white p-8 text-center"><h1 className="text-3xl font-extrabold text-navy">Order placed successfully</h1><p className="mt-4 text-sm text-slate-soft">Order number</p><strong className="text-xl text-green-600">{order.orderNumber}</strong><p className="mt-4 text-sm">{order.items?.length ?? 0} item(s) | ₹{Number(order.totalAmount ?? 0).toLocaleString("en-IN")}</p><Link href={`/order-tracking?orderId=${encodeURIComponent(order.id)}`} className="mt-6 inline-block rounded bg-navy-900 px-5 py-3 text-sm font-bold text-white">Track order</Link></section></main>;
}

export default function OrderPlacedSuccessfullyPage() { return <Suspense fallback={<main className="container-page py-12">Loading order...</main>}><OrderPlacedContent /></Suspense>; }
