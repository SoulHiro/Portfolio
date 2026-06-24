import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { TechStack } from "@/components/tech-stack";
import { WorksList } from "@/components/works-list";
import { HomeLab } from "@/components/home-lab";
import { HomeDevlog } from "@/components/home-devlog";
import { Contact } from "@/components/contact";
import { client } from "@/lib/sanity/client";
import { PROJECTS_QUERY } from "@/lib/sanity/queries";
import type { SanityProjectListing } from "@/lib/sanity/types";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await client.fetch<SanityProjectListing[]>(
    PROJECTS_QUERY,
    { locale },
    { next: { revalidate: 3600 } },
  );

  return (
    <>
      <Hero />
      <About />
      <TechStack />
      <WorksList projects={projects} />
      <HomeLab />
      <HomeDevlog locale={locale} />
      <Contact />
    </>
  );
}
