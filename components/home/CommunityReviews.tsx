"use client";

import { useRef } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdVerified } from "react-icons/md";

const RATING_BREAKDOWN = [
  { stars: 5, percent: 84 },
  { stars: 4, percent: 9 },
  { stars: 3, percent: 3 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const REVIEWS = [
  {
    name: "Rahul Sharma",
    avatar: "/avatars/rahul.jpg",
    rating: 5,
    text: "Mass Fuel Pro has been a game changer for me. Great taste, mixes well and I have seen real improvements in my strength and weight.",
    date: "20 Apr 2024",
  },
  {
    name: "Vikram Singh",
    avatar: "/avatars/vikram.jpg",
    rating: 5,
    text: "Clean ingredients and no stomach issues. I love the transparency in the label. Highly recommended!",
    date: "18 Apr 2024",
  },
  {
    name: "Aman Verma",
    avatar: "/avatars/aman.jpg",
    rating: 5,
    text: "Results are visible when combined with a good diet and workout. Worth every penny!",
    date: "15 Apr 2024",
  },
  {
    name: "Aman Verma",
    avatar: "/avatars/aman.jpg",
    rating: 5,
    text: "Results are visible when combined with a good diet and workout. Worth every penny!",
    date: "15 Apr 2024",
  },
  {
    name: "Aman Verma",
    avatar: "/avatars/aman.jpg",
    rating: 5,
    text: "Results are visible when combined with a good diet and workout. Worth every penny!",
    date: "15 Apr 2024",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-gold-400">
      {Array.from({ length: count }).map((_, i) => (
        <FaStar key={i} className="text-xs" />
      ))}
    </div>
  );
}

export default function CommunityReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <section className="container-page py-16">
      <h2 className="font-display text-center text-2xl font-extrabold text-navy sm:text-3xl">
        From Our Community
      </h2>
      <span className="mx-auto mt-2 block h-1 w-10 rounded-full bg-green-500" />

      <div className="mt-10 flex items-start gap-4 relative">
        <div className="hidden w-[260px] shrink-0 rounded-2xl border border-line bg-white p-5 shadow-soft sm:block">
          <p className="font-display text-4xl font-extrabold text-navy">
            4.8/5
          </p>
          <div className="mt-2 flex text-gold-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-soft">
            Based on 10,000+ reviews
          </p>

          <div className="mt-4 space-y-1.5">
            {RATING_BREAKDOWN.map(({ stars, percent }) => (
              <div
                key={stars}
                className="flex items-center gap-2 text-[11px] text-slate-soft"
              >
                <span className="w-6 shrink-0">{stars} ★</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <span
                    className="block h-full rounded-full bg-green-500"
                    style={{ width: `${percent}%` }}
                  />
                </span>
                <span className="w-7 shrink-0 text-right">{percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden" style={{height: "stretch"}}>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden h-full"
          >
            {REVIEWS.map((review, index) => (
              <div
                key={`${review.name}-${index}`}
                className="w-[260px] shrink-0 rounded-2xl border border-line bg-white p-5 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">
                      {review.name}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-green-600">
                      <MdVerified /> Verified Purchase
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <Stars count={review.rating} />
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-soft">
                  {review.text}
                </p>
                <p className="mt-3 text-[11px] text-gray-400">{review.date}</p>
              </div>
            ))}
          </div>
        </div>

        
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex size-9 items-center justify-center rounded-full border border-line bg-white shadow-soft hover:bg-gray-50 absolute -left-5 top-1/2 -translate-y-1/2"
          >
            <IoChevronBack />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex size-9 items-center justify-center rounded-full border border-line bg-white shadow-soft hover:bg-gray-50 absolute -right-5 top-1/2 -translate-y-1/2"
          >
            <IoChevronForward />
          </button>
        
      </div>
    </section>
  );
}
