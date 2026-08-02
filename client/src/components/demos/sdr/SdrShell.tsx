import { Menu, Plug, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { NavId } from "@/data/acmeSdrDemo";
import { SdrDenseContext } from "./SdrDenseContext";
import { APP_NAME, APP_SUBTITLE, navSections, renderSdrPage } from "./SdrPages";

type SdrShellProps = {
  compact?: boolean;
  className?: string;
};

const flatNav = [
  ...navSections.flatMap((s) => s.items.map((i) => ({ ...i, section: s.label }))),
  { id: "integrations" as NavId, label: "Integrations", section: "System", icon: Plug },
];

export function SdrShell({ compact = false, className }: SdrShellProps) {
  const [active, setActive] = useState<NavId>("revops");
  const [menuOpen, setMenuOpen] = useState(false);
  const dense = compact;

  const activeMeta = useMemo(
    () => flatNav.find((n) => n.id === active) ?? flatNav[0],
    [active]
  );

  return (
    <SdrDenseContext.Provider value={dense}>
      <div
        className={cn(
          "sdr-demo relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl ring-1 ring-sage-200/90",
          "bg-[linear-gradient(165deg,#f8f7f2_0%,#eef3ef_48%,#f8f7f2_100%)]",
          dense && "sdr-dense text-[11px]",
          className
        )}
      >
        <header className="shrink-0 border-b border-sage-200/70 bg-white/70 px-2.5 py-1.5 backdrop-blur-md sm:px-3">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-[13px] font-medium tracking-tight text-ink-900">
                  {APP_NAME}
                </span>
                <span className="rounded-full bg-sage-100 px-1.5 py-px text-[8px] font-medium uppercase tracking-wider text-sage-700">
                  {APP_SUBTITLE}
                </span>
              </div>
              {!dense && (
                <p className="mt-0.5 truncate text-[10px] text-ink-500">
                  {activeMeta.section} · {activeMeta.label}
                </p>
              )}
            </div>
            {!dense && (
              <button
                type="button"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white ring-1 ring-sage-200 lg:hidden"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle navigation"
              >
                {menuOpen ? <X size={14} /> : <Menu size={14} />}
              </button>
            )}
          </div>

          <nav
            className={cn(
              "mt-1.5 gap-0.5",
              dense
                ? "flex flex-nowrap overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                : cn(
                    menuOpen ? "flex flex-wrap" : "hidden lg:flex lg:flex-wrap",
                    "gap-1"
                  )
            )}
            aria-label="SDR demo sections"
          >
            {flatNav.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActive(item.id);
                    setMenuOpen(false);
                  }}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 font-medium transition",
                    dense ? "text-[10px]" : "text-[11px] rounded-xl px-2.5 py-1.5",
                    isActive
                      ? "bg-sage-700 text-cream shadow-sm"
                      : "text-ink-600 hover:bg-white/90 hover:text-sage-800"
                  )}
                >
                  <Icon size={dense ? 11 : 13} strokeWidth={2} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {!dense && menuOpen && (
          <div className="absolute inset-x-0 top-[52px] z-20 max-h-[45%] overflow-y-auto border-b border-sage-200 bg-cream/98 p-2 backdrop-blur-lg lg:hidden">
            <div className="grid grid-cols-2 gap-1">
              {flatNav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActive(item.id);
                    setMenuOpen(false);
                  }}
                  className={cn(
                    "rounded-lg px-2 py-1.5 text-left text-[10px] font-medium",
                    active === item.id ? "bg-sage-700 text-cream" : "bg-white ring-1 ring-sage-200 text-ink-700"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-2 sm:px-3">
          {renderSdrPage(active)}
        </main>
      </div>
    </SdrDenseContext.Provider>
  );
}
