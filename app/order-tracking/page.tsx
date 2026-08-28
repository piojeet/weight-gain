"use client";

import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiClipboard, FiCreditCard, FiTruck } from "react-icons/fi";
import { PRODUCTS } from "@/app/data/products";
import { useCart } from "@/app/hooks/useCart";
import TrackingStatus from "@/components/order-tracking/TrackingStatus";
import ShipmentTimeline from "@/components/order-tracking/ShipmentTimeline";
import TrackingSidebar from "@/components/order-tracking/TrackingSidebar";
import TrackingOrderItems from "@/components/order-tracking/TrackingOrderItems";
import ProductCard from "@/components/shop/ProductCard";

export default function OrderTrackingPage() {
  const { items } = useCart();
  const products = items.map((item) => ({ product: PRODUCTS.find((product) => product.id === item.productId), quantity: item.quantity })).filter((item): item is { product: (typeof PRODUCTS)[number]; quantity: number } => Boolean(item.product));
  const orderProducts = products.length ? products : [{ product: PRODUCTS[0], quantity: 1 }];
  const related = PRODUCTS.filter((product) => !orderProducts.some((item) => item.product.id === product.id)).slice(0, 6);

  return <main className="container-page py-6 sm:py-10"><nav className="flex items-center gap-2 text-[11px] text-slate-soft"><Link href="/">Home</Link><span>/</span><Link href="/my-account/orders">My Orders</Link><span>/</span><span className="text-navy">Order Tracking</span></nav><div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-extrabold text-navy sm:text-3xl">Track Your Order</h1><p className="mt-1 text-xs text-slate-soft">Stay updated with your order status in real-time.</p></div><Link href="/my-account/orders" className="flex items-center gap-2 rounded-md border border-line px-4 py-2 text-xs font-semibold text-navy"><FiArrowLeft /> Back to My Orders</Link></div><section className="mt-6 rounded-xl border border-line bg-white p-5 sm:p-6"><div className="grid gap-6 lg:grid-cols-[170px_1fr]"><div className="border-b border-line pb-4 text-xs lg:border-r lg:border-b-0 lg:pr-6"><p className="text-[10px] text-slate-soft">Order Number</p><strong className="text-sm text-green-600">NG-2024-05-18-12345 <FiClipboard className="ml-1 inline" /></strong><Meta icon={<FiCalendar />} title="Order Placed" value="18 May 2024, 10:30 AM" /><Meta icon={<FiCreditCard />} title="Payment Method" value="UPI" /><Meta icon={<FiCreditCard />} title="Payment Status" value="Paid" accent /></div><div><TrackingStatus /><div className="mt-6 flex items-center justify-between rounded-lg bg-green-soft p-3 text-[10px] text-green-700"><span><FiTruck className="mr-2 inline" /><strong>Your order is out for delivery</strong><br /><span className="ml-6">Our delivery partner is on the way with your order.</span></span><span className="text-right"><span className="block text-slate-soft">Estimated Delivery</span><strong>22 May 2024</strong></span></div></div></div></section><div className="mt-6 flex gap-6 border-b border-line pb-3 text-xs font-semibold text-green-600"><button type="button">▣ Order Details</button><button type="button" className="text-slate-soft">Shipment Updates</button><button type="button" className="text-slate-soft">Order Items ({orderProducts.length})</button><button type="button" className="text-slate-soft">Invoice</button></div><div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><div className="grid gap-6"><ShipmentTimeline /><TrackingOrderItems products={orderProducts} /></div><TrackingSidebar /></div><section className="mt-8"><div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-navy">You May Also Like</h2><Link href="/shop" className="text-xs font-bold text-green-600">View All</Link></div><div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{related.map((product) => <ProductCard key={product.id} product={product} />)}</div></section></main>;
}

function Meta({ icon, title, value, accent = false }: { icon: React.ReactNode; title: string; value: string; accent?: boolean }) { return <div className="mt-4 flex gap-2"><span className="text-green-600">{icon}</span><div><p className="text-[9px] text-slate-soft">{title}</p><p className={`mt-1 text-[10px] font-bold ${accent ? "text-green-600" : "text-navy"}`}>{value}</p></div></div>; }
