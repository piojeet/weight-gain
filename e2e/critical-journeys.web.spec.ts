import { expect, test } from "@playwright/test";
import {
  accountUser,
  cartWithProduct,
  installProviderBlock,
  installWebApiMock,
  webProduct,
} from "./fixtures";

const coupon = {
  id: "coupon-e2e",
  code: "SAVE10",
  name: "Ten percent off",
  description: "Test-only validated coupon",
  discountType: "percentage",
  discountValue: 10,
  applicableTo: "all",
  minOrderValue: 0,
  validFrom: "2025-01-01T00:00:00.000Z",
  validTo: "2030-01-01T00:00:00.000Z",
  status: "active",
  usageCount: 0,
  totalDiscountGiven: 0,
  bucket: "available",
};

test.beforeEach(async ({ page }) => {
  await installProviderBlock(page);
});

test("customer login works and protected account routes redirect anonymous users", async ({ page }) => {
  const requests = await installWebApiMock(page, ({ path, method }) => {
    if (path === "/api/auth/login" && method === "POST") {
      return {
        data: { user: accountUser },
        headers: { "set-cookie": "accessToken=e2e-token; Path=/; SameSite=Lax" },
      };
    }
    if (path === "/api/auth/me") return { data: { user: accountUser } };
    if (path === "/api/account/preferences") {
      return { data: { preferences: { language: "English", theme: "Dark" } } };
    }
    return { status: 404, message: `Unmocked Web API request: ${method} ${path}` };
  });

  await page.goto("/my-account/coupons");
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel("Email Address").fill(accountUser.email);
  await page.getByLabel("Password", { exact: true }).fill("test-password");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page).toHaveURL(/\/my-account\/dashboard/);
  expect(requests.some((request) => request.path === "/api/auth/login")).toBeTruthy();
});

test("login and cart render useful API errors without crashing on incomplete error bodies", async ({ page }) => {
  const pageErrors: string[] = [];
  let cartRequests = 0;
  let failCartRequest = false;
  let allowCartRetry = false;
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) {
      await route.abort("blockedbyclient");
      return;
    }
    const path = url.pathname;
    if (path.endsWith("/auth/me")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: { user: null } }) });
      return;
    }
    if (path.endsWith("/auth/login")) {
      await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false, message: "Internal server error" }) });
      return;
    }
    if (path.endsWith("/cart") && route.request().method() === "GET" && route.request().resourceType() !== "document") {
      cartRequests += 1;
      if (failCartRequest && !allowCartRetry) {
        await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false, message: "Internal server error", error: { code: "INTERNAL_ERROR", details: null } }) });
        return;
      }
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: { id: "cart-retry", items: [], subtotal: 0 } }) });
      return;
    }
    await route.continue();
  });

  await page.goto("/login");
  await page.getByLabel("Email Address").fill(accountUser.email);
  await page.getByLabel("Password", { exact: true }).fill("test-password");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.getByText("Internal server error (HTTP 500, ERROR)")).toBeVisible();

  failCartRequest = true;
  cartRequests = 0;
  await page.goto("/cart");
  await expect.poll(() => cartRequests).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { name: "Unable to load your cart" })).toBeVisible();
  await expect(page.locator("p[role='alert']")).toContainText("Internal server error (HTTP 500, INTERNAL_ERROR)");
  allowCartRetry = true;
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByRole("heading", { name: "Your Cart", exact: true })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("product search, details, and cart use API responses", async ({ page }) => {
  let cart: { id: string; items: ReturnType<typeof cartWithProduct>["items"]; subtotal: number } = {
    id: "cart-e2e",
    items: [],
    subtotal: 0,
  };
  const requests = await installWebApiMock(page, ({ path, method, body }) => {
    if (path === "/api/auth/me") return { data: { user: null } };
    if (path === "/api/products") {
      return {
        data: {
          products: [webProduct],
          dietaryPreferences: [],
          facets: { allProductsCount: 1, categories: [], subCategories: [], goals: [], dietaryPreferences: [], ratings: [], inStockCount: 1 },
          pagination: { page: 1, pageSize: 24, total: 1, pageCount: 1 },
        },
      };
    }
    if (path === "/api/cart" && method === "GET") return { data: cart };
    if (path === "/api/cart/items" && method === "POST") {
      cart = cartWithProduct(Number(body?.quantity ?? 1));
      return { data: cart };
    }
    if (path === `/api/products/${webProduct.id}/reviews`) {
      return { data: { reviews: [], pagination: { page: 1, pageCount: 1, total: 0 } } };
    }
    return { status: 404, message: `Unmocked Web API request: ${method} ${path}` };
  });

  await page.goto("/shop?search=protein");
  await expect(page.getByText(webProduct.name).first()).toBeVisible();
  expect(requests.some((request) => request.path === "/api/products")).toBeTruthy();

  await page.goto("/product/test-protein");
  await expect(page.getByRole("heading", { name: webProduct.name })).toBeVisible();
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByRole("button", { name: "Already in Cart" })).toBeVisible();
  expect(requests.some((request) => request.path === "/api/cart/items" && request.method === "POST")).toBeTruthy();
  await page.goto("/cart");
  await expect(page.getByText(webProduct.name).first()).toBeVisible();
  expect(requests.some((request) => request.path === "/api/cart/items" && request.method === "POST")).toBeTruthy();
});

test("coupon validation controls checkout totals and COD order confirmation", async ({ page, context }) => {
  await context.addCookies([{ name: "accessToken", value: "e2e-token", url: "http://127.0.0.1:3100" }]);
  let cart: { id: string; items: ReturnType<typeof cartWithProduct>["items"]; subtotal: number } = cartWithProduct();
  let orderSaved = false;
  const requests = await installWebApiMock(page, ({ path, method, body }) => {
    if (path === "/api/auth/me") return { data: { user: accountUser } };
    if (path === "/api/user/coupons") return { data: { coupons: [coupon], summary: { totalSavings: 120, thisMonthSavings: 40, availableCouponCount: 1 } } };
    if (path === "/api/products/best-sellers") return { data: { products: [webProduct] } };
    if (path === "/api/coupons/validate" && method === "POST") {
      if (body?.code !== "SAVE10") return { status: 400, message: "Coupon is invalid" };
      return { data: { valid: true, code: "SAVE10", discountAmount: 20, shippingAmount: body.shippingMethodId ? 50 : 0, subtotal: 200, totalAmount: body.shippingMethodId ? 230 : 180 } };
    }
    if (path === "/api/cart" && method === "GET") return { data: cart };
    if (path === "/api/shipping-methods") return { data: { shippingMethods: [{ id: "ship-standard", name: "Standard", type: "flat", config: { charge: 50 }, deliveryTime: "3-5 days" }] } };
    if (path === "/api/checkout/settings") {
      return {
        data: {
          settings: {
            steps: [],
            fields: [],
            payments: [{ id: "cod", label: "Cash on Delivery", icon: "cod", enabled: true }],
            razorpayEnabled: false,
            guestCheckout: true,
            checkoutType: "One Page",
            phoneRequired: true,
            companyField: false,
            autocomplete: false,
          },
        },
      };
    }
    if (path === "/api/checkout" && method === "POST") {
      orderSaved = true;
      cart = { id: "cart-e2e", items: [], subtotal: 0 };
      return { data: { id: "order-e2e", orderNumber: "ORD-E2E", payment: null } };
    }
    if (path === "/api/orders/order-e2e" && method === "GET" && orderSaved) {
      return { data: { id: "order-e2e", orderNumber: "ORD-E2E", status: "pending", paymentStatus: "cod", totalAmount: 230, items: [{ id: "item-e2e", nameSnapshot: webProduct.name, quantity: 1 }] } };
    }
    return { status: 404, message: `Unmocked Web API request: ${method} ${path}` };
  });

  await page.goto("/my-account/coupons");
  await page.getByRole("button", { name: /Apply at Checkout/ }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByText(/Coupon applied: ₹20 off/)).toBeVisible();
  await expect(page.getByText("₹230").first()).toBeVisible();

  await page.locator('input[name="guestEmail"]').fill("customer@example.test");
  await page.locator('input[name="phone"]').fill("9876543210");
  await page.locator('input[name="fullName"]').fill("E2E Customer");
  await page.locator('input[name="pincode"]').fill("110001");
  await page.locator('input[name="addressLine1"]').fill("1 Test Street");
  await page.locator('input[name="city"]').fill("Delhi");
  await page.getByRole("combobox", { name: "State *" }).click();
  await page.getByRole("option", { name: "Delhi" }).click();
  await page.getByRole("button", { name: "Place Order Securely" }).click();
  await expect(page).toHaveURL(/order-placed-successfully/);
  await expect(page.getByText("ORD-E2E")).toBeVisible();
  expect(orderSaved).toBeTruthy();
  expect(requests.some((request) => request.path === "/api/checkout" && request.method === "POST")).toBeTruthy();
  expect(requests.some((request) => request.path === "/api/coupons/validate" && request.body?.shippingMethodId === "ship-standard")).toBeTruthy();
});

test("failed account preference save rolls back and remains recoverable", async ({ page, context }) => {
  await context.addCookies([{ name: "accessToken", value: "e2e-token", url: "http://127.0.0.1:3100" }]);
  let saveRequests = 0;
  await installWebApiMock(page, ({ path, method }) => {
    if (path === "/api/auth/me") return { data: { user: accountUser } };
    if (path === "/api/user/account-preferences" && method === "GET") {
      return { data: { preferences: { language: "English", theme: "Dark" } } };
    }
    if (path === "/api/user/account-preferences" && method === "PUT") {
      saveRequests += 1;
      return saveRequests === 1
        ? { status: 503, message: "Preference save unavailable" }
        : { data: { preferences: { language: "English", theme: "Light" } } };
    }
    return { status: 404, message: `Unmocked Web API request: ${method} ${path}` };
  });

  await page.goto("/my-account");
  await expect(page.getByRole("button", { name: "Dark" })).toBeVisible();
  await page.getByRole("button", { name: "Light" }).click();
  await expect(page.getByText("Preference save unavailable")).toBeVisible();
  await expect(page.getByRole("button", { name: "Dark" })).toHaveClass(/bg-green-600/);
  await page.getByRole("button", { name: "Light" }).click();
  await expect(page.getByText("Language and theme preferences saved. Theme application remains unchanged.")).toBeVisible();
});

test("product review loading failure has retry, empty state, and rejects anonymous submission", async ({ page }) => {
  let reviewReads = 0;
  await installWebApiMock(page, ({ path, method }) => {
    if (path === "/api/auth/me") return { data: { user: null } };
    if (path === `/api/products/${webProduct.id}/reviews` && method === "GET") {
      reviewReads += 1;
      return reviewReads <= 2
        ? { status: 503, message: "Reviews temporarily unavailable" }
        : { data: { reviews: [], pagination: { page: 1, pageCount: 1, total: 0 } } };
    }
    if (path === `/api/products/${webProduct.id}/reviews` && method === "POST") {
      return { status: 401, message: "Sign in to submit a review", errorCode: "UNAUTHORIZED" };
    }
    return { status: 404, message: `Unmocked Web API request: ${method} ${path}` };
  });

  await page.goto("/product/test-protein");
  await expect(page.getByText("Reviews temporarily unavailable")).toBeVisible();
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByText("No approved reviews yet. Be the first to share your experience.")).toBeVisible();
  await page.getByPlaceholder("Share your experience").fill("Useful product.");
  await page.getByRole("button", { name: "Submit Review" }).click();
  await expect(page.getByText("Sign in to submit a review")).toBeVisible();
});
