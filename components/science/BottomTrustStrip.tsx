import { PiFlaskLight, PiCheckCircleLight, PiShieldCheckeredLight, PiArrowsCounterClockwiseLight, PiTruckLight } from "react-icons/pi";

const ITEMS = [
    { icon: PiFlaskLight, title: "Lab Tested", subtitle: "For purity & safety" },
    { icon: PiCheckCircleLight, title: "Clean Ingredients", subtitle: "No banned substances" },
    { icon: PiShieldCheckeredLight, title: "Secure Payments", subtitle: "100% safe & secure" },
    { icon: PiArrowsCounterClockwiseLight, title: "Easy Returns", subtitle: "Hassle-free returns" },
    { icon: PiTruckLight, title: "Fast Delivery", subtitle: "Pan India" },
];

export default function BottomTrustStrip() {
    return (
        <section className="border-t border-line bg-gray-50 py-6">
            <div className="container-page grid grid-cols-2 gap-6 sm:grid-cols-5">
                {ITEMS.map(({ icon: Icon, title, subtitle }) => (
                    <div key={title} className="flex items-center gap-2.5">
                        <Icon className="shrink-0 text-xl text-navy" />
                        <div>
                            <p className="text-xs font-semibold text-navy">{title}</p>
                            <p className="text-[10px] text-slate-soft">{subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}