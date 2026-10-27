"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type AnimatedSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectChangeEvent = { target: { value: string; name?: string } };

type AnimatedSelectProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (event: SelectChangeEvent) => void;
  options: AnimatedSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  className?: string;
  name?: string;
  id?: string;
  "aria-label"?: string;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  searchable?: boolean;
  clearable?: boolean;
};

const sizeClasses = {
  sm: "min-h-8 px-2.5 text-[10px]",
  md: "min-h-10 px-3 text-xs",
  lg: "min-h-12 px-4 text-sm",
};

export function AnimatedSelect({
  value,
  defaultValue = "",
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  label,
  error,
  className,
  name,
  id,
  "aria-label": ariaLabel,
  required = false,
  size = "md",
  searchable = false,
  clearable = false,
}: AnimatedSelectProps) {
  const generatedId = useId();
  const selectId = id ?? `animated-select-${generatedId}`;
  const listboxId = `${selectId}-listbox`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, above: false });

  const selectedValue = value ?? internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue);
  const filteredOptions = useMemo(
    () => searchable && query.trim()
      ? options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))
      : options,
    [options, query, searchable],
  );
  const enabledIndexes = filteredOptions
    .map((option, index) => option.disabled ? -1 : index)
    .filter((index) => index >= 0);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuHeight = Math.min(Math.max(filteredOptions.length * 36 + 16, 56), 280);
    const spaceBelow = window.innerHeight - rect.bottom;
    const above = spaceBelow < menuHeight && rect.top > spaceBelow;
    setPosition({
      top: above ? Math.max(8, rect.top - menuHeight - 6) : rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      above,
    });
  }, [filteredOptions.length]);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    const handleViewportChange = () => updatePosition();
    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, updatePosition]);

  const activeHighlightedIndex = filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled
    ? highlightedIndex
    : enabledIndexes[0] ?? 0;

  useEffect(() => {
    if (open) optionRefs.current[activeHighlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeHighlightedIndex, open]);

  const commitValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onChange?.({ target: { value: nextValue, name } });
    setQuery("");
    setOpen(false);
    triggerRef.current?.focus();
  };

  const moveHighlight = (direction: 1 | -1) => {
    if (!enabledIndexes.length) return;
    const currentPosition = enabledIndexes.indexOf(highlightedIndex);
    const nextPosition = currentPosition < 0
      ? 0
      : (currentPosition + direction + enabledIndexes.length) % enabledIndexes.length;
    setHighlightedIndex(enabledIndexes[nextPosition]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      else moveHighlight(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      else moveHighlight(-1);
    } else if (event.key === "Home" && open) {
      event.preventDefault();
      setHighlightedIndex(enabledIndexes[0] ?? 0);
    } else if (event.key === "End" && open) {
      event.preventDefault();
      setHighlightedIndex(enabledIndexes.at(-1) ?? 0);
    } else if ((event.key === "Enter" || event.key === " ") && !open) {
      event.preventDefault();
      setOpen(true);
    } else if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      const option = filteredOptions[activeHighlightedIndex];
      if (option && !option.disabled) commitValue(option.value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  const menu = typeof document !== "undefined" ? createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? `${selectId}-label` : undefined}
          initial={{ opacity: 0, y: position.above ? 4 : -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position.above ? 4 : -4, scale: 0.98 }}
          transition={{ duration: 0.14, ease: "easeOut" }}
          style={{ position: "fixed", top: position.top, left: position.left, width: position.width, zIndex: 1000 }}
          className="overflow-hidden rounded-lg border border-line bg-white p-1.5 shadow-xl"
        >
          {searchable && (
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  moveHighlight(event.key === "ArrowDown" ? 1 : -1);
                }
                if (event.key === "Enter") {
                  event.preventDefault();
                  const option = filteredOptions[activeHighlightedIndex];
                  if (option && !option.disabled) commitValue(option.value);
                }
                if (event.key === "Escape") setOpen(false);
              }}
              placeholder="Search..."
              className="mb-1.5 w-full rounded-md border border-line px-2.5 py-2 text-xs text-navy outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          )}
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length ? filteredOptions.map((option, index) => (
              <button
                key={option.value}
                ref={(element) => { optionRefs.current[index] = element; }}
                type="button"
                role="option"
                aria-selected={option.value === selectedValue}
                disabled={option.disabled}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => commitValue(option.value)}
                className={cn(
                  "flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs text-navy transition-colors cursor-pointer",
                  option.value === selectedValue && "bg-green-soft font-semibold text-green-700",
                  index === activeHighlightedIndex && option.value !== selectedValue && "bg-slate-50",
                  option.disabled && "cursor-not-allowed opacity-40",
                )}
              >
                {option.label}
              </button>
            )) : <p className="px-2.5 py-2 text-xs text-slate-soft">No options found</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  ) : null;

  return (
    <div className={cn("w-full", className)}>
      {label && <label id={`${selectId}-label`} htmlFor={selectId} className="mb-1.5 block text-xs font-semibold text-navy">{label}{required && " *"}</label>}
      <div className="relative">
        <button
          ref={triggerRef}
          id={selectId}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-label={ariaLabel}
          aria-invalid={Boolean(error)}
          disabled={disabled}
          onClick={() => {
            setOpen((current) => !current);
            setQuery("");
            const selectedIndex = filteredOptions.findIndex((option) => option.value === selectedValue);
            setHighlightedIndex(selectedIndex >= 0 && !filteredOptions[selectedIndex]?.disabled ? selectedIndex : enabledIndexes[0] ?? 0);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-white text-left text-navy outline-none transition focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            sizeClasses[size],
            error && "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/20",
          )}
        >
          <span className={cn("truncate", !selectedOption && "text-slate-soft")}>{selectedOption?.label ?? placeholder}</span>
          <span className="flex shrink-0 items-center gap-1">
            {clearable && selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear selection"
                onClick={(event) => { event.stopPropagation(); commitValue(""); }}
                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); commitValue(""); } }}
                className="rounded p-0.5 text-slate-soft hover:bg-slate-100 hover:text-navy"
              ><X className="size-3" /></span>
            )}
            <ChevronDown className={cn("size-4 text-slate-soft transition-transform duration-150", open && "rotate-180")} />
          </span>
        </button>
        {name && <input type="text" name={name} value={selectedValue} required={required} tabIndex={-1} aria-hidden="true" onChange={() => undefined} className="sr-only" />}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {menu}
    </div>
  );
}
