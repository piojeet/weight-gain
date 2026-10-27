"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Funnel, ArrowDownUp, Truck, FlaskConical, ShieldCheck, RefreshCcw, X } from "lucide-react";
import FiltersSidebar from "@/components/shop/FiltersSidebar";
import GoalTabs from "@/components/shop/GoalTabs";
import ProductCard from "@/components/shop/ProductCard";
import ShopToolbar from "@/components/shop/ShopToolbar";
import { commerceApi, normalizeCommerceProduct } from "@/lib/api/commerce";
import type { CommerceFacets } from "@/lib/api/commerce";
import type { Product } from "@/app/types/shop";
import { useProductFilters } from "../hooks/useProductFilters";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";
import { PRICE_BOUNDS } from "../data/shop-filters";

const CATALOG_PAGE_SIZE = 24;
const EMPTY_PAGINATION = { page: 0, pageSize: CATALOG_PAGE_SIZE, total: 0, pageCount: 0 };
const EMPTY_FACETS: CommerceFacets = {
  allProductsCount: 0,
  categories: [],
  subCategories: [],
  goals: [],
  dietaryPreferences: [],
  ratings: [],
  inStockCount: 0,
};

function pageQuery(query: string, page: number) {
  const params = new URLSearchParams(query);
  params.set("page", String(page));
  params.set("pageSize", String(CATALOG_PAGE_SIZE));
  return `?${params.toString()}`;
}

function appendUniqueProducts(existing: Product[], incoming: Product[]) {
  const ids = new Set(existing.map((product) => String(product.id)));
  return [...existing, ...incoming.filter((product) => {
    const id = String(product.id);
    if (ids.has(id)) return false;
    ids.add(id);
    return true;
  })];
}

function ShopContent() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const categoriesFromUrl = searchParams.getAll("category");
  const subCategoriesFromUrl = searchParams.getAll("subCategory");
  const categoryUrlKey = JSON.stringify(categoriesFromUrl);
  const subCategoryUrlKey = JSON.stringify(subCategoriesFromUrl);
  const searchFromUrl = searchParams.get("search");
  const appliedCategoryFromUrl = useRef(categoryUrlKey);
  const appliedSubCategoryFromUrl = useRef(subCategoryUrlKey);
  const appliedSearchFromUrl = useRef<string | null>(searchFromUrl);
  const [productsFromApi, setProductsFromApi] = useState<Product[]>([]);
  const [catalogFacets, setCatalogFacets] = useState<CommerceFacets>(EMPTY_FACETS);
  const [catalogTotal, setCatalogTotal] = useState(0);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogHasMore, setCatalogHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingMoreQueryKey, setLoadingMoreQueryKey] = useState<string | null>(null);
  const [moreErrorPage, setMoreErrorPage] = useState<number | null>(null);
  const [moreErrorQueryKey, setMoreErrorQueryKey] = useState<string | null>(null);
  const [priceRangeEnabled, setPriceRangeEnabled] = useState(false);
  const [loadedQueryKey, setLoadedQueryKey] = useState<string | null>(null);
  const [catalogErrorQueryKey, setCatalogErrorQueryKey] = useState<string | null>(null);
  const productsRef = useRef<Product[]>([]);
  const paginationRef = useRef(EMPTY_PAGINATION);
  const hasMoreRef = useRef(false);
  const generationRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const abortTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeQueryKeyRef = useRef<string | null>(null);
  const inFlightPagesRef = useRef(new Map<number, { generation: number; promise: Promise<boolean> }>());
  const sentinelRef = useRef<HTMLDivElement>(null);
  const facets = { ...catalogFacets, dietary: catalogFacets.dietaryPreferences, priceBounds: PRICE_BOUNDS };
  const {
    filters,
    setGoal,
    setCategories,
    toggleSubCategory,
    setSubCategories,
    toggleDietary,
    setMinRating,
    setInStockOnly,
    setPriceRange,
    setSearch,
    setSort,
    clearAll,
    filteredCount,
    products,
  } = useProductFilters(productsFromApi, facets.priceBounds, {
    categories: categoriesFromUrl,
    subCategories: categoriesFromUrl.length ? subCategoriesFromUrl : [],
    search: searchFromUrl ?? "",
  });

  const replaceCategoryParams = useCallback((categories: string[], subCategories: string[], clearAllFilters = false) => {
    const params = new URLSearchParams(searchParams.toString());
    if (clearAllFilters) {
      ["category", "subCategory", "search", "goalSlug", "dietaryPreferences", "rating", "inStockOnly", "minPrice", "maxPrice", "sort"].forEach((key) => params.delete(key));
    } else {
      params.delete("category");
      params.delete("subCategory");
    }
    categories.forEach((category) => params.append("category", category));
    subCategories.forEach((subCategory) => params.append("subCategory", subCategory));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const handleToggleCategory = (slug: string) => {
    const nextCategories = filters.categories.includes(slug)
      ? filters.categories.filter((category) => category !== slug)
      : [...filters.categories, slug];
    setCategories(nextCategories);
    replaceCategoryParams(nextCategories, []);
  };

  const handleToggleSubCategory = (slug: string) => {
    const nextSubCategories = filters.subCategories.includes(slug)
      ? filters.subCategories.filter((subCategory) => subCategory !== slug)
      : [...filters.subCategories, slug];
    toggleSubCategory(slug);
    replaceCategoryParams(filters.categories, nextSubCategories);
  };

  const handlePriceRange = (min: number, max: number) => {
    setPriceRangeEnabled(true);
    setPriceRange(min, max);
  };

  const handleClearAll = () => {
    setPriceRangeEnabled(false);
    clearAll();
    replaceCategoryParams([], [], true);
  };

  const catalogQuery = useMemo(() => {
    const params = new URLSearchParams();
    const search = filters.search.trim();
    if (search) params.set("search", search);
    filters.categories.forEach((category) => params.append("category", category));
    filters.subCategories.forEach((subCategory) => params.append("subCategory", subCategory));
    filters.goals.forEach((goal) => params.append("goalSlug", goal));
    filters.dietary.forEach((preference) => params.append("dietaryPreferences", preference));
    if (filters.minRating !== null) params.set("rating", String(filters.minRating));
    if (filters.inStockOnly) params.set("inStockOnly", "true");
    if (priceRangeEnabled) {
      params.set("minPrice", String(filters.priceMin));
      params.set("maxPrice", String(filters.priceMax));
    }
    const sort = filters.sort === "price-asc"
      ? "price_asc"
      : filters.sort === "price-desc"
        ? "price_desc"
        : filters.sort === "newest"
          ? "newest"
          : filters.sort === "rating"
            ? "rating"
            : "featured";
    params.set("sort", sort);
    return params.toString();
    }, [filters.categories, filters.dietary, filters.goals, filters.inStockOnly, filters.minRating, filters.priceMax, filters.priceMin, filters.search, filters.sort, filters.subCategories, priceRangeEnabled]);

  const queryKey = useMemo(() => JSON.stringify({
    catalogQuery,
    categories: filters.categories,
    subCategories: filters.subCategories,
    goals: filters.goals,
    dietary: filters.dietary,
    minRating: filters.minRating,
    search: filters.search,
    sort: filters.sort,
    priceRangeEnabled,
    priceRange: priceRangeEnabled ? [filters.priceMin, filters.priceMax] : null,
  }), [catalogQuery, filters.categories, filters.dietary, filters.goals, filters.minRating, filters.priceMax, filters.priceMin, filters.search, filters.sort, filters.subCategories, priceRangeEnabled]);

  useEffect(() => {
    if (appliedCategoryFromUrl.current === categoryUrlKey) return;
    appliedCategoryFromUrl.current = categoryUrlKey;
    setCategories(JSON.parse(categoryUrlKey) as string[]);
  }, [categoryUrlKey, setCategories]);

  useEffect(() => {
    if (appliedSubCategoryFromUrl.current === subCategoryUrlKey) return;
    appliedSubCategoryFromUrl.current = subCategoryUrlKey;
    const categories = JSON.parse(categoryUrlKey) as string[];
    setSubCategories(categories.length ? JSON.parse(subCategoryUrlKey) as string[] : []);
  }, [categoryUrlKey, setSubCategories, subCategoryUrlKey]);

  useEffect(() => {
    const categories = JSON.parse(categoryUrlKey) as string[];
    const subCategories = JSON.parse(subCategoryUrlKey) as string[];
    if (!categories.length && subCategories.length) replaceCategoryParams([], []);
  }, [categoryUrlKey, replaceCategoryParams, subCategoryUrlKey]);

  useEffect(() => {
    if (loadedQueryKey !== queryKey) return;
    const availableSubCategories = new Set(facets.subCategories
      .filter((facet) => filters.categories.includes(facet.parentSlug))
      .map((facet) => facet.slug));
    const validSubCategories = filters.subCategories.filter((slug) => availableSubCategories.has(slug));
    if (validSubCategories.length !== filters.subCategories.length) {
      setSubCategories(validSubCategories);
      replaceCategoryParams(filters.categories, validSubCategories);
    }
  }, [facets.subCategories, filters.categories, filters.subCategories, loadedQueryKey, queryKey, replaceCategoryParams, setSubCategories]);

  useEffect(() => {
    if (appliedSearchFromUrl.current === searchFromUrl) return;
    appliedSearchFromUrl.current = searchFromUrl;
    if (searchFromUrl !== null && filters.search !== searchFromUrl) setSearch(searchFromUrl);
  }, [filters.search, searchFromUrl, setSearch]);

  useEffect(() => {
    if (abortTimerRef.current !== null) {
      clearTimeout(abortTimerRef.current);
      abortTimerRef.current = null;
    }

    const existingController = controllerRef.current;
    if (
      existingController &&
      !existingController.signal.aborted &&
      activeQueryKeyRef.current === queryKey
    ) {
      return () => {
        abortTimerRef.current = setTimeout(() => {
          existingController.abort();
          if (controllerRef.current === existingController) controllerRef.current = null;
          abortTimerRef.current = null;
        }, 0);
      };
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const generation = ++generationRef.current;
    activeQueryKeyRef.current = queryKey;
    inFlightPagesRef.current.clear();
    productsRef.current = [];
    paginationRef.current = EMPTY_PAGINATION;
    hasMoreRef.current = false;

    commerceApi.products(pageQuery(catalogQuery, 1), controller.signal)
      .then((response) => {
        if (generation !== generationRef.current || controller.signal.aborted) return;
        const loadedProducts = response.products.map(normalizeCommerceProduct);
        productsRef.current = loadedProducts;
        paginationRef.current = response.pagination;
        const hasMore = response.pagination.page < response.pagination.pageCount && loadedProducts.length < response.pagination.total;
        hasMoreRef.current = hasMore;
        setProductsFromApi(loadedProducts);
        setCatalogFacets(response.facets);
        setCatalogTotal(response.pagination.total);
        setCatalogHasMore(hasMore);
        setLoadedQueryKey(queryKey);
        setCatalogError(null);
        setLoadingMore(false);
        setLoadingMoreQueryKey(null);
        setMoreErrorPage(null);
        setMoreErrorQueryKey(null);
      })
      .catch(() => {
        if (generation === generationRef.current && !controller.signal.aborted) {
          setCatalogError("Unable to load products.");
          setCatalogErrorQueryKey(queryKey);
        }
      })
      .finally(() => {
        if (generation === generationRef.current && !controller.signal.aborted) setCatalogLoading(false);
      });

    return () => {
      abortTimerRef.current = setTimeout(() => {
        controller.abort();
        if (controllerRef.current === controller) controllerRef.current = null;
        abortTimerRef.current = null;
      }, 0);
    };
  }, [catalogQuery, queryKey]);

  const loadNextPage = useCallback((): Promise<boolean> => {
    const generation = generationRef.current;
    const requestQueryKey = queryKey;
    const page = paginationRef.current.page + 1;
    const controller = controllerRef.current;
    if (
      !hasMoreRef.current ||
      activeQueryKeyRef.current !== requestQueryKey ||
      !controller ||
      controller.signal.aborted ||
      page > paginationRef.current.pageCount
    ) return Promise.resolve(false);

    const existing = inFlightPagesRef.current.get(page);
    if (existing?.generation === generation) return existing.promise;

    setLoadingMore(true);
    setLoadingMoreQueryKey(requestQueryKey);
    setMoreErrorPage(null);
    setMoreErrorQueryKey(null);
    const promise = (async () => {
      try {
        const response = await commerceApi.products(pageQuery(catalogQuery, page), controller.signal);
        if (generation !== generationRef.current || controller.signal.aborted) return false;

        const incoming = response.products.map(normalizeCommerceProduct);
        const nextProducts = appendUniqueProducts(productsRef.current, incoming);
        productsRef.current = nextProducts;
        paginationRef.current = response.pagination;
        const hasMore = response.pagination.page < response.pagination.pageCount && nextProducts.length < response.pagination.total;
        hasMoreRef.current = hasMore;
        setProductsFromApi(nextProducts);
        setCatalogTotal(response.pagination.total);
        setCatalogHasMore(hasMore);
        setLoadedQueryKey(requestQueryKey);
        return true;
      } catch {
        if (generation === generationRef.current && !controller.signal.aborted) {
          setMoreErrorPage(page);
          setMoreErrorQueryKey(requestQueryKey);
        }
        return false;
      } finally {
        const pending = inFlightPagesRef.current.get(page);
        if (pending?.generation === generation) inFlightPagesRef.current.delete(page);
        if (generation === generationRef.current) setLoadingMore(false);
      }
    })();
    inFlightPagesRef.current.set(page, { generation, promise });
    return promise;
  }, [catalogQuery, queryKey]);

  const currentCatalogError = catalogErrorQueryKey === queryKey ? catalogError : null;
  const currentMoreErrorPage = moreErrorQueryKey === queryKey ? moreErrorPage : null;
  const currentLoadingMore = loadingMoreQueryKey === queryKey && loadingMore;
  const currentHasMore = loadedQueryKey === queryKey && catalogHasMore;
  const queryPending = loadedQueryKey !== queryKey && currentCatalogError === null;
  const initialLoading = catalogLoading || queryPending;
  const visibleProducts = loadedQueryKey === queryKey ? products : [];

  useEffect(() => {
    if (
      !currentHasMore || initialLoading || currentLoadingMore || currentMoreErrorPage !== null ||
      currentCatalogError || !sentinelRef.current
    ) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadNextPage();
    }, { rootMargin: "400px" });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [currentCatalogError, currentHasMore, currentLoadingMore, currentMoreErrorPage, initialLoading, loadNextPage]);

  return (
    <>
      <section className="border-b border-line bg-linear-to-r from-[#f5fbf5] via-white to-[#f5f9ff]">
        <div className="container-page flex h-39.5 items-center justify-between overflow-hidden sm:h-48">
          <div><p className="text-2xl font-extrabold text-navy sm:text-4xl">Shop</p><p className="mt-2 max-w-47.5 text-xs leading-5 text-slate-soft sm:max-w-none sm:text-sm">Science-backed nutrition<br className="sm:hidden" /> for every goal.</p></div>
          <Image src="/hero.png" alt="TheGrowthHealth nutrition products" width={260} height={170} className="h-32 w-48 object-contain sm:h-44 sm:w-64" priority />
        </div>
      </section>
      <div className="container-page -mt-1 py-4 sm:py-8">
        <div className="grid grid-cols-4 rounded-md border border-line bg-white p-3 shadow-soft sm:grid-cols-4 sm:p-5">
          {[
            [Truck, "Free Shipping", "On orders ₹1,999+"], [FlaskConical, "Lab Tested", "Quality you can trust"], [ShieldCheck, "Secure Payments", "100% safe checkout"], [RefreshCcw, "Easy Returns", "Hassle-free returns"],
          ].map(([Icon, title, detail]) => <div key={title as string} className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-3 sm:text-left"><Icon className="size-5 text-green-600 sm:size-6" /><span><strong className="block text-[9px] font-bold text-navy sm:text-xs">{title as string}</strong><small className="hidden text-[10px] text-slate-soft sm:block">{detail as string}</small></span></div>)}
        </div>
        <GoalTabs activeGoal={filters.goals[0] ?? null} onSelect={setGoal} goals={facets.goals} allProductsCount={facets.allProductsCount} />

        <div className="mt-5 flex gap-3 lg:hidden">
          <button type="button" onClick={() => setMobileFiltersOpen(true)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-line text-xs font-bold text-navy"><Funnel className="size-4" /> Filters</button>
          <div className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-line px-2 text-xs font-bold text-navy"><ArrowDownUp className="size-4 shrink-0" /><AnimatedSelect value={filters.sort} onChange={(event) => setSort(event.target.value as typeof filters.sort)} size="sm" options={[{ value: "featured", label: "Featured" }, { value: "price-asc", label: "Price low to high" }, { value: "price-desc", label: "Price high to low" }, { value: "rating", label: "Top rated" }, { value: "newest", label: "Newest" }]} className="min-w-0 flex-1" /></div>
        </div>

        {mobileFiltersOpen && <div className="fixed inset-0 z-60 bg-black/30 lg:hidden" onClick={() => setMobileFiltersOpen(false)}><div className="absolute inset-y-0 left-0 w-[min(88vw,340px)] overflow-y-auto bg-white p-5" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-base font-bold text-navy">Filters</h2><button type="button" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)}><X className="size-5" /></button></div><FiltersSidebar mobile filters={filters} setGoal={setGoal} toggleCategory={handleToggleCategory} toggleSubCategory={handleToggleSubCategory} toggleDietary={toggleDietary} setMinRating={setMinRating} setInStockOnly={setInStockOnly} setPriceRange={handlePriceRange} clearAll={handleClearAll} {...facets} /></div></div>}

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <FiltersSidebar
            filters={filters}
            setGoal={setGoal}
            toggleCategory={handleToggleCategory}
            toggleSubCategory={handleToggleSubCategory}
            toggleDietary={toggleDietary}
            setMinRating={setMinRating}
            setInStockOnly={setInStockOnly}
            setPriceRange={handlePriceRange}
            clearAll={handleClearAll}
            {...facets}
          />

          <div className="flex-1">
            <ShopToolbar
              total={catalogTotal}
              shown={loadedQueryKey === queryKey ? filteredCount : 0}
              search={filters.search}
              sort={filters.sort}
              onSearch={setSearch}
              onSort={setSort}
            />

            {initialLoading ? (
              <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
                    <div className="animate-pulse">
                      <div className="aspect-4/4 w-full bg-gray-200" />
                      <div className="space-y-2 p-4">
                        <div className="h-2.5 w-20 rounded bg-gray-200" />
                        <div className="h-4 w-32 rounded bg-gray-200" />
                        <div className="h-3 w-full rounded bg-gray-200" />
                        <div className="h-3 w-4/5 rounded bg-gray-200" />
                        <div className="mt-4 h-10 w-full rounded-md bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : currentCatalogError ? <p className="mt-16 text-center text-sm text-red-600">{currentCatalogError}</p> : visibleProducts.length > 0 ? (
              <div className="mt-5 grid sm:grid-cols-2 gap-2 sm:mt-6 sm:gap-4 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="mt-16 text-center text-sm text-slate-soft">
                No products match your filters. Try adjusting or clearing them.
              </p>
            )}

            {currentLoadingMore && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-4" aria-label="Loading more products">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`more-skeleton-${index}`} className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
                    <div className="animate-pulse">
                      <div className="aspect-4/4 w-full bg-gray-200" />
                      <div className="space-y-2 p-4">
                        <div className="h-2.5 w-20 rounded bg-gray-200" />
                        <div className="h-4 w-32 rounded bg-gray-200" />
                        <div className="h-3 w-full rounded bg-gray-200" />
                        <div className="h-3 w-4/5 rounded bg-gray-200" />
                        <div className="mt-4 h-10 w-full rounded-md bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div ref={sentinelRef} className="h-1" aria-hidden="true" />

            {currentMoreErrorPage !== null && (
              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-soft">
                <span>Couldn&apos;t load more products</span>
                <button type="button" onClick={() => void loadNextPage()} className="font-semibold text-green-600 hover:underline">
                  Retry
                </button>
              </div>
            )}

            {!currentHasMore && !initialLoading && !currentCatalogError && loadedQueryKey === queryKey && productsFromApi.length > 0 && (
              <p className="mt-4 text-center text-xs text-slate-soft">No more products</p>
            )}

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
