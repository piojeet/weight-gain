"use client";

import Link from "next/link";
import { FiCreditCard, FiShield } from "react-icons/fi";

export default function PaymentMethodsPage() {
  return (
    <div className="bg-[#fbfcfd] pb-12">
      <nav className="text-[10px] text-slate-soft">
        Home <span className="mx-2">›</span> My Account <span className="mx-2">›</span>{" "}
        <span className="text-navy">Payment Methods</span>
      </nav>
      <header className="mt-5">
        <h1 className="text-2xl font-extrabold text-navy">Payment Methods</h1>
        <p className="mt-1 text-[10px] text-slate-soft">
          Payment details are entered securely in Razorpay Checkout and are not stored by this store.
        </p>
      </header>
      <section className="mt-4 rounded-lg border border-line bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <FiCreditCard className="mt-0.5 text-lg text-green-600" />
          <div>
            <h2 className="text-xs font-extrabold">No saved payment methods</h2>
            <p className="mt-2 max-w-2xl text-[10px] leading-5 text-slate-soft">
              Tokenized payment-method storage is not enabled for this merchant account. This page will not
              display sample cards or UPI IDs. Use Razorpay Checkout to choose an available payment method.
            </p>
            <Link href="/checkout" className="mt-4 inline-flex rounded bg-green-600 px-4 py-2 text-[10px] font-bold text-white">
              Continue to secure checkout
            </Link>
          </div>
        </div>
      </section>
      <section className="mt-4 rounded-lg bg-green-soft p-4">
        <FiShield className="text-lg text-green-600" />
        <p className="mt-2 text-[10px] font-extrabold">Payment security</p>
        <p className="mt-1 max-w-2xl text-[9px] leading-4 text-slate-soft">
          Card, UPI and other payment credentials are handled in the provider checkout and are never stored in this account.
        </p>
      </section>
    </div>
  );
}
