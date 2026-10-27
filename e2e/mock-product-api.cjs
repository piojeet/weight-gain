const product = {
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

async function startServer() {
  const { createServer } = await import("node:http");
  const server = createServer((request, response) => {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    if (request.url === "/health") {
      response.writeHead(200).end(JSON.stringify({ ok: true }));
      return;
    }

    if (request.method === "GET" && request.url?.startsWith("/v1/api/products/test-protein")) {
      response.writeHead(200).end(JSON.stringify({
        success: true,
        data: { product, related: [] },
      }));
      return;
    }

    response.writeHead(404).end(JSON.stringify({
      success: false,
      message: "No test fixture for this server-side request",
    }));
  });

  server.listen(3101, "127.0.0.1");
}

void startServer().catch((error) => {
  console.error("Could not start the local product fixture server", error);
  process.exitCode = 1;
});
