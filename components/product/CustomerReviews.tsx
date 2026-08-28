"use client";

import { FaStar } from "react-icons/fa6";
import { FiCheckCircle } from "react-icons/fi";
import { useState } from "react";
import type { Product } from "@/app/types/shop";

export default function CustomerReviews({ product }: { product: Product }) {
  const details = product.details;
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? details.reviews : details.reviews.slice(0, 3);
  const reviewCount = details.reviews.length;
  const averageRating = reviewCount
    ? (details.reviews.reduce((total, review) => total + review.rating, 0) / reviewCount).toFixed(1)
    : "0.0";
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    percentage: reviewCount
      ? Math.round(
          (details.reviews.filter((review) => review.rating === stars).length /
            reviewCount) *
            100,
        )
      : 0,
  }));

  return (
    <section id="reviews" className="mt-10 rounded-2xl border border-line bg-white p-5 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h2 className="text-lg font-extrabold text-navy">Customer Reviews</h2>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-4xl font-extrabold text-navy">{averageRating}</span>
            <div className="pb-1">
              <div className="flex gap-0.5 text-gold-400">
                {Array.from({ length: 5 }).map((_, index) => <FaStar key={index} className="text-sm" />)}
              </div>
              <p className="mt-1 text-[11px] text-slate-soft">Based on {product.reviews} reviews</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {distribution.map(({ stars, percentage }) => (
              <div key={stars} className="flex items-center gap-2 text-[11px] text-slate-soft">
                <span className="w-7">{stars} <FaStar className="inline text-[9px] text-gold-400" /></span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${percentage}%` }} />
                </div>
                <span className="w-8 text-right">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {visibleReviews.map(({ name, comment, date, rating }) => (
            <article key={name} className="rounded-xl border border-line bg-[#fbfcfd] p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-xs font-bold text-green-600">{name[0]}</span>
                <div>
                  <p className="text-[11px] font-bold text-navy">{name}</p>
                  <p className="flex items-center gap-1 text-[9px] text-green-600"><FiCheckCircle /> Verified Purchase</p>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5 text-[10px] text-gold-400">{Array.from({ length: rating }).map((_, index) => <FaStar key={index} />)}</div>
              <p className="mt-2 text-[10px] leading-5 text-slate-soft">{comment}</p>
              <p className="mt-3 text-[9px] text-slate-soft">{date}</p>
            </article>
          ))}
        </div>
      </div>
      {details.reviews.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="mt-6 text-xs font-semibold text-green-600 hover:underline"
        >
          {showAll ? "Show fewer reviews" : `View all ${product.reviews} reviews`}
          <span aria-hidden="true"> {showAll ? "↑" : "->"}</span>
        </button>
      )}
    </section>
  );
}
