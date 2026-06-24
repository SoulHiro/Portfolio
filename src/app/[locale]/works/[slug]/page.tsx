import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { POST_BY_SLUG_QUERY, ALL_POST_SLUGS_QUERY, RELATED_POSTS_QUERY } from "@/lib/sanity/queries";
import type { SanityPostListing } from "@/lib/sanity/types";
import type { SanityPostFull } from "@/lib/sanity/types";
import { H1, P, Label } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { MoveLeft } from "lucide-react";
import { ProgressRead } from "@/components/progress-read";
import { PostBody } from "@/components/post-body";
import { PostSidebarShare } from "@/components/post-sidebar-share";
import { PostSidebarToc, type TocSection } from "@/components/post-sidebar-toc";
import { PostRelated } from "@/components/post-related";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/* ─── Mock post (shown when Sanity has no matching slug) ─── */
const MOCK_POST: SanityPostFull = {
  _id: "mock-building-systemic-vision",
  title: "Building with systemic vision",
  titleHighlight: "systemic vision",
  slug: "building-systemic-vision",
  excerpt:
    "How thinking from business problem to interface shapes better products and reduces wasted iterations along the way.",
  category: "Product",
  estimatedReadingTime: 5,
  publishedAt: "2025-12-10",
  tags: ["Product", "Engineering", "Career"],
  author: { name: "Victor M. Santos", handle: "soulhiro" },
  body: [
    {
      _type: "block",
      _key: "intro1",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s1",
          text: "Most developers start from the code. They pick a stack, open a blank file, and start building. That's a valid way to ship fast. But it tends to produce products that solve the wrong problem in the right way.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "intro2",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s2",
          text: "Working on CampoMind changed how I think about this. The product lives at the intersection of rural Brazil, mental health regulation, and agricultural labor — contexts where a technically elegant solution without business understanding is worthless. That experience taught me to start differently.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "h2-1",
      style: "h2",
      markDefs: [],
      children: [
        { _type: "span", _key: "s3", text: "What ", marks: [] },
        { _type: "span", _key: "s4", text: "systemic vision", marks: ["em"] },
        { _type: "span", _key: "s5", text: " actually means", marks: [] },
      ],
    },
    {
      _type: "block",
      _key: "p1",
      style: "normal",
      markDefs: [],
      children: [
        { _type: "span", _key: "s6", text: "Systemic vision means ", marks: [] },
        {
          _type: "span",
          _key: "s7",
          text: "starting from the problem space",
          marks: ["strong"],
        },
        {
          _type: "span",
          _key: "s8",
          text: " and working your way down to implementation — not the reverse. It means asking: what decision does this feature enable? Who benefits when it works? Who pays when it fails?",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "p2",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s9",
          text: "These questions feel uncomfortable because they're not technical. They live in product strategy, in business model, in user psychology. Developers who skip this layer ship fast and pivot often — not because they're bad at their craft, but because their craft is disconnected from the problem.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "bq1",
      style: "blockquote",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s10",
          text: "Good software starts with a diagnosis, not a solution. The code is the last thing you should be thinking about.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "h2-2",
      style: "h2",
      markDefs: [],
      children: [
        { _type: "span", _key: "s11", text: "Layers of a ", marks: [] },
        {
          _type: "span",
          _key: "s12",
          text: "product decision",
          marks: ["em"],
        },
      ],
    },
    {
      _type: "block",
      _key: "h3-1",
      style: "h3",
      markDefs: [],
      children: [
        { _type: "span", _key: "s13", text: "The business layer", marks: [] },
      ],
    },
    {
      _type: "block",
      _key: "p3",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s14",
          text: "Before writing a line, ask: what does this product need to enable? In CampoMind's case, it was PGR compliance under NR-1 — a legal requirement with a hard deadline. Not knowing this would mean designing the wrong kind of surveys, the wrong reporting format, the wrong notification cadence.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "h3-2",
      style: "h3",
      markDefs: [],
      children: [
        { _type: "span", _key: "s15", text: "The user layer", marks: [] },
      ],
    },
    {
      _type: "block",
      _key: "p4",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s16",
          text: "The users are rural workers with low digital literacy and intermittent connectivity. A CRUD-first design would produce an app that works perfectly in a Figma prototype and fails completely in the field. Understanding ",
          marks: [],
        },
        {
          _type: "span",
          _key: "s17",
          text: "context of use",
          marks: ["strong"],
        },
        {
          _type: "span",
          _key: "s18",
          text: " shaped the decision to deliver through WhatsApp instead of a native app.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "h2-3",
      style: "h2",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s19",
          text: "How I apply this in ",
          marks: [],
        },
        { _type: "span", _key: "s20", text: "practice", marks: ["em"] },
      ],
    },
    {
      _type: "block",
      _key: "l1",
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s21",
          text: "Map the business flow before touching the database schema",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "l2",
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s22",
          text: "Validate with end users before writing the API layer",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "l3",
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s23",
          text: "Treat the interface as an output of architecture, not an input",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "l4",
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [
        { _type: "span", _key: "s24a", text: "Write a ", marks: [] },
        { _type: "span", _key: "s24b", text: "README", marks: ["code"] },
        {
          _type: "span",
          _key: "s24c",
          text: " before code when the problem space is fuzzy",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "p5",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s25",
          text: "This doesn't mean never prototyping. Sometimes you need a proof of concept to validate an assumption quickly. But a prototype should answer one specific question. If you don't know what question it's answering, you're not prototyping — you're procrastinating by building.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "h2-4",
      style: "h2",
      markDefs: [],
      children: [
        { _type: "span", _key: "s26", text: "The output", marks: [] },
      ],
    },
    {
      _type: "block",
      _key: "p6",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s27",
          text: "When you approach software with systemic vision, something shifts: you make fewer things. Not because you're lazy — because you understand what's actually needed. Every component has a reason. Every endpoint answers a real question. Every screen exists because someone needs to make a decision.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "p7",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s28",
          text: "That's the goal. Not clever architecture. Not beautiful code. Software that fits its problem space exactly, with no excess and no gaps.",
          marks: [],
        },
      ],
    },
  ],
};

/* ─── Static params ─── */
export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(ALL_POST_SLUGS_QUERY);
  return [
    ...slugs.map((s) => ({ slug: s.slug })),
    { slug: "building-systemic-vision" },
  ];
}

/* ─── Metadata ─── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await client.fetch<SanityPostFull | null>(POST_BY_SLUG_QUERY, {
    slug,
    locale,
  });
  const data = post ?? (slug === "building-systemic-vision" ? MOCK_POST : null);
  if (!data) return {};
  return {
    title: data.title,
    description: data.excerpt ?? undefined,
  };
}

/* ─── Extract h2 sections from body for TOC ─── */
function extractSections(body: unknown[]): TocSection[] {
  return body
    .filter((b) => {
      const block = b as { _type?: string; style?: string };
      return block._type === "block" && block.style === "h2";
    })
    .map((b) => {
      const block = b as { children?: { text?: string }[] };
      const title = (block.children ?? []).map((c) => c.text ?? "").join("");
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return { id, title };
    });
}

/* ─── Helpers ─── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ─── Page ─── */
export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [post, relatedPosts] = await Promise.all([
    client.fetch<SanityPostFull | null>(
      POST_BY_SLUG_QUERY,
      { slug, locale },
      { next: { tags: ["post"] } },
    ),
    client.fetch<SanityPostListing[]>(
      RELATED_POSTS_QUERY,
      { slug, locale },
      { next: { tags: ["post"] } },
    ),
  ]);

  const data = post ?? (slug === "building-systemic-vision" ? MOCK_POST : null);
  if (!data) notFound();

  const sections = extractSections(data.body);

  return (
    <>
      <ProgressRead />

      <article className="min-h-screen pb-24">
        {/* Back link */}
        <div className="px-6 md:px-12 lg:px-24 pt-24 md:pt-32 pb-8 md:pb-12">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 text-label-sm"
          >
            <MoveLeft className="size-4" />
            All works
          </Link>
        </div>

        {/* Hero */}
        <header className="px-6 md:px-12 lg:px-24 pb-12 md:pb-16 flex flex-col gap-5 md:gap-8 max-w-4xl">
          {/* Category + read time */}
          <div className="flex items-center gap-4">
            {data.category && (
              <Label
                size="sm"
                className="text-muted-foreground tracking-[3px]"
              >
                {data.category.toUpperCase()}
              </Label>
            )}
            {data.estimatedReadingTime && (
              <>
                <span className="w-px h-3 bg-border" />
                <Label size="sm" className="text-muted-foreground">
                  {data.estimatedReadingTime} min read
                </Label>
              </>
            )}
          </div>

          {/* Title */}
          <PostTitle title={data.title} highlight={data.titleHighlight} />

          {/* Excerpt */}
          {data.excerpt && (
            <P
              size="lg"
              className="text-muted-foreground max-w-2xl font-light leading-[1.7]"
            >
              {data.excerpt}
            </P>
          )}

          {/* Author + date */}
          <div className="flex items-center gap-4 text-label-sm text-muted-foreground">
            <span>{data.author?.name ?? "Victor M. Santos"}</span>
            <span className="w-px h-3 bg-border" />
            <span>{formatDate(data.publishedAt)}</span>
          </div>
        </header>

        {/* Full-width divider */}
        <div className="w-full h-px bg-border" />

        {/* Body + sidebars */}
        <div className="relative overflow-x-clip">
          <PostSidebarShare />
          <PostSidebarToc sections={sections} />

          <div className="py-16 px-6 md:px-12 lg:px-24 xl:px-0 xl:max-w-2xl xl:mx-auto">
            <PostBody body={data.body} />

            {/* Tags — inside centered column */}
            {data.tags && data.tags.length > 0 && (
              <div className="mt-16 pt-10 border-t border-border flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 border border-border text-label-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related posts + back button */}
        <PostRelated
          posts={relatedPosts ?? []}
          backLabel="Voltar ao devlog"
          backHref="/works"
        />
      </article>
    </>
  );
}

/* ─── Post title with optional italic highlight in Instrument Serif ─── */
function PostTitle({
  title,
  highlight,
}: {
  title: string;
  highlight?: string | null;
}) {
  if (!highlight || !title.includes(highlight)) {
    return (
      <h1 className="font-display text-display-md tracking-tight leading-tight text-wrap-pretty">
        {title}
      </h1>
    );
  }

  const idx = title.indexOf(highlight);
  const before = title.slice(0, idx);
  const after = title.slice(idx + highlight.length);

  return (
    <h1 className="font-display text-display-md tracking-tight leading-tight text-wrap-pretty">
      {before}
      <span className="italic text-muted-foreground">{highlight}</span>
      {after}
    </h1>
  );
}
