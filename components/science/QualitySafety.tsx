import { CERTIFICATIONS } from "@/app/data/science-page";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";

export default function QualitySafety() {
    return (
        <section className="container-page py-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
                <div>
                    <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
                        Quality & Safety
                        <br />
                        Our Top Priority
                    </h2>
                    <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-soft">
                        We follow international standards to ensure you get nothing but the best.
                    </p>
                    <Link
                        href="/quality"
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-green-500 px-4 py-2 text-xs font-semibold text-green-600 hover:bg-green-soft"
                    >
                        Learn About Our Quality <IoArrowForward />
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                    {CERTIFICATIONS.map(({ label, sublabel, description }) => (
                        <div key={label} className="flex flex-col items-center text-center">
                            <span className="flex size-16 items-center justify-center rounded-full border border-dashed border-navy/30 text-[10px] font-bold text-navy">
                                {label}
                                <br />
                                {sublabel}
                            </span>
                            <p className="mt-2 text-[10px] leading-tight text-slate-soft">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}