import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedSwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const AnimatedSwitch = React.forwardRef<HTMLButtonElement, AnimatedSwitchProps>(
  ({ className, checked = false, onCheckedChange, onClick, ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(event) => {
        onCheckedChange?.(!checked);
        onClick?.(event);
      }}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-emerald-600" : "bg-slate-300",
        className,
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  ),
);
AnimatedSwitch.displayName = "AnimatedSwitch";
