import { INGREDIENTS } from "@/app/data/science-page";
import Image from "next/image";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";

export default function IngredientsGrid() {
    return (
        <section className="container-page">
            <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
                            Powerful Ingredients. Proven Results.
                        </h2>
                        <p className="mt-1 text-xs text-slate-soft">
                            We use premium, research-backed ingredients in effective doses.
                        </p>
                    </div>
                    <Link
                        href="/ingredients"
                        className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
                    >
                        View All Ingredients <IoArrowForward />
                    </Link>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {INGREDIENTS.map(({ name, description, image }: { name: string; description: string; image: string }) => (
                        <div key={name} className="rounded-xl border border-line p-3">
                            <div className="relative h-20 w-full overflow-hidden rounded-lg bg-gray-50">
                                <Image src={image} alt={name} fill className="object-cover" />
                            </div>
                            <p className="mt-3 text-xs font-semibold text-navy">{name}</p>
                            <p className="mt-1 text-[11px] leading-snug text-slate-soft">{description}</p>
                            <Link
                                href={`/ingredients/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-green-600 hover:text-green-700"
                            >
                                Learn More <IoArrowForward className="text-[10px]" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}