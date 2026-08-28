import { useMemo, useState } from "react";
import { Product, ShopFilters, SortOption } from "@/app/types/shop";
import { PAGE_SIZE, PRICE_BOUNDS } from "@/app/data/shop-filters";

const INITIAL_FILTERS: ShopFilters = {
  categories: [],
  goals: [],
  dietary: [],
  minRating: null,
  inStockOnly: false,
  priceMin: PRICE_BOUNDS.min,
  priceMax: PRICE_BOUNDS.max,
  search: "",
  sort: "featured",
  page: 1,
};

function toggleInArray(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState<ShopFilters>(INITIAL_FILTERS);

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
      page: 1,
    }));

  const setCategory = (slug: string) =>
    setFilters((f) => ({ ...f, categories: [slug], page: 1 }));

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

  const setPage = (page: number) => setFilters((f) => ({ ...f, page }));

  const clearAll = () => setFilters(INITIAL_FILTERS);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (
        filters.categories.length &&
        !filters.categories.includes(p.categorySlug)
      )
        return false;
      if (filters.goals.length && !filters.goals.includes(p.goalSlug))
        return false;
      if (
        filters.dietary.length &&
        !filters.dietary.every((d) => p.dietary.includes(d))
      )
        return false;
      if (filters.minRating && p.rating < filters.minRating) return false;
      if (filters.inStockOnly && !p.inStock) return false;
      if (p.price < filters.priceMin || p.price > filters.priceMax)
        return false;
      if (
        filters.search &&
        !p.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });

    switch (filters.sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list = [...list].sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
        );
        break;
    }
    return list;
  }, [products, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(filters.page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return {
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
    resetPage,
    filteredCount: filtered.length,
    totalPages,
    currentPage,
    products: paginated,
  };
}
