import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(({ className, checked = false, onCheckedChange, ...props }, ref) => (
  <button ref={ref} type="button" role="switch" aria-checked={checked} onClick={() => onCheckedChange?.(!checked)} className={cn("relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-600", checked && "bg-green-600", className)} {...props}>
    <span className={cn("pointer-events-none block size-4 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform", checked && "translate-x-4")} />
  </button>
));
Switch.displayName = "Switch";
export { Switch };
