import Link from "next/link";
import { FiArrowLeft, FiHome, FiSearch } from "react-icons/fi";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-green-soft text-5xl font-extrabold text-green-600">404</div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-green-600">Page not found</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">This page took a wrong turn.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-soft">The page you&apos;re looking for may have moved, expired, or never existed. Let&apos;s get you back to your nutrition journey.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="flex items-center gap-2 rounded bg-green-600 px-5 py-3 text-xs font-bold text-white hover:bg-green-700"><FiHome /> Go to Homepage</Link>
          <Link href="/shop" className="flex items-center gap-2 rounded border border-[#bdc8d6] px-5 py-3 text-xs font-bold text-navy hover:border-green-500 hover:text-green-600"><FiSearch /> Explore Products</Link>
        </div>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold text-slate-soft hover:text-green-600"><FiArrowLeft /> Back to safety</Link>
      </div>
    </section>
  );
}
