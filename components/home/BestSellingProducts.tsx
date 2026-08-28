"use client";

import Link from "next/link";
import { PRODUCTS } from "@/app/data/products";
import ProductCard from "@/components/shop/ProductCard";

const BEST_SELLING_PRODUCTS = [...PRODUCTS]
  .sort((firstProduct, secondProduct) => secondProduct.reviews - firstProduct.reviews)
  .slice(0, 4);

export default function BestSellingProducts() {
  return (
    <section className="container-page py-16">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
          Best Selling Products
        </h2>
        <Link
          href="/shop"
          className="text-sm font-semibold text-green-600 hover:text-green-700"
        >
          View All
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {BEST_SELLING_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
