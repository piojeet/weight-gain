"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { commerceApi, type BannerResponse } from "@/lib/api/commerce";

export default function LiveBanners() {
  const [banners, setBanners] = useState<BannerResponse[]>([]);
  const tracked = useRef(new Set<string>());
  useEffect(() => { commerceApi.banners().then(({ banners: rows }) => setBanners(rows)).catch(() => undefined); }, []);
  if (!banners.length) return null;
  return <section className="container-page py-5"><div className="grid gap-3 md:grid-cols-2">{banners.map((banner) => <Link key={banner.id} href={banner.linkUrl || "/shop"} onClick={() => { void commerceApi.bannerClick(banner.id); }} onMouseEnter={() => { if (!tracked.current.has(banner.id)) { tracked.current.add(banner.id); void commerceApi.bannerImpression(banner.id); } }} className="overflow-hidden rounded-xl border border-line bg-white shadow-sm"><img src={banner.image} alt={banner.title} className="h-44 w-full object-cover" /><div className="p-4"><h2 className="text-lg font-extrabold text-navy">{banner.title}</h2>{banner.subtitle && <p className="mt-1 text-xs text-slate-soft">{banner.subtitle}</p>}</div></Link>)}</div></section>;
}
