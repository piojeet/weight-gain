import { FiCheckCircle, FiHome, FiShield, FiTag } from "react-icons/fi";

export default function CheckoutTrustStrip() {
  return (
    <div className="mt-6 grid gap-5 rounded-xl border border-line bg-linear-to-r from-[#f4faf8] to-white p-5 sm:grid-cols-4 sm:p-6">
      <div className="flex items-center gap-3 sm:col-span-1"><FiTag className="text-lg text-green-600" /><div><p className="text-xs font-bold text-navy">Have a Coupon?</p><p className="mt-1 text-[10px] text-slate-soft">WELCOME10 applied</p></div></div>
      <TrustItem icon={<FiShield />} title="GMP Certified" detail="Quality you can trust" />
      <TrustItem icon={<FiCheckCircle />} title="No Hidden Blends" detail="100% transparent labels" />
      <TrustItem icon={<FiHome />} title="Made in India" detail="Proudly made for you" />
    </div>
  );
}

function TrustItem({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return <div className="flex items-center gap-3"><span className="text-lg text-green-600">{icon}</span><div><p className="text-xs font-bold text-navy">{title}</p><p className="mt-1 text-[10px] text-slate-soft">{detail}</p></div></div>;
}
