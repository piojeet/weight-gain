"use client";

import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiCopy, FiTruck, FiX } from "react-icons/fi";
import type { Order } from "@/app/data/orders";
import { getOrderProducts } from "@/app/data/orders";

export default function OrderRow({ order }: { order: Order }) {
  const products = getOrderProducts(order);
  const statusStyle = order.status === "Delivered" ? "text-green-600" : order.status === "Shipped" ? "text-blue-600" : "text-red-500";
  const StatusIcon = order.status === "Delivered" ? FiCheckCircle : order.status === "Shipped" ? FiTruck : FiX;
  return <article className="grid gap-4 border-b border-line p-5 last:border-b-0 sm:grid-cols-[1.2fr_180px_190px_1fr_170px] sm:items-center"><div><p className="text-[10px] text-slate-soft">Order ID</p><p className="mt-1 text-xs font-bold text-navy">{order.id} <FiCopy className="ml-1 inline" /></p><p className="mt-2 text-[10px] text-slate-soft">{order.date}</p><p className="mt-2 text-[11px] text-navy">{products.length} Items <span className="mx-1">•</span> <strong>₹{order.total.toLocaleString("en-IN")}</strong></p></div><div className={`flex items-center gap-2 ${statusStyle}`}><span className="flex size-9 items-center justify-center rounded-full bg-green-soft"><StatusIcon /></span><div><p className="text-xs font-bold">{order.status}</p><p className="mt-1 text-[10px] text-slate-soft">{order.status === "Shipped" ? "Expected Delivery" : `${order.status} on`}</p><p className="text-[10px] text-slate-soft">{order.statusDate}</p></div></div><div className="flex items-center gap-2 overflow-hidden">{products.slice(0, 4).map((product) => <div key={product.id} className="relative size-12 shrink-0 rounded bg-[#f7fafc]"><Image src={product.image} alt={product.name} fill className="object-contain p-1" /></div>)}</div><div><p className="text-[10px] text-slate-soft">Total Amount</p><p className="mt-1 text-sm font-bold text-navy">₹{order.total.toLocaleString("en-IN")}</p><p className="mt-3 text-[10px] text-slate-soft">Payment Method <strong className="ml-8 text-navy">{order.paymentMethod}</strong></p></div><div className="flex gap-2 sm:flex-col"><Link href={order.status === "Shipped" ? "/order-tracking" : "/order-success"} className="rounded-md border border-line px-4 py-2 text-center text-[11px] font-semibold text-navy hover:border-green-500">{order.status === "Shipped" ? "Track Order" : "View Details"}</Link><button type="button" className="rounded-md border border-green-500 px-4 py-2 text-[11px] font-semibold text-green-600">Buy Again</button></div></article>;
}
