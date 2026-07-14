import { getTranslations } from "next-intl/server";
import { H3, P } from "@/components/ui/typography";

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

type ExpertiseCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
};

function ExpertiseCard({ icon, title, description, tags }: ExpertiseCardProps) {
  return (
    <div
      data-expertise-card
      className="group/card border border-border flex flex-col gap-6 md:gap-8 p-5 md:p-8 hover:bg-accent transition-colors duration-300 bg-background"
    >
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

export async function Expertise() {
  const t = await getTranslations("Expertise");

  const cards = [
    {
      icon: <Diamond filled />,
      title: t("item1Title"),
      description: t("item1Desc"),
      tags: ["Next.js", "React", "TypeScript", "Tailwind", "Motion", "A11y"],
    },
    {
      icon: <Diamond />,
      title: t("item2Title"),
      description: t("item2Desc"),
      tags: ["Node.js", "NestJS", "PostgreSQL", "Redis", "Docker", "Go"],
    },
    {
      icon: <Circle />,
      title: t("item3Title"),
      description: t("item3Desc"),
      tags: ["System Design", "UX", "Founder", "SaaS"],
    },
  ];

  return (
    <section
      id="expertise"
      className="min-h-screen flex flex-col justify-center"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
        {cards.map((card) => (
          <ExpertiseCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
