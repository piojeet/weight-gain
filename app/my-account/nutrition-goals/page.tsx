"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiAward,
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiCheck,
  FiChevronRight,
  FiCircle,
  FiEdit2,
  FiHeart,
  FiLock,
  FiShield,
  FiTarget,
  FiZap,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { PRODUCTS } from "@/app/data/products";
import { useWishlist } from "@/app/hooks/useWishlist";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { customerApi, type NutritionGoals as NutritionGoalValues } from "@/lib/api/customer";

const goals = [
  {
    name: "Build Muscle",
    detail: "Increase lean muscle mass and strength",
    icon: FiActivity,
    tone: "green",
  },
  {
    name: "Lose Weight",
    detail: "Support fat loss and achieve a lean body",
    icon: FiTarget,
    tone: "orange",
  },
  {
    name: "Improve Energy",
    detail: "Boost daily energy and reduce fatigue",
    icon: FiZap,
    tone: "cyan",
  },
  {
    name: "Immunity Support",
    detail: "Strengthen immunity and overall wellness",
    icon: FiShield,
    tone: "purple",
  },
  {
    name: "Gut Health",
    detail: "Improve digestion and gut balance",
    icon: FiHeart,
    tone: "pink",
  },
  {
    name: "Improve Performance",
    detail: "Enhance workout performance & stamina",
    icon: FiAward,
    tone: "blue",
  },
];
const recommendations = [1, 2, 3, 4, 5, 6].flatMap((id) => {
  const product = PRODUCTS.find((item) => item.id === id);
  return product ? [product] : [];
});
const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const overview: { icon: IconType; label: string; value: string }[] = [
  { icon: FiTarget, label: "Primary Goal", value: "" },
  { icon: FiCalendar, label: "Target Timeline", value: "Not set" },
  { icon: FiCheck, label: "Goal Status", value: "Not set" },
  { icon: FiBarChart2, label: "Progress", value: "Not tracked" },
];
const emptyGoals: NutritionGoalValues = {
  goals: [],
  activityLevel: null,
  workoutType: null,
  dietPreference: null,
  ageRange: null,
  gender: null,
  dailyProtein: null,
  focusAreas: [],
};
type NutritionField = Exclude<keyof NutritionGoalValues, "goals" | "focusAreas">;

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-[9px] font-medium text-slate-soft">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function NutritionGoalsPage() {
  const [goalValues, setGoalValues] = useState<NutritionGoalValues>(emptyGoals);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const { isWishlisted, toggleWishlist } = useWishlist();
  const selectedGoals = goalValues.goals;
  useEffect(() => {
    let active = true;
    customerApi.nutritionGoals().then(({ goals: result }) => {
      if (active) setGoalValues(result);
    }).catch((cause) => {
      if (active) setError(cause instanceof Error ? cause.message : "Unable to load your goals. Sign in and try again.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const toggleGoal = (name: string) => {
    setSaved(false);
    setGoalValues((current) => ({
      ...current,
      goals: current.goals.includes(name)
        ? current.goals.filter((goal) => goal !== name)
        : current.goals.length < 2 ? [...current.goals, name] : current.goals,
    }));
  };
  const saveGoals = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const result = await customerApi.updateNutritionGoals(goalValues);
      setGoalValues(result.goals);
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save your goals. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const updateField = (field: NutritionField, value: string | null) => {
    setSaved(false);
    setGoalValues((current) => ({ ...current, [field]: value }));
  };
  const toggleFocusArea = (item: string) => {
    const areas = goalValues.focusAreas.includes(item)
      ? goalValues.focusAreas.filter((area) => area !== item)
      : [...goalValues.focusAreas, item];
    setSaved(false);
    setGoalValues((current) => ({ ...current, focusAreas: areas }));
  };

  return (
    <section className="bg-[#fbfcfe] py-7 text-navy">
      <div className="text-[10px] text-slate-soft">
        Home <span className="mx-2">›</span> My Account{" "}
        <span className="mx-2">›</span>{" "}
        <span className="text-navy">Nutrition Goals</span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight">
            Nutrition Goals
          </h1>
          <p className="mt-1 text-xs text-slate-soft">
            Set your goals and get personalised product recommendations.
          </p>
        </div>
        <button
          type="button"
          className="hidden items-center gap-2 rounded border border-[#94a3b8] px-3 py-2 text-[10px] font-bold sm:flex"
        >
          <FiBookOpen /> How it works
        </button>
      </div>
      {loading && <p role="status" className="mt-3 text-xs text-slate-soft">Loading saved goals...</p>}
      {error && <p role="alert" className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error} {error.includes("Unauthorized") && <Link className="font-bold underline" href="/login">Sign in</Link>}</p>}
      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_235px]">
        <div className="min-w-0">
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-extrabold">My Goals Overview</h2>
                <p className="mt-1 text-[8px] text-slate-soft">
                  Your current nutrition plan at a glance
                </p>
              </div>
              <span className="text-[8px] text-slate-soft">
                {saved ? "Saved just now" : "Personal progress tracking is not configured"}{" "}
                <button
                  type="button"
                  className="ml-2 rounded border border-[#bdc8d6] px-2 py-1 font-bold text-navy"
                >
                  <FiEdit2 className="mr-1 inline" /> Edit Goals
                </button>
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {overview.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 border-r border-line last:border-0"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-soft text-green-600">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-[8px] text-slate-soft">{label}</p>
                    <p className="mt-1 text-[10px] font-extrabold">
                      {label === "Primary Goal"
                        ? (selectedGoals[0] ?? "Choose a goal")
                        : value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm">
            <div>
              <h2 className="text-xs font-extrabold">My Nutrition Goals</h2>
              <p className="mt-1 text-[9px] text-slate-soft">
                Select your primary goal. You can choose up to 2 goals.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
              {goals.map(({ name, detail, icon: Icon, tone }) => {
                const active = selectedGoals.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    disabled={loading}
                    onClick={() => toggleGoal(name)}
                    className={`relative min-h-[109px] rounded-md border p-3 text-center transition ${active ? "border-green-500 bg-[#f7fcf8]" : "border-[#e8edf2] hover:border-green-300"}`}
                  >
                    <span
                      className={`mx-auto flex size-9 items-center justify-center rounded-full ${tone === "green" ? "bg-green-soft text-green-600" : tone === "orange" ? "bg-orange-50 text-orange-500" : tone === "purple" ? "bg-purple-50 text-purple-500" : tone === "pink" ? "bg-pink-50 text-pink-500" : tone === "blue" ? "bg-blue-50 text-blue-500" : "bg-cyan-50 text-cyan-500"}`}
                    >
                      <Icon size={19} />
                    </span>
                    <p className="mt-2 text-[10px] font-extrabold">{name}</p>
                    <p className="mt-1 text-[8px] leading-3 text-slate-soft">
                      {detail}
                    </p>
                    {active ? (
                      <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-green-600 text-white">
                        <FiCheck size={10} />
                      </span>
                    ) : (
                      <FiCircle
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[#b7c1cf]"
                        size={13}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <h2 className="text-xs font-extrabold">
                Lifestyle &amp; Preferences
              </h2>
              <p className="mt-1 text-[9px] text-slate-soft">
                Help us personalise recommendations for you.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                {[
                  { label: "Activity Level", field: "activityLevel", option: "Moderately Active" },
                  { label: "Workout Type (Optional)", field: "workoutType", option: "Strength Training" },
                  { label: "Diet Preference", field: "dietPreference", option: "Vegetarian" },
                  { label: "Age", field: "ageRange", option: "23-30" },
                  { label: "Gender", field: "gender", option: "Male" },
                  { label: "Daily Protein (Approx.)", field: "dailyProtein", option: "60-80g" },
                ].map(({ label, field, option }) => (
                  <Field key={field} label={label}>
                    <AnimatedSelect
                      value={goalValues[field as NutritionField] ?? ""}
                      onChange={(event) => updateField(field as NutritionField, event.target.value || null)}
                      size="sm"
                      disabled={loading}
                      options={[{ value: "", label: "Not set" }, { value: option, label: option }, { value: "Other", label: "Other" }]}
                    />
                  </Field>
                ))}
              </div>
              <p className="mt-4 text-[9px] font-bold">
                Health Focus Areas{" "}
                <span className="font-normal text-slate-soft">
                  (Select all that apply)
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "Strength & Recovery",
                  "Weight Management",
                  "Better Sleep",
                  "Joint Support",
                  "Heart Health",
                  "Skin & Hair",
                  "Stress Support",
                ].map((item) => (
                  <label
                    key={item}
                    className={`flex items-center gap-1 rounded border px-2 py-1.5 text-[8px] ${goalValues.focusAreas.includes(item) ? "border-green-300 bg-green-soft text-green-600" : "border-[#e8edf2] text-slate-soft"}`}
                  >
                    <input
                      type="checkbox"
                      checked={goalValues.focusAreas.includes(item)}
                      disabled={loading}
                      onChange={() => toggleFocusArea(item)}
                      className="accent-green-600"
                    />
                    {item}
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => void saveGoals()}
                disabled={loading || saving}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-green-600 py-2 text-[9px] font-bold text-white hover:bg-green-700 disabled:opacity-60"
              >
                <FiCheck />{" "}
                {saving ? "Saving Goals..." : saved ? "Goals Saved" : "Save Goals & Get Recommendations"}
              </button>
            </div>
          </div>
        </div>
        <aside className="grid content-start gap-4">
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Goal Progress</h2>
            <div className="mt-4 flex items-center gap-3">
              <div
                className="flex size-16 items-center justify-center rounded-full"
                style={{ background: "conic-gradient(#138a4b 0 0%, #e8f0eb 0% 100%)" }}
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-green-600">
                  --
                </span>
              </div>
              <div>
                <p className="text-[10px] font-extrabold">Progress not tracked</p>
                <p className="mt-1 text-[8px] text-slate-soft">
                  Saved goals do not include a progress history.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 border-t border-line pt-4 text-[8px]">
              <p className="text-[8px] leading-4 text-slate-soft">Progress milestones will appear here when progress tracking is available.</p>
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded border border-green-500 py-2 text-[9px] font-bold text-green-600"
            >
              View Progress Details
            </button>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Personalised For You</h2>
            <p className="mt-1 text-[8px] leading-3 text-slate-soft">
              Based on your goals and preferences, we recommend these food
              categories.
            </p>
            {[
              "Whey Proteins",
              "Mass Gainers",
              "Pre-Workout",
              "Creatine",
              "Protein Bars",
            ].map((item) => (
              <Link
                key={item}
                href="/shop"
                className="mt-3 flex items-center gap-2 text-[9px] font-bold"
              >
                <FiLock className="text-slate-soft" size={12} />
                {item}
                <FiChevronRight className="ml-auto" />
              </Link>
            ))}
            <Link
              href="/shop"
              className="mt-4 block text-[9px] font-bold text-green-600"
            >
              View All Recommended <FiArrowRight className="ml-1 inline" />
            </Link>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Nutrition Tips</h2>
            <div className="mt-3 flex gap-2">
              <span className="text-xl">💡</span>
              <p className="text-[9px] leading-4 text-slate-soft">
                Consistency is key!
                <br />
                Small daily steps lead
                <br />
                to big results.
                <br />
                <span className="text-[8px]">- TheGrowthHealth Team</span>
              </p>
            </div>
            <Link
              href="/blog"
              className="mt-3 block rounded border border-green-500 py-2 text-center text-[9px] font-bold text-green-600"
            >
              View All Tips
            </Link>
          </div>
        </aside>
      </div>
      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-extrabold">
              Recommended for Your Goals
            </h2>
            <p className="mt-1 text-[9px] text-slate-soft">
              Products handpicked to help you achieve your goals faster.
            </p>
          </div>
          <Link href="/shop" className="text-[9px] font-bold text-green-600">
            View All Recommended <FiArrowRight className="inline" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="relative rounded-md border border-line bg-white p-2 shadow-sm"
            >
              <button
                type="button"
                onClick={() => void toggleWishlist(product.id)}
                aria-label={`Wishlist ${product.name}`}
                className="absolute right-2 top-2 text-slate-soft"
              >
                <FiHeart
                  size={13}
                  fill={isWishlisted(product.id) ? "currentColor" : "none"}
                />
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="mx-auto h-20 object-contain"
              />
              <p className="truncate text-[9px] font-bold">{product.name}</p>
              <p className="mt-1 truncate text-[8px] text-slate-soft">
                {product.description}
              </p>
              <p className="mt-1 text-[10px] font-extrabold">
                {money(product.price)}
              </p>
              <p className="text-[8px] text-slate-soft line-through">
                {money(product.mrp ?? 0)}
              </p>
              <AddToCartButton productId={product.id} className="mt-2 w-full rounded border border-[#bdc8d6] py-1.5 text-[8px] font-bold hover:border-green-500 hover:text-green-600" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
