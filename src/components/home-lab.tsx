import { Link } from "@/i18n/navigation";
import { MoveRight } from "lucide-react";
import { client } from "@/lib/sanity/client";
import {
  LAB_SETTINGS_QUERY,
  LAB_PROJECT_FALLBACK_QUERY,
  LAB_STATUS_QUERY,
} from "@/lib/sanity/queries";
import type {
  SanityLabSettings,
  SanityLabProject,
  SanityLabStatus,
} from "@/lib/sanity/types";

export async function HomeLab() {
  const [settings, labStatus] = await Promise.all([
    client.fetch<SanityLabSettings | null>(
      LAB_SETTINGS_QUERY,
      {},
      { next: { tags: ["lab"] } },
    ),
    client.fetch<SanityLabStatus | null>(
      LAB_STATUS_QUERY,
      {},
      { next: { tags: ["lab"] } },
    ),
  ]);

  const project: SanityLabProject | null =
    settings?.featuredProject ??
    (await client.fetch<SanityLabProject | null>(
      LAB_PROJECT_FALLBACK_QUERY,
      {},
      { next: { tags: ["lab"] } },
    ));

  if (!project) return null;

  const activePhase = project.roadmap?.find((s) => s.status === "active");

  return (
    <section className="py-24 flex flex-col gap-12">
      {/* Header */}
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="relative inline-flex size-1.5 rounded-full bg-red-500" />
            </span>
            <span className="font-mono text-label-xs tracking-[5px] text-red-500 uppercase animate-pulse">
              Ao vivo
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="font-mono text-label-xs tracking-[5px] text-muted-foreground/50 dark:text-muted-foreground/30 uppercase">
              Lab
            </span>
          </div>
          <h2 className="font-display text-display-md tracking-tight leading-tight">
            {project.name}
          </h2>
        </div>
        <Link
          href="/lab"
          className="hidden sm:inline-flex items-center gap-2 text-label-sm text-muted-foreground hover:text-foreground transition-colors duration-300 shrink-0"
        >
          Ver o lab
          <MoveRight className="size-4" />
        </Link>
      </div>

      <div className="w-full h-px bg-border" />

      {/* Status grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {activePhase && (
          <div className="flex flex-col gap-4">
            <span className="font-mono text-label-xs tracking-[4px] text-muted-foreground/50 dark:text-muted-foreground/30 uppercase">
              Fase atual
            </span>
            <p className="text-body-md font-medium">{activePhase.title}</p>
            {activePhase.description && (
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                {activePhase.description}
              </p>
            )}
          </div>
        )}

        {labStatus && (
          <div className="flex flex-col gap-4">
            <span className="font-mono text-label-xs tracking-[4px] text-muted-foreground/50 dark:text-muted-foreground/30 uppercase">
              Situação
            </span>
            <p className="text-body-sm text-muted-foreground leading-relaxed line-clamp-4">
              {labStatus.body}
            </p>
          </div>
        )}
      </div>

      {/* Mobile link */}
      <Link
        href="/lab"
        className="sm:hidden inline-flex items-center gap-2 text-label-sm text-muted-foreground hover:text-foreground transition-colors duration-300 w-fit"
      >
        Ver o lab
        <MoveRight className="size-4" />
      </Link>
    </section>
  );
}
