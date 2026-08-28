import { NextResponse } from "next/server";
import { PRODUCTS } from "@/app/data/products";

const COOKIE_NAME = "wishlist-product-ids";
const MAX_AGE = 60 * 60 * 24 * 365;

function readWishlist(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const value = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

  if (!value) return [];

  try {
    const ids = JSON.parse(decodeURIComponent(value));
    if (!Array.isArray(ids)) return [];
    return ids.filter(
      (id): id is number =>
        typeof id === "number" && PRODUCTS.some((product) => product.id === id),
    );
  } catch {
    return [];
  }
}

function responseWithWishlist(request: Request, productIds: number[]) {
  const response = NextResponse.json({ productIds });
  response.cookies.set(COOKIE_NAME, encodeURIComponent(JSON.stringify(productIds)), {
    httpOnly: true,
    maxAge: MAX_AGE,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

function validProductIds(value: unknown) {
  if (!Array.isArray(value)) return null;
  const productIds = value.filter(
    (id): id is number =>
      typeof id === "number" && PRODUCTS.some((product) => product.id === id),
  );
  return [...new Set(productIds)];
}

export function GET(request: Request) {
  return responseWithWishlist(request, readWishlist(request));
}

export async function POST(request: Request) {
  const { productId, productIds: requestedIds } = (await request.json()) as {
    productId?: unknown;
    productIds?: unknown;
  };
  if (
    typeof productId !== "number" ||
    !PRODUCTS.some((product) => product.id === productId)
  ) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  const productIds = validProductIds(requestedIds) ?? readWishlist(request);
  if (!productIds.includes(productId)) productIds.push(productId);
  return responseWithWishlist(request, productIds);
}

export async function DELETE(request: Request) {
  const body = await request.text();
  const { productId, productIds: requestedIds } = body
    ? (JSON.parse(body) as { productId?: unknown; productIds?: unknown })
    : {};
  if (productId === undefined) return responseWithWishlist(request, []);
  if (typeof productId !== "number") return NextResponse.json({ error: "Invalid product" }, { status: 400 });

  const productIds = (validProductIds(requestedIds) ?? readWishlist(request)).filter(
    (id) => id !== productId,
  );
  return responseWithWishlist(request, productIds);
}
