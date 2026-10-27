"use client";

import { FiCheckCircle, FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/app/types/shop";
import { commerceApi, type ReviewResponse } from "@/lib/api/commerce";
import { StarRating } from "@/components/spectrumui/star-rating";

export default function CustomerReviews({ product }: { product: Product }) {
  const [showAll, setShowAll] = useState(false);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState("");
  const readImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };
  const [message, setMessage] = useState("");
  const [reporting, setReporting] = useState<Record<string, boolean>>({});
  const [reported, setReported] = useState<Record<string, boolean>>({});
  const [reportError, setReportError] = useState<Record<string, string>>({});
  const [voted, setVoted] = useState<Record<string, "helpful" | "unhelpful">>(
    {},
  );
  const loadReviews = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { reviews: rows } = await commerceApi.productReviews(String(product.id));
      setReviews(rows);
    } catch (cause) {
      setReviews([]);
      setLoadError(cause instanceof Error ? cause.message : "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [product.id]);
  useEffect(() => {
    let active = true;
    commerceApi.productReviews(String(product.id))
      .then(({ reviews: rows }) => { if (active) setReviews(rows); })
      .catch((cause: unknown) => {
        if (!active) return;
        setReviews([]);
        setLoadError(cause instanceof Error ? cause.message : "Unable to load reviews.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [product.id]);
  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await commerceApi.createReview(String(product.id), {
        rating,
        title: title || undefined,
        comment,
        images: image ? [image] : [],
      });
      setReviews((current) => [result.review, ...current]);
      setMessage("Review submitted for moderation.");
      setTitle("");
      setComment("");
      setImage("");
    } catch (error) {
      setMessage(
        error instanceof Error &&
          error.message.toLowerCase().includes("already")
          ? "You have already reviewed this product."
          : error instanceof Error
            ? error.message
            : "Unable to submit review.",
      );
    }
  };
  const vote = async (
    review: ReviewResponse,
    value: "helpful" | "unhelpful",
  ) => {
    const previous = voted[review.id];
    if (previous === value) return;
    setVoted((current) => ({ ...current, [review.id]: value }));
    setReviews((current) =>
      current.map((item) =>
        item.id === review.id
          ? {
              ...item,
              helpfulVotes:
                item.helpfulVotes +
                (value === "helpful" ? 1 : 0) -
                (previous === "helpful" ? 1 : 0),
              unhelpfulVotes:
                item.unhelpfulVotes +
                (value === "unhelpful" ? 1 : 0) -
                (previous === "unhelpful" ? 1 : 0),
            }
          : item,
      ),
    );
    try {
      const result = await commerceApi.voteReview(review.id, value);
      setReviews((current) =>
        current.map((item) =>
          item.id === review.id
            ? {
                ...item,
                helpfulVotes: result.helpfulVotes,
                unhelpfulVotes: result.unhelpfulVotes,
              }
            : item,
        ),
      );
    } catch {
      setVoted((current) => ({
        ...current,
        ...(previous ? { [review.id]: previous } : {}),
      }));
      setReviews((current) =>
        current.map((item) =>
          item.id === review.id
            ? {
                ...item,
                helpfulVotes: review.helpfulVotes,
                unhelpfulVotes: review.unhelpfulVotes,
              }
            : item,
        ),
      );
    }
  };
  const report = async (id: string) => {
    setReporting((current) => ({ ...current, [id]: true }));
    setReportError((current) => ({ ...current, [id]: "" }));
    try {
      await commerceApi.reportReview(id);
      setReported((current) => ({ ...current, [id]: true }));
    } catch (cause) {
      setReportError((current) => ({
        ...current,
        [id]: cause instanceof Error ? cause.message : "Unable to report this review.",
      }));
    } finally {
      setReporting((current) => ({ ...current, [id]: false }));
    }
  };
  const sourceReviews = reviews;
  const visibleReviews = showAll ? sourceReviews : sourceReviews.slice(0, 3);
  const reviewCount = sourceReviews.length;
  const averageRating = reviewCount
    ? (
        sourceReviews.reduce((total, review) => total + review.rating, 0) /
        reviewCount
      ).toFixed(1)
    : "0.0";
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    percentage: reviewCount
      ? Math.round(
          (sourceReviews.filter((review) => review.rating === stars).length /
            reviewCount) *
            100,
        )
      : 0,
  }));

  return (
    <section
      id="reviews"
      className="mt-10 rounded-2xl border border-line bg-white p-5 sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h2 className="text-lg font-extrabold text-navy">Customer Reviews</h2>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-4xl font-extrabold text-navy">
              {averageRating}
            </span>
            <div className="pb-1">
              <StarRating
                value={Number(averageRating)}
                readOnly
                size="sm"
                showValue
              />
              <p className="mt-1 text-[11px] text-slate-soft">
                Based on {reviewCount} verified reviews
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {distribution.map(({ stars, percentage }) => (
              <div
                key={stars}
                className="flex items-center gap-2 text-[11px] text-slate-soft"
              >
                <span className="flex w-7 items-center gap-0.5">
                  {stars} <StarRating value={stars} readOnly size="xs" />
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {loading && <p role="status" className="col-span-full text-xs text-slate-soft">Loading customer reviews…</p>}
          {loadError && <div role="alert" className="col-span-full flex items-center justify-between gap-3 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700"><span>{loadError}</span><button type="button" onClick={() => void loadReviews()} className="shrink-0 rounded bg-red-700 px-3 py-2 font-semibold text-white">Retry</button></div>}
          {!loading && !loadError && visibleReviews.length === 0 && <p className="col-span-full text-xs text-slate-soft">No approved reviews yet. Be the first to share your experience.</p>}
          {visibleReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-line bg-[#fbfcfd] p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-xs font-bold text-green-600">
                  {(review.title || "C")[0]}
                </span>
                <div>
                  <p className="text-[11px] font-bold text-navy">
                    {review.title || "Customer Review"}
                  </p>
                  <p className="flex items-center gap-1 text-[9px] text-green-600">
                    {review.verified && (
                      <>
                        <FiCheckCircle /> Verified Purchase
                      </>
                    )}
                  </p>
                </div>
              </div>
              <StarRating
                value={review.rating}
                readOnly
                size="xs"
                className="mt-3"
              />
              <p className="mt-2 text-[10px] leading-5 text-slate-soft">
                {review.comment}
              </p>
              <p className="mt-3 text-[9px] text-slate-soft">
                {new Date(review.createdAt).toLocaleDateString("en-IN")}
              </p>
              {"helpfulVotes" in review && (
                <div className="mt-3 flex items-center gap-3 text-[10px] text-slate-soft">
                  <button
                    type="button"
                    onClick={() => vote(review, "helpful")}
                    className={
                      voted[review.id] === "helpful" ? "text-green-600" : ""
                    }
                  >
                    <FiThumbsUp className="mr-1 inline" />
                    Helpful {review.helpfulVotes}
                  </button>
                  <button
                    type="button"
                    onClick={() => vote(review, "unhelpful")}
                    className={
                      voted[review.id] === "unhelpful" ? "text-red-600" : ""
                    }
                  >
                    <FiThumbsDown className="mr-1 inline" />
                    {review.unhelpfulVotes}
                  </button>
                </div>
              )}
              {!review.id.startsWith("fallback-") && (
                <div className="mt-2">
                  <button type="button" disabled={reporting[review.id] || reported[review.id]} onClick={() => void report(review.id)} className="text-[10px] text-slate-soft underline disabled:opacity-50">
                    {reported[review.id] ? "Reported" : reporting[review.id] ? "Reporting…" : "Report review"}
                  </button>
                  {reportError[review.id] && <p role="alert" className="mt-1 text-[10px] text-red-600">{reportError[review.id]}</p>}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
      <form onSubmit={submitReview} className="mt-8 border-t border-line pt-6">
        <h3 className="text-sm font-extrabold text-navy">Write a Review</h3>
        <StarRating
          value={rating}
          onValueChange={setRating}
          showValue
          label="Rate your experience"
          size="md"
          className="mt-3"
        />
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title (optional)"
          className="mt-3 h-9 w-full rounded border border-line px-3 text-xs"
        />
        <textarea
          required
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your experience"
          className="mt-2 h-20 w-full rounded border border-line p-3 text-xs"
        />
        <label className="mt-2 block text-xs text-slate-soft">
          Add image (optional)
          <input
            type="file"
            accept="image/*"
            onChange={(event) => readImage(event.target.files?.[0])}
            className="mt-1 block w-full text-xs"
          />
        </label>
        <button
          type="submit"
          className="mt-3 rounded bg-green-600 px-4 py-2 text-xs font-bold text-white"
        >
          Submit Review
        </button>
        {message && (
          <p role="status" className="mt-2 text-xs text-slate-soft">
            {message}
          </p>
        )}
      </form>
      {sourceReviews.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="mt-6 text-xs font-semibold text-green-600 hover:underline"
        >
          {showAll ? "Show fewer reviews" : `View all ${reviewCount} reviews`}
          <span aria-hidden="true"> {showAll ? "↑" : "->"}</span>
        </button>
      )}
    </section>
  );
}
