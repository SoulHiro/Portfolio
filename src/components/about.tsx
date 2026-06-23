import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { H2, P } from "@/components/ui/typography";

export async function About() {
  const t = await getTranslations("About");

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative flex flex-col w-full justify-center py-16 md:min-h-screen md:py-0 px-6 md:px-12 lg:px-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <div className="min-w-0 flex justify-center md:block">
          <div className="relative size-48 rounded-full overflow-hidden md:size-auto md:rounded-none md:h-full">
            <Image
              src="/images/profile.webp"
              alt={t("alt")}
              fill
              sizes="(min-width: 768px) 50vw, 192px"
              className="object-cover"
            />
          </div>
        </div>
        <div className="min-w-0 space-y-6 md:space-y-8 flex flex-col justify-center">
          <div className="flex gap-2 items-center">
            <div className="h-0.5 w-12 bg-muted-foreground" />
            <P size="md" className="text-muted-foreground font-semibold">{t("label")}</P>
          </div>
          <div>
            <H2 id="about-heading">Victor M. Santos</H2>
            <P size="md" className="text-muted-foreground">{t("subtitle")}</P>
          </div>
          <div className="space-y-4">
            <P size="lg" className="text-foreground">{t("bio1")}</P>
            <P size="lg" className="text-foreground">{t("bio2")}</P>
          </div>
          <div className="w-full h-0.5 bg-border" />
          <div className="flex gap-4">
            <Link
              href="https://github.com/SoulHiro"
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta flex items-center gap-3 border border-border px-4 py-2 md:px-5 md:py-3 transition-colors duration-300 hover:border-foreground"
            >
              <IconBrandGithub className="size-5 text-muted-foreground transition-colors duration-300 group-hover/cta:text-foreground" />
              <P size="md" className="text-muted-foreground font-medium transition-colors duration-300 group-hover/cta:text-foreground">
                GitHub
              </P>
            </Link>
            <Link
              href="https://www.linkedin.com/in/victormts/"
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta flex items-center gap-3 border border-border px-4 py-2 md:px-5 md:py-3 transition-colors duration-300 hover:border-foreground"
            >
              <IconBrandLinkedin className="size-5 text-muted-foreground transition-colors duration-300 group-hover/cta:text-foreground" />
              <P size="md" className="text-muted-foreground font-medium transition-colors duration-300 group-hover/cta:text-foreground">
                LinkedIn
              </P>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
