"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useCart } from "@/app/hooks/useCart";
import { ApiError } from "@/lib/api/client";
import { commerceApi, normalizeCommerceProduct } from "@/lib/api/commerce";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import CheckoutTrustStrip from "@/components/checkout/CheckoutTrustStrip";

type RazorpayCheckoutResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { email: string };
  handler: (response: RazorpayCheckoutResponse) => void;
  modal: { ondismiss: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => {
      open: () => void;
      on: (event: "payment.failed", callback: () => void) => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const checkoutRequestId = useRef<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shippingAmount, setShippingAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { items, loading, error: cartError, reload } = useCart();
  const products = items.filter((item) => item.product).map((item) => ({ product: normalizeCommerceProduct(item.product!), quantity: item.quantity }));
  const subtotal = items.reduce((total, item) => total + (item.subtotal ?? 0), 0);
  const savings = products.reduce((total, item) => total + (item.product.mrp ? item.product.mrp - item.product.price : 0) * item.quantity, 0);
  const updateCheckoutTotals = useCallback((totals: { couponDiscount: number; shippingAmount: number }) => {
    setCouponDiscount(totals.couponDiscount);
    setShippingAmount(totals.shippingAmount);
  }, []);

  if (loading) return <main className="container-page py-12 text-sm text-slate-soft">Loading checkout...</main>;
  if (cartError) return <main className="container-page py-12"><h1 className="text-2xl font-extrabold text-navy">Unable to load your cart</h1><p role="alert" className="mt-3 text-sm text-red-600">{cartError}</p><button type="button" onClick={() => void reload()} className="mt-4 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white">Retry</button></main>;
  if (!products.length) return <main className="container-page py-12"><div className="rounded-xl border border-line bg-white p-10 text-center"><h1 className="text-2xl font-extrabold text-navy">Your cart is empty</h1><p className="mt-2 text-sm text-slate-soft">Add a product before checking out.</p><Link href="/shop" className="mt-5 inline-flex rounded-md bg-green-600 px-5 py-3 text-xs font-bold text-white">Continue Shopping</Link></div></main>;

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    checkoutRequestId.current ??= crypto.randomUUID();
    let paymentModalOpened = false;
    try {
      const data = await commerceApi.checkout({
        guestEmail: String(form.get("guestEmail") ?? ""),
        paymentMethod: String(form.get("paymentMethod") ?? ""),
        shippingMethodId: String(form.get("shippingMethodId") ?? ""),
        couponCode: String(form.get("couponCode") ?? "") || undefined,
        shippingAddress: {
          fullName: String(form.get("fullName") ?? ""), phone: String(form.get("phone") ?? ""),
          addressLine1: String(form.get("addressLine1") ?? ""), addressLine2: String(form.get("addressLine2") ?? "") || null,
          city: String(form.get("city") ?? ""), state: String(form.get("state") ?? ""), pincode: String(form.get("pincode") ?? ""), country: "India",
        },
      }, checkoutRequestId.current) as {
        id?: string;
        orderNumber?: string;
        payment?: { keyId: string; order: { id: string; amount: number; currency: string } } | null;
      };
      const order = data as { id?: string; orderNumber?: string };
      if (!data.payment) {
        router.push(`/order-placed-successfully?orderId=${encodeURIComponent(order.id ?? order.orderNumber ?? "")}`);
        return;
      }
      if (!window.Razorpay) throw new Error("Secure payment checkout is still loading. Please try again.");
      const checkout = new window.Razorpay({
        key: data.payment.keyId,
        amount: data.payment.order.amount,
        currency: data.payment.order.currency,
        name: "TheGrowthHealth",
        description: `Order ${data.orderNumber ?? ""}`,
        order_id: data.payment.order.id,
        prefill: { email: String(form.get("guestEmail") ?? "") },
        handler: (response) => {
          void commerceApi.verifyPayment(String(order.id), response)
            .then((result) => {
              if (!result.verified) {
                setError("Your payment is still being confirmed. Please wait and refresh your order status.");
                return;
              }
              router.push(`/order-placed-successfully?orderId=${encodeURIComponent(order.id ?? "")}`);
            })
            .catch((cause) => setError(cause instanceof Error ? cause.message : "We could not verify this payment yet."))
            .finally(() => setSubmitting(false));
        },
        modal: {
          ondismiss: () => {
            setError("Payment was not completed. Your order remains pending; you can retry from checkout.");
            setSubmitting(false);
          },
        },
      });
      checkout.on("payment.failed", () => {
        setError("Payment failed. Your order remains pending; retry securely to create a new payment attempt.");
        setSubmitting(false);
      });
      checkout.open();
      paymentModalOpened = true;
    } catch (cause) {
      setError(cause instanceof ApiError && cause.code === "CART_STALE" ? "Your cart changed because stock availability changed. Refresh the cart and try again." : cause instanceof Error ? cause.message : "Unable to place the order.");
    } finally {
      if (!paymentModalOpened) setSubmitting(false);
    }
  };

  return <><Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" /><main className="container-page py-6 sm:py-10"><nav className="flex items-center gap-2 text-[11px] text-slate-soft"><Link href="/">Home</Link><span>/</span><Link href="/cart">Cart</Link><span>/</span><span className="text-navy">Checkout</span></nav><header className="mt-5"><h1 className="text-2xl font-extrabold text-navy sm:text-3xl">Secure <span className="text-green-600">Checkout</span></h1><p className="mt-1 text-xs text-slate-soft">Complete your order and get closer to your goals.</p></header>{error && <p role="alert" className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}<CheckoutSteps activeStep={activeStep} /><div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">  <CheckoutForm onSubmit={submitOrder} onProgress={setActiveStep} onTotalsChange={updateCheckoutTotals} /><CheckoutSummary products={products} subtotal={subtotal} savings={savings} couponDiscount={couponDiscount} shippingAmount={shippingAmount} submitting={submitting} /></div><CheckoutTrustStrip /></main></>;
}
