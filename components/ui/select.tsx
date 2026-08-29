import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(({ className, children, ...props }, ref) => <select ref={ref} className={cn("flex h-10 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-navy outline-none transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}>{children}</select>);
Select.displayName = "Select";
export { Select };
