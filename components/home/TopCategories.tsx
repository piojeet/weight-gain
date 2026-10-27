"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import { commerceApi, type CategoryFacet } from "@/lib/api/commerce";

export default function TopCategories() {
  const [categories, setCategories] = useState<CategoryFacet[]>([]);

  useEffect(() => {
    let active = true;
    commerceApi.products("?page=1&pageSize=1")
      .then(({ facets }) => { if (active) setCategories(facets.categories); })
      .catch(() => { if (active) setCategories([]); });
    return () => { active = false; };
  }, []);

  return (
    <section className="container-page md:py-16 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-navy sm:text-4xl">
            Shop by Category
          </h2>
          <span className="mt-2 block h-1 w-10 rounded-full bg-green-500" />
        </div>
        <Link
          href="/shop"
          className="hidden items-center gap-1 text-sm font-semibold text-navy hover:text-green-600 sm:flex"
        >
          View All <IoArrowForward />
        </Link>
      </div>

      <div className="md:mt-10 mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(({ slug, label, image, count }) => (
          <Link
            key={slug}
            href={`/shop?category=${slug}`}
            className="group overflow-hidden rounded-xl border border-line bg-white shadow-soft transition-shadow hover:shadow-md"
          >
            <div className="relative h-32 w-full overflow-hidden sm:h-36">
              <Image
                src={image || "/categories/mass-gainer.jpg"}
                alt={label}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy-900/20 to-transparent" />
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-navy">{label}</p>
              <p className="mt-0.5 text-xs text-slate-soft">
                {count} Products
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex justify-center sm:hidden">
        <Link
          href="/shop"
          className="flex items-center gap-1 text-sm font-semibold text-navy hover:text-green-600"
        >
          View All <IoArrowForward />
        </Link>
      </div>
    </section>
  );
}
