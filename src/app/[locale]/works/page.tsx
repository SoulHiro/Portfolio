import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { H1, P, Label } from "@/components/ui/typography";
import { client } from "@/lib/sanity/client";
import { PROJECTS_QUERY, POSTS_QUERY } from "@/lib/sanity/queries";
import type { SanityProjectListing, SanityPostListing } from "@/lib/sanity/types";
import { WorksContent } from "@/components/works-content";

type Props = { params: Promise<{ locale: string }> };

const MOCK_POSTS: SanityPostListing[] = [
  {
    _id: "mock-1",
    title: "Building with systemic vision",
    slug: "building-systemic-vision",
    excerpt:
      "How thinking from business problem to interface shapes better products and reduces wasted iterations along the way.",
    category: "Product",
    publishedAt: "2025-12-10",
    estimatedReadingTime: 5,
  },
  {
    _id: "mock-2",
    title: "Why I chose Go for backend services",
    slug: "why-go-backend",
    excerpt:
      "Go's simplicity and performance make it the right choice for long-running services that need to stay boring.",
    category: "Engineering",
    publishedAt: "2025-11-04",
    estimatedReadingTime: 7,
  },
  {
    _id: "mock-3",
    title: "Designing for farmers: lessons from CampoMind",
    slug: "designing-campomind",
    excerpt:
      "When your users are in the field with intermittent signal, everything you know about UX gets tested.",
    category: "Design",
    publishedAt: "2025-10-18",
    estimatedReadingTime: 4,
  },
  {
    _id: "mock-4",
    title: "The mental model behind NR-1 compliance",
    slug: "mental-model-nr1",
    excerpt:
      "Understanding Brazilian workplace mental health regulation and how software can make compliance less painful.",
    category: "Product",
    publishedAt: "2025-09-29",
    estimatedReadingTime: 6,
  },
  {
    _id: "mock-5",
    title: "Tailwind 4 in production: what changed",
    slug: "tailwind-4-production",
    excerpt:
      "Real-world notes after migrating a production app from Tailwind 3 to 4. The good, the weird, and the broken.",
    category: "Engineering",
    publishedAt: "2025-08-15",
    estimatedReadingTime: 8,
  },
  {
    _id: "mock-6",
    title: "Teaching as the sharpest debugging tool",
    slug: "teaching-debugging",
    excerpt:
      "Every time I explain a concept to someone else, I find gaps I didn't know I had. Here's why I document everything.",
    category: "Career",
    publishedAt: "2025-07-02",
    estimatedReadingTime: 3,
  },
];

const MOCK_PROJECTS: (SanityProjectListing & { stack?: string[] })[] = [
  {
    _id: "p1",
    title: "CampoMind",
    slug: "campomind",
    tagline: "Plataforma de saúde mental para o agronegócio via WhatsApp.",
    category: "SaaS",
    year: 2025,
    stack: ["NEXT.JS", "TYPESCRIPT", "SANITY"],
    heroImage: null as never,
    color: null,
    featured: true,
    order: 1,
  },
  {
    _id: "p2",
    title: "Portfolio",
    slug: "portfolio-pessoal",
    tagline: "Este site. Minimalismo, i18n e deploy estático.",
    category: "Website",
    year: 2025,
    stack: ["NEXT.JS", "TAILWIND", "VERCEL"],
    heroImage: null as never,
    color: null,
    featured: null,
    order: 2,
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "WorksPage" });
  return { title: t("title") };
}

export default async function WorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("WorksPage");

  const [projectsFromSanity, postsFromSanity] = await Promise.all([
    client.fetch<SanityProjectListing[]>(
      PROJECTS_QUERY,
      { locale },
      { next: { revalidate: 3600 } },
    ),
    client.fetch<SanityPostListing[]>(
      POSTS_QUERY,
      { locale },
      { next: { revalidate: 3600 } },
    ),
  ]);

  const projects =
    projectsFromSanity.length > 0
      ? projectsFromSanity
      : MOCK_PROJECTS;
  const posts = postsFromSanity.length > 0 ? postsFromSanity : MOCK_POSTS;

  return (
    <section className="flex flex-col gap-16 py-24 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div>
        <div className="w-full h-px bg-border" />
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center gap-2.5">
            <div className="w-16 h-px bg-muted-foreground" />
            <Label size="sm" className="text-muted-foreground tracking-[4px]">
              {t("label")}
            </Label>
          </div>
          <H1 className="text-display-xl">{t("title")}</H1>
        </div>
        <P className="text-muted-foreground max-w-lg mt-6">{t("description")}</P>
      </div>

      {/* Content — client component handles search/filter/grouping */}
      <Suspense>
        <WorksContent
          projects={projects}
          posts={posts}
          labels={{
            projectsLabel: t("projectsLabel"),
            writingLabel: t("writingLabel"),
            readMin: t("readMin"),
            noProjects: t("noProjects"),
            noPosts: t("noPosts"),
          }}
        />
      </Suspense>
    </section>
  );
}
