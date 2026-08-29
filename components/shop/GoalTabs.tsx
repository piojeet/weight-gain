import { GOALS } from "@/app/data/shop-filters";

export default function GoalTabs({
  activeGoal,
  onSelect,
}: {
  activeGoal: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-navy">
        Shop By Your Goal
      </h2>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {GOALS.map(({ slug, label, count, icon: Icon }) => {
          const isActive = slug === "all" ? !activeGoal : activeGoal === slug;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => onSelect(slug)}
              className={`flex min-w-[76px] shrink-0 flex-col items-center gap-1 rounded-md border p-2 text-center transition-colors sm:min-w-[160px] sm:flex-row sm:gap-3 sm:rounded-xl sm:p-3.5 sm:text-left ${
                isActive
                  ? "border-green-500 bg-green-soft"
                  : "border-line bg-white hover:border-navy/20"
              }`}
            >
              <Icon
                className={`text-xl ${isActive ? "text-green-600" : "text-navy"}`}
              />
              <div>
                <p className="text-[10px] font-semibold leading-tight text-navy sm:text-sm">{label}</p>
                <p className="hidden text-[11px] text-slate-soft sm:block">{count} Products</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
