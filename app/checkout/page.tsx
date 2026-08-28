"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PRODUCTS } from "@/app/data/products";
import { useCart } from "@/app/hooks/useCart";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import CheckoutTrustStrip from "@/components/checkout/CheckoutTrustStrip";

export default function CheckoutPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const { items, loading } = useCart();
  const products = items.map((item) => ({ product: PRODUCTS.find((product) => product.id === item.productId), quantity: item.quantity })).filter((item): item is { product: (typeof PRODUCTS)[number]; quantity: number } => Boolean(item.product));
  const subtotal = products.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const savings = products.reduce((total, item) => total + (item.product.mrp ? item.product.mrp - item.product.price : 0) * item.quantity, 0);

  if (loading) return <main className="container-page py-12 text-sm text-slate-soft">Loading checkout...</main>;
  if (!products.length) return <main className="container-page py-12"><div className="rounded-xl border border-line bg-white p-10 text-center"><h1 className="text-2xl font-extrabold text-navy">Your cart is empty</h1><p className="mt-2 text-sm text-slate-soft">Add a product before checking out.</p><Link href="/shop" className="mt-5 inline-flex rounded-md bg-green-600 px-5 py-3 text-xs font-bold text-white">Continue Shopping</Link></div></main>;

  const submitOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/order-placed-successfully");
  };

  return <main className="container-page py-6 sm:py-10"><nav className="flex items-center gap-2 text-[11px] text-slate-soft"><Link href="/">Home</Link><span>/</span><Link href="/cart">Cart</Link><span>/</span><span className="text-navy">Checkout</span></nav><header className="mt-5"><h1 className="text-2xl font-extrabold text-navy sm:text-3xl">Secure <span className="text-green-600">Checkout</span></h1><p className="mt-1 text-xs text-slate-soft">Complete your order and get closer to your goals.</p></header><CheckoutSteps activeStep={activeStep} /><div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><CheckoutForm onSubmit={submitOrder} onProgress={setActiveStep} /><CheckoutSummary products={products} subtotal={subtotal} savings={savings} /></div><CheckoutTrustStrip /></main>;
}
