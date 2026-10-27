import { LuLayoutGrid, LuPersonStanding, LuDumbbell, LuLeaf, LuFlaskConical, LuShieldCheck } from "react-icons/lu";
import type { ShopFacet } from "./FiltersSidebar";

const GOAL_ICONS = [LuPersonStanding, LuDumbbell, LuLeaf, LuFlaskConical, LuShieldCheck];

export default function GoalTabs({
  activeGoal,
  onSelect,
  goals,
  allProductsCount,
}: {
  activeGoal: string | null;
  onSelect: (slug: string) => void;
  goals: ShopFacet[];
  allProductsCount: number;
}) {
  const allGoal = { slug: "all", label: "All Products", count: allProductsCount };
  const goalOptions = [allGoal, ...goals];
  return (
    <div className="mt-4">
      <h2 className="font-display text-xl font-extrabold text-navy">
        Shop By Your Goal
      </h2>
      <div className="scrollbar-none mt-4 flex gap-3 overflow-x-auto pb-1">
        {goalOptions.map(({ slug, label, count }, index) => {
          const Icon = slug === "all" ? LuLayoutGrid : GOAL_ICONS[(index - 1) % GOAL_ICONS.length];
          const isActive = slug === "all" ? !activeGoal : activeGoal === slug;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => onSelect(slug)}
              className={`flex min-w-19 shrink-0 flex-col items-center gap-1 rounded-md border p-2 text-center transition-colors sm:min-w-40 sm:flex-row sm:gap-3 sm:p-3.5 sm:text-left cursor-pointer ${
                isActive
                  ? "border-green-600 bg-green-soft"
                  : "border-line bg-white hover:border-navy/20"
              }`}
            >
              <Icon
                className={`text-xl ${isActive ? "text-green-600" : "text-navy"}`}
              />
              <div>
                <p className="text-[10px] font-semibold leading-tight text-navy sm:text-sm">{label}</p>
                <p className="hidden text-[11px] text-slate-soft sm:block">{count} Product{count === 1 ? "" : "s"}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
