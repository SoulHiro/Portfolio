import { ArrowUpRight } from "lucide-react";
import { Label } from "@/components/ui/typography";

type PastProject = {
  name: string;
  category: string;
  year: string;
  url?: string;
};

const PAST_PROJECTS: PastProject[] = [
  { name: "Nuvio", category: "SaaS / Finance", year: "2025" },
  { name: "Discord Bots", category: "Automation", year: "2022" },
  { name: "Roblox Servers", category: "Game / Lua", year: "2019" },
];

export function PastProjects({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-6">
      <Label size="xs" className="tracking-[3px] text-muted-foreground/60">
        {label}
      </Label>

      <div className="flex flex-col">
        {PAST_PROJECTS.map((p) => {
          const Inner = (
            <div className="flex items-center justify-between py-4 border-b border-border group">
              <div className="flex items-center gap-3">
                <span className="text-body-sm font-medium group-hover:text-foreground transition-colors duration-200">
                  {p.name}
                </span>
                {p.url && (
                  <ArrowUpRight className="size-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors duration-200" />
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-label-xs text-muted-foreground/50">
                  {p.category}
                </span>
                <span className="text-label-xs text-muted-foreground/30 font-mono">
                  {p.year}
                </span>
              </div>
            </div>
          );

          return p.url ? (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {Inner}
            </a>
          ) : (
            <div key={p.name}>{Inner}</div>
          );
        })}
      </div>
    </div>
  );
}
