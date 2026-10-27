"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { StarRating } from "@/components/spectrumui/star-rating";
import {
  commerceApi,
  type CommunityReviewResponse,
} from "@/lib/api/commerce";

const communityRatingLevels = [5, 4, 3, 2, 1] as const;

function Stars({ count }: { count: number }) {
  return <StarRating value={count} readOnly size="xs" />;
}

export default function CommunityReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [community, setCommunity] = useState<CommunityReviewResponse | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    let active = true;

    commerceApi
      .communityReviews()
      .then((response) => {
        if (!active) return;
        setCommunity(response);
        setLoadState("ready");
      })
      .catch(() => {
        if (active) setLoadState("error");
      });

    return () => {
      active = false;
    };
  }, []);

  const reviews = community?.reviews ?? [];
  const distribution = community?.summary.distribution ?? [];

  useEffect(() => {
    const carousel = scrollRef.current;
    if (!carousel) return;

    setCanScrollLeft(carousel.scrollLeft > 0);
    setCanScrollRight(
      carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 1,
    );
  }, [community, loadState]);

  const scroll = (dir: "left" | "right") => {
    const carousel = scrollRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const carousel = scrollRef.current;
    if (!carousel) return;

    setCanScrollLeft(carousel.scrollLeft > 0);
    setCanScrollRight(
      carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 1,
    );
  };

  return (
    <section className="container-page py-16">
      <h2 className="font-display text-center text-2xl font-extrabold text-navy sm:text-3xl">
        From Our Community
      </h2>
      <span className="mx-auto mt-2 block h-1 w-10 rounded-full bg-green-500" />

      <div className="mt-10 flex items-start gap-4 relative">
        <div className="hidden w-65 shrink-0 rounded-2xl border border-line bg-white p-5 shadow-soft sm:block">
          {loadState === "loading" ? (
            <div aria-hidden="true" className="animate-pulse">
              <div className="h-10 w-24 rounded bg-gray-100" />
              <div className="mt-2 h-4 w-24 rounded bg-gray-100" />
              <div className="mt-2 h-3 w-32 rounded bg-gray-100" />
              <div className="mt-5 space-y-2">
                {communityRatingLevels.map((stars) => (
                  <div key={stars} className="h-2 rounded bg-gray-100" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="font-display text-4xl font-extrabold text-navy">
                {community?.summary.totalReviews
                  ? community.summary.averageRating.toFixed(1)
                  : "—"}
                {community?.summary.totalReviews ? "/5" : ""}
              </p>
              <StarRating
                value={community?.summary.averageRating ?? 0}
                readOnly
                size="sm"
                className="mt-2"
              />
              <p className="mt-1 text-xs text-slate-soft">
                {loadState === "error"
                  ? "Reviews are temporarily unavailable"
                  : community?.summary.totalReviews
                    ? `Based on ${community.summary.totalReviews.toLocaleString("en-IN")} reviews`
                    : "No approved reviews yet"}
              </p>

              {loadState === "ready" && (
                <div className="mt-4 space-y-1.5">
                  {distribution.map(({ stars, percent }) => (
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
              )}
            </>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous reviews"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white shadow-soft hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IoChevronBack aria-hidden="true" />
          </button>

          <div className="relative min-w-0 flex-1 overflow-hidden px-1">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            aria-busy={loadState === "loading"}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden h-full"
          >
            {loadState === "loading" &&
              [0, 1, 2].map((skeletonIndex) => (
                <div
                  key={skeletonIndex}
                  aria-hidden="true"
                  className="w-65 shrink-0 rounded-2xl border border-line bg-white p-5 shadow-soft animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 shrink-0 rounded-full bg-gray-100" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded bg-gray-100" />
                      <div className="h-2 w-20 rounded bg-gray-100" />
                    </div>
                  </div>
                  <div className="mt-4 h-3 w-20 rounded bg-gray-100" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full rounded bg-gray-100" />
                    <div className="h-3 w-4/5 rounded bg-gray-100" />
                  </div>
                  <div className="mt-4 h-2 w-16 rounded bg-gray-100" />
                </div>
              ))}
            {loadState === "ready" && reviews.length === 0 && (
              <p className="py-8 text-sm text-slate-soft">
                No approved community reviews yet.
              </p>
            )}
            {loadState === "error" && (
              <p className="py-8 text-sm text-slate-soft">
                Community reviews are temporarily unavailable.
              </p>
            )}
            {loadState === "ready" && reviews.map((review) => (
              <div
                key={review.id}
                className="w-65 shrink-0 rounded-2xl border border-line bg-white p-5 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
                    {review.avatar ? (
                      <Image
                        src={review.avatar}
                        alt={review.reviewerName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center bg-green-soft text-xs font-bold text-green-600">
                        {review.reviewerName.trim().charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="min-w-0 truncate text-sm font-semibold text-navy">
                      {review.reviewerName}
                    </p>
                    {review.verified && (
                      <p className="flex items-center gap-1 text-[11px] text-green-600">
                        <MdVerified /> Verified Purchase
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <Stars count={review.rating} />
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-soft">
                  {review.text}
                </p>
                <p className="mt-3 text-[11px] text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next reviews"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white shadow-soft hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IoChevronForward aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
