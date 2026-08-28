import Jar from "@/public/how-it-works/jar-flour.svg";
import Cup from "@/public/how-it-works/cartoon-takeaway-cup.svg";
import Trend from "@/public/how-it-works/cartoon-trending-up.svg";
import Image from "next/image";
import { LuChevronRight } from "react-icons/lu";

const STEPS = [
  {
    number: "01",
    icon: Jar,
    title: "Choose Your Product",
    subtitle: "Pick the right nutrition based on your goal and lifestyle.",
  },
  {
    number: "02",
    icon: Cup,
    title: "Follow Daily Nutrition",
    subtitle: "Take your nutrition daily as per the recommended usage.",
  },
  {
    number: "03",
    icon: Trend,
    title: "Stay Consistent",
    subtitle: "Consistency + proper nutrition leads to visible results.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 md:py-16 py-10">
      <div className="container-page">
        <div className="text-center">
          <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
            How It Works
          </h2>
          <span className="mx-auto mt-2 block h-1 w-10 rounded-full bg-green-500" />
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {STEPS.map(({ number, icon: Icon, title, subtitle }, i) => (
            <div key={number} className="relative flex gap-4 items-center">
              <span className="flex size-20 shrink-0 items-center justify-center rounded-full border border-line bg-white text-2xl text-navy shadow-soft p-4">
                <Image
                  src={Icon}
                  alt={Icon}
                  className="size-full object-contain"
                />
              </span>
              <div>
                <p className="font-display text-lg font-extrabold text-navy">
                  {number}
                </p>
                <p className="mt-1 text-sm font-semibold text-navy">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-soft">
                  {subtitle}
                </p>
              </div>

              {i < STEPS.length - 1 && (
                <div className="relative">
                  <span className="hidden w-14 border-t-2 border-dashed border-gray-300 sm:block" />
                  <LuChevronRight className="absolute top-1/2 -right-1.5 -translate-y-1/2 text-gray-300 text-lg" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
