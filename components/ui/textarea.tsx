import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => <textarea ref={ref} className={cn("flex min-h-20 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-navy outline-none transition-all duration-200 placeholder:text-slate-soft focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />);
Textarea.displayName = "Textarea";
export { Textarea };
