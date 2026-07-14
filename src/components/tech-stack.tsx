import { getTranslations } from "next-intl/server";
import { H2, H3, P } from "@/components/ui/typography";

function Diamond({ filled = false }: { filled?: boolean }) {
  return (
    <div className="relative size-5 rotate-45 border-[1.5px] border-foreground rounded-[2px]">
      {filled && (
        <div className="absolute inset-1.5 bg-foreground rounded-[1px]" />
      )}
    </div>
  );
}

function Circle() {
  return (
    <div className="size-5 rounded-full border-[1.5px] border-foreground" />
  );
}

type SkillCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
};

function SkillCard({ icon, title, description, tags }: SkillCardProps) {
  return (
    <div className="group/card border border-border flex flex-col gap-6 md:gap-8 p-5 md:p-8 hover:bg-accent transition-colors duration-300">
      {icon}
      <div className="flex flex-col gap-3">
        <H3 className="transition-colors duration-300">{title}</H3>
        <P
          size="lg"
          className="text-muted-foreground font-light transition-colors duration-300"
        >
          {description}
        </P>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 border border-border text-label-sm text-muted-foreground transition-colors duration-300 group-hover/card:border-foreground/30"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export async function TechStack() {
  const t = await getTranslations("TechStack");

  const skills = [
    {
      icon: <Diamond filled />,
      title: t("frontend"),
      description: t("frontendDesc"),
      tags: [
        "NEXT.JS",
        "REACT",
        "TYPESCRIPT",
        "TAILWIND CSS",
        "REACT NATIVE",
        "MOTION",
      ],
    },
    {
      icon: <Diamond />,
      title: t("backend"),
      description: t("backendDesc"),
      tags: [
        "NODE.JS",
        "NEST.JS",
        "GO",
        "PYTHON",
        "POSTGRESQL",
        "REDIS",
        "DOCKER",
      ],
    },
    {
      icon: <Circle />,
      title: t("tools"),
      description: t("toolsDesc"),
      tags: ["SANITY CMS", "GIT", "VERCEL", "LINUX", "FIGMA", "CI/CD"],
    },
  ];

  return (
    <section className="py-24">
      <div className="w-full h-px bg-border mb-8" />

      <div className="flex flex-col gap-4 mb-8 md:mb-12">
        <span className="font-mono text-label-xs tracking-[5px] text-muted-foreground/30 uppercase">
          {t("label")}
        </span>
        <H2>
          {t("title")}{" "}
          <span className="font-display italic text-muted-foreground">
            {t("titleHighlight")}
          </span>
        </H2>
        <P size="lg" className="text-muted-foreground font-light max-w-lg">
          {t("description")}
        </P>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
        {skills.map((skill) => (
          <SkillCard key={skill.title} {...skill} />
        ))}
      </div>
    </section>
  );
}
