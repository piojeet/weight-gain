import { FiCheck, FiTruck } from "react-icons/fi";

export default function OrderTimeline() {
  const steps = [["Order Confirmed", "We have received your order"], ["Processing", "We are preparing your order"], ["Shipped", "Your order is on the way"], ["Delivered", "Get ready to achieve your goals"]];
  return <section className="rounded-xl border border-line bg-white p-5 sm:p-6"><h2 className="text-base font-extrabold text-navy">What&apos;s Next?</h2><div className="mt-7 grid grid-cols-4 gap-2">{steps.map(([title, detail], index) => <div key={title} className="relative text-center">{index < steps.length - 1 && <div className="absolute left-1/2 top-3 hidden h-px w-full bg-line sm:block" />}<span className={`relative z-10 mx-auto flex size-7 items-center justify-center rounded-full ${index === 0 ? "bg-green-600 text-white" : "border border-line bg-white text-slate-soft"}`}>{index === 0 ? <FiCheck /> : index === 1 ? "▣" : <FiTruck />}</span><p className="mt-3 text-[10px] font-bold text-navy sm:text-xs">{title}</p><p className="mt-1 text-[9px] leading-4 text-slate-soft">{detail}</p></div>)}</div></section>;
}
