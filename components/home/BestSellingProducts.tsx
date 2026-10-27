"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import ProductCard from "@/components/shop/ProductCard";
import { commerceApi, normalizeCommerceProduct } from "@/lib/api/commerce";
import type { Product } from "@/app/types/shop";

export default function BestSellingProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const response = await commerceApi.bestSellers(4);
        if (!active) return;
        setProducts(response.products.map(normalizeCommerceProduct));
      } catch {
        if (active) {
          setProducts([]);
        }
      }
    };

    void loadProducts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="container-page py-16">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
          Best Selling Products
        </h2>
        <Link
          href="/shop"
          className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
        >
          View All <IoArrowForward aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );
}
