"use client";

import { PRICE_BOUNDS } from "@/app/data/shop-filters";

export default function PriceRangeSlider({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const { min: boundMin, max: boundMax } = PRICE_BOUNDS;

  const handleMin = (value: number) => onChange(Math.min(value, max - 1), max);
  const handleMax = (value: number) => onChange(min, Math.max(value, min + 1));

  const minPercent = ((min - boundMin) / (boundMax - boundMin)) * 100;
  const maxPercent = ((max - boundMin) / (boundMax - boundMin)) * 100;

  return (
    <div>
      <div className="relative h-1.5">
        <div className="absolute inset-0 rounded-full bg-gray-100" />
        <div
          className="absolute h-full rounded-full bg-green-500"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={boundMin}
          max={boundMax}
          value={min}
          onChange={(e) => handleMin(Number(e.target.value))}
          className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
        />
        <input
          type="range"
          min={boundMin}
          max={boundMax}
          value={max}
          onChange={(e) => handleMax(Number(e.target.value))}
          className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
        />
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <input
          type="number"
          value={min}
          onChange={(e) => handleMin(Number(e.target.value))}
          className="w-full rounded-md border border-line px-2 py-1.5 outline-none focus:border-navy"
        />
        <span className="text-slate-soft">–</span>
        <input
          type="number"
          value={max}
          onChange={(e) => handleMax(Number(e.target.value))}
          className="w-full rounded-md border border-line px-2 py-1.5 outline-none focus:border-navy"
        />
      </div>
    </div>
  );
}
