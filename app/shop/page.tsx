"use client";

import { useEffect, useRef, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Funnel, ArrowDownUp, Truck, FlaskConical, ShieldCheck, RefreshCcw, X } from "lucide-react";
import FiltersSidebar from "@/components/shop/FiltersSidebar";
import GoalTabs from "@/components/shop/GoalTabs";
import Pagination from "@/components/shop/Pagination";
import ProductCard from "@/components/shop/ProductCard";
import ShopToolbar from "@/components/shop/ShopToolbar";
import { PRODUCTS } from "../data/products";
import { useProductFilters } from "../hooks/useProductFilters";

 

function ShopContent() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const searchFromUrl = searchParams.get("search");
  const appliedCategoryFromUrl = useRef<string | null>(null);
  const appliedSearchFromUrl = useRef<string | null>(null);
  const {
    filters,
    setGoal,
    toggleCategory,
    setCategory,
    toggleDietary,
    setMinRating,
    setInStockOnly,
    setPriceRange,
    setSearch,
    setSort,
    setPage,
    clearAll,
    filteredCount,
    totalPages,
    currentPage,
    products,
  } = useProductFilters(PRODUCTS);

  useEffect(() => {
    if (appliedCategoryFromUrl.current === categoryFromUrl) return;

    appliedCategoryFromUrl.current = categoryFromUrl;

    if (
      categoryFromUrl &&
      PRODUCTS.some((product) => product.categorySlug === categoryFromUrl) &&
      (filters.categories.length !== 1 ||
        !filters.categories.includes(categoryFromUrl))
    ) {
      setCategory(categoryFromUrl);
    }
  }, [categoryFromUrl, filters.categories, setCategory]);

  useEffect(() => {
    if (appliedSearchFromUrl.current === searchFromUrl) return;
    appliedSearchFromUrl.current = searchFromUrl;
    if (searchFromUrl !== null && filters.search !== searchFromUrl) setSearch(searchFromUrl);
  }, [filters.search, searchFromUrl, setSearch]);

  return (
    <>
      <section className="border-b border-line bg-linear-to-r from-[#f5fbf5] via-white to-[#f5f9ff]">
        <div className="container-page flex h-39.5 items-center justify-between overflow-hidden sm:h-48">
          <div><p className="text-2xl font-extrabold text-navy sm:text-4xl">Shop</p><p className="mt-2 max-w-47.5 text-xs leading-5 text-slate-soft sm:max-w-none sm:text-sm">Science-backed nutrition<br className="sm:hidden" /> for every goal.</p></div>
          <Image src="/hero.png" alt="NutriGain nutrition products" width={260} height={170} className="h-32 w-48 object-contain sm:h-44 sm:w-64" priority />
        </div>
      </section>
      <div className="container-page -mt-1 py-4 sm:py-8">
        <div className="grid grid-cols-4 rounded-xl border border-line bg-white p-3 shadow-soft sm:grid-cols-4 sm:p-5">
          {[
            [Truck, "Free Shipping", "On orders ₹1,999+"], [FlaskConical, "Lab Tested", "Quality you can trust"], [ShieldCheck, "Secure Payments", "100% safe checkout"], [RefreshCcw, "Easy Returns", "Hassle-free returns"],
          ].map(([Icon, title, detail]) => <div key={title as string} className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-3 sm:text-left"><Icon className="size-5 text-green-600 sm:size-6" /><span><strong className="block text-[9px] font-bold text-navy sm:text-xs">{title as string}</strong><small className="hidden text-[10px] text-slate-soft sm:block">{detail as string}</small></span></div>)}
        </div>
        <GoalTabs activeGoal={filters.goals[0] ?? null} onSelect={setGoal} />

        <div className="mt-5 flex gap-3 lg:hidden">
          <button type="button" onClick={() => setMobileFiltersOpen(true)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-line text-xs font-bold text-navy"><Funnel className="size-4" /> Filters</button>
          <label className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-line text-xs font-bold text-navy"><ArrowDownUp className="size-4" /> Sort<select value={filters.sort} onChange={(event) => setSort(event.target.value as typeof filters.sort)} className="sr-only"><option value="featured">Featured</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option><option value="rating">Top rated</option><option value="newest">Newest</option></select></label>
        </div>

        {mobileFiltersOpen && <div className="fixed inset-0 z-60 bg-black/30 lg:hidden" onClick={() => setMobileFiltersOpen(false)}><div className="absolute inset-y-0 left-0 w-[min(88vw,340px)] overflow-y-auto bg-white p-5" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-base font-bold text-navy">Filters</h2><button type="button" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)}><X className="size-5" /></button></div><FiltersSidebar mobile filters={filters} setGoal={setGoal} toggleCategory={toggleCategory} toggleDietary={toggleDietary} setMinRating={setMinRating} setInStockOnly={setInStockOnly} setPriceRange={setPriceRange} clearAll={clearAll} /></div></div>}

      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <FiltersSidebar
            filters={filters}
            setGoal={setGoal}
            toggleCategory={toggleCategory}
            toggleDietary={toggleDietary}
            setMinRating={setMinRating}
            setInStockOnly={setInStockOnly}
            setPriceRange={setPriceRange}
            clearAll={clearAll}
          />

          <div className="flex-1">
            <ShopToolbar
              total={PRODUCTS.length}
              shown={filteredCount}
              search={filters.search}
              sort={filters.sort}
              onSearch={setSearch}
              onSort={setSort}
            />

            {products.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-5 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="mt-16 text-center text-sm text-slate-soft">
                No products match your filters. Try adjusting or clearing them.
              </p>
            )}

            <div className="mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-page py-8">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
