"use client";

import { Trash2 } from "lucide-react";
import { FaStar } from "react-icons/fa6";
import { useState } from "react";
import { ShopFilters } from "@/app/types/shop";
import PriceRangeSlider from "./PriceRangeSlider";
import { AnimatedAccordionItem } from "@/components/ui/faq-tabs-card";

export type ShopFacet = { slug: string; label: string; count: number };
export type RatingFacet = { value: number; count: number };

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <AnimatedAccordionItem
      title={<span className="text-sm font-semibold text-navy">{title}</span>}
      open={open}
      onToggle={() => setOpen((current) => !current)}
      className="py-4 first:pt-0 last:border-0"
      contentClassName="mt-3 space-y-2"
    >
      {children}
    </AnimatedAccordionItem>
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
  toggleSubCategory: (slug: string) => void;
  toggleDietary: (slug: string) => void;
  setMinRating: (value: number) => void;
  setInStockOnly: (value: boolean) => void;
  setPriceRange: (min: number, max: number) => void;
  clearAll: () => void;
  categories: ShopFacet[];
  subCategories: Array<ShopFacet & { parentSlug: string }>;
  goals: ShopFacet[];
  dietary: ShopFacet[];
  ratings: RatingFacet[];
  priceBounds: { min: number; max: number };
  inStockCount: number;
  className?: string;
  mobile?: boolean;
}

export default function FiltersSidebar({
  filters,
  setGoal,
  toggleCategory,
  toggleSubCategory,
  toggleDietary,
  setMinRating,
  setInStockOnly,
  setPriceRange,
  clearAll,
  categories,
  subCategories,
  goals,
  dietary,
  ratings,
  priceBounds,
  inStockCount,
  className = "",
  mobile = false,
}: Props) {
  return (
    <aside
      className={`${mobile ? "block" : "hidden lg:block"} w-full shrink-0 rounded-lg border border-line bg-white p-5 lg:w-64 sticky top-20 h-fit ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-navy">Filters</h3>
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 hover:underline"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <FilterGroup title="Category">
        {categories.map((c) => (
          <CheckRow
            key={c.slug}
            label={c.label}
            count={
              c.count
            }
            checked={filters.categories.includes(c.slug)}
            onChange={() => toggleCategory(c.slug)}
          />
        ))}
      </FilterGroup>

      {filters.categories.length > 0 && (
        <FilterGroup title="Sub Category">
          {subCategories
            .filter((subCategory) => filters.categories.includes(subCategory.parentSlug))
            .map((subCategory) => (
              <CheckRow
                key={subCategory.slug}
                label={subCategory.label}
                count={subCategory.count}
                checked={filters.subCategories.includes(subCategory.slug)}
                onChange={() => toggleSubCategory(subCategory.slug)}
              />
            ))}
          {!subCategories.some((subCategory) => filters.categories.includes(subCategory.parentSlug)) && (
            <p className="pl-6 text-xs text-slate-soft">No subcategories available</p>
          )}
        </FilterGroup>
      )}

      <FilterGroup title="Price Range">
        <PriceRangeSlider
          min={filters.priceMin}
          max={filters.priceMax}
          bounds={priceBounds}
          onChange={setPriceRange}
        />
      </FilterGroup>

      <FilterGroup title="Product Goal">
        {goals.map((g) => (
          <CheckRow
            key={g.slug}
            label={g.label}
            count={
              g.count
            }
            checked={filters.goals.includes(g.slug)}
            onChange={() =>
              setGoal(filters.goals.includes(g.slug) ? "all" : g.slug)
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Dietary Preferences">
        {dietary.map((d) => (
          <CheckRow
            key={d.slug}
            label={d.label}
            count={
              d.count
            }
            checked={filters.dietary.includes(d.slug)}
            onChange={() => toggleDietary(d.slug)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Rating">
        {ratings.map((r) => (
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
              {r.count}
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
