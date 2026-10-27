import { IconType } from "react-icons";

export interface Product {
  id: string | number;
  slug: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  categorySlug: string | null;
  categoryLabel: string | null;
  categoryId?: string | null;
  categoryRootId?: string | null;
  subCategoryId?: string | null;
  subCategorySlug?: string | null;
  subCategoryLabel?: string | null;
  goalSlug: string | null;
  goalLabel?: string | null;
  dietaryPreferences?: string[];
  badge: "BESTSELLER" | "NEW" | "LAB TESTED" | null;
  stats: { label: string; value: string }[];
  rating: number;
  reviews: number;
  price: number;
  mrp: number | null;
  discountPercent: number | null;
  dietary: string[];
  inStock: boolean;
  createdAt: string;
  variants?: { id: string; attributes: Record<string, unknown>; priceOverride: number | null; stock: number }[];
  details: ProductDetailContent;
}

export interface ProductReview {
  name: string;
  comment: string;
  date: string;
  rating: number;
}

export interface ProductDetailContent {
  overview: string;
  benefits: string[];
  features: string[];
  ingredients: string[];
  usage: string[];
  faqs: { question: string; answer: string }[];
  reviews: ProductReview[];
}

export interface Goal {
  slug: string;
  label: string;
  count: number;
  icon: IconType;
}

export interface CategoryOption {
  slug: string;
  label: string;
  count: number;
  image: string;
}

export interface DietaryOption {
  slug: string;
  label: string;
  count: number;
}

export interface RatingOption {
  value: number; // minimum stars
  count: number;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";

export interface ShopFilters {
  categories: string[];
  subCategories: string[];
  goals: string[];
  dietary: string[];
  minRating: number | null;
  inStockOnly: boolean;
  priceMin: number;
  priceMax: number;
  search: string;
  sort: SortOption;
  page: number;
}
