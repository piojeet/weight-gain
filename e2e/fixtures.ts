import type { Page, Route } from "@playwright/test";

export const webProduct = {
  id: "product-protein-1",
  slug: "test-protein",
  name: "E2E Whey Protein",
  description: "Test-only product fixture",
  image: "/categories/mass-gainer.jpg",
  images: [],
  categorySlug: "protein",
  categoryLabel: "Protein",
  categoryId: null,
  categoryRootId: null,
  subCategoryId: null,
  goalSlug: "muscle-gain",
  goalLabel: "Muscle Gain",
  dietaryPreferences: [],
  badge: null,
  stats: [],
  rating: 0,
  reviews: 0,
  price: 200,
  mrp: 250,
  discountPercent: 20,
  dietary: [],
  inStock: true,
  createdAt: "2025-01-01T00:00:00.000Z",
  variants: [],
  details: {
    overview: "Test-only product fixture",
    benefits: [],
    features: [],
    ingredients: [],
    usage: [],
    faqs: [],
    reviews: [],
  },
};

export type MockRequest = {
  path: string;
  method: string;
  body: Record<string, unknown> | null;
};

export type MockReply = {
  status?: number;
  data?: unknown;
  message?: string;
  errorCode?: string;
  headers?: Record<string, string>;
};

export async function installProviderBlock(page: Page) {
  await page.route(/^https?:\/\//, async (route: Route) => {
    const host = new URL(route.request().url()).hostname;
    if (host === "127.0.0.1" || host === "localhost") {
      await route.continue();
      return;
    }
    await route.abort("blockedbyclient");
  });
}

export async function installWebApiMock(
  page: Page,
  resolve: (request: MockRequest) => MockReply | Promise<MockReply>,
) {
  const requests: MockRequest[] = [];
  await page.route("**/v1/api/**", async (route) => {
    const rawBody = route.request().postData();
    let body: Record<string, unknown> | null = null;
    try {
      body = rawBody ? JSON.parse(rawBody) as Record<string, unknown> : null;
    } catch {
      body = null;
    }
    const request = {
      path: new URL(route.request().url()).pathname.replace(/^\/v1/, ""),
      method: route.request().method(),
      body,
    };
    requests.push(request);
    const reply = await resolve(request);
    const status = reply.status ?? 200;
    const success = status >= 200 && status < 300;
    await route.fulfill({
      status,
      headers: reply.headers,
      contentType: "application/json",
      body: JSON.stringify(success
        ? { success: true, data: reply.data ?? {} }
        : {
            success: false,
            message: reply.message ?? "Mock request rejected",
            error: { code: reply.errorCode ?? "MOCK_ERROR", details: [] },
          }),
    });
  });
  return requests;
}

export const accountUser = {
  id: "user-e2e",
  fullName: "E2E Customer",
  email: "customer@example.test",
  role: "customer",
  adminRole: null,
};

export const adminUser = {
  id: "admin-e2e",
  fullName: "E2E Admin",
  email: "admin@example.test",
  role: "admin",
  adminRole: "super_admin",
};

export function cartWithProduct(quantity = 1) {
  return {
    id: "cart-e2e",
    items: [{
      id: "cart-item-e2e",
      productId: webProduct.id,
      variantId: null,
      quantity,
      product: webProduct,
      variant: null,
      unitPrice: webProduct.price,
      subtotal: webProduct.price * quantity,
      available: true,
    }],
    subtotal: webProduct.price * quantity,
  };
}
