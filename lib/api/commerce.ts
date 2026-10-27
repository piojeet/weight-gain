import { apiFetch } from "@/lib/api/client";
import type { Product } from "@/app/types/shop";

export type CommerceProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string | null;
  images?: Array<{ id?: string; url?: string; isPrimary?: boolean } | string>;
  categorySlug: string | null;
  categoryLabel: string | null;
  categoryId?: string | null;
  categoryRootId?: string | null;
  subCategoryId?: string | null;
  subCategorySlug?: string | null;
  subCategoryLabel?: string | null;
  goalSlug: string | null;
  goalLabel: string | null;
  dietaryPreferences: string[];
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
  details?: { overview: string; benefits: string[]; features: string[]; ingredients: string[]; usage: string[]; faqs: { question: string; answer: string }[]; reviews: { name: string; comment: string; date: string; rating: number }[] };
  variants?: Array<{ id: string; attributes: Record<string, unknown>; priceOverride: number | null; stock: number }>;
};

export type CartResponse = { id: string; items: Array<{ id: string; productId: string; variantId: string | null; quantity: number; product: CommerceProduct; variant: CommerceProduct["variants"] extends Array<infer T> ? T | null : null; unitPrice: number; subtotal: number; available: boolean }>; subtotal: number };
export type ReviewResponse = { id: string; productId: string; rating: number; title?: string | null; comment: string; status: string; verified: boolean; helpfulVotes: number; unhelpfulVotes: number; adminReply?: string | null; createdAt: string; product?: CommerceProduct };
export type PublicCheckoutSettings = {
  steps: Array<{ id: string; label: string; enabled: boolean }>;
  fields: Array<{ id: string; label: string; enabled: boolean }>;
  payments: Array<{ id: string; label: string; icon: string; enabled: boolean }>;
  razorpayEnabled: boolean;
  guestCheckout: boolean;
  checkoutType: "Multi Step" | "One Page";
  phoneRequired: boolean;
  companyField: boolean;
  autocomplete: boolean;
};
export type OrderTrackingResponse = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: Array<{ id: string; nameSnapshot: string; quantity: number }>;
  shipment: {
    provider: string;
    awb: string | null;
    courier: string | null;
    status: string;
    estimatedDelivery: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    events: Array<{ status: string; description: string | null; location: string | null; occurredAt: string }>;
  } | null;
};
export type CommunityReviewResponse = {
  summary: {
    averageRating: number;
    totalReviews: number;
    distribution: Array<{ stars: number; percent: number }>;
  };
  reviews: Array<{
    id: string;
    reviewerName: string;
    avatar: string | null;
    rating: number;
    text: string;
    createdAt: string;
    verified: boolean;
    productName: string;
    productSlug: string;
  }>;
};
export type CouponResponse = { id: string; code: string; name: string; description?: string | null; discountType: string; discountValue: number; applicableTo?: string; minOrderValue: number; validFrom: string; validTo: string; status: string; usageCount: number; totalDiscountGiven: number; bucket?: 'available' | 'used' | 'expired' | 'scheduled' };
export type UserCouponsResponse = {
  coupons: CouponResponse[];
  summary: { totalSavings: number; thisMonthSavings: number; availableCouponCount: number };
};
export type BannerResponse = { id: string; title: string; subtitle?: string | null; image: string; linkUrl?: string | null; type: string; location: string; priorityOrder: number; impressions: number; clicks: number; ctr: number; status: string };
export type ConversationResponse = { id: string; subject: string; priority: string; status: string; channel: string; preview: string; unreadCount: number; lastActivityAt: string; messages: Array<{ id: string; senderType: string; text: string; createdAt: string; seenAt?: string | null }> };
export type BestSellerProduct = CommerceProduct & { totalSold?: number; latestSaleAt?: string };
export type DietaryFacet = { slug: string; label: string; count: number };
export type CategoryFacet = DietaryFacet & { image: string | null };
export type SubCategoryFacet = DietaryFacet & { parentSlug: string };
export type CommerceFacets = {
  allProductsCount: number;
  categories: CategoryFacet[];
  subCategories: SubCategoryFacet[];
  goals: DietaryFacet[];
  dietaryPreferences: DietaryFacet[];
  ratings: Array<{ value: number; count: number }>;
  inStockCount: number;
};

export function normalizeCommerceProduct(product: CommerceProduct): Product {
  const images = (product.images ?? [])
    .map((image) => typeof image === "string" ? image : image.url ?? "")
    .filter(Boolean);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description ?? "",
    image: product.image ?? images[0] ?? "/categories/mass-gainer.jpg",
    images,
    categorySlug: product.categorySlug ?? null,
    categoryLabel: product.categoryLabel ?? null,
    categoryId: product.categoryId ?? null,
    categoryRootId: product.categoryRootId ?? null,
    subCategoryId: product.subCategoryId ?? null,
    subCategorySlug: product.subCategorySlug ?? null,
    subCategoryLabel: product.subCategoryLabel ?? null,
    goalSlug: product.goalSlug ?? null,
    goalLabel: product.goalLabel ?? null,
    dietaryPreferences: product.dietaryPreferences ?? [],
    badge: product.badge ?? null,
    stats: product.stats ?? [],
    rating: product.rating ?? 0,
    reviews: product.reviews ?? 0,
    price: product.price ?? 0,
    mrp: product.mrp ?? null,
    discountPercent: product.discountPercent ?? null,
    dietary: product.dietaryPreferences ?? product.dietary ?? [],
    inStock: product.inStock ?? false,
    createdAt: product.createdAt ?? new Date().toISOString(),
    variants: product.variants,
    details: product.details ?? {
      overview: product.description ?? "",
      benefits: [],
      features: [],
      ingredients: [],
      usage: [],
      faqs: [],
      reviews: [],
    },
  };
}

export const commerceApi = {
  products: (query = "", signal?: AbortSignal) => apiFetch<{ products: CommerceProduct[]; dietaryPreferences: DietaryFacet[]; facets: CommerceFacets; pagination: { page: number; pageSize: number; total: number; pageCount: number } }>(`/api/products${query}`, { signal }),
  bestSellers: (limit = 4) => apiFetch<{ products: BestSellerProduct[] }>(`/api/products/best-sellers?limit=${encodeURIComponent(String(limit))}`),
  product: (slug: string) => apiFetch<{ product: CommerceProduct; related: CommerceProduct[] }>(`/api/products/${encodeURIComponent(slug)}`),
  categories: () => apiFetch<{ categories: Array<{ id: string; name: string; slug: string; parentId: string | null }> }>("/api/categories"),
  shippingMethods: () => apiFetch<{ shippingMethods: Array<{ id: string; name: string; type: string; config: Record<string, unknown>; deliveryTime: string }> }>("/api/shipping-methods"),
  checkoutSettings: () => apiFetch<{ settings: PublicCheckoutSettings }>("/api/checkout/settings"),
  communityReviews: () => apiFetch<CommunityReviewResponse>("/api/reviews/community"),
  cart: () => apiFetch<CartResponse>("/api/cart"),
  addCartItem: (body: { productId: string; variantId?: string; quantity: number }) => apiFetch<CartResponse>("/api/cart/items", { method: "POST", body: JSON.stringify(body) }),
  updateCartItem: (id: string, quantity: number) => apiFetch<CartResponse>(`/api/cart/items/${id}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
  removeCartItem: (id: string) => apiFetch<CartResponse>(`/api/cart/items/${id}`, { method: "DELETE" }),
  clearCart: () => apiFetch<CartResponse>("/api/cart", { method: "DELETE" }),
  checkout: (body: Record<string, unknown>, idempotencyKey: string) => apiFetch<Record<string, unknown>>("/api/checkout", { method: "POST", headers: { "Idempotency-Key": idempotencyKey }, body: JSON.stringify(body) }),
  verifyPayment: (orderId: string, payment: Record<string, string>) => apiFetch<{ verified: boolean; paymentStatus: string }>(`/api/orders/${encodeURIComponent(orderId)}/payment/verify`, { method: "POST", body: JSON.stringify(payment) }),
  validateCoupon: (code: string, shippingMethodId?: string) => apiFetch<{ valid: boolean; code: string; discountAmount: number; shippingAmount: number; subtotal: number; totalAmount: number }>("/api/coupons/validate", { method: "POST", body: JSON.stringify({ code, shippingMethodId }) }),
  productReviews: (id: string, query = "") => apiFetch<{ reviews: ReviewResponse[]; pagination: { page: number; pageCount: number; total: number } }>(`/api/products/${encodeURIComponent(id)}/reviews${query}`),
  createReview: (id: string, body: Record<string, unknown>) => apiFetch<{ review: ReviewResponse }>(`/api/products/${encodeURIComponent(id)}/reviews`, { method: "POST", body: JSON.stringify(body) }),
  userReviews: () => apiFetch<{ reviews: ReviewResponse[] }>("/api/user/reviews"),
  updateReview: (id: string, body: Record<string, unknown>) => apiFetch<{ review: ReviewResponse }>(`/api/reviews/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteReview: (id: string) => apiFetch<{ deleted: boolean }>(`/api/reviews/${id}`, { method: "DELETE" }),
  voteReview: (id: string, vote: "helpful" | "unhelpful") => apiFetch<{ voted: string; helpfulVotes: number; unhelpfulVotes: number }>(`/api/reviews/${id}/vote`, { method: "POST", body: JSON.stringify({ vote }) }),
  reportReview: (id: string) => apiFetch<{ review: ReviewResponse }>(`/api/reviews/${encodeURIComponent(id)}/report`, { method: "POST" }),
  userCoupons: () => apiFetch<UserCouponsResponse>("/api/user/coupons"),
  banners: (location = "homepage") => apiFetch<{ banners: BannerResponse[] }>(`/api/banners?location=${encodeURIComponent(location)}`),
  bannerImpression: (id: string) => apiFetch<{ tracked: boolean }>(`/api/banners/${id}/impression`, { method: "POST" }),
  bannerClick: (id: string) => apiFetch<{ tracked: boolean }>(`/api/banners/${id}/click`, { method: "POST" }),
  conversations: () => apiFetch<{ conversations: ConversationResponse[] }>("/api/conversations"),
  conversation: (id: string) => apiFetch<{ conversation: ConversationResponse }>(`/api/conversations/${id}`),
  createConversation: (body: Record<string, unknown>) => apiFetch<{ conversation: ConversationResponse }>("/api/conversations", { method: "POST", body: JSON.stringify(body) }),
  sendConversationMessage: (id: string, text: string) => apiFetch<{ conversation: ConversationResponse }>(`/api/conversations/${id}/messages`, { method: "POST", body: JSON.stringify({ text }) }),
  addresses: () => apiFetch<{ addresses: Array<Record<string, unknown>> }>("/api/addresses"),
  createAddress: (body: Record<string, unknown>) => apiFetch<{ address: Record<string, unknown> }>("/api/addresses", { method: "POST", body: JSON.stringify(body) }),  updateAddress: (id: string, body: Record<string, unknown>) => apiFetch<{ address: Record<string, unknown> }>(`/api/addresses/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAddress: (id: string) => apiFetch<{ deleted: boolean }>(`/api/addresses/${encodeURIComponent(id)}`, { method: 'DELETE' }),  orders: () => apiFetch<{ orders: Array<Record<string, unknown>>; pagination: { page: number; pageSize: number; total: number; pageCount: number } }>("/api/orders"),
  order: (id: string) => apiFetch<Record<string, unknown>>(`/api/orders/${encodeURIComponent(id)}`),
  trackOrder: (id: string) => apiFetch<OrderTrackingResponse>(`/api/orders/${encodeURIComponent(id)}/tracking`),
  wishlist: () => apiFetch<{ productIds: string[] }>("/api/wishlist"),
  addWishlist: (productId: string) => apiFetch<{ productIds: string[] }>("/api/wishlist", { method: "POST", body: JSON.stringify({ productId }) }),
  removeWishlist: (productId?: string) => apiFetch<{ productIds: string[] }>("/api/wishlist", { method: "DELETE", body: productId ? JSON.stringify({ productId }) : undefined }),
};

export async function downloadCustomerInvoice(orderId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? "/v1"}/api/orders/${encodeURIComponent(orderId)}/invoice`, { credentials: "include" });
  if (!response.ok) throw new Error("Unable to download invoice");
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = `${orderId}-invoice.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
