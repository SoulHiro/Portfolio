import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/hero";
import { HomeProjects } from "@/components/home-projects";
import { About } from "@/components/about";
import { TechStack } from "@/components/tech-stack";
import { HomeLab } from "@/components/home-lab";
import { HomeDevlog } from "@/components/home-devlog";
import { Contact } from "@/components/contact";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <HomeProjects />
      <About />
      <TechStack />
      <HomeLab />
      <HomeDevlog locale={locale} />
      <Contact />
    </>
  );
}
