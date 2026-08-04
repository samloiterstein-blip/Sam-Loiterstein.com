import { lazy, Suspense, type ComponentType } from "react";
import type { WorkSystem } from "@/data/content";

const demoMap: Record<string, ComponentType<{ onOpenDemo?: () => void }>> = {
  GenreExplorer: lazy(() => import("./GenreExplorer").then((m) => ({ default: m.GenreExplorer }))),
  DealClassifierPreview: lazy(() =>
    import("./DealClassifierPreview").then((m) => ({ default: m.DealClassifierPreview }))
  ),
  DealClassifier: lazy(() => import("./DealClassifier").then((m) => ({ default: m.DealClassifier }))),
  VoiceCompare: lazy(() => import("./VoiceCompare").then((m) => ({ default: m.VoiceCompare }))),
  SdrBasePreview: lazy(() =>
    import("./SdrBasePreview").then((m) => ({ default: m.SdrBasePreview }))
  ),
  SignalClassifier: lazy(() =>
    import("./SignalClassifier").then((m) => ({ default: m.SignalClassifier }))
  ),
  NexusEngagementMatcher: lazy(() =>
    import("./NexusEngagementMatcher").then((m) => ({ default: m.NexusEngagementMatcher }))
  ),
  SynthEmbed: lazy(() => import("./SynthEmbed").then((m) => ({ default: m.SynthEmbed }))),
};

const portalMap: Record<string, ComponentType<{ embedded?: boolean }>> = {
  SdrBasePreview: lazy(() =>
    import("./sdr/SdrShell").then((m) => ({
      default: function SdrPortal() {
        return <m.SdrShell compact className="!h-full min-h-0" />;
      },
    }))
  ),
  DealClassifierPreview: lazy(() =>
    import("./DealClassifierDemo").then((m) => ({
      default: function DealClassifierPortal({ embedded }: { embedded?: boolean }) {
        return <m.DealClassifierDemo embedded={embedded} />;
      },
    }))
  ),
  DealClassifier: lazy(() =>
    import("./DealClassifierDemo").then((m) => ({
      default: function DealClassifierPortal({ embedded }: { embedded?: boolean }) {
        return <m.DealClassifierDemo embedded={embedded} />;
      },
    }))
  ),
  VoiceCompare: lazy(() =>
    import("./VoiceCompare").then((m) => ({
      default: function VoicePortal() {
        return <m.VoiceCompare embedded />;
      },
    }))
  ),
  GenreExplorer: lazy(() =>
    import("./GenreFeedDemo").then((m) => ({ default: m.GenreFeedDemo }))
  ),
  NexusEngagementMatcher: lazy(() =>
    import("./NexusEngagementMatcher").then((m) => ({
      default: function NexusPortal() {
        return <m.NexusEngagementMatcher />;
      },
    }))
  ),
};

const previewWithDrawer = new Set(["GenreExplorer", "DealClassifierPreview", "SdrBasePreview"]);

function DemoFallback({ portal }: { portal?: boolean }) {
  return (
    <div
      className={
        portal
          ? "flex h-full min-h-[360px] items-center justify-center rounded-2xl bg-sage-50/50 text-sm text-ink-400"
          : "flex h-full min-h-[120px] items-center justify-center rounded-lg bg-ink-50/60 text-xs text-ink-400"
      }
    >
      Loading demo…
    </div>
  );
}

export function WorkDemo({
  system,
  onOpenDemo,
  variant = "preview",
}: {
  system: WorkSystem;
  onOpenDemo?: () => void;
  variant?: "preview" | "portal";
}) {
  if (!system.demo) return null;

  if (variant === "portal") {
    const Portal = portalMap[system.demo.component];
    if (!Portal) return null;

    return (
      <div className="work-portal-demo h-full min-h-0 w-full">
        <Suspense fallback={<DemoFallback portal />}>
          <Portal embedded />
        </Suspense>
      </div>
    );
  }

  const Component = demoMap[system.demo.component];
  if (!Component) return null;

  const Preview = Component as React.ComponentType<{ onOpenDemo?: () => void }>;

  return (
    <div className="h-full min-h-0">
      <Suspense fallback={<DemoFallback />}>
        {previewWithDrawer.has(system.demo.component) ? (
          <Preview onOpenDemo={onOpenDemo} />
        ) : (
          <Component />
        )}
      </Suspense>
    </div>
  );
}
