import { FiBox, FiCheckCircle, FiClock, FiRefreshCw, FiTruck, FiX } from "react-icons/fi";
import { ORDER_STATUS_COUNTS } from "@/app/data/orders";

const icons = { "All Orders": FiBox, Delivered: FiCheckCircle, Shipped: FiTruck, Processing: FiClock, Cancelled: FiX, Returned: FiRefreshCw };
export default function OrderSummary() { return <aside className="rounded-xl border border-line bg-white p-5 shadow-soft"><h2 className="text-base font-extrabold text-navy">Order Summary</h2><div className="mt-5 grid gap-2">{ORDER_STATUS_COUNTS.map(([label, count]) => { const Icon = icons[label]; return <div key={label} className={`flex items-center gap-3 rounded-md px-3 py-3 text-xs ${label === "All Orders" ? "bg-green-soft text-green-600" : "text-navy"}`}><Icon /><span className="flex-1">{label}</span><strong>{count}</strong></div>; })}</div></aside>; }
