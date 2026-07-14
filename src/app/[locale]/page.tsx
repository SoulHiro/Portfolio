import { setRequestLocale } from "next-intl/server";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { HomeProjects } from "@/components/home-projects";
import { ScrollScrub } from "@/components/scroll-scrub";

type Props = { params: Promise<{ locale: string }> };

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <div className="w-16 h-px bg-border/50" />
      <div className="w-2.5 h-2.5 border border-border/60 rotate-45" />
      <div className="w-16 h-px bg-border/50" />
    </div>
  );
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <div>
        <ScrollScrub>
          <HomeProjects />
          <SectionDivider />
          <Experience />
          <SectionDivider />
          <Contact />
        </ScrollScrub>
      </div>
    </>
  );
}
