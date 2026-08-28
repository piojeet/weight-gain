import { FiCheckCircle, FiHeart, FiRefreshCw, FiTruck } from "react-icons/fi";

export default function WishlistSummary({
  itemCount,
  savings,
  total,
  onAddAll,
}: {
  itemCount: number;
  savings: number;
  total: number;
  onAddAll: () => void;
}) {
  return (
    <aside className="rounded-xl border border-line bg-white p-5 shadow-soft lg:sticky lg:top-5 lg:h-fit">
      <div className="flex items-center justify-between"><h2 className="text-base font-extrabold text-navy">Wishlist Summary</h2><span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600"><FiHeart /></span></div>
      <div className="mt-6 grid gap-5 text-xs"><SummaryLine label="Total Items" value={itemCount} /><SummaryLine label="Total Savings" value={`₹${savings.toLocaleString("en-IN")}`} accent /><div className="border-t border-line pt-5"><SummaryLine label="Estimated Total" value={`₹${total.toLocaleString("en-IN")}`} strong /></div></div>
      <button type="button" onClick={onAddAll} disabled={!itemCount} className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-green-600 py-3 text-xs font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300">Add All to Cart <span aria-hidden="true">-&gt;</span></button>
      <div className="mt-6 grid gap-4 border-t border-line pt-5 text-[11px] text-slate-soft"><Info icon={<FiCheckCircle />} title="Secured Payments" detail="100% Safe Checkout" /><Info icon={<FiTruck />} title="Fast & Reliable Delivery" detail="Pan India Delivery" /><Info icon={<FiRefreshCw />} title="Easy Returns" detail="Hassle Free Returns" /><Info icon={<FiHeart />} title="Quality Assured" detail="Lab Tested Products" /></div>
    </aside>
  );
}

function SummaryLine({ label, value, accent = false, strong = false }: { label: string; value: string | number; accent?: boolean; strong?: boolean }) {
  return <div className="flex items-center justify-between"><span className="text-slate-soft">{label}</span><strong className={`${accent ? "text-green-600" : "text-navy"} ${strong ? "text-sm" : ""}`}>{value}</strong></div>;
}

function Info({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return <div className="flex items-start gap-3"><span className="mt-0.5 text-green-600">{icon}</span><div><p className="font-bold text-navy">{title}</p><p className="mt-0.5">{detail}</p></div></div>;
}
