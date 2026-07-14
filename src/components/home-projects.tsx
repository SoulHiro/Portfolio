import { ArrowUpRight, GitBranch } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

type Project = {
  name: string;
  description: string;
  technologies: string[];
  liveUrl: string | null;
  githubRepo: string | null;
  image: string | null;
  placeholderGradient?: string;
  imageAlt: string;
  wip?: boolean;
  caseStudy?: boolean;
};

function ProjectCard({
  project,
  wipLabel,
  caseStudyLabel,
  className = "",
  priority = false,
  compact = false,
  imageSize = "(max-width: 1024px) 100vw, 50vw",
  ...rest
}: {
  project: Project;
  wipLabel: string;
  caseStudyLabel: string;
  className?: string;
  priority?: boolean;
  compact?: boolean;
  imageSize?: string;
  [key: string]: unknown;
}) {
  const githubUrl = project.githubRepo
    ? `https://github.com/${project.githubRepo}`
    : null;

  return (
    <div className={`group relative overflow-hidden ${className}`} {...rest}>
      {project.image ? (
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          quality={90}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={priority}
          sizes={imageSize}
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ background: project.placeholderGradient }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.22,
          mixBlendMode: "screen",
        }}
        aria-hidden="true"
      />

      <div className="absolute top-4 right-4 flex items-center gap-2">
        {project.caseStudy && (
          <span className="font-mono text-label-xs text-white/70 tracking-widest uppercase bg-black/50 backdrop-blur-sm px-2.5 py-1 border border-white/15">
            Case Study
          </span>
        )}
        {project.wip && (
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 border border-white/15">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
              <span className="relative inline-flex size-1.5 rounded-full bg-amber-400" />
            </span>
            <span className="font-mono text-label-xs text-white/70 tracking-widest uppercase">
              {wipLabel}
            </span>
          </div>
        )}
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-3 ${compact ? "p-5" : "p-6 md:p-8"}`}
      >
        <div>
          <h3
            className={`font-display text-white leading-tight ${compact ? "text-h4" : "text-h3"}`}
          >
            <em>{project.name}</em>
          </h3>
          {project.description && (
            <p
              className={`text-white/65 leading-relaxed mt-1 ${compact ? "text-label-sm" : "text-body-sm mt-1.5 max-w-sm"}`}
            >
              {project.description}
            </p>
          )}
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
              {project.caseStudy ? caseStudyLabel : project.name}
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

export async function HomeProjects() {
  const t = await getTranslations("HomeProjects");

  const ambar: Project = {
    name: "Âmbar Ecommerce",
    description: t("ambar.description"),
    technologies: ["Next.js", "TypeScript", "Drizzle ORM", "PostgreSQL"],
    liveUrl: "https://ambar-ecommerce.vercel.app/",
    githubRepo: "SoulHiro/AmbarCommerce",
    image: "/images/ambar-banner.webp",
    imageAlt: t("ambar.imageAlt"),
    wip: true,
  };

  const campomind: Project = {
    name: "CampoMind",
    description: t("campomind.description"),
    technologies: [
      "Next.js 16",
      "React 19",
      "Drizzle ORM",
      "Neon",
      "Better Auth",
    ],
    liveUrl: "https://campomind.com.br/",
    githubRepo: "SoulHiro/CampoMind",
    image: null,
    placeholderGradient:
      "linear-gradient(160deg, oklch(0.22 0 0) 0%, oklch(0.13 0 0) 100%)",
    imageAlt: t("campomind.imageAlt"),
    wip: true,
  };

  const doutores: Project = {
    name: "Doutores Palhaços",
    description: t("doutores.description"),
    technologies: ["Next.js", "TypeScript", "Drizzle ORM", "Neon"],
    liveUrl: "https://doutorespalhacos.com/",
    githubRepo: "SoulHiro/DoctorSite",
    image: null,
    placeholderGradient:
      "linear-gradient(160deg, oklch(0.19 0 0) 0%, oklch(0.12 0 0) 100%)",
    imageAlt: t("doutores.imageAlt"),
  };

  return (
    <section id="work" className="py-24">
      <div
        data-hp-header=""
        className="flex flex-col items-center mb-12 relative"
      >
        <img
          src="/cat.svg"
          alt=""
          aria-hidden="true"
          data-hp-cat=""
          className="w-[7.5rem] h-[7.5rem]"
        />
        <h2
          data-hp-title=""
          className="font-display text-display-md tracking-tight leading-tight text-center"
        >
          {t("title")}{" "}
          <span className="italic text-muted-foreground">
            {t("titleHighlight")}
          </span>
        </h2>
      </div>

      <div
        data-hp-grid=""
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        <ProjectCard
          project={ambar}
          wipLabel={t("wip")}
          caseStudyLabel={t("caseStudy")}
          className="aspect-square"
          compact
          priority
          imageSize="(max-width: 640px) 100vw, 33vw"
          data-hp-card=""
        />
        <ProjectCard
          project={campomind}
          wipLabel={t("wip")}
          caseStudyLabel={t("caseStudy")}
          className="aspect-square"
          compact
          imageSize="(max-width: 640px) 100vw, 33vw"
          data-hp-card=""
        />
        <ProjectCard
          project={doutores}
          wipLabel={t("wip")}
          caseStudyLabel={t("caseStudy")}
          className="aspect-square"
          compact
          imageSize="(max-width: 640px) 100vw, 33vw"
          data-hp-card=""
        />
      </div>
    </section>
  );
}
