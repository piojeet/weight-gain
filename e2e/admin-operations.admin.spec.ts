import { expect, test, type Page } from "@playwright/test";
import { adminUser, installProviderBlock, type MockRequest, type MockReply } from "./fixtures";

const couponRow = (id: string, code: string) => ({
  id,
  code,
  name: `${code} campaign`,
  description: "Browser test fixture",
  discountType: "percentage",
  discountValue: 10,
  applicableTo: "all",
  applicableProductIds: [],
  applicableCategoryIds: [],
  minOrderValue: 0,
  usageLimit: null,
  perUserLimit: 1,
  validFrom: "2025-01-01T00:00:00.000Z",
  validTo: "2030-01-01T00:00:00.000Z",
  status: "active",
  usageCount: 0,
  totalDiscountGiven: 0,
});

async function installAdminApiMock(
  page: Page,
  resolve: (request: MockRequest) => MockReply | Promise<MockReply>,
) {
  const requests: MockRequest[] = [];
  await page.route("**/v1/api/**", async (route) => {
    let body: Record<string, unknown> | null = null;
    try {
      body = route.request().postDataJSON() as Record<string, unknown> | null;
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
    await route.fulfill({
      status,
      headers: reply.headers,
      contentType: "application/json",
      body: JSON.stringify(status >= 200 && status < 300
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

test.beforeEach(async ({ page }) => {
  await installProviderBlock(page);
});

test("admin login and protected route use server authentication", async ({ page }) => {
  const requests = await installAdminApiMock(page, ({ path, method }) => {
    if (path === "/api/auth/me") return { status: 401, message: "Not signed in", errorCode: "UNAUTHORIZED" };
    if (path === "/api/auth/refresh") return { status: 401, message: "Session expired", errorCode: "UNAUTHORIZED" };
    if (path === "/api/auth/login" && method === "POST") {
      return {
        data: { user: adminUser, csrfToken: "mock-csrf" },
        headers: { "set-cookie": "accessToken=e2e-admin; Path=/; SameSite=Lax" },
      };
    }
    return { status: 404, message: `Unmocked Admin API request: ${method} ${path}` };
  });

  await page.goto("/orders");
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel("Email").fill(adminUser.email);
  await page.locator('input[placeholder="Enter your password"]').fill("test-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3102/");
  expect(requests.some((request) => request.path === "/api/auth/login" && request.method === "POST")).toBeTruthy();
});

test("admin coupon create/edit and bulk partial failure are reported accurately", async ({ page }) => {
  let rows = [couponRow("coupon-1", "FIRST10"), couponRow("coupon-2", "SECOND10")];
  const requests = await installAdminApiMock(page, ({ path, method, body }) => {
    if (path === "/api/auth/me") return { data: { user: adminUser } };
    if (path === "/api/admin/coupons" && method === "GET") return { data: { coupons: rows } };
    if (path === "/api/admin/coupons" && method === "POST") {
      const created = { ...couponRow("coupon-new", String(body?.code ?? "NEW10")), ...(body ?? {}) };
      rows = [created, ...rows];
      return { data: { coupon: created } };
    }
    if (path === "/api/admin/coupons/coupon-new" && method === "PUT") {
      const current = rows.find((row) => row.id === "coupon-new") ?? couponRow("coupon-new", "NEW10");
      const edited = { ...current, ...(body ?? {}) };
      rows = rows.map((row) => row.id === "coupon-new" ? edited : row);
      return { data: { coupon: edited } };
    }
    if (path === "/api/admin/coupons/coupon-1" && method === "PUT") {
      const current = rows.find((row) => row.id === "coupon-1") ?? couponRow("coupon-1", "FIRST10");
      const edited = { ...current, ...(body ?? {}) };
      rows = rows.map((row) => row.id === "coupon-1" ? edited : row);
      return { data: { coupon: edited } };
    }
    if (path === "/api/admin/coupons/coupon-2" && method === "PUT") {
      return { status: 503, message: "Coupon update unavailable" };
    }
    return { status: 404, message: `Unmocked Admin API request: ${method} ${path}` };
  });

  await page.goto("/coupons");
  await expect(page.getByRole("button", { name: "FIRST10", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Create Coupon" }).click();
  await page.locator("label").filter({ hasText: "Coupon Code" }).locator("input").fill("NEW10");
  await page.getByLabel("Coupon Name").fill("New campaign");
  await page.getByLabel("Description").fill("New test campaign");
  await page.locator("label").filter({ hasText: "Valid From" }).locator("input").fill("2025-01-01");
  await page.locator("label").filter({ hasText: "Valid To" }).locator("input").fill("2030-01-01");
  await page.getByRole("button", { name: "Create Coupon" }).last().click();
  await expect(page.getByRole("button", { name: "NEW10", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Edit NEW10" }).click();
  await page.getByLabel("Coupon Name").fill("Edited test campaign");
  await page.getByRole("button", { name: "Save Changes" }).click();
  expect(requests.some((request) => request.path === "/api/admin/coupons" && request.method === "POST")).toBeTruthy();
  expect(requests.some((request) => request.path === "/api/admin/coupons/coupon-new" && request.method === "PUT")).toBeTruthy();

  await page.locator("tr").filter({ hasText: "FIRST10" }).locator('input[type="checkbox"]').check();
  await page.locator("tr").filter({ hasText: "SECOND10" }).locator('input[type="checkbox"]').check();
  await page.getByRole("button", { name: /Bulk Actions/ }).click();
  await page.getByRole("button", { name: "Activate Selected" }).click();
  await expect(page.getByText(/1 of 2 coupons were updated\. Failed: SECOND10:/)).toBeVisible();
  expect(requests.filter((request) => request.path.startsWith("/api/admin/coupons/") && request.method === "PUT").length).toBeGreaterThanOrEqual(3);
});

test("admin order payment and shipment actions stay behind mocked API routes", async ({ page }) => {
  const order = {
    id: "order-admin-e2e",
    orderNumber: "ORD-ADMIN-E2E",
    status: "processing",
    guestEmail: "customer@example.test",
    placedAt: "2025-01-01T00:00:00.000Z",
    paymentStatus: "cod",
    paymentMethod: "cod",
    totalAmount: 250,
    subtotal: 200,
    shippingAmount: 50,
    discountAmount: 0,
    taxAmount: 0,
    shippingAddress: { fullName: "E2E Customer", phone: "9876543210", addressLine1: "1 Test Street", city: "Delhi", state: "Delhi", pincode: "110001", country: "India" },
    items: [{ productId: "product-protein-1", nameSnapshot: "E2E Whey Protein", quantity: 1, unitPrice: 200, subtotal: 200 }],
  };
  let createdShipment: Record<string, unknown> | null = null;
  const requests = await installAdminApiMock(page, ({ path, method }) => {
    if (path === "/api/auth/me") return { data: { user: adminUser } };
    if (path === "/api/admin/orders" && method === "GET") return { data: { orders: [order] } };
    if (path === `/api/admin/orders/${order.id}` && method === "GET") return { data: order };
    if (path === `/api/admin/orders/${order.id}/financial` && method === "GET") return { data: { id: order.id, paymentStatus: "cod", paymentMethod: "cod", paymentAttempts: [] } };
    if (path === `/api/admin/orders/${order.id}/shipment` && method === "GET") return { data: { shipment: createdShipment } };
    if (path === `/api/admin/orders/${order.id}/payment/refresh` && method === "POST") return { data: { paymentStatus: "cod", attemptStatus: null } };
    if (path === `/api/admin/orders/${order.id}/shipment` && method === "POST") {
      createdShipment = { id: "shipment-e2e", provider: "shiprocket", providerOrderId: null, providerShipmentId: "mock-shipment", awb: null, courier: null, status: "created", packageLengthCm: 20, packageBreadthCm: 20, packageHeightCm: 20, packageWeightGrams: 500, events: [] };
      return { data: { shipment: createdShipment } };
    }
    return { status: 404, message: `Unmocked Admin API request: ${method} ${path}` };
  });

  await page.goto("/orders");
  await expect(page.getByText("ORD-ADMIN-E2E")).toBeVisible();
  await page.getByRole("button", { name: /View order/i }).click();
  await expect(page.getByText("Payment Information")).toBeVisible();
  await page.getByRole("button", { name: "Refresh" }).first().click();
  await page.getByLabel("lengthCm").fill("20");
  await page.getByLabel("breadthCm").fill("20");
  await page.getByLabel("heightCm").fill("20");
  await page.getByLabel("weightGrams").fill("500");
  await page.getByRole("button", { name: "Create Shiprocket shipment" }).click();
  await expect(page.getByText(/Status: created/)).toBeVisible();
  expect(requests.some((request) => request.path.endsWith("/payment/refresh") && request.method === "POST")).toBeTruthy();
  expect(requests.some((request) => request.path.endsWith("/shipment") && request.method === "POST")).toBeTruthy();
});
