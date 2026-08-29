"use client";

import { FaStar } from "react-icons/fa6";
import {
  CATEGORIES,
  DIETARY_OPTIONS,
  GOALS,
  RATING_OPTIONS,
} from "@/app/data/shop-filters";
import { PRODUCTS } from "@/app/data/products";
import { ShopFilters } from "@/app/types/shop";
import PriceRangeSlider from "./PriceRangeSlider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Accordion defaultValue={[title]}>
      <AccordionItem value={title} className="py-4 first:pt-0 last:border-0">
        <AccordionTrigger className="text-sm font-semibold text-navy">{title}</AccordionTrigger>
        <AccordionContent className="mt-3 space-y-2">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-xs text-slate-soft">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="accent-green-500"
        />
        <span className="text-navy">{label}</span>
      </span>
      <span>{count}</span>
    </label>
  );
}

interface Props {
  filters: ShopFilters;
  setGoal: (slug: string) => void;
  toggleCategory: (slug: string) => void;
  toggleDietary: (slug: string) => void;
  setMinRating: (value: number) => void;
  setInStockOnly: (value: boolean) => void;
  setPriceRange: (min: number, max: number) => void;
  clearAll: () => void;
  className?: string;
  mobile?: boolean;
}

export default function FiltersSidebar({
  filters,
  setGoal,
  toggleCategory,
  toggleDietary,
  setMinRating,
  setInStockOnly,
  setPriceRange,
  clearAll,
  className = "",
  mobile = false,
}: Props) {
  const inStockCount = PRODUCTS.filter((product) => product.inStock).length;

  return (
    <aside className={`${mobile ? "block" : "hidden lg:block"} w-full shrink-0 rounded-2xl border border-line bg-white p-5 lg:w-64 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-navy">Filters</h3>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs font-medium text-green-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <FilterGroup title="Category">
        {CATEGORIES.map((c) => (
          <CheckRow
            key={c.slug}
            label={c.label}
            count={
              PRODUCTS.filter((product) => product.categorySlug === c.slug)
                .length
            }
            checked={filters.categories.includes(c.slug)}
            onChange={() => toggleCategory(c.slug)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price Range">
        <PriceRangeSlider
          min={filters.priceMin}
          max={filters.priceMax}
          onChange={setPriceRange}
        />
      </FilterGroup>

      <FilterGroup title="Product Goal">
        {GOALS.filter((g) => g.slug !== "all").map((g) => (
          <CheckRow
            key={g.slug}
            label={g.label}
            count={PRODUCTS.filter((product) => product.goalSlug === g.slug).length}
            checked={filters.goals.includes(g.slug)}
            onChange={() =>
              setGoal(filters.goals.includes(g.slug) ? "all" : g.slug)
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Dietary Preferences">
        {DIETARY_OPTIONS.map((d) => (
          <CheckRow
            key={d.slug}
            label={d.label}
            count={
              PRODUCTS.filter((product) => product.dietary.includes(d.slug))
                .length
            }
            checked={filters.dietary.includes(d.slug)}
            onChange={() => toggleDietary(d.slug)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Rating">
        {RATING_OPTIONS.map((r) => (
          <label
            key={r.value}
            className="flex cursor-pointer items-center justify-between text-xs text-slate-soft"
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.minRating === r.value}
                onChange={() => setMinRating(r.value)}
                className="accent-green-500"
              />
              <span className="flex items-center gap-0.5 text-navy">
                {Array.from({ length: r.value }).map((_, i) => (
                  <FaStar key={i} className="text-[10px] text-gold-400" />
                ))}
                & Up
              </span>
            </span>
            <span>
              {PRODUCTS.filter((product) => product.rating >= r.value).length}
            </span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <CheckRow
          label="In Stock"
          count={inStockCount}
          checked={filters.inStockOnly}
          onChange={() => setInStockOnly(!filters.inStockOnly)}
        />
      </FilterGroup>
    </aside>
  );
}
