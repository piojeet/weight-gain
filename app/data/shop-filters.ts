import {
  LuLayoutGrid,
  LuPersonStanding,
  LuDumbbell,
  LuLeaf,
  LuFlaskConical,
  LuShieldCheck,
} from "react-icons/lu";
import {
  CategoryOption,
  DietaryOption,
  Goal,
  RatingOption,
} from "@/app/types/shop";

export const GOALS: Goal[] = [
  { slug: "all", label: "All Products", count: 120, icon: LuLayoutGrid },
  {
    slug: "weight-gain",
    label: "Healthy Weight Gain",
    count: 24,
    icon: LuPersonStanding,
  },
  {
    slug: "muscle-support",
    label: "Build Muscle",
    count: 28,
    icon: LuDumbbell,
  },
  {
    slug: "daily-nutrition",
    label: "Daily Nutrition",
    count: 32,
    icon: LuLeaf,
  },
  { slug: "energy", label: "Protein Support", count: 22, icon: LuFlaskConical },
  {
    slug: "recovery",
    label: "Vitamins & Essentials",
    count: 18,
    icon: LuShieldCheck,
  },
];

export const CATEGORIES: CategoryOption[] = [
  {
    slug: "mass-builders",
    label: "Mass Builders",
    count: 28,
    image: "/categories/mass-gainer.jpg",
  },
  {
    slug: "protein",
    label: "Protein",
    count: 22,
    image: "/categories/mass-gainer.jpg",
  },
  {
    slug: "nutrition-essentials",
    label: "Nutrition Essentials",
    count: 18,
    image: "/categories/mass-gainer.jpg",
  },
  {
    slug: "vitamins",
    label: "Vitamins",
    count: 16,
    image: "/categories/mass-gainer.jpg",
  },
  {
    slug: "accessories",
    label: "Accessories",
    count: 12,
    image: "/categories/mass-gainer.jpg",
  },
];

export const DIETARY_OPTIONS: DietaryOption[] = [
  { slug: "vegetarian", label: "Vegetarian", count: 68 },
  { slug: "no-added-sugar", label: "No Added Sugar", count: 24 },
  { slug: "gluten-free", label: "Gluten Free", count: 16 },
  { slug: "lactose-free", label: "Lactose Free", count: 14 },
];

export const RATING_OPTIONS: RatingOption[] = [
  { value: 5, count: 80 },
  { value: 4, count: 46 },
  { value: 3, count: 18 },
];

export const PRICE_BOUNDS = { min: 399, max: 4999 };

export const SORT_LABELS: Record<string, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Top Rated",
  newest: "Newest",
};

export const PAGE_SIZE = 12;
