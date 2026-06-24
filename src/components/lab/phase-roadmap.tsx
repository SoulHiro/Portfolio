import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type Phase = {
  number: string;
  title: string;
  description: string;
  status: "done" | "active" | "upcoming";
};

const PHASES: Phase[] = [
  {
    number: "01",
    title: "MVP",
    description: "Core WhatsApp flow, onboarding, PGR survey engine",
    status: "active",
  },
  {
    number: "02",
    title: "Scale",
    description: "Multi-tenant, billing, analytics dashboard",
    status: "upcoming",
  },
  {
    number: "03",
    title: "Growth",
    description: "Marketplace integrations, referral system",
    status: "upcoming",
  },
  {
    number: "04",
    title: "Enterprise",
    description: "Custom contracts, SLA, dedicated infrastructure",
    status: "upcoming",
  },
];

const statusConfig = {
  done: { dot: "bg-foreground", line: "bg-foreground", label: "Completed" },
  active: { dot: "bg-emerald-500", line: "bg-border", label: "In progress" },
  upcoming: { dot: "bg-border", line: "bg-border", label: null },
};

export function PhaseRoadmap({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-6">
      <Label size="xs" className="tracking-[3px] text-muted-foreground/60">
        {label}
      </Label>

      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-start gap-0">
        {PHASES.map((phase, i) => {
          const cfg = statusConfig[phase.status];
          const isLast = i === PHASES.length - 1;
          return (
            <div key={phase.number} className="flex items-start flex-1">
              <div className="flex flex-col gap-3 flex-1">
                {/* Dot + connector */}
                <div className="flex items-center">
                  <span
                    className={cn(
                      "size-2 rounded-full shrink-0 ring-2 ring-background",
                      cfg.dot,
                      phase.status === "active" && "ring-emerald-500/30 ring-4",
                    )}
                  />
                  {!isLast && (
                    <span className={cn("flex-1 h-px mx-3", cfg.line)} />
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "flex flex-col gap-1 pr-6",
                    phase.status === "upcoming" && "opacity-40",
                  )}
                >
                  <span className="text-label-xs text-muted-foreground/50 font-mono">
                    {phase.number}
                  </span>
                  <span
                    className={cn(
                      "text-body-sm font-medium",
                      phase.status === "active" && "text-emerald-500",
                    )}
                  >
                    {phase.title}
                  </span>
                  <span className="text-label-xs text-muted-foreground/60 leading-relaxed">
                    {phase.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex md:hidden flex-col gap-0">
        {PHASES.map((phase, i) => {
          const cfg = statusConfig[phase.status];
          const isLast = i === PHASES.length - 1;
          return (
            <div key={phase.number} className="flex gap-4">
              {/* Left: dot + vertical line */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "size-2 rounded-full shrink-0 ring-2 ring-background mt-1",
                    cfg.dot,
                    phase.status === "active" && "ring-emerald-500/30 ring-4",
                  )}
                />
                {!isLast && (
                  <span className={cn("w-px flex-1 my-1", cfg.line)} />
                )}
              </div>

              {/* Right: content */}
              <div
                className={cn(
                  "flex flex-col gap-1 pb-6",
                  phase.status === "upcoming" && "opacity-40",
                )}
              >
                <span className="text-label-xs text-muted-foreground/50 font-mono">
                  {phase.number}
                </span>
                <span
                  className={cn(
                    "text-body-sm font-medium",
                    phase.status === "active" && "text-emerald-500",
                  )}
                >
                  {phase.title}
                </span>
                <span className="text-label-xs text-muted-foreground/60 leading-relaxed">
                  {phase.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
