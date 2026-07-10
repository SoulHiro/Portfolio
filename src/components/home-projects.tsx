import Image from "next/image";
import { ArrowUpRight, GitBranch } from "lucide-react";

type Project = {
  name: string;
  description: string;
  technologies: string[];
  liveUrl: string | null;
  githubRepo: string | null;
  image: string;
  imageAlt: string;
  wip?: boolean;
};

const PROJECTS: Project[] = [
  {
    name: "Âmbar Ecommerce",
    description:
      "Ecommerce de moda para classes A/B. Autenticação, catálogo com variantes, checkout e painel administrativo.",
    technologies: ["Next.js", "TypeScript", "Drizzle ORM", "PostgreSQL"],
    liveUrl: "https://ambar-ecommerce.vercel.app/",
    githubRepo: "SoulHiro/AmbarCommerce",
    image: "/images/ambar-banner.webp",
    imageAlt:
      "Casal em casacos de outono em parque com névoa — campanha editorial Âmbar",
    wip: true,
  },
  {
    name: "Portfolio",
    description:
      "Este site. Next.js App Router, Sanity CMS, i18n, ISR e design system próprio.",
    technologies: ["Next.js", "Sanity", "TypeScript", "Tailwind"],
    liveUrl: "https://victormts.dev",
    githubRepo: "SoulHiro/portfolio",
    image: "/banner.webp",
    imageAlt: "SoulHiro Studio — identidade visual do portfólio",
  },
];

function ProjectCard({
  project,
  className = "",
  priority = false,
  imageSize = "(max-width: 1024px) 100vw, 50vw",
}: {
  project: Project;
  className?: string;
  priority?: boolean;
  imageSize?: string;
}) {
  const githubUrl = project.githubRepo
    ? `https://github.com/${project.githubRepo}`
    : null;

  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <Image
        src={project.image}
        alt={project.imageAlt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        priority={priority}
        sizes={imageSize}
      />

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />

      {/* top-right badges */}
      {project.wip && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 border border-white/15">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
            <span className="relative inline-flex size-1.5 rounded-full bg-amber-400" />
          </span>
          <span className="font-mono text-label-xs text-white/70 tracking-widest uppercase">
            Em construção
          </span>
        </div>
      )}

      {/* content */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col gap-3">
        <div>
          <h3 className="font-display text-h3 text-white leading-tight">
            <em>{project.name}</em>
          </h3>
          <p className="text-body-sm text-white/65 leading-relaxed mt-1.5 max-w-sm">
            {project.description}
          </p>
        </div>

        <p className="font-mono text-label-xs text-white/35 tracking-wide">
          {project.technologies.join("  ·  ")}
        </p>

        <div className="flex items-center gap-2.5 pt-0.5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-label-sm font-medium text-white border border-white/30 px-3.5 py-1.5 hover:bg-white hover:text-black transition-colors duration-300"
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
              className="inline-flex items-center gap-1.5 text-label-sm text-white/50 border border-white/20 px-3.5 py-1.5 hover:text-white hover:border-white/40 transition-colors duration-300"
            >
              <GitBranch className="size-3.5" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function HomeProjects() {
  return (
    <section className="py-24">
      <div className="flex flex-col gap-3 mb-10">
        <div className="w-full h-px bg-border" />
        <h2 className="font-display text-display-md tracking-tight leading-tight pt-6">
          Projetos{" "}
          <span className="italic text-muted-foreground">selecionados</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <ProjectCard
          project={PROJECTS[0]}
          className="aspect-[16/10] lg:aspect-auto lg:col-span-2 lg:h-[540px]"
          priority
          imageSize="(max-width: 1024px) 100vw, 66vw"
        />
        <ProjectCard
          project={PROJECTS[1]}
          className="aspect-[4/3] lg:aspect-auto lg:h-[540px]"
          imageSize="(max-width: 1024px) 100vw, 33vw"
        />
      </div>
    </section>
  );
}
