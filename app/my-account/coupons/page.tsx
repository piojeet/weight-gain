"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowRight, FiCheck, FiCopy, FiGift, FiInfo, FiTag, FiZap } from "react-icons/fi";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { commerceApi, type BestSellerProduct, type CouponResponse } from "@/lib/api/commerce";

type CouponBucket = "available" | "used" | "expired" | "scheduled";
type CouponSummary = { totalSavings: number; thisMonthSavings: number; availableCouponCount: number };

const tabs: Array<{ key: CouponBucket; label: string }> = [
  { key: "available", label: "Available" },
  { key: "scheduled", label: "Upcoming" },
  { key: "used", label: "Used" },
  { key: "expired", label: "Expired" },
];
const money = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
const couponBucket = (coupon: CouponResponse): CouponBucket =>
  coupon.bucket ?? (coupon.status === "expired" ? "expired" : coupon.status === "scheduled" ? "scheduled" : "available");

export default function CouponsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<CouponBucket>("available");
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [summary, setSummary] = useState<CouponSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [applyError, setApplyError] = useState("");
  const [applyingCode, setApplyingCode] = useState("");
  const [copied, setCopied] = useState("");
  const [recommendations, setRecommendations] = useState<BestSellerProduct[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState("");

  const loadCoupons = () => {
    setLoading(true);
    setLoadError("");
    commerceApi.userCoupons()
      .then(({ coupons: rows, summary: stats }) => {
        setCoupons(rows);
        setSummary(stats);
      })
      .catch((cause: unknown) => setLoadError(cause instanceof Error ? cause.message : "Unable to load your coupons."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    commerceApi.userCoupons()
      .then(({ coupons: rows, summary: stats }) => {
        if (!active) return;
        setCoupons(rows);
        setSummary(stats);
      })
      .catch((cause: unknown) => {
        if (active) setLoadError(cause instanceof Error ? cause.message : "Unable to load your coupons.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    commerceApi.bestSellers(6)
      .then(({ products }) => { if (active) setRecommendations(products); })
      .catch((cause: unknown) => {
        if (active) setRecommendationsError(cause instanceof Error ? cause.message : "Unable to load recommendations.");
      })
      .finally(() => { if (active) setRecommendationsLoading(false); });
    return () => { active = false; };
  }, []);

  const visibleCoupons = coupons.filter((coupon) => couponBucket(coupon) === tab);

  const copyCode = async (code: string) => {
    setApplyError("");
    try {
      if (!navigator.clipboard) throw new Error("Clipboard access is unavailable in this browser.");
      await navigator.clipboard.writeText(code);
      setCopied(code);
      window.setTimeout(() => setCopied(""), 1800);
    } catch (cause) {
      setApplyError(cause instanceof Error ? cause.message : "Unable to copy the coupon code.");
    }
  };

  const applyAtCheckout = async (coupon: CouponResponse) => {
    setApplyingCode(coupon.code);
    setApplyError("");
    try {
      await commerceApi.validateCoupon(coupon.code);
      window.sessionStorage.setItem("growthhealth_checkout_coupon", coupon.code);
      router.push("/checkout");
    } catch (cause) {
      setApplyError(cause instanceof Error ? cause.message : "This coupon could not be validated against your cart.");
    } finally {
      setApplyingCode("");
    }
  };

  return (
    <main className="bg-[#fbfcfd] pb-12">
      <nav className="text-[10px] text-slate-soft">Home <span className="mx-2">›</span> My Account <span className="mx-2">›</span> <span className="text-navy">My Coupons</span></nav>
      <header className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy"><FiTag className="mr-2 inline text-green-600" />My Coupons &amp; Offers</h1>
          <p className="mt-1 text-[10px] text-slate-soft">Validate a coupon against your cart before continuing to checkout.</p>
        </div>
        <Link href="/checkout" className="inline-flex items-center gap-2 rounded border border-green-500 px-4 py-2 text-[9px] font-bold text-green-600">Go to Checkout <FiArrowRight /></Link>
      </header>

      {applyError && <p role="alert" className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">{applyError}</p>}

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
        <section className="min-w-0 rounded-lg border border-line bg-white p-3">
          <h2 className="text-[10px] font-extrabold"><FiGift className="mr-1 inline text-amber-500" /> Your Coupons</h2>
          <div className="mt-3 flex flex-wrap gap-3 border-b border-line text-[9px] font-bold text-slate-soft">
            {tabs.map(({ key, label }) => (
              <button key={key} type="button" onClick={() => setTab(key)} aria-pressed={tab === key} className={`border-b-2 px-2 py-3 ${tab === key ? "border-green-600 text-green-600" : "border-transparent"}`}>
                {label} ({coupons.filter((coupon) => couponBucket(coupon) === key).length})
              </button>
            ))}
          </div>
          {loading && <p role="status" className="p-6 text-center text-xs text-slate-soft">Loading coupons…</p>}
          {loadError && <div role="alert" className="mt-3 flex items-center justify-between gap-3 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700"><span>{loadError}</span><button type="button" onClick={loadCoupons} className="shrink-0 rounded bg-red-700 px-3 py-2 font-semibold text-white">Retry</button></div>}
          {!loading && !loadError && visibleCoupons.length === 0 && <p className="p-10 text-center text-xs text-slate-soft">No {tab} coupons are available.</p>}
          {!loading && !loadError && <div className="mt-3 grid gap-2">
            {visibleCoupons.map((coupon) => (
              <article key={coupon.id} className="grid grid-cols-[78px_minmax(0,1fr)_130px] items-center gap-3 rounded-lg border border-[#e5ece7] p-2">
                <div className="flex min-h-20 flex-col items-center justify-center rounded-lg bg-green-soft text-center text-lg font-extrabold leading-5 text-green-700">
                  {coupon.discountType === "freeShipping" ? "FREE" : coupon.discountType === "flat" ? money(coupon.discountValue) : `${coupon.discountValue}%`}
                  <small className="mt-1 text-[7px]">{coupon.applicableTo ?? "All products"}</small>
                </div>
                <div>
                  <h3 className="text-[10px] font-extrabold">{coupon.name}</h3>
                  <p className="mt-1 text-[8px] text-slate-soft">{coupon.description || "Offer terms are checked at checkout."}</p>
                  <p className="mt-2 text-[8px] text-slate-soft"><FiCheck className="mr-1 inline text-green-600" />Valid till {new Date(coupon.validTo).toLocaleDateString("en-IN")}</p>
                  <Link href="/shop" className="mt-2 inline-block text-[8px] font-bold text-green-600">View Products <FiArrowRight className="inline" /></Link>
                </div>
                <div className="text-center">
                  <button type="button" onClick={() => void copyCode(coupon.code)} className="w-full rounded border border-[#bdc8d6] py-1.5 text-[8px] font-bold"><FiCopy className="mr-1 inline" />{copied === coupon.code ? "Copied" : coupon.code}</button>
                  {tab === "available" && <button type="button" disabled={applyingCode === coupon.code} onClick={() => void applyAtCheckout(coupon)} className="mt-2 w-full rounded border border-green-200 py-1.5 text-[8px] font-bold text-green-600 disabled:opacity-50">{applyingCode === coupon.code ? "Checking…" : "Apply at Checkout"}</button>}
                  {tab !== "available" && <span className="mt-2 block text-[8px] text-slate-soft">{tab === "used" ? "Previously redeemed" : tab === "expired" ? "Expired" : "Not active yet"}</span>}
                </div>
              </article>
            ))}
          </div>}
        </section>

        <aside className="grid content-start gap-4">
          <section className="rounded-lg bg-green-soft p-4">
            <h2 className="text-[10px] font-extrabold">Your Savings</h2>
            {loading && <p role="status" className="mt-3 text-xs text-slate-soft">Loading saved totals…</p>}
            {loadError && <p className="mt-3 text-xs text-red-700">Savings unavailable until coupon data loads.</p>}
            {summary && !loadError && <>
              <p className="mt-4 text-[8px] text-slate-soft">Total saved from redeemed coupons</p>
              <p className="text-xl font-extrabold">{money(summary.totalSavings)}</p>
              <hr className="my-4 border-white" />
              <p className="text-[8px] text-slate-soft">Saved this month <b className="float-right text-navy">{money(summary.thisMonthSavings)}</b></p>
              <p className="mt-3 text-[8px] text-slate-soft">Available coupons <b className="float-right text-navy">{summary.availableCouponCount}</b></p>
            </>}
          </section>
          <section className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-[10px] font-extrabold"><FiZap className="mr-1 inline text-amber-500" /> Coupon Tips</h2>
            <div className="mt-4 grid gap-4 text-[8px] text-slate-soft">
              <p><FiCopy className="mr-2 inline text-green-600" />Copy the code or validate it against your cart before checkout.</p>
              <p><FiCheck className="mr-2 inline text-green-600" />The server checks minimum order, eligibility and usage limits again when placing the order.</p>
              <p><FiInfo className="mr-2 inline text-green-600" />Final order totals are calculated by the server at checkout.</p>
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-5 rounded-lg border border-line bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-extrabold">Popular products</h2>
          <Link href="/shop" className="text-[8px] font-bold text-green-600">View All Products <FiArrowRight className="inline" /></Link>
        </div>
        {recommendationsLoading && <p role="status" className="mt-3 text-xs text-slate-soft">Loading popular products…</p>}
        {recommendationsError && <p role="alert" className="mt-3 text-xs text-red-700">{recommendationsError}</p>}
        {!recommendationsLoading && !recommendationsError && !recommendations.length && <p className="mt-3 text-xs text-slate-soft">No popular products are available.</p>}
        {!recommendationsLoading && !recommendationsError && recommendations.length > 0 && <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {recommendations.map((product) => (
            <article key={product.id} className="rounded border border-line p-2">
              <Image src={product.image || "/categories/mass-gainer.jpg"} alt={product.name} width={128} height={96} className="mx-auto h-16 object-contain" />
              <p className="truncate text-[8px] font-bold">{product.name}</p>
              <p className="mt-1 text-[9px] font-extrabold">{money(product.price)}</p>
              <AddToCartButton productId={product.id} className="mt-2 w-full rounded border border-[#bdc8d6] py-1.5 text-[8px] font-bold" />
            </article>
          ))}
        </div>}
      </section>
    </main>
  );
}
