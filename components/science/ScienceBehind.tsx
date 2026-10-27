import Image from "next/image";
import WheyImg from "@/public/line-up.jpeg";
import { SCIENCE_FEATURES } from "@/app/data/science-page";

export default function ScienceBehind() {
    return (
        <section className="container-page py-16">
            <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
                The Science Behind Our Products
            </h2>
            <p className="mt-1 text-xs text-slate-soft">
                Every product is developed with research, innovation and precision.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_1fr_1fr_1.1fr]">
                {SCIENCE_FEATURES.map(({ icon: Icon, title, subtitle }) => (
                    <div key={title} className="rounded-xl border border-line bg-white p-5">
                        <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-xl text-green-600">
                            <Icon />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-soft">{subtitle}</p>
                    </div>
                ))}

                <div className="relative col-span-2 h-56 overflow-hidden rounded-2xl sm:col-span-1 lg:h-auto">
                    <Image src={WheyImg} alt="TheGrowthHealth Whey Protein tub" fill className="object-cover" />
                    <span className="absolute top-4 right-4 flex size-16 items-center justify-center rounded-full bg-green-600 p-2 text-center text-[10px] font-semibold text-white">
                        Science You Can Trust
                    </span>
                </div>
            </div>
        </section>
    );
}