import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { SanityRoadmapStep } from "@/lib/sanity/types";

const statusConfig = {
  done: { dot: "bg-foreground", line: "bg-foreground", label: "Completed" },
  active: { dot: "bg-emerald-600 dark:bg-emerald-500", line: "bg-border", label: "In progress" },
  upcoming: { dot: "bg-border", line: "bg-border", label: null },
};

type PhaseRoadmapProps = {
  label: string;
  steps: SanityRoadmapStep[];
};

export function PhaseRoadmap({ label, steps }: PhaseRoadmapProps) {
  if (steps.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <Label size="xs" className="tracking-[3px] text-muted-foreground/60">
        {label}
      </Label>

      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-start gap-0">
        {steps.map((step, i) => {
          const cfg = statusConfig[step.status];
          const isLast = i === steps.length - 1;
          return (
            <div key={step.phase} className="flex items-start flex-1">
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center">
                  <span
                    className={cn(
                      "size-2 rounded-full shrink-0 ring-2 ring-background",
                      cfg.dot,
                      step.status === "active" && "ring-emerald-600/30 dark:ring-emerald-500/30 ring-4",
                    )}
                  />
                  {!isLast && (
                    <span className={cn("flex-1 h-px mx-3", cfg.line)} />
                  )}
                </div>

                <div
                  className={cn(
                    "flex flex-col gap-1 pr-6",
                    step.status === "upcoming" && "opacity-60 dark:opacity-40",
                  )}
                >
                  <span className="text-label-xs text-muted-foreground/50 font-mono">
                    {String(step.phase).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-body-sm font-medium",
                      step.status === "active" && "text-emerald-600 dark:text-emerald-500",
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-label-xs text-muted-foreground/60 leading-relaxed">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex md:hidden flex-col gap-0">
        {steps.map((step, i) => {
          const cfg = statusConfig[step.status];
          const isLast = i === steps.length - 1;
          return (
            <div key={step.phase} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "size-2 rounded-full shrink-0 ring-2 ring-background mt-1",
                    cfg.dot,
                    step.status === "active" && "ring-emerald-600/30 dark:ring-emerald-500/30 ring-4",
                  )}
                />
                {!isLast && (
                  <span className={cn("w-px flex-1 my-1", cfg.line)} />
                )}
              </div>

              <div
                className={cn(
                  "flex flex-col gap-1 pb-6",
                  step.status === "upcoming" && "opacity-60 dark:opacity-40",
                )}
              >
                <span className="text-label-xs text-muted-foreground/50 font-mono">
                  {String(step.phase).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-body-sm font-medium",
                    step.status === "active" && "text-emerald-600 dark:text-emerald-500",
                  )}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-label-xs text-muted-foreground/60 leading-relaxed">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
