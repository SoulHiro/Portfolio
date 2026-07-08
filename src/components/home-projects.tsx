import { ArrowUpRight, GitBranch } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { HOME_PROJECTS_QUERY } from "@/lib/sanity/queries";
import type { SanityLabProjectListing } from "@/lib/sanity/types";

const MOCK_PROJECTS: SanityLabProjectListing[] = [
  {
    _id: "mock-1",
    name: "CampoMind",
    description: "SaaS de saúde mental no agro via WhatsApp. PGR automatizado conforme NR-1.",
    technologies: ["Next.js", "NestJS", "TypeScript", "WhatsApp API", "PostgreSQL"],
    liveUrl: "https://campomind.com.br",
    githubRepo: null,
  },
  {
    _id: "mock-2",
    name: "Nuvio",
    description: "Plataforma financeira para autônomos e MEIs. Gestão de contratos e cobranças.",
    technologies: ["React", "NestJS", "PostgreSQL", "Stripe"],
    liveUrl: "https://nuvio.com.br",
    githubRepo: "SoulHiro/nuvio",
  },
  {
    _id: "mock-3",
    name: "Linha de Comando",
    description: "Estudo prático de terminal, shell script e acesso remoto via SSH.",
    technologies: ["Bash", "Linux", "SSH", "zsh"],
    liveUrl: null,
    githubRepo: "SoulHiro/terminal-studies",
  },
  {
    _id: "mock-4",
    name: "Portfolio",
    description: "Este site. Next.js 15, Sanity CMS, i18n, ISR.",
    technologies: ["Next.js", "Sanity", "TypeScript", "Tailwind"],
    liveUrl: "https://victormts.dev",
    githubRepo: "SoulHiro/portfolio",
  },
];

function ProjectCard({
  project,
  className = "",
}: {
  project: SanityLabProjectListing;
  className?: string;
}) {
  const liveUrl = project.liveUrl;
  const githubUrl = project.githubRepo
    ? `https://github.com/${project.githubRepo}`
    : null;
  const techs = project.technologies ?? [];

  return (
    <div
      className={`group flex flex-col gap-5 border border-border p-6 md:p-8 bg-background hover:bg-muted/30 transition-colors duration-300 ${className}`}
    >
      {/* Name + description */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-display text-h3 tracking-tight leading-tight">
          {project.name}
        </h3>
        {project.description && (
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      {/* Tech tags */}
      {techs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {techs.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-label-xs text-muted-foreground/60 border border-border px-2.5 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* CTAs */}
      {(liveUrl || githubUrl) && (
        <div className="flex items-center gap-2 pt-1 mt-auto">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-label-sm font-medium text-foreground border border-foreground px-3.5 py-1.5 hover:bg-foreground hover:text-background transition-colors duration-300"
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
              className="inline-flex items-center gap-1.5 text-label-sm text-muted-foreground border border-border px-3.5 py-1.5 hover:border-foreground hover:text-foreground transition-colors duration-300"
            >
              <GitBranch className="size-3.5" />
              GitHub
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export async function HomeProjects() {
  let projects = await client.fetch<SanityLabProjectListing[]>(
    HOME_PROJECTS_QUERY,
    {},
    { next: { tags: ["lab"] } },
  );

  if (!projects || projects.length < 4) {
    const real = projects ?? [];
    const usedIds = new Set(real.map((p) => p._id));
    const filler = MOCK_PROJECTS.filter((m) => !usedIds.has(m._id));
    projects = [...real, ...filler].slice(0, 4);
  }

  const [p1, p2, p3, p4] = projects;

  return (
    <section className="py-24">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-10">
        <div className="w-full h-px bg-border" />
        <h2 className="font-display text-display-md tracking-tight leading-tight pt-6">
          Projetos{" "}
          <span className="italic text-muted-foreground">selecionados</span>
        </h2>
      </div>

      {/* Bento grid — mobile: 1 col / desktop: assimétrico 3 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Card 1 — wide (col-span-2), taller */}
        {p1 && (
          <ProjectCard
            project={p1}
            className="lg:col-span-2 lg:row-span-2 lg:min-h-[320px]"
          />
        )}

        {/* Card 2 — tall right */}
        {p2 && (
          <ProjectCard
            project={p2}
            className="lg:col-start-3 lg:row-span-2 lg:min-h-[320px]"
          />
        )}

        {/* Card 3 — small bottom-left */}
        {p3 && (
          <ProjectCard project={p3} />
        )}

        {/* Card 4 — wide bottom */}
        {p4 && (
          <ProjectCard project={p4} className="lg:col-span-2" />
        )}
      </div>
    </section>
  );
}
