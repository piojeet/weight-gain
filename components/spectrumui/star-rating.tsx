"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onValueChange,
  max = 5,
  showValue = false,
  label = "Rating",
  readOnly = false,
  size = "sm",
  className,
}: {
  value?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  showValue?: boolean;
  label?: string;
  readOnly?: boolean;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const [preview, setPreview] = useState<number | null>(null);
  const [internalValue, setInternalValue] = useState(value ?? 0);
  const [direction, setDirection] = useState(1);
  const committedValue = value ?? internalValue;
  const activeValue = preview ?? committedValue;
  const iconSize = size === "xs" ? "size-3" : size === "md" ? "size-6" : "size-4";
  const commitValue = (nextValue: number) => {
    setDirection(nextValue >= committedValue ? 1 : -1);
    setPreview(null);
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      onMouseLeave={() => setPreview(null)}
    >
      <div className="flex items-center" role={readOnly ? "img" : "radiogroup"} aria-label={label}>
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const filled = starValue <= activeValue;
          const control = (
            <motion.span
              animate={{ scale: filled ? 1.08 : 1, rotate: filled ? [0, -8, 8, 0] : 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="block"
            >
              <Star className={cn(iconSize, filled ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
            </motion.span>
          );

          if (readOnly) return <span key={starValue}>{control}</span>;
          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-label={`${starValue} out of ${max} stars`}
              aria-checked={committedValue === starValue}
              onMouseEnter={() => {
                setDirection(starValue >= committedValue ? 1 : -1);
                setPreview(starValue);
              }}
              onFocus={() => {
                setDirection(starValue >= committedValue ? 1 : -1);
                setPreview(starValue);
              }}
              onBlur={() => setPreview(null)}
              onClick={() => commitValue(committedValue === starValue ? 0 : starValue)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                  event.preventDefault();
                  commitValue(Math.min(max, starValue + 1));
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                  event.preventDefault();
                  commitValue(Math.max(0, starValue - 1));
                }
                if (event.key === "Home") {
                  event.preventDefault();
                  commitValue(1);
                }
                if (event.key === "End") {
                  event.preventDefault();
                  commitValue(max);
                }
              }}
              className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {control}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold tabular-nums text-slate-soft">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.span
              key={activeValue}
              custom={direction}
              variants={{
                enter: (movement: number) => ({ y: movement * 5 }),
                center: { y: 0 },
                exit: (movement: number) => ({ y: movement * -5 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="inline-block"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeValue}
            </motion.span>
          </AnimatePresence>
          /{max}
        </span>
      )}
    </div>
  );
}
