import { GitCommitHorizontal } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import type { SanityLabProject } from "@/lib/sanity/types";

type LastCommit = { message: string; relativeTime: string } | null;

async function fetchLastCommit(repo: string): Promise<LastCommit> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/commits?per_page=1`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const [commit] = await res.json();
    const date = new Date(commit.commit.author.date);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);
    const diffDays = Math.floor(diffHours / 24);
    let relativeTime: string;
    if (diffHours < 1) relativeTime = "agora mesmo";
    else if (diffHours < 24) relativeTime = `${diffHours}h atrás`;
    else if (diffDays === 1) relativeTime = "ontem";
    else if (diffDays < 30) relativeTime = `${diffDays}d atrás`;
    else relativeTime = date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
    return { message: commit.commit.message.split("\n")[0].slice(0, 72), relativeTime };
  } catch {
    return null;
  }
}

type ProjectHeroProps = {
  project: SanityLabProject;
};

export async function ProjectHero({ project }: ProjectHeroProps) {
  const lastCommit = project.githubRepo
    ? await fetchLastCommit(project.githubRepo)
    : null;

  const tech = project.technologies ?? [];

  return (
    <div className="flex flex-col gap-8">
      {project.architectureNotes && (
        <div className="flex flex-col gap-3 max-w-2xl">
          <p className="text-body-md text-foreground leading-relaxed">
            {project.architectureNotes}
          </p>
        </div>
      )}

      {tech.length > 0 && (
        <p className="font-mono text-label-xs text-muted-foreground/35 leading-loose">
          {tech.join("  ·  ")}
        </p>
      )}

      {project.githubRepo && (
        <a
          href={`https://github.com/${project.githubRepo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 border border-border px-4 py-2 text-label-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors duration-300 w-fit"
        >
          <IconBrandGithub className="size-4" />
          {project.githubRepo}
        </a>
      )}

      {lastCommit && (
        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <GitCommitHorizontal className="size-3.5 text-muted-foreground/25 shrink-0" />
          <span className="font-mono text-label-xs text-muted-foreground/40 truncate">
            {lastCommit.message}
          </span>
          <span className="font-mono text-label-xs text-muted-foreground/25 shrink-0 ml-auto">
            {lastCommit.relativeTime}
          </span>
        </div>
      )}
    </div>
  );
}
