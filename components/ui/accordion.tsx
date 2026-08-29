"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AccordionContextValue = {
  value: string[];
  setValue: (value: string[]) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const ItemContext = React.createContext<string | null>(null);

export function Accordion({
  children,
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  className,
}: {
  children: React.ReactNode;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const setValue = (nextValue: string[]) => {
    if (controlledValue === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  return <AccordionContext.Provider value={{ value, setValue }}><div className={cn(className)}>{children}</div></AccordionContext.Provider>;
}

export function AccordionItem({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return <ItemContext.Provider value={value}><div className={cn("border-b border-line", className)}>{children}</div></ItemContext.Provider>;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ children, className, ...props }, ref) => {
  const accordion = React.useContext(AccordionContext);
  const itemValue = React.useContext(ItemContext);
  if (!accordion || !itemValue) throw new Error("AccordionTrigger must be used inside AccordionItem and Accordion");
  const open = accordion.value.includes(itemValue);
  const contentId = `accordion-content-${itemValue.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return <button ref={ref} type="button" aria-expanded={open} aria-controls={contentId} onClick={() => accordion.setValue(open ? accordion.value.filter((value) => value !== itemValue) : [...accordion.value, itemValue])} className={cn("flex w-full items-center justify-between text-left", className)} {...props}>{children}<ChevronDown aria-hidden="true" className={cn("shrink-0 transition-transform", open && "rotate-180")} /></button>;
});
AccordionTrigger.displayName = "AccordionTrigger";

export function AccordionContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const accordion = React.useContext(AccordionContext);
  const itemValue = React.useContext(ItemContext);
  if (!accordion || !itemValue) throw new Error("AccordionContent must be used inside AccordionItem and Accordion");
  const open = accordion.value.includes(itemValue);
  const contentId = `accordion-content-${itemValue.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return <div id={contentId} role="region" aria-hidden={!open} className={cn("grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0", className)}><div className="min-h-0">{children}</div></div>;
}
