"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { commerceApi, downloadCustomerInvoice } from "@/lib/api/commerce";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Array<Record<string, any>>>([]);
  const [error, setError] = useState("");
  const [invoiceError, setInvoiceError] = useState("");
  useEffect(() => { commerceApi.orders().then((data) => setOrders(data.orders)).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load orders")); }, []);
  return <main className="container-page py-8"><h1 className="text-3xl font-extrabold text-navy">My Orders</h1>{error && <p className="mt-4 text-sm text-red-600">{error}</p>}{invoiceError && <p className="mt-4 text-sm text-red-600">{invoiceError}</p>}<div className="mt-6 grid gap-3">{orders.map((order) => <article key={String(order.id)} className="rounded-xl border border-line bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><strong>{String(order.orderNumber)}</strong><span className="text-green-600">{String(order.status)}</span></div><p className="mt-2 text-sm text-slate-soft">₹{Number(order.totalAmount ?? 0).toLocaleString("en-IN")} | {Array.isArray(order.items) ? order.items.length : 0} item(s)</p><div className="mt-3 flex gap-4"><Link className="text-sm text-green-600" href={`/order-tracking?orderId=${encodeURIComponent(String(order.id))}`}>Track order</Link><button type="button" className="text-sm text-green-600" onClick={async () => { try { setInvoiceError(""); await downloadCustomerInvoice(String(order.id)); } catch (cause) { setInvoiceError(cause instanceof Error ? cause.message : "Unable to download invoice"); } }}>Download Invoice</button></div></article>)}{!orders.length && !error && <p className="text-sm text-slate-soft">No orders found.</p>}</div></main>;
}
