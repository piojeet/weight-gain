import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";
import { FaLeaf } from "react-icons/fa";
import { HiShieldCheck } from "react-icons/hi2";
import { IoFlask, IoStar } from "react-icons/io5";
import User1 from "@/public/trusted-users/user1.jpg";
import HeroImg from "@/public/hero.png";
import HeroBg from "@/public/hero-bg.png";

const BENEFITS = [
  { icon: FaLeaf, label: "High Quality Ingredients" },
  { icon: IoFlask, label: "Scientifically Formulated" },
  { icon: HiShieldCheck, label: "Clean & Transparent" },
];

const STATS = [
  { value: "25g", label: "Protein Per Serving", pos: "left-0 top-[18%]" },
  { value: "560", label: "Calories Per Serving", pos: "left-0 bottom-[24%]" },
  { value: "27", label: "Vitamins & Minerals", pos: "right-0 top-[14%]" },
  { value: "3g", label: "Creatine Monohydrate", pos: "right-0 bottom-[20%]" },
];

export default function Hero() {
  return (
    <section className="gradient-blue">
      <div className="container-page relative">
        <Image
          src={HeroBg}
          alt="bg"
          className="w-fit h-full object-cover absolute top-0 right-0 opacity-25 hidden md:block"
        />
        <div className="relative md:grid flex flex-col-reverse items-center gap-12 py-14 md:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-20">
          <div>
            <div className="text-[10px] leading-none text-brand-green font-bold bg-green-soft w-fit py-2 px-4 rounded-full">
              SCIENTIFIC NUTRITION
            </div>
            <h1 className="lg:text-[56px] leading-none md:text-[40px] text-[32px] font-bold md:my-6 my-4 md:mb-8">
              <span className="text-navy">Healthy Weight.</span>
              <br />
              <span className="text-brand-green">Stronger You.</span>
            </h1>
            <p className="text-sm text-slate-soft">
              Thoughtfully formulated nutrition with fully disclosed
              ingredients, third-party lab testing and clear labels — so you
              always know exactly what you&apos;re taking.
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-sm font-medium text-ink"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-card">
                    <Icon className="size-5 text-brand-green" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <div className="md:mt-8 mt-6 flex flex-wrap gap-3">
              <a
                href="#range"
                className="group inline-flex min-h-12 items-center gap-2 rounded-lg bg-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-deep"
              >
                Shop Products
                <BsArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#range"
                className="inline-flex min-h-12 items-center rounded-lg border border-navy/25 bg-card px-6 text-sm font-semibold text-navy transition-colors hover:bg-secondary"
              >
                Explore Range
              </a>
            </div>

            <div className="md:mt-8 mt-6 flex flex-wrap items-center gap-4">
              <div className="flex -space-x-2">
                {[User1, User1, User1, User1].map((c, i) => (
                  <span
                    key={i}
                    className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border-2 border-card bg-secondary text-xs font-bold text-navy"
                    style={{ zIndex: 4 - i }}
                  >
                    <Image
                      src={c}
                      alt="user"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
              <div>
                <p className="flex items-center gap-1 text-sm text-slate-soft">
                  <span className="flex text-star gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IoStar key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </span>
                </p>
                <p className="text-sm font-semibold text-ink">
                  Trusted by 10,000+ customers
                </p>
              </div>
            </div>
          </div>

          <div className="md:absolute relative md:right-0 md:top-1/2 md:-translate-y-1/2 py-6 flex items-center justify-center h-full md:max-w-[50%] w-full">
          <Image
          src={HeroBg}
          alt="bg"
          className="w-fit h-full object-cover absolute top-0 right-0 opacity-25 md:hidden"
        />
            <Image
              src={HeroImg}
              alt="hero"
              className="h-full object-contain right-0 w-fit left-auto"
            />

            {STATS.map((s, i) => (
              <div
                key={s.value + s.label}
                className={`animate-fade-up absolute ${s.pos} w-[112px] rounded-2xl border border-line/60 bg-linear-to-br from-card via-card/95 to-card/80 p-3 shadow-[0_8px_24px_-4px_rgba(16,42,67,0.15),0_2px_8px_-2px_rgba(16,42,67,0.1)] backdrop-blur-md sm:w-[132px] sm:p-4`}
                style={{ animationDelay: `${200 + i * 120}ms` }}
              >
                <p className="font-display text-xl font-extrabold text-navy sm:text-2xl">
                  {s.value}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-slate-soft sm:text-[11px]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
