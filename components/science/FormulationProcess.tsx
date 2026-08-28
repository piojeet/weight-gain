import { FORMULATION_STEPS } from "@/app/data/science-page";

export default function FormulationProcess() {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container-page">
                <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
                    Our Formulation Process
                </h2>
                <p className="mt-1 text-xs text-slate-soft">
                    From ingredient selection to your hands — we follow a strict process.
                </p>

                <div className="mt-10 grid grid-cols-2 gap-y-10 sm:grid-cols-5 sm:gap-x-4">
                    {FORMULATION_STEPS.map(({ icon: Icon, title, subtitle }, i) => (
                        <div key={title} className="relative flex flex-col items-center px-2 text-center">
                            <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-xl text-green-600">
                                <Icon />
                            </span>
                            <p className="mt-3 text-xs font-semibold text-navy">
                                {i + 1}. {title}
                            </p>
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-soft">{subtitle}</p>

                            {i < FORMULATION_STEPS.length - 1 && (
                                <span className="absolute top-7 left-[calc(50%+2rem)] hidden w-[calc(100%-4rem)] border-t-2 border-dashed border-gray-300 sm:block" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}