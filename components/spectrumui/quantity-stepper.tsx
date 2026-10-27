"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onValueChange,
  min = 1,
  max = 99,
  className,
}: {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const repeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [shaking, setShaking] = useState(false);

  const changeValue = (delta: number) => {
    const next = Math.max(min, Math.min(max, value + delta));
    if (next === value) {
      setShaking(true);
      window.setTimeout(() => setShaking(false), 180);
      return;
    }
    onValueChange(next);
  };

  const stopRepeating = () => {
    if (repeatTimerRef.current) clearTimeout(repeatTimerRef.current);
    if (repeatIntervalRef.current) clearInterval(repeatIntervalRef.current);
    repeatTimerRef.current = null;
    repeatIntervalRef.current = null;
  };

  const startRepeating = (delta: number) => {
    stopRepeating();
    repeatTimerRef.current = setTimeout(() => {
      repeatIntervalRef.current = setInterval(() => changeValue(delta), 90);
    }, 350);
  };

  useEffect(() => stopRepeating, []);

  const buttonClass = "flex h-full w-9 items-center justify-center text-slate-soft transition-colors hover:bg-slate-50 hover:text-navy disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <motion.div
      animate={shaking ? { x: [0, -3, 3, -2, 2, 0] } : { x: 0 }}
      transition={{ duration: 0.18 }}
      className={cn("flex h-11 items-center overflow-hidden rounded-lg border border-line bg-white", className)}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => changeValue(-1)}
        onPointerDown={() => startRepeating(-1)}
        onPointerUp={stopRepeating}
        onPointerCancel={stopRepeating}
        onPointerLeave={stopRepeating}
        className={buttonClass}
      >
        <Minus className="size-4" />
      </button>
      <span className="flex min-w-9 justify-center overflow-hidden text-sm font-semibold tabular-nums text-navy">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => changeValue(1)}
        onPointerDown={() => startRepeating(1)}
        onPointerUp={stopRepeating}
        onPointerCancel={stopRepeating}
        onPointerLeave={stopRepeating}
        className={buttonClass}
      >
        <Plus className="size-4" />
      </button>
    </motion.div>
  );
}
