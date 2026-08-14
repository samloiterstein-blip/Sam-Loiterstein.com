import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type DemoFrameProps = {
  children: ReactNode;
  className?: string;
  /** Card carousel previews — avoids clipping footer actions */
  variant?: "default" | "card";
};

export function DemoFrame({ children, className, variant = "default" }: DemoFrameProps) {
  return (
    <div
      data-analytics="demo:frame"
      className={cn("demo-panel flex h-full min-h-0 w-full flex-col", className)}
    >
      <div
        className={cn(
          "flex w-full flex-1 flex-col",
          variant === "card"
            ? "justify-center overflow-visible py-1"
            : "min-h-0 items-center justify-center overflow-hidden"
        )}
      >
        {children}
      </div>
    </div>
  );
}
