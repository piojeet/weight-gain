import Image from "next/image";
import {
  PiMicroscopeLight,
  PiTagLight,
  PiDropLight,
  PiShieldCheckLight,
} from "react-icons/pi";
import ScientistImg from "@/public/MLT.jpg";

const FEATURES = [
  {
    icon: PiMicroscopeLight,
    title: "Evidence Based",
    subtitle: "Formulas developed using scientific research.",
  },
  {
    icon: PiTagLight,
    title: "Transparent Labels",
    subtitle: "Know exactly what goes into your nutrition.",
  },
  {
    icon: PiDropLight,
    title: "Better Absorption",
    subtitle: "Nutrients in right ratio for maximum absorption.",
  },
  {
    icon: PiShieldCheckLight,
    title: "Safe & Effective",
    subtitle: "Clean, tested & safe for everyday use.",
  },
];

export default function ScienceSection() {
  return (
    <section className="container-page grid items-center gap-6 md:py-16 py-10 lg:grid-cols-2 lg:gap-14">
      <div className="relative h-64 w-full overflow-hidden rounded-2xl sm:h-80 lg:h-105">
        <Image
          src={ScientistImg}
          alt="Scientist researching nutrition formulas"
          fill
          className="object-cover"
        />
      </div>

      <div>
        <p className="text-xs font-bold tracking-wide text-green-600">
          SCIENCE BACKED. RESULTS DRIVEN.
        </p>
        <h2 className="font-display mt-2 text-2xl md:text-3xl font-extrabold text-navy sm:text-4xl">
          Nutrition That Works
          <br />
          The Scientific Way
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-soft">
          Every formula is designed after research, backed by science and made
          with clean, high-quality ingredients.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
          {FEATURES.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-lg text-brand-blue">
                <Icon />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">{title}</p>
                <p className="mt-0.5 text-xs text-slate-soft">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
