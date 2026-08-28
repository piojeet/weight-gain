"use client";

import { liteClient } from "algoliasearch/lite";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";
import { PRODUCTS } from "@/app/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "products";
const algoliaClient = appId && searchKey ? liteClient(appId, searchKey) : null;

type SearchHit = { objectID?: string; name?: string; description?: string; slug?: string; image?: string };

export default function ProductSearch({ className, mobile = false }: { className?: string; mobile?: boolean }) {
  const router = useRouter();
  const containerRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const localHits = useMemo(() => PRODUCTS.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5), [query]);

  useEffect(() => {
    if (!query.trim()) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      if (algoliaClient) {
        try {
          const response = await algoliaClient.searchForHits<SearchHit>([{ indexName, params: { query, hitsPerPage: 5 } }]);
          if (!cancelled) setHits(response.results[0]?.hits || []);
        } catch {
          if (!cancelled) setHits([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }, 180);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [query]);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!containerRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setOpen(false);
    router.push(`/shop?search=${encodeURIComponent(value)}`);
  };
  const select = (value: string) => { setQuery(value); setOpen(false); router.push(`/shop?search=${encodeURIComponent(value)}`); };
  const visibleHits: SearchHit[] = algoliaClient ? hits : localHits.map((product) => ({ objectID: String(product.id), name: product.name, description: product.description, slug: product.slug, image: product.image }));

  return <form ref={containerRef} onSubmit={submit} className={cn("relative", className)} role="search"><Input value={query} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onFocus={() => query && setOpen(true)} placeholder={mobile ? "Search Products..." : "Search Products..."} aria-label="Search products" className={cn(mobile ? "h-10 pl-9" : "h-8 w-40 bg-[#f9f9fa] pr-9 text-xs md:w-56", "rounded-md")} /><Button type="submit" variant="ghost" size="icon" aria-label="Submit product search" className={cn("absolute right-0 top-1/2 size-8 -translate-y-1/2", mobile && "left-0 right-auto")}><IoSearchOutline /></Button>{open && query.trim() && <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-line bg-white p-1 shadow-lg">{loading && <p className="px-3 py-2 text-xs text-slate-soft">Searching...</p>}{!loading && visibleHits.length === 0 && <p className="px-3 py-2 text-xs text-slate-soft">No products found.</p>}{!loading && visibleHits.map((hit) => <button type="button" key={hit.objectID || hit.name} onClick={() => select(hit.name || query)} className="flex w-full items-start gap-2 rounded px-2 py-2 text-left hover:bg-green-soft"><span className="flex size-7 shrink-0 items-center justify-center rounded bg-gray-50 text-[10px] text-green-600"><IoSearchOutline /></span><span className="min-w-0"><b className="block truncate text-xs text-navy">{hit.name}</b><small className="block truncate text-[10px] text-slate-soft">{hit.description}</small></span></button>)}</div>}</form>;
}
