import { IoSearchOutline } from "react-icons/io5";
import { SORT_LABELS } from "@/app/data/shop-filters";
import { SortOption } from "@/app/types/shop";

export default function ShopToolbar({
  total,
  shown,
  search,
  sort,
  onSearch,
  onSort,
}: {
  total: number;
  shown: number;
  search: string;
  sort: SortOption;
  onSearch: (value: string) => void;
  onSort: (value: SortOption) => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-lg font-bold text-navy">All Nutrition Products</h1>
        <p className="text-xs text-slate-soft">
          Showing {shown} of {total} products
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products..."
            className="hidden w-full rounded-lg border border-line py-2 pr-3 pl-9 text-xs outline-none focus:border-navy sm:block sm:w-56"
          />
          <IoSearchOutline className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-soft" />
        </div>

        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as SortOption)}
          className="rounded-lg border border-line py-2 px-3 text-xs text-navy outline-none focus:border-navy"
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              Sort by: {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
