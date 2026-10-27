import Image from "next/image";
import { IoCheckmarkCircle } from "react-icons/io5";
import SupplementFactsImg from "@/public/nutrition-facts.webp";
import ProductsImg from "@/public/line-up.jpeg";
import { TRANSPARENCY_POINTS } from "@/app/data/science-page";

export default function TransparencyBanner() {
    return (
        <section className="container-page pb-16">
            <div className="grid items-center gap-6 overflow-hidden rounded-2xl bg-green-soft p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr_1fr]">
                <div className="relative order-1 hidden h-32 sm:block lg:h-40">
                    <Image src={SupplementFactsImg} alt="Supplement facts label" fill className="object-contain" />
                </div>

                <div className="order-2">
                    <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
                        We Believe in 100% Transparency
                    </h2>
                    <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-soft">
                        You have the right to know what goes into your body. That&apos;s why we disclose every ingredient
                        and its exact quantity.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                        {TRANSPARENCY_POINTS.map((point) => (
                            <span key={point} className="flex items-center gap-1.5 text-[11px] font-medium text-navy">
                                <IoCheckmarkCircle className="text-green-600" />
                                {point}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="relative order-3 h-32 sm:h-40">
                    <Image src={ProductsImg} alt="TheGrowthHealth product lineup" fill className="object-contain" />
                </div>
            </div>
        </section>
    );
}