"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiCheck, FiMapPin, FiCreditCard, FiTruck } from "react-icons/fi";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";
import { commerceApi, type PublicCheckoutSettings } from "@/lib/api/commerce";

type CheckoutFormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onProgress: (step: number) => void;
  onTotalsChange: (totals: { couponDiscount: number; shippingAmount: number }) => void;
};

function updateProgress(form: HTMLFormElement, onProgress: (step: number) => void) {
  const sections = ["contact", "address", "delivery", "payment"];
  let completedSteps = -1;

  for (const [index, step] of sections.entries()) {
    const section = form.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const fields = section?.querySelectorAll<HTMLInputElement>("input[required]") ?? [];
    if (![...fields].every((field) => field.checkValidity())) break;
    completedSteps = index;
  }

  onProgress(Math.min(completedSteps + 1, 4));
}

export default function CheckoutForm({ onSubmit, onProgress, onTotalsChange }: CheckoutFormProps) {
  const [shippingMethods, setShippingMethods] = useState<Array<{ id: string; name: string; type: string; config: Record<string, unknown>; deliveryTime: string }>>([]);
  const [checkoutSettings, setCheckoutSettings] = useState<PublicCheckoutSettings | null>(null);
  const [settingsError, setSettingsError] = useState("");
  const [delivery, setDelivery] = useState("");
  const [payment, setPayment] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponIsApplied, setCouponIsApplied] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const storedCouponChecked = useRef(false);
  const selectedShippingAmount = useCallback((methodId: string) => {
    const method = shippingMethods.find((item) => item.id === methodId);
    return !method || method.type === "free_shipping" ? 0 : Number(method.config.charge ?? 0);
  }, [shippingMethods]);
  const applyCoupon = useCallback(async (code = couponCode, shippingMethodId = delivery) => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) return;
    setValidatingCoupon(true);
    setCouponMessage("");
    try {
      const result = await commerceApi.validateCoupon(normalizedCode, shippingMethodId || undefined);
      setCouponIsApplied(true);
      onTotalsChange({ couponDiscount: result.discountAmount, shippingAmount: result.shippingAmount });
      setCouponMessage(`Coupon applied: ₹${result.discountAmount.toLocaleString("en-IN")} off`);
    } catch (cause) {
      setCouponIsApplied(false);
      onTotalsChange({ couponDiscount: 0, shippingAmount: selectedShippingAmount(shippingMethodId) });
      setCouponMessage(cause instanceof Error ? cause.message : "Unable to validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  }, [couponCode, delivery, onTotalsChange, selectedShippingAmount]);
  useEffect(() => {
    let active = true;
    void Promise.all([commerceApi.shippingMethods(), commerceApi.checkoutSettings()])
      .then(([{ shippingMethods: methods }, { settings }]) => {
        if (!active) return;
        setShippingMethods(methods);
        setDelivery(methods[0]?.id ?? "");
        onTotalsChange({ couponDiscount: 0, shippingAmount: methods[0] ? methods[0].type === "free_shipping" ? 0 : Number(methods[0].config.charge ?? 0) : 0 });
        setCheckoutSettings(settings);
        const availablePayments = settings.payments.filter((method) => method.enabled);
        setPayment(settings.razorpayEnabled && availablePayments.some((method) => method.id !== "cod") ? "razorpay" : availablePayments.some((method) => method.id === "cod") ? "cod" : "");
      })
      .catch((cause: unknown) => { if (active) setSettingsError(cause instanceof Error ? cause.message : "Unable to load checkout settings."); });
    return () => { active = false; };
  }, [onTotalsChange]);
  useEffect(() => {
    if (!delivery || storedCouponChecked.current) return;
    storedCouponChecked.current = true;
    try {
      const storedCoupon = window.sessionStorage.getItem("growthhealth_checkout_coupon");
      if (!storedCoupon) return;
      queueMicrotask(() => {
        setCouponCode(storedCoupon);
        void applyCoupon(storedCoupon, delivery);
      });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to restore the selected coupon.";
      queueMicrotask(() => setCouponMessage(message));
    }
  }, [applyCoupon, delivery]);
  const configuredPayments = checkoutSettings?.payments.filter((method) => method.enabled) ?? [];
  const enabledPayments = [
    ...(checkoutSettings?.razorpayEnabled && configuredPayments.some((method) => method.id !== "cod")
      ? [{ id: "razorpay", label: "Online payment", icon: "razorpay", enabled: true }]
      : []),
    ...(configuredPayments.some((method) => method.id === "cod")
      ? [{ id: "cod", label: "Cash on Delivery", icon: "cod", enabled: true }]
      : []),
  ];
  return <form id="checkout-form" onSubmit={onSubmit} onChange={(event) => updateProgress(event.currentTarget, onProgress)} className="grid gap-4">
    {settingsError && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">{settingsError}</p>}
    <Section step="contact" number="1" icon={<FiCheck />} title="Contact Information" detail="We'll use this email to send your order updates." action={<span className="text-[10px] text-slate-soft">Already have an account? <Link href="/login" className="font-bold text-green-600">Login</Link></span>}><div className="grid gap-4"><Field name="guestEmail" label="Email Address" type="email" placeholder="Enter your email address" required={checkoutSettings?.guestCheckout ?? true} /><div className="grid gap-3 sm:grid-cols-[100px_1fr]"><Field label="Phone Number" placeholder="+91" /><Field name="phone" label="Mobile Number" placeholder="Enter your mobile number" required={checkoutSettings?.phoneRequired ?? true} /></div><label className="flex items-center gap-2 text-[11px] text-slate-soft"><input type="checkbox" defaultChecked className="accent-green-600" /> Keep me updated with offers, new products & nutrition tips</label>{checkoutSettings?.guestCheckout === false && <p className="text-xs text-amber-700">Guest checkout is disabled. <Link href="/login" className="font-semibold underline">Sign in to continue.</Link></p>}</div></Section>
    <Section step="address" number="2" icon={<FiMapPin />} title="Shipping Address" detail="Enter the address where you want your order delivered." action={<button type="button" className="text-[10px] font-bold text-green-600">Use Saved Address</button>}><div className="grid gap-4 sm:grid-cols-2"><Field name="fullName" label="Full Name" placeholder="Enter your full name" required /><div className="flex items-end gap-2"><div className="flex-1"><Field name="pincode" label="Pincode" placeholder="Enter pincode" required /></div><button type="button" className="mb-0.5 h-9 rounded-md border border-green-500 px-3 text-[10px] font-bold text-green-600">Verify Pincode</button></div><Field name="addressLine1" label="Address Line 1" placeholder="House no., Building name, Street name" required /><Field name="addressLine2" label="Address Line 2" placeholder="Apartment, Landmark, etc." />{checkoutSettings?.companyField && <Field name="company" label="Company" placeholder="Company (optional)" />}<Field name="city" label="City / Town" placeholder="Enter city" required /><AnimatedSelect name="state" required label="State" placeholder="Select state" size="sm" options={[{ value: "Delhi", label: "Delhi" }, { value: "Maharashtra", label: "Maharashtra" }, { value: "Karnataka", label: "Karnataka" }]} /></div></Section>
    <Section step="delivery" number="3" icon={<FiTruck />} title="Delivery Options" detail="Choose your preferred delivery option."><div className="grid gap-2">{shippingMethods.map((method) => <label key={method.id} className="flex cursor-pointer items-center gap-3 rounded-md border border-line p-3 text-xs"><input type="radio" name="shippingMethodId" value={method.id} checked={delivery === method.id} onChange={() => { setDelivery(method.id); if (couponIsApplied) void applyCoupon(couponCode, method.id); else onTotalsChange({ couponDiscount: 0, shippingAmount: selectedShippingAmount(method.id) }); }} required /><FiTruck className="text-green-600" /><span className="flex-1"><strong className="block text-navy">{method.name}</strong><small className="text-slate-soft">{method.deliveryTime}</small></span><strong className="text-green-600">{method.type === "free_shipping" ? "FREE" : `₹${Number(method.config.charge ?? 0)}`}</strong></label>)}</div>{!shippingMethods.length && <p className="text-xs text-red-600">No enabled shipping methods are available.</p>}</Section>
    <Section step="payment" number="4" icon={<FiCreditCard />} title="Payment Method" detail="Select a secure payment option."><input type="hidden" name="paymentMethod" value={payment} /><div className="grid gap-3 sm:grid-cols-[130px_1fr]"><div className="flex gap-2 overflow-x-auto sm:grid sm:content-start">{enabledPayments.map((method) => <button key={method.id} type="button" onClick={() => setPayment(method.id)} className={`whitespace-nowrap rounded border px-3 py-2 text-left text-[11px] font-semibold ${payment === method.id ? "border-green-500 text-green-600" : "border-line text-slate-soft"}`}>{method.label}</button>)}</div><div className="rounded-lg border border-line p-4"><p className="text-xs font-bold text-navy">{payment === "cod" ? "Pay when your order arrives" : "Pay securely with Razorpay"}</p><p className="mt-1 text-[10px] text-slate-soft">{payment === "cod" ? "Cash on Delivery remains available where enabled." : "Razorpay Checkout securely supports the payment methods enabled for your merchant account. Card or UPI credentials are entered only in Razorpay Checkout."}</p></div></div>{!enabledPayments.length && <p className="text-xs text-red-600">No configured payment methods are available.</p>}</Section>
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-white p-4"><span className="text-sm font-bold text-navy">Have a Coupon?</span><input name="couponCode" value={couponCode} onChange={(event) => { const code = event.target.value.toUpperCase(); setCouponCode(code); setCouponMessage(""); setCouponIsApplied(false); onTotalsChange({ couponDiscount: 0, shippingAmount: selectedShippingAmount(delivery) }); }} className="flex-1 rounded border border-line px-3 py-2 text-xs outline-none" placeholder="Enter coupon code" /><button type="button" disabled={validatingCoupon || !couponCode.trim()} onClick={() => void applyCoupon()} className="rounded border border-green-500 px-4 py-2 text-xs font-bold text-green-600 disabled:opacity-50">{validatingCoupon ? "Checking…" : "Apply"}</button>{couponMessage && <p role={couponIsApplied ? "status" : "alert"} className={`basis-full text-[10px] ${couponIsApplied ? "text-green-600" : "text-red-600"}`}>{couponMessage}</p>}</div>
  </form>;
}

function Section({ step, number, icon, title, detail, action, children }: { step: string; number: string; icon: React.ReactNode; title: string; detail: string; action?: React.ReactNode; children: React.ReactNode }) { return <section data-step={step} className="rounded-xl border border-line bg-white p-4 shadow-sm sm:p-5"><div className="mb-4 flex items-start gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">{number}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-extrabold text-navy">{icon}{title}</h2>{action}</div><p className="mt-1 text-[10px] text-slate-soft">{detail}</p></div></div>{children}</section>; }
function Field({ name, label, type = "text", placeholder, required = false }: { name?: string; label: string; type?: string; placeholder: string; required?: boolean }) { return <label className="grid gap-1 text-[10px] font-semibold text-navy">{label}{required && " *"}<input name={name} type={type} required={required} placeholder={placeholder} className="rounded-md border border-line px-3 py-2 text-xs font-normal outline-none focus:border-green-500" /></label>; }
