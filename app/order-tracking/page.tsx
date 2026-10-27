"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { commerceApi, type OrderTrackingResponse } from "@/lib/api/commerce";

function OrderTrackingContent() {
  const orderId = useSearchParams().get("orderId");
  const [result, setResult] = useState<{ orderId: string; order: OrderTrackingResponse | null } | null>(null);
  const loading = Boolean(orderId && result?.orderId !== orderId);
  const order = result?.orderId === orderId ? result.order : null;

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    commerceApi.trackOrder(orderId)
      .then((data) => {
        if (active) setResult({ orderId, order: data });
      })
      .catch(() => {
        if (active) setResult({ orderId, order: null });
      });
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) return <main className="container-page py-12">Loading tracking information...</main>;
  if (!order) return <main className="container-page py-12"><h1 className="text-2xl font-bold text-navy">Order unavailable</h1><p className="mt-2 text-sm text-slate-soft">This order could not be found or you do not have access to its tracking details.</p><Link href="/my-account/orders" className="mt-4 inline-block text-green-600">View my orders</Link></main>;

  const shipment = order.shipment;
  return (
    <main className="container-page py-12">
      <Link href="/my-account/orders" className="text-sm text-green-600">Back to my orders</Link>
      <section className="mt-5 rounded-xl border border-line bg-white p-6">
        <p className="text-xs text-slate-soft">Order number</p>
        <h1 className="text-2xl font-bold text-navy">{order.orderNumber}</h1>
        <p className="mt-4 text-sm">Order status: <strong className="text-green-600">{order.status}</strong></p>
        <p className="mt-2 text-sm">Payment status: <strong>{order.paymentStatus}</strong></p>
        <p className="mt-2 text-sm">Total: ₹{Number(order.totalAmount).toLocaleString("en-IN")}</p>
        <div className="mt-6 border-t border-line pt-4">
          <h2 className="font-semibold text-navy">Shipment</h2>
          {shipment ? (
            <>
              <p className="mt-2 text-sm">Status: <strong>{shipment.status}</strong></p>
              {shipment.courier && <p className="mt-1 text-sm">Carrier: {shipment.courier}</p>}
              {shipment.awb && <p className="mt-1 text-sm">Tracking reference: {shipment.awb}</p>}
              {shipment.events.length ? (
                <ol className="mt-4 grid gap-3">
                  {shipment.events.map((event, index) => (
                    <li key={`${event.status}-${event.occurredAt}-${index}`} className="border-l-2 border-green-500 pl-3">
                      <p className="text-sm font-semibold">{event.status}</p>
                      {event.description && <p className="text-xs text-slate-soft">{event.description}</p>}
                      {event.location && <p className="text-xs text-slate-soft">{event.location}</p>}
                      <time className="text-[10px] text-slate-soft">{new Date(event.occurredAt).toLocaleString()}</time>
                    </li>
                  ))}
                </ol>
              ) : <p className="mt-2 text-xs text-slate-soft">Tracking updates have not synchronized yet.</p>}
            </>
          ) : <p className="mt-2 text-sm text-slate-soft">This order has not shipped yet. Tracking information will appear here when the shipment is created.</p>}
        </div>
        <div className="mt-6 border-t border-line pt-4">
          {order.items.map((item) => <p key={item.id} className="py-1 text-sm">{item.nameSnapshot} x {item.quantity}</p>)}
        </div>
      </section>
    </main>
  );
}

export default function OrderTrackingPage() {
  return <Suspense fallback={<main className="container-page py-12">Loading order...</main>}><OrderTrackingContent /></Suspense>;
}
