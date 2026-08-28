"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { ORDERS } from "@/app/data/orders";
import OrderRow from "@/components/account/OrderRow";
import OrderSummary from "@/components/account/OrderSummary";

export default function MyOrdersPage() {
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState("Newest First");
  const [page, setPage] = useState(1);
  const filteredOrders = useMemo(() => {
    const result =
      status === "All Status"
        ? [...ORDERS]
        : ORDERS.filter((order) => order.status === status);
    return result.sort((a, b) =>
      sort === "Newest First"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date),
    );
  }, [sort, status]);

  return (
    <main className="py-8 sm:py-12">
      <nav className="mb-4 flex items-center gap-2 text-xs text-slate-soft">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/my-account">My Account</Link>
        <span>/</span>
        <span className="text-navy">My Orders</span>
      </nav>
      <header className="mb-7">
        <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">
          My Orders
        </h1>
        <p className="mt-1 text-xs text-slate-soft">
          Track, view or reorder your previous purchases.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_255px]">
        <div className="min-w-0 rounded-xl border border-line bg-white shadow-soft">
          <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
            <select
              aria-label="Filter orders"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="rounded-md border border-line px-3 py-2 text-xs text-navy outline-none"
            >
              <option>All Status</option>
              <option>Delivered</option>
              <option>Shipped</option>
              <option>Cancelled</option>
            </select>
            <label className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-xs text-navy">
              <FiCalendar />
              <span>Select Date Range</span>
            </label>
            <label className="ml-auto flex items-center gap-2 text-xs text-navy">
              Sort by:
              <select
                aria-label="Sort orders"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="font-bold outline-none"
              >
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
            </label>
          </div>
          {filteredOrders.length ? (
            filteredOrders
              .slice((page - 1) * 4, page * 4)
              .map((order) => <OrderRow key={order.id} order={order} />)
          ) : (
            <p className="p-10 text-center text-sm text-slate-soft">
              No orders found.
            </p>
          )}
          <div className="flex items-center justify-between border-t border-line px-5 py-4 text-[10px] text-slate-soft">
            <span>
              Showing {filteredOrders.length ? 1 : 0} to{" "}
              {Math.min(page * 4, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => setPage(Math.max(1, page - 1))}
                className="flex size-7 items-center justify-center rounded border border-line disabled:opacity-40"
              >
                <FiChevronLeft />
              </button>
              <span className="flex size-7 items-center justify-center rounded bg-green-600 font-bold text-white">
                {page}
              </span>
              <button
                type="button"
                aria-label="Next page"
                disabled={page * 4 >= filteredOrders.length}
                onClick={() => setPage(page + 1)}
                className="flex size-7 items-center justify-center rounded border border-line disabled:opacity-40"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
        <OrderSummary />
      </div>
    </main>
  );
}
