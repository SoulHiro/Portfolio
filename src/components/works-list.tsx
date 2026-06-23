import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { H2, H3, P } from "@/components/ui/typography";
import { MoveRight } from "lucide-react";
import type { SanityProjectListing } from "@/lib/sanity/types";

export async function WorksList({ projects }: { projects: SanityProjectListing[] }) {
  const t = await getTranslations("Works");

  if (projects.length === 0) return null;

  return (
    <section
      id="works"
      className="flex flex-col space-y-8 md:space-y-16 w-full min-h-screen justify-center py-16 md:py-0 px-6 md:px-12 lg:px-24"
    >
      <div className="w-full flex items-end justify-between">
        <H2>
          {t("title")}{" "}
          <span className="text-muted-foreground italic">{t("titleHighlight")}</span>
        </H2>
        <P size="md" className="text-muted-foreground">
          {String(projects.length).padStart(2, "0")} {t("projects")}
        </P>
      </div>

      <div className="w-full h-px bg-border" />

      <div>
        {projects.map((project, i) => (
          <div key={project._id}>
            <Link
              href={`/works/${project.slug}`}
              className="group flex flex-col sm:flex-row items-start sm:items-center p-6 md:p-12 justify-between gap-4 sm:gap-0 cursor-pointer hover:bg-accent transition-colors duration-300"
            >
              <div className="flex items-center gap-4 md:gap-16">
                <P size="lg" className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {String(i + 1).padStart(2, "0")}
                </P>
                <H3 className="transition-transform duration-300 group-hover:translate-x-2">
                  {project.title}
                </H3>
              </div>
              <div className="flex items-center gap-4 md:gap-16 sm:ml-0 ml-10">
                <div className="flex flex-wrap gap-2 md:gap-4">
                  <span className="px-4 py-1 border border-border text-body-sm text-muted-foreground font-semibold">
                    {project.category}
                  </span>
                  {project.stack.slice(0, 2).map((tech) => (
                    <span key={tech} className="px-4 py-1 border border-border text-body-sm text-muted-foreground font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
                <MoveRight className="text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:-rotate-45" />
              </div>
            </Link>
            <div className="w-full h-px bg-border" />
          </div>
        ))}
      </div>
    </section>
  );
}
