import Image from "next/image";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import ProductsDarkImg from "@/public/line-up.jpeg";
import { CTA_STATS } from "@/app/data/science-page";

export default function CtaBanner() {
    return (
        <section className="container-page pb-10">
            <div className="relative overflow-hidden rounded-2xl bg-navy-deep">
                <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
                            Nutrition that&apos;s Honest.
                            <br />
                            Results that Last.
                        </h2>
                        <p className="mt-2 max-w-xs text-xs text-white/70">
                            Choose TheGrowthHealth – Where Science Meets Nutrition.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        {CTA_STATS.map(({ icon: Icon, value, label }) => (
                            <div key={label} className="flex items-center gap-2">
                                <span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-lg text-white">
                                    <Icon />
                                </span>
                                <p className="text-[11px] leading-snug text-white/80">
                                    <span className="block text-sm font-bold text-white">{value}</span>
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/shop"
                        className="flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-navy-900 hover:bg-gray-100"
                    >
                        Explore Our Products <IoArrowForward />
                    </Link>
                </div>

                <div className="pointer-events-none absolute right-0 bottom-0 h-full w-40 opacity-60 sm:w-56">
                    <Image src={ProductsDarkImg} alt="" fill className="object-contain object-bottom" />
                </div>
            </div>
        </section>
    );
}