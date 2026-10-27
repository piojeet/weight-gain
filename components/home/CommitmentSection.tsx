import Image from "next/image";
import {
  PiUsersThreeLight,
  PiClipboardTextLight,
  PiFlaskLight,
  PiHeadsetLight,
} from "react-icons/pi";
import GymImg from "@/public/commitment.jpg";

const STATS = [
  { icon: PiUsersThreeLight, value: "10,000+", label: "Happy Customers" },
  { icon: PiClipboardTextLight, value: "50+", label: "Products" },
  { icon: PiFlaskLight, value: "100%", label: "Lab Tested" },
  { icon: PiHeadsetLight, value: "24/7", label: "Customer Support" },
];

export default function CommitmentSection() {
  return (
    <section className="container-page">
      <div className="grid overflow-hidden rounded-2xl bg-gradient-to-br from-light-blue to-white lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 md:py-16 py-10">
          <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
            Your Goals. Our Commitment.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-soft">
            We&apos;re here to support your journey with safe, effective and
            honest nutrition you can trust.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <Icon className="text-2xl text-green-600" />
                <p className="font-display mt-2 text-lg font-extrabold text-navy">
                  {value}
                </p>
                <p className="text-[11px] text-slate-soft">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-64 lg:h-auto">
          <Image
            src={GymImg}
            alt="Person using TheGrowthHealth shaker at the gym"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
