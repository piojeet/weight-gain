import { IoSearchOutline } from "react-icons/io5";
import { SORT_LABELS } from "@/app/data/shop-filters";
import { SortOption } from "@/app/types/shop";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";

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

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-md border border-line py-2.5 min-h-10 pr-3 pl-9 text-xs outline-none focus:border-navy sm:block sm:w-56"
          />
          <IoSearchOutline className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-soft" />
        </div>

        <AnimatedSelect
          value={sort}
          onChange={(e) => onSort(e.target.value as SortOption)}
          size="md"
          options={Object.entries(SORT_LABELS).map(([value, label]) => ({ value, label: `Sort by: ${label}` }))}
          className="min-w-36"
        />
      </div>
    </div>
  );
}
