"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiEdit2,
  FiMessageCircle,
  FiSearch,
  FiShield,
  FiTrash2,
  FiThumbsUp,
  FiUser,
} from "react-icons/fi";
import { PRODUCTS } from "@/app/data/products";
import { commerceApi, type ReviewResponse } from "@/lib/api/commerce";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";

type Review = {
  id: string | number;
  productId: string | number;
  title: string;
  body: string;
  rating: number;
  status: "Published" | "Pending" | "Not Approved";
  date: string;
  verified: boolean;
  productName: string;
  productDescription: string;
  productImage: string | null;
};
const reviewStatus = (status: string): Review["status"] =>
  status === "approved" ? "Published" : status === "rejected" ? "Not Approved" : "Pending";
const mapReview = (review: ReviewResponse): Review => ({
  id: review.id,
  productId: review.productId,
  title: review.title ?? "",
  body: review.comment,
  rating: review.rating,
  status: reviewStatus(review.status),
  date: new Date(review.createdAt).toLocaleDateString("en-IN"),
  verified: review.verified,
  productName: review.product?.name ?? "",
  productDescription: review.product?.description ?? "",
  productImage: review.product?.image ?? (typeof review.product?.images?.[0] === "string" ? review.product.images[0] : review.product?.images?.[0]?.url ?? null),
});
const stars = (value: number) => (
  <span className="text-amber-500">
    {"★".repeat(value)}
    <span className="text-slate-200">{"★".repeat(5 - value)}</span>
  </span>
);

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tab, setTab] = useState("All Reviews");
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("All Ratings");
  const [modal, setModal] = useState<string | number | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [newRating, setNewRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notice, setNotice] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  useEffect(() => {
    let active = true;
    commerceApi
      .userReviews()
      .then(({ reviews: rows }) => {
        if (active) setReviews(rows.map(mapReview));
      })
      .catch((cause: unknown) => {
        if (active) setLoadError(cause instanceof Error ? cause.message : "Unable to load your reviews.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);
  const filtered = useMemo(
    () =>
      reviews.filter(
        (item) =>
          (tab === "All Reviews" || item.status === tab) &&
          (rating === "All Ratings" || item.rating === Number(rating[0])) &&
          `${item.title} ${item.body}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [reviews, tab, rating, search],
  );
  const unreviewed = PRODUCTS.filter(
    (product) => !reviews.some((review) => review.productId === product.id),
  ).slice(0, 6);
  const closeEditor = () => {
    setModal(null);
    setEditingReview(null);
    setTitle("");
    setBody("");
    setNewRating(5);
    setReviewError("");
  };
  const edit = (review: Review) => {
    setEditingReview(review);
    setModal(review.productId);
    setTitle(review.title);
    setBody(review.body);
    setNewRating(review.rating);
    setReviewError("");
  };
  const submit = async () => {
    if (modal === null || !title.trim() || !body.trim() || submitting) return;
    setSubmitting(true);
    setReviewError("");
    try {
      if (editingReview) {
        const result = await commerceApi.updateReview(String(editingReview.id), {
          rating: newRating,
          title: title.trim(),
          comment: body.trim(),
        });
        const updated = { ...mapReview(result.review), productName: editingReview.productName, productDescription: editingReview.productDescription, productImage: editingReview.productImage };
        setReviews((current) => current.map((item) => item.id === updated.id ? updated : item));
      } else {
        const result = await commerceApi.createReview(String(modal), {
          rating: newRating,
          title: title.trim(),
          comment: body.trim(),
        });
        const product = PRODUCTS.find((item) => String(item.id) === String(modal));
        setReviews((current) => [{ ...mapReview(result.review), productName: product?.name ?? "", productDescription: product?.description ?? "", productImage: product?.image ?? null }, ...current]);
      }
      const successMessage = editingReview ? "Review updated successfully" : "Review submitted successfully";
      closeEditor();
      setNotice(successMessage);
    } catch (cause) {
      setReviewError(
        cause instanceof Error &&
          cause.message.toLowerCase().includes("already")
          ? "You have already reviewed this product."
          : cause instanceof Error
            ? cause.message
            : editingReview ? "Unable to update review." : "Unable to submit review.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  const removeReview = async (review: Review) => {
    if (deletingId !== null || !window.confirm("Delete this review? This cannot be undone.")) return;
    setDeletingId(review.id);
    setReviewError("");
    try {
      await commerceApi.deleteReview(String(review.id));
      setReviews((current) => current.filter((item) => item.id !== review.id));
    } catch (cause) {
      setReviewError(cause instanceof Error ? cause.message : "Unable to delete this review.");
    } finally {
      setDeletingId(null);
    }
  };
  const count = (value: string) =>
    value === "All Reviews"
      ? reviews.length
      : reviews.filter((item) => item.status === value).length;

  return (
    <div className="bg-[#fbfcfd] pb-12">
      <nav className="text-[10px] text-slate-soft">
        Home <span className="mx-2">›</span> My Account{" "}
        <span className="mx-2">›</span>{" "}
        <span className="text-navy">My Reviews</span>
      </nav>
      <header className="mt-5 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">My Reviews</h1>
          <p className="mt-1 text-[10px] text-slate-soft">
            View, manage and write reviews for the products you&apos;ve
            purchased.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal(unreviewed[0]?.id || null)}
          className="flex items-center gap-2 rounded bg-navy-900 px-4 py-2.5 text-[10px] font-bold text-white"
        >
          <FiEdit2 /> Write a Review
        </button>
      </header>
      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_176px]">
        <div className="min-w-0">
          {loadError && <p role="alert" className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">{loadError}</p>}
          {reviewError && !modal && <p role="alert" className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">{reviewError}</p>}
          <div className="flex gap-4 overflow-x-auto border-b border-line text-[9px] font-bold text-slate-soft">
            {["All Reviews", "Published", "Pending", "Not Approved"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`whitespace-nowrap border-b-2 px-1 py-3 ${tab === item ? "border-green-600 text-green-600" : "border-transparent"}`}
                >
                  {item} ({count(item)})
                </button>
              ),
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 rounded-lg border border-line bg-white p-3">
            <label className="relative flex min-w-44 flex-1 items-center">
              <FiSearch className="absolute left-2 text-slate-soft" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your reviews..."
                className="h-8 w-full rounded border border-line pl-7 text-[9px] outline-none"
              />
            </label>
            <AnimatedSelect
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              size="sm"
              options={[
                { value: "All Ratings", label: "All Ratings" },
                { value: "5 Stars", label: "5 Stars" },
                { value: "4 Stars", label: "4 Stars" },
                { value: "3 Stars", label: "3 Stars" },
              ]}
              className="min-w-28"
            />
          </div>
          <div className="mt-2 grid gap-2">
            {loading && <p role="status" className="rounded-lg border border-line bg-white p-4 text-xs text-slate-soft">Loading your reviews...</p>}
            {!loading && filtered.map((item) => {
              return (
                <article
                  key={item.id}
                  className="grid grid-cols-[48px_minmax(0,1fr)_75px_18px] gap-3 rounded-lg border border-line bg-white p-3 shadow-sm"
                >
                  <div className="h-14 w-11">{item.productImage && <img src={item.productImage} alt={item.productName} className="h-14 w-11 object-contain" />}</div>
                  <div>
                    <p className="text-[9px] font-extrabold">{item.productName || "Product"}</p>
                    <p className="text-[8px] text-slate-soft">
                      {item.productDescription}
                    </p>
                    <p className="mt-1 text-[9px]">
                      {stars(item.rating)} <b>{item.rating}.0</b>
                    </p>
                    <span className="rounded bg-green-soft px-1.5 py-1 text-[8px] font-bold text-green-600">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[8px] text-slate-soft">
                    Reviewed on
                    <br />
                    <b className="text-navy">{item.date}</b>
                  </p>
                  <div className="flex flex-col gap-2 text-[8px]">
                    {item.status === "Pending" && <button type="button" onClick={() => edit(item)} className="font-bold text-green-700">Edit</button>}
                    <button type="button" disabled={deletingId !== null} onClick={() => void removeReview(item)} className="font-bold text-red-600 disabled:opacity-50">
                      {deletingId === item.id ? "Deleting..." : <><FiTrash2 className="mr-1 inline" />Delete</>}
                    </button>
                  </div>
                  <div className="col-span-4 border-t border-line pt-2 text-[9px]">
                    <p className="font-extrabold">{item.title}</p>
                    <p className="mt-1 text-slate-soft">{item.body}</p>
                    {item.verified && <p className="mt-2 font-bold text-green-600"><FiCheck className="mr-1 inline" /> Verified Purchase</p>}
                  </div>
                </article>
              );
            })}
            {!loading && !loadError && filtered.length === 0 && <p className="rounded-lg border border-line bg-white p-4 text-xs text-slate-soft">No reviews match your filters.</p>}
          </div>
        </div>
        <aside className="grid content-start gap-4">
          <section className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Review Summary</h2>
            <div className="mt-3 flex items-center gap-2">
              <b className="text-2xl">4.6</b>
              <div>
                {stars(5)}
                <p className="text-[8px] text-slate-soft">Average Rating</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-[8px]">
              {[5, 4, 3, 2, 1].map((value) => (
                <p key={value} className="flex items-center gap-2">
                  <span>{value} Stars</span>
                  <span className="h-1.5 flex-1 rounded bg-gray-100">
                    <span className="block h-full w-3/4 rounded bg-green-600" />
                  </span>
                  {reviews.filter((item) => item.rating === value).length}
                </p>
              ))}
            </div>
            <hr className="my-4 border-line" />
            <p className="text-[8px] text-slate-soft">
              Total Reviews{" "}
              <b className="float-right text-navy">{reviews.length}</b>
            </p>
          </section>
          <section className="rounded-lg bg-green-soft p-4">
            <FiMessageCircle className="text-xl text-green-600" />
            <p className="mt-2 text-[9px] font-extrabold">Write a Review</p>
            <p className="mt-1 text-[8px] text-slate-soft">
              Share your experience and help others.
            </p>
            <button
              type="button"
              onClick={() => setModal(unreviewed[0]?.id || null)}
              className="mt-3 w-full rounded border border-green-500 py-1.5 text-[8px] font-bold text-green-600"
            >
              Write a Review
            </button>
          </section>
          <section className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Review Guidelines</h2>
            <div className="mt-3 grid gap-3 text-[8px] text-slate-soft">
              <p>
                <FiEdit2 className="mr-2 inline" />
                Share your honest experience
              </p>
              <p>
                <FiThumbsUp className="mr-2 inline" />
                Focus on quality and results
              </p>
              <p>
                <FiUser className="mr-2 inline" />
                Avoid personal information
              </p>
              <p>
                <FiShield className="mr-2 inline" />
                Reviews are checked before publishing
              </p>
            </div>
          </section>
        </aside>
      </div>
      <section className="mt-5 rounded-lg border border-line bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-extrabold">
              Purchased but not reviewed
            </h2>
            <p className="text-[8px] text-slate-soft">
              Earn 50 reward points for each review.
            </p>
          </div>
          <Link
            href="/my-account/orders"
            className="text-[8px] font-bold text-green-600"
          >
            View All Orders <FiArrowRight className="inline" />
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {unreviewed.map((product) => (
            <article
              key={product.id}
              className="rounded border border-line p-2"
            >
              <img
                src={product.image}
                alt={product.name}
                className="mx-auto h-16 object-contain"
              />
              <p className="truncate text-[8px] font-bold">{product.name}</p>
              <button
                type="button"
                onClick={() => setModal(product.id)}
                className="mt-2 w-full rounded border border-line py-1.5 text-[8px] font-bold"
              >
                Write a Review
              </button>
            </article>
          ))}
        </div>
      </section>
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/30 p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl"
          >
            <div className="flex justify-between">
              <h2 className="text-sm font-extrabold">{editingReview ? "Edit Review" : "Write a Review"}</h2>
              <button
                type="button"
                disabled={submitting}
                onClick={closeEditor}
                className="text-xl text-slate-soft"
              >
                ×
              </button>
            </div>
            <div className="mt-4 flex gap-2 text-xl">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  aria-pressed={value === newRating}
                  disabled={submitting}
                  onClick={() => setNewRating(value)}
                  className={
                    value <= newRating ? "text-amber-500" : "text-slate-200"
                  }
                >
                  ★
                </button>
              ))}
            </div>
            <input
              required
              aria-label="Review title"
              disabled={submitting}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Review title"
              className="mt-3 h-9 w-full rounded border border-line px-3 text-[10px]"
            />
            <textarea
              required
              aria-label="Review text"
              disabled={submitting}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Share your experience"
              className="mt-2 h-24 w-full rounded border border-line p-3 text-[10px]"
            />
            {reviewError && <p role="alert" className="mt-2 text-[10px] text-red-600">{reviewError}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="mt-3 w-full rounded bg-green-600 py-2 text-[10px] font-bold text-white disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingReview ? "Save Changes" : "Submit Review"}
            </button>
          </form>
        </div>
      )}
      {notice && (
        <button
          type="button"
          onClick={() => setNotice("")}
          className="fixed bottom-5 right-5 rounded bg-green-600 px-4 py-2 text-[10px] font-bold text-white"
        >
          {notice} ×
        </button>
      )}
    </div>
  );
}
