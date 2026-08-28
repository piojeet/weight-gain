import Image from "next/image";
import Link from "next/link";
import { IoChevronForward, IoCheckmarkCircle } from "react-icons/io5";
import type { IconType } from "react-icons";
import LabImg from "@/public/lab-hero.jpg";
import { HERO_BADGES, OUR_PROMISE } from "@/app/data/science-page";

export default function ScienceHero() {
    return (
        <section className="container-page py-8">
            <div className="flex items-center gap-1.5 text-xs text-slate-soft">
                <Link href="/" className="hover:text-navy">
                    Home
                </Link>
                <IoChevronForward className="text-[10px]" />
                <span className="text-navy">Science & Ingredients</span>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                    <h1 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">
                        Science & Ingredients
                    </h1>
                    <p className="mt-2 text-sm font-semibold text-green-600">
                        Backed by Science. Powered by Nature.
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-soft">
                        At NutriGain, every formula is a perfect blend of scientific research and nature&apos;s finest
                        ingredients to deliver real results you can feel.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-6">
                        {HERO_BADGES.map(({ icon: Icon, label, sublabel }: { icon: IconType; label: string; sublabel: string }) => (
                            <div key={label} className="flex items-center gap-2">
                                <Icon className="text-xl text-green-600" />
                                <p className="text-xs font-medium text-navy">
                                    {label}
                                    <br />
                                    {sublabel}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-72 lg:h-80">
                        <Image src={LabImg} alt="Lab ingredients for NutriGain formulas" fill className="object-cover" />
                    </div>

                    <div className="absolute top-4 right-4 w-44 rounded-xl bg-white/95 p-4 shadow-md backdrop-blur-sm sm:w-52">
                        <p className="text-xs font-bold text-navy">Our Promise</p>
                        <ul className="mt-2 space-y-1.5">
                            {OUR_PROMISE.map((item) => (
                                <li key={item} className="flex items-center gap-1.5 text-[11px] text-slate-soft">
                                    <IoCheckmarkCircle className="shrink-0 text-green-600" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}