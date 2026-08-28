
"use client";

import Link from "next/link";
import { FiArrowRight, FiCheck, FiEdit2, FiHeart, FiPlus, FiTarget, FiTruck } from "react-icons/fi";
import { ORDERS, getOrderProducts } from "@/app/data/orders";
import { PRODUCTS } from "@/app/data/products";
import { useCart } from "@/app/hooks/useCart";
import { useWishlist } from "@/app/hooks/useWishlist";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const stats = [
  { label: "Total Orders", value: "12", note: "View all orders", icon: FiTruck, tone: "green" },
  { label: "Total Spent", value: "₹28,745", note: "Across all orders", icon: FiCheck, tone: "blue" },
  { label: "Wishlist Items", value: "3", note: "View wishlist", icon: FiHeart, tone: "purple" },
  { label: "Coupons", value: "2", note: "Available", icon: FiPlus, tone: "orange" },
  { label: "Reward Points", value: "560", note: "₹560 value", icon: FiTarget, tone: "teal" },
];

export default function DashboardPage() {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlistProducts = PRODUCTS.filter((product) => [3, 2, 4].includes(product.id));
  const recommended = PRODUCTS.filter((product) => !wishlistProducts.some((item) => item.id === product.id)).slice(0, 6);

  return (
    <section className="bg-[#fbfcfe] py-7 text-navy">
      <div>
        <div className="mb-5 text-[10px] text-slate-soft">Home <span className="mx-2">›</span> My Account <span className="mx-2">›</span> <span className="text-navy">Dashboard</span></div>
        <h1 className="text-[22px] font-extrabold tracking-tight">My Dashboard</h1>
        <p className="mt-1 text-xs text-slate-soft">Welcome back, Rahul! 👋</p>

        <div className="mt-6">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
              {stats.map(({ label, value, note, icon: Icon }) => (
                <div key={label} className="rounded-lg border border-line bg-white p-4 shadow-sm">
                  <div className="mb-3 flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600"><Icon size={16} /></div>
                  <p className="text-[10px] text-slate-soft">{label}</p><p className="mt-1 text-lg font-extrabold">{value}</p>
                  <Link href={label === "Total Orders" ? "/my-account/orders" : label === "Wishlist Items" ? "/wishlist" : "#"} className="mt-2 flex items-center gap-1 text-[9px] font-bold text-green-600">{note} <FiArrowRight /></Link>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(235px,0.75fr)]">
              <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-extrabold">Recent Orders</h2><Link href="/my-account/orders" className="text-[9px] font-bold text-green-600">View All Orders <FiArrowRight className="inline" /></Link></div>
                <div className="grid gap-2">{ORDERS.map((order) => { const product = getOrderProducts(order)[0]; return <div key={order.id} className="grid grid-cols-[42px_minmax(0,1fr)_70px_94px] items-center gap-3 rounded-md border border-[#edf0f4] px-2 py-2 text-[9px]"><img src={product?.image} alt="" className="size-10 object-contain" /><div className="min-w-0"><p className="truncate font-bold">{product?.name}</p><p className="mt-0.5 truncate text-[8px] text-slate-soft">{product?.description} · {order.id}</p><p className="text-[8px] text-slate-soft">{order.date.split(",")[0]}</p></div><div className="text-right"><p className="font-bold">{money(order.total)}</p><p className="text-[8px] text-slate-soft">Qty: {order.productIds.length}</p></div><div><span className={`rounded px-1.5 py-1 text-[8px] font-bold ${order.status === "Cancelled" ? "bg-red-50 text-red-500" : order.status === "Shipped" ? "bg-blue-50 text-blue-600" : "bg-green-soft text-green-600"}`}>{order.status === "Shipped" ? "Out for Delivery" : order.status}</span><p className="mt-1 text-[8px] text-slate-soft">{order.statusDate}</p><Link href="/my-account/orders" className="mt-1 inline-block rounded border border-[#bdc8d6] px-2 py-1 text-[8px] font-bold">{order.status === "Delivered" ? "Buy Again" : "Track Order"}</Link></div></div>; })}</div>
                <div className="mt-3 flex items-center justify-between text-[9px] text-slate-soft"><span>Can&apos;t find your order?</span><Link href="/my-account/orders" className="rounded border border-[#bdc8d6] px-3 py-1.5 font-bold text-navy">View All Orders</Link></div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Account Overview</h2><div className="mt-4 grid gap-3 text-[9px]"><p>♙ <span className="ml-2 text-slate-soft">Name</span><b className="float-right">Rahul Sharma</b></p><p>✉ <span className="ml-2 text-slate-soft">Email</span><b className="float-right font-medium">rahul.sharma@email.com</b></p><p>⌕ <span className="ml-2 text-slate-soft">Phone</span><b className="float-right font-medium">+91 98765 43210</b></p><p>♧ <span className="ml-2 text-slate-soft">Member Since</span><b className="float-right font-medium">18 April 2024</b></p></div><Link href="/my-account/profile" className="mt-4 block rounded border border-green-500 py-1.5 text-center text-[9px] font-bold text-green-600"><FiEdit2 className="mr-1 inline" /> Edit Profile</Link></div>
                <div className="rounded-lg border border-line bg-white p-4 shadow-sm"><div className="flex justify-between"><h2 className="text-xs font-extrabold">Delivery Address</h2><span className="rounded bg-green-soft px-1.5 py-1 text-[8px] font-bold text-green-600">Default Address</span></div><p className="mt-3 text-[9px] leading-4 text-slate-soft"><b className="text-navy">Rahul Sharma</b><br />Flat 101, Green Valley Apartments<br />MG Road, Sector 15<br />Gurugram, Haryana - 122001<br />India<br />Phone: +91 98765 43210</p><Link href="/my-account/addresses" className="mt-3 block rounded border border-green-500 py-1.5 text-center text-[9px] font-bold text-green-600">Manage Addresses</Link></div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(235px,0.75fr)]">
              <div className="rounded-lg border border-line bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-extrabold">My Wishlist <span className="font-normal text-slate-soft">({wishlistProducts.length} items)</span></h2><Link href="/wishlist" className="text-[9px] font-bold text-green-600">View Wishlist <FiArrowRight className="inline" /></Link></div><div className="grid gap-2 sm:grid-cols-3">{wishlistProducts.map((product) => <div key={product.id} className="relative rounded-md border border-[#edf0f4] p-2"><button onClick={() => void toggleWishlist(product.id)} aria-label="Remove from wishlist" className="absolute right-2 top-2 text-red-400"><FiHeart fill={isWishlisted(product.id) ? "currentColor" : "none"} /></button><img src={product.image} alt={product.name} className="mx-auto h-16 object-contain" /><p className="truncate text-[9px] font-bold">{product.name}</p><p className="truncate text-[8px] text-slate-soft">{product.description}</p><p className="mt-1 text-[10px] font-extrabold">{money(product.price)}</p><button onClick={() => addItem(product.id)} className="mt-2 w-full rounded border border-[#bdc8d6] py-1.5 text-[8px] font-bold">Add to Cart</button></div>)}</div></div>
              <div className="rounded-lg border border-line bg-white p-4 shadow-sm"><div className="flex justify-between"><h2 className="text-xs font-extrabold">Your Nutrition Goals</h2><Link href="/my-account/nutrition-goals" aria-label="Edit nutrition goals"><FiEdit2 size={14} /></Link></div><div className="mt-4 flex items-center gap-3"><div className="flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600"><FiTarget /></div><div><p className="text-[10px] font-bold">Muscle Gain</p><p className="text-[8px] text-slate-soft">Target: 75 kg</p></div></div><div className="mt-4 flex justify-between text-[8px] text-slate-soft"><span>Start Weight: 68 kg</span><span>Target Date: 30 Aug 2024</span></div><div className="mt-2 h-1.5 rounded-full bg-gray-100"><div className="h-full w-[68%] rounded-full bg-green-600" /></div><p className="mt-1 text-right text-[9px] font-bold">68%</p><p className="text-[8px] text-slate-soft">You&apos;re doing great! Keep going.</p></div>
            </div>
        </div>
        <div className="mt-5"><div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-extrabold">Recommended for You</h2><div className="text-slate-soft">‹ <span className="mx-2">›</span></div></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{recommended.map((product) => <div key={product.id} className="rounded-md border border-line bg-white p-2 shadow-sm"><img src={product.image} alt={product.name} className="mx-auto h-20 object-contain" /><p className="truncate text-[9px] font-bold">{product.name}</p><p className="mt-1 text-[10px] font-extrabold">{money(product.price)}</p><button onClick={() => addItem(product.id)} className="mt-2 w-full rounded border border-[#bdc8d6] py-1.5 text-[8px] font-bold">Add to Cart</button></div>)}</div></div>
      </div>
    </section>
  );
}
