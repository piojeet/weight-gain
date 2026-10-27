import { useCallback, useMemo, useState } from "react";
import { Product, ShopFilters, SortOption } from "@/app/types/shop";

const INITIAL_FILTERS: ShopFilters = {
  categories: [],
  subCategories: [],
  goals: [],
  dietary: [],
  minRating: null,
  inStockOnly: false,
  priceMin: 0,
  priceMax: 1,
  search: "",
  sort: "featured",
  page: 1,
};

function toggleInArray(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function useProductFilters(
  products: Product[],
  priceBounds: { min: number; max: number },
  initialOverrides: Partial<ShopFilters> = {},
) {
  const initialFilters = { ...INITIAL_FILTERS, priceMin: priceBounds.min, priceMax: priceBounds.max };
  const [filters, setFilters] = useState<ShopFilters>(() => ({ ...initialFilters, ...initialOverrides }));

  const effectiveFilters = useMemo(
    () => filters.priceMax === 1 && products.length
      ? { ...filters, priceMin: priceBounds.min, priceMax: priceBounds.max }
      : filters,
    [filters, priceBounds.max, priceBounds.min, products.length],
  );

  const resetPage = () => setFilters((f) => ({ ...f, page: 1 }));

  const setGoal = (goalSlug: string) =>
    setFilters((f) => ({
      ...f,
      goals: goalSlug === "all" ? [] : [goalSlug],
      page: 1,
    }));

  const toggleCategory = (slug: string) =>
    setFilters((f) => ({
      ...f,
      categories: toggleInArray(f.categories, slug),
      subCategories: [],
      page: 1,
    }));

  const setCategory = (slug: string) =>
    setFilters((f) => ({ ...f, categories: slug ? [slug] : [], subCategories: [], page: 1 }));

  const setCategories = (categories: string[]) =>
    setFilters((f) => ({ ...f, categories, subCategories: [], page: 1 }));

  const toggleSubCategory = (slug: string) =>
    setFilters((f) => ({ ...f, subCategories: toggleInArray(f.subCategories, slug), page: 1 }));

  const setSubCategories = (subCategories: string[]) =>
    setFilters((f) => ({ ...f, subCategories, page: 1 }));

  const toggleDietary = (slug: string) =>
    setFilters((f) => ({
      ...f,
      dietary: toggleInArray(f.dietary, slug),
      page: 1,
    }));

  const setMinRating = (value: number) =>
    setFilters((f) => ({
      ...f,
      minRating: f.minRating === value ? null : value,
      page: 1,
    }));

  const setInStockOnly = (value: boolean) =>
    setFilters((f) => ({ ...f, inStockOnly: value, page: 1 }));

  const setPriceRange = (priceMin: number, priceMax: number) =>
    setFilters((f) => ({ ...f, priceMin, priceMax, page: 1 }));

  const setSearch = (search: string) =>
    setFilters((f) => ({ ...f, search, page: 1 }));

  const setSort = (sort: SortOption) =>
    setFilters((f) => ({ ...f, sort, page: 1 }));

  const setPage = useCallback((page: number) => setFilters((f) => ({ ...f, page })), []);

  const clearAll = () => setFilters(initialFilters);

  return {
    filters: effectiveFilters,
    setGoal,
    toggleCategory,
    setCategory,
    setCategories,
    toggleSubCategory,
    setSubCategories,
    toggleDietary,
    setMinRating,
    setInStockOnly,
    setPriceRange,
    setSearch,
    setSort,
    setPage,
    clearAll,
    resetPage,
    filteredCount: products.length,
    products,
  };
}
