export default function CheckoutSteps({ activeStep = 0 }: { activeStep?: number }) {
  const steps = ["Contact", "Address", "Delivery", "Payment", "Review"];

  return (
    <div className="mt-8 px-2 sm:px-8">
      <div className="relative grid grid-cols-5">
        <div className="absolute left-[10%] right-[10%] top-3.5 h-px bg-line" />
        {steps.map((step, index) => (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2 text-center">
            <span className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${index <= activeStep ? "bg-green-600 text-white" : "border border-line bg-white text-slate-soft"}`}>{index + 1}</span>
            <span className={`text-[10px] font-semibold sm:text-xs ${index <= activeStep ? "text-green-600" : "text-navy"}`}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
