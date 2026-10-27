"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ShareAction = {
  icon: ReactNode;
  label: string;
  onSelect: () => void | Promise<void>;
};

export function ShareButton({
  copyValue,
  actions = [],
  className,
}: {
  copyValue: string;
  actions?: ShareAction[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const copyLink = async () => {
    await navigator.clipboard?.writeText(copyValue);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Share product"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-white px-3 text-xs font-semibold text-navy shadow-sm transition hover:border-green-400 hover:text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      >
        <Share2 className={cn("size-4 transition-transform duration-300", open && "rotate-12 scale-110")} />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.92, transformOrigin: "top right" }}
            animate={{ opacity: 1, y: 0, scale: 1, transformOrigin: "top right" }}
            exit={{ opacity: 0, y: -5, scale: 0.94, transformOrigin: "top right" }}
            transition={{ type: "spring", stiffness: 420, damping: 26, mass: 0.7 }}
            role="menu"
            className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-line bg-white p-1.5 shadow-xl"
          >
            <div className="grid gap-0.5">
              {actions.map((action, index) => (
                <motion.button
                  key={action.label}
                  type="button"
                  role="menuitem"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.045, duration: 0.16, ease: "easeOut" }}
                  onClick={() => {
                    void action.onSelect();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-navy transition hover:bg-green-soft hover:text-green-700"
                >
                  {action.icon}
                  {action.label}
                </motion.button>
              ))}
              <motion.button
                type="button"
                role="menuitem"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: actions.length * 0.045, duration: 0.16, ease: "easeOut" }}
                onClick={() => void copyLink()}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-navy transition hover:bg-green-soft hover:text-green-700"
              >
                {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                {copied ? "Link copied" : "Copy link"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
