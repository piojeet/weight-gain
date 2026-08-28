"use client";

import { useState } from "react";
import { FiCheck, FiMapPin, FiCreditCard, FiTruck } from "react-icons/fi";

type CheckoutFormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onProgress: (step: number) => void;
};

function updateProgress(form: HTMLFormElement, onProgress: (step: number) => void) {
  const sections = ["contact", "address", "delivery", "payment"];
  let completedSteps = -1;

  for (const [index, step] of sections.entries()) {
    const section = form.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const fields = section?.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input[required], select[required]") ?? [];
    if (![...fields].every((field) => field.checkValidity())) break;
    completedSteps = index;
  }

  onProgress(Math.min(completedSteps + 1, 4));
}

export default function CheckoutForm({ onSubmit, onProgress }: CheckoutFormProps) {
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("upi");
  const [upiApp, setUpiApp] = useState("phonepe");
  return <form id="checkout-form" onSubmit={onSubmit} onChange={(event) => updateProgress(event.currentTarget, onProgress)} className="grid gap-4">
    <Section step="contact" number="1" icon={<FiCheck />} title="Contact Information" detail="We'll use this email to send your order updates." action={<span className="text-[10px] text-slate-soft">Already have an account? <button type="button" className="font-bold text-green-600">Login</button></span>}><div className="grid gap-4"><Field label="Email Address" type="email" placeholder="Enter your email address" required /><div className="grid gap-3 sm:grid-cols-[100px_1fr]"><Field label="Phone Number" placeholder="+91" /><Field label="Mobile Number" placeholder="Enter your mobile number" required /></div><label className="flex items-center gap-2 text-[11px] text-slate-soft"><input type="checkbox" defaultChecked className="accent-green-600" /> Keep me updated with offers, new products & nutrition tips</label></div></Section>
    <Section step="address" number="2" icon={<FiMapPin />} title="Shipping Address" detail="Enter the address where you want your order delivered." action={<button type="button" className="text-[10px] font-bold text-green-600">Use Saved Address</button>}><div className="grid gap-4 sm:grid-cols-2"><Field label="Full Name" placeholder="Enter your full name" required /><div className="flex items-end gap-2"><div className="flex-1"><Field label="Pincode" placeholder="Enter pincode" required /></div><button type="button" className="mb-0.5 h-9 rounded-md border border-green-500 px-3 text-[10px] font-bold text-green-600">Verify Pincode</button></div><Field label="Address Line 1" placeholder="House no., Building name, Street name" required /><Field label="Address Line 2" placeholder="Apartment, Landmark, etc." /><Field label="City / Town" placeholder="Enter city" required /><label className="grid gap-1 text-[10px] font-semibold text-navy">State<select required className="rounded-md border border-line bg-white px-3 py-2 text-xs font-normal outline-none"><option value="">Select state</option><option>Delhi</option><option>Maharashtra</option><option>Karnataka</option></select></label><Field label="Phone Number" placeholder="Enter number" required /></div></Section>
    <Section step="delivery" number="3" icon={<FiTruck />} title="Delivery Options" detail="Choose your preferred delivery option."><div className="grid gap-2">{[["standard", "Standard Delivery", "Delivery in 3-5 business days", "FREE"], ["express", "Express Delivery", "Delivery in 1-2 business days", "₹149"], ["same", "Same Day Delivery", "Order within 3 hours", "₹249"]].map(([value, title, detail, price], index) => <label key={value} className="flex cursor-pointer items-center gap-3 rounded-md border border-line p-3 text-xs"><input type="radio" name="delivery" value={value} checked={delivery === value} onChange={() => setDelivery(value)} required={index === 0} /><FiTruck className="text-green-600" /><span className="flex-1"><strong className="block text-navy">{title}</strong><small className="text-slate-soft">{detail}</small></span><strong className="text-green-600">{price}</strong></label>)}</div><p className="rounded-md bg-green-soft p-2 text-[10px] text-green-700"><FiCheck className="mr-1 inline" /> You&apos;ve unlocked FREE delivery.</p></Section>
    <Section step="payment" number="4" icon={<FiCreditCard />} title="Payment Method" detail="Select a secure payment option."><div className="grid gap-3 sm:grid-cols-[130px_1fr]"><div className="flex gap-2 overflow-x-auto sm:grid sm:content-start">{["upi", "cards", "netbanking", "wallets", "cod"].map((value) => <button key={value} type="button" onClick={() => setPayment(value)} className={`whitespace-nowrap rounded border px-3 py-2 text-left text-[11px] font-semibold uppercase ${payment === value ? "border-green-500 text-green-600" : "border-line text-slate-soft"}`}>{value}</button>)}</div><div className="rounded-lg border border-line p-4"><p className="text-xs font-bold text-navy">Pay using {payment.toUpperCase()}</p><p className="mt-1 text-[10px] text-slate-soft">Secure payment powered by our dummy checkout flow.</p>{payment === "upi" && <div className="mt-4 grid grid-cols-4 gap-2">{[["phonepe", "PhonePe"], ["googlepay", "Google Pay"], ["paytm", "Paytm"], ["other", "Other"]].map(([value, label]) => <button key={value} type="button" onClick={() => setUpiApp(value)} className={`rounded-md border px-2 py-2 text-[10px] font-semibold ${upiApp === value ? "border-green-500 bg-green-soft text-green-600" : "border-line text-navy"}`}>{label}</button>)}</div>}<input className="mt-4 w-full rounded border border-line px-3 py-2 text-xs outline-none" placeholder={payment === "upi" ? `Enter ${upiApp === "other" ? "your" : upiApp} UPI ID` : "Enter payment details"} required /></div></div></Section>
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-white p-4"><span className="text-sm font-bold text-navy">Have a Coupon?</span><input className="flex-1 rounded border border-line px-3 py-2 text-xs outline-none" placeholder="Enter coupon code" /><button type="button" className="rounded border border-green-500 px-4 py-2 text-xs font-bold text-green-600">Apply</button></div>
  </form>;
}

function Section({ step, number, icon, title, detail, action, children }: { step: string; number: string; icon: React.ReactNode; title: string; detail: string; action?: React.ReactNode; children: React.ReactNode }) { return <section data-step={step} className="rounded-xl border border-line bg-white p-4 shadow-sm sm:p-5"><div className="mb-4 flex items-start gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">{number}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-extrabold text-navy">{icon}{title}</h2>{action}</div><p className="mt-1 text-[10px] text-slate-soft">{detail}</p></div></div>{children}</section>; }
function Field({ label, type = "text", placeholder, required = false }: { label: string; type?: string; placeholder: string; required?: boolean }) { return <label className="grid gap-1 text-[10px] font-semibold text-navy">{label}{required && " *"}<input type={type} required={required} placeholder={placeholder} className="rounded-md border border-line px-3 py-2 text-xs font-normal outline-none focus:border-green-500" /></label>; }
