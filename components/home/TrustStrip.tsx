import { PiFlaskLight, PiCirclesFourLight, PiSealCheckLight, PiWalletLight, PiTruckLight } from "react-icons/pi";

const TRUST_ITEMS = [
  { icon: PiFlaskLight, title: "Lab Tested", subtitle: "For Purity & Safety" },
  { icon: PiCirclesFourLight, title: "Clean & Transparent", subtitle: "No Hidden Blends" },
  { icon: PiSealCheckLight, title: "GMP Certified", subtitle: "Quality You Can Trust" },
  { icon: PiWalletLight, title: "Secure Payments", subtitle: "100% Safe Checkout" },
  { icon: PiTruckLight, title: "Fast & Reliable", subtitle: "Pan India Delivery" },
];

export default function TrustStrip() {
  return (
    <div className="container-page">
      <div className="grid grid-cols-2 gap-y-5 rounded-xl border border-line bg-white p-5 shadow-soft sm:grid-cols-3 sm:divide-x sm:divide-line lg:grid-cols-5">
        {TRUST_ITEMS.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-center gap-3 px-3 first:pl-0">
            <Icon className="shrink-0 text-2xl text-navy" />
            <div>
              <p className="text-xs font-semibold text-navy sm:text-sm">{title}</p>
              <p className="text-[11px] text-slate-soft">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}