import { FiHeadphones, FiRefreshCw, FiShield } from "react-icons/fi";

export default function OrderTrustStrip() {
  const items = [[FiShield, "100% Secure Payments", "Your payments are safe with us."], [FiRefreshCw, "Easy Returns", "Hassle-free returns within 7 days."], [FiShield, "Lab Tested Products", "Quality & purity you can trust."], [FiHeadphones, "Customer Support", "24/7 assistance available."]];
  return <div className="grid gap-5 rounded-xl border border-line bg-white p-5 sm:grid-cols-4 sm:p-6">{items.map(([Icon, title, detail]) => <div key={title as string} className="flex gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-soft text-green-600">{<Icon />}</span><div><p className="text-xs font-bold text-navy">{title as string}</p><p className="mt-1 text-[10px] text-slate-soft">{detail as string}</p></div></div>)}</div>;
}
