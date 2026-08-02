import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useSdrDense } from "./SdrDenseContext";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  const dense = useSdrDense();
  return (
    <header
      className={cn(
        "flex flex-wrap items-start justify-between gap-2 border-b border-sage-200/80",
        dense ? "pb-2" : "pb-4"
      )}
    >
      <div>
        {eyebrow && !dense && (
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-sage-600">{eyebrow}</p>
        )}
        <h1 className={cn("font-display tracking-tight text-ink-900", dense ? "text-sm" : "text-xl")}>
          {title}
        </h1>
        {description && !dense && (
          <p className="mt-1 max-w-lg text-xs leading-relaxed text-ink-500">{description}</p>
        )}
      </div>
      {actions}
    </header>
  );
}

export function Pill({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  const dense = useSdrDense();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full font-medium transition",
        dense ? "px-2 py-0.5 text-[9px]" : "px-3 py-1 text-[11px]",
        active
          ? "bg-sage-700 text-cream shadow-sm"
          : "bg-white/80 text-ink-600 ring-1 ring-sage-200/90 hover:bg-sage-50 hover:text-sage-800"
      )}
    >
      {children}
    </button>
  );
}

export function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "default" | "success" | "warn" | "muted";
}) {
  const dense = useSdrDense();
  const ring =
    accent === "success"
      ? "ring-sage-400/40"
      : accent === "warn"
        ? "ring-amber-300/50"
        : accent === "muted"
          ? "ring-ink-200/60"
          : "ring-sage-200/80";

  return (
    <div className={cn("rounded-2xl bg-white/90 ring-1 backdrop-blur-sm", dense ? "p-2.5" : "p-3.5", ring)}>
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-400">{label}</div>
      <div
        className={cn(
          "mt-1 font-display tracking-tight text-ink-900",
          dense ? "text-base" : "text-2xl"
        )}
      >
        {value}
      </div>
      {sub && (
        <div className={cn("text-ink-500", dense ? "mt-0.5 text-[8px] leading-tight" : "mt-1 text-[10px]")}>
          {sub}
        </div>
      )}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-white/95 ring-1 ring-sage-200/70 backdrop-blur-sm", className)}>
      {children}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-xl border-0 bg-white/90 px-3 py-2 text-xs text-ink-800 ring-1 ring-sage-200/90 placeholder:text-ink-400 focus:ring-2 focus:ring-sage-500/40",
        className
      )}
    />
  );
}

export function Btn({
  children,
  variant = "secondary",
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition disabled:opacity-50",
        variant === "primary" && "bg-sage-700 text-cream hover:bg-sage-800",
        variant === "secondary" && "bg-white text-ink-700 ring-1 ring-sage-200 hover:bg-sage-50",
        variant === "ghost" && "text-sage-700 hover:bg-sage-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warn" | "brand" | "info";
}) {
  const tones = {
    neutral: "bg-ink-100 text-ink-600",
    success: "bg-sage-100 text-sage-800",
    warn: "bg-amber-50 text-amber-900",
    brand: "bg-sage-700/10 text-sage-800",
    info: "bg-blue-50 text-blue-900",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", tones[tone])}>{children}</span>
  );
}

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <Panel className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-xs">{children}</table>
    </Panel>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th className="border-b border-sage-100 bg-sage-50/50 px-3 py-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-500">
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <td className={cn("border-b border-sage-50/80 px-3 py-2.5 text-ink-700", className)}>{children}</td>
  );
}

export const pageWrap = "space-y-5 animate-fade-up";

export function usePageWrap() {
  const dense = useSdrDense();
  return dense ? "space-y-2.5 animate-fade-up" : pageWrap;
}
