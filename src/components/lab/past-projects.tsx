"use client";

import { useState } from "react";
import { ArrowUpRight, GitBranch, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/typography";
import type { SanityLabProjectListing } from "@/lib/sanity/types";

type Props = {
  label: string;
  projects: SanityLabProjectListing[];
};

export function PastProjects({ label, projects }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  if (projects.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <Label size="xs" className="tracking-[3px] text-muted-foreground/60">
        {label}
      </Label>

      <div className="flex flex-col">
        {projects.map((p) => {
          const isOpen = open === p._id;
          const liveUrl = p.liveUrl;
          const githubUrl = p.githubRepo
            ? `https://github.com/${p.githubRepo}`
            : null;
          const techs = p.technologies ?? [];

          return (
            <div key={p._id} className="border-b border-border last:border-b-0">
              {/* Row header — always visible */}
              <button
                onClick={() => setOpen(isOpen ? null : p._id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between py-4 gap-6 group text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-body-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-200 truncate">
                    {p.name}
                  </span>

                  {/* Tech pills — top 3, desktop only */}
                  {techs.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="hidden sm:inline-flex shrink-0 text-label-xs text-muted-foreground/60 border border-border rounded-full px-2.5 py-0.5 leading-none"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-all duration-300 motion-reduce:transition-none"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {/* Expandable body — grid-rows trick for smooth height animation */}
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 flex flex-col gap-4">
                    {p.description && (
                      <p className="text-body-sm text-muted-foreground leading-relaxed max-w-xl">
                        {p.description}
                      </p>
                    )}

                    {/* All tech tags */}
                    {techs.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {techs.map((t) => (
                          <span
                            key={t}
                            className="text-label-xs text-muted-foreground/70 border border-border rounded-full px-2.5 py-1"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    {(liveUrl || githubUrl) && (
                      <div className="flex items-center gap-5 pt-1">
                        {liveUrl && (
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-label-sm text-foreground hover:text-muted-foreground transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Ver projeto
                            <ArrowUpRight className="size-3.5" />
                          </a>
                        )}
                        {githubUrl && (
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-label-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GitBranch className="size-3.5" />
                            GitHub
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
