"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function HoldToConfirmButton({
  onConfirm,
  children,
  holdDuration = 900,
  size = "md",
  className,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  onConfirm: () => void;
  children?: ReactNode;
  holdDuration?: number;
  size?: "sm" | "md";
}) {
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const holdingRef = useRef(false);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    timerRef.current = null;
    frameRef.current = null;
  };

  const cancel = () => {
    if (confirmed) return;
    clearTimers();
    holdingRef.current = false;
    setProgress(0);
  };

  const start = () => {
    if (props.disabled || holdingRef.current || confirmed) return;
    holdingRef.current = true;
    startedAtRef.current = performance.now();
    const tick = (now: number) => {
      const next = Math.min((now - startedAtRef.current) / holdDuration, 1);
      setProgress(next);
      if (next < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    timerRef.current = setTimeout(() => {
      clearTimers();
      holdingRef.current = false;
      setProgress(1);
      setConfirmed(true);
      timerRef.current = setTimeout(() => {
        onConfirm();
        setConfirmed(false);
        setProgress(0);
      }, 900);
    }, holdDuration);
  };

  useEffect(() => () => clearTimers(), []);

  return (
    <button
      {...props}
      type="button"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-md border border-red-200 bg-white font-semibold text-red-500 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-8 min-w-20 px-3 text-[10px]" : "h-9 min-w-24 px-4 text-xs",
        className,
      )}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 bg-red-100"
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.05, ease: "linear" }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {confirmed ? (
          <motion.span
            key="confirmed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative"
          >
            Confirmed
          </motion.span>
        ) : (
          <motion.span
            key="hold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {children ?? "Hold to Confirm"}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export const HoldToConfirm = HoldToConfirmButton;
