"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiAlertTriangle, FiHome, FiRefreshCw, FiSearch } from "react-icons/fi";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application error", error);
  }, [error]);

  return (
    <section className="container-page flex min-h-130 items-center justify-center py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-red-50 text-red-500"><FiAlertTriangle size={42} /></div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-red-500">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">We couldn&apos;t load this page.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-soft">There was an unexpected problem on our side. Please try again, or continue browsing while we get things back on track.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => reset()} className="flex items-center gap-2 rounded bg-green-600 px-5 py-3 text-xs font-bold text-white hover:bg-green-700"><FiRefreshCw /> Try Again</button>
          <Link href="/" className="flex items-center gap-2 rounded border border-[#bdc8d6] px-5 py-3 text-xs font-bold text-navy hover:border-green-500 hover:text-green-600"><FiHome /> Go to Homepage</Link>
          <Link href="/shop" className="flex items-center gap-2 rounded border border-[#bdc8d6] px-5 py-3 text-xs font-bold text-navy hover:border-green-500 hover:text-green-600"><FiSearch /> Explore Products</Link>
        </div>
        <p className="mt-6 text-[10px] text-slate-soft">If this keeps happening, please contact our support team.</p>
      </div>
    </section>
  );
}
