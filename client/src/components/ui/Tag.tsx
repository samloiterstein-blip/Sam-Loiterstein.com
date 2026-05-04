import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-sage-200 bg-sage-50 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-sage-800",
        className
      )}
    >
      {children}
    </span>
  );
}
