import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { POST_BY_SLUG_QUERY, ALL_POST_SLUGS_QUERY, RELATED_POSTS_QUERY } from "@/lib/sanity/queries";
import type { SanityPostFull, SanityPostListing } from "@/lib/sanity/types";
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

/* ─── Static params ─── */
export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(ALL_POST_SLUGS_QUERY);
  return slugs.map((s) => ({ slug: s.slug }));
}

const BASE_META_URL = "https://www.victormts.dev";

/* ─── Metadata ─── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await client.fetch<SanityPostFull | null>(POST_BY_SLUG_QUERY, { slug, locale });
  if (!post) return {};

  const otherLocale = locale === "en" ? "pt-br" : "en";
  const postUrl = `${BASE_META_URL}/${locale}/works/${post.slug}`;
  const altUrl = `${BASE_META_URL}/${otherLocale}/works/${post.slug}`;
  const ogImage = `${BASE_META_URL}/og.webp`;

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    authors: [{ name: "Victor M. Santos", url: BASE_META_URL }],
    openGraph: {
      type: "article",
      url: postUrl,
      locale: locale === "pt-br" ? "pt_BR" : "en_US",
      siteName: "Victor M. Santos",
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.publishedAt,
      authors: ["Victor M. Santos"],
      tags: post.tags ?? undefined,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@victormts_dev",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: [ogImage],
    },
    alternates: {
      canonical: postUrl,
      languages: {
        en: locale === "en" ? postUrl : altUrl,
        "pt-BR": locale === "pt-br" ? postUrl : altUrl,
        "x-default": `${BASE_META_URL}/en/works/${post.slug}`,
      },
    },
  };
}

/* ─── Extract h2/h3 sections from body for TOC ─── */
function extractSections(body: unknown[]): TocSection[] {
  return body
    .filter((b) => {
      const block = b as { _type?: string; style?: string };
      return block._type === "block" && (block.style === "h2" || block.style === "h3");
    })
    .map((b) => {
      const block = b as { style?: string; children?: { text?: string }[] };
      const title = (block.children ?? []).map((c) => c.text ?? "").join("");
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return { id, title, level: block.style as "h2" | "h3" };
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

  if (!post) notFound();

  const sections = extractSections(post.body);

  const postUrl = `${BASE_META_URL}/${locale}/works/${post.slug}`;
  const worksUrl = `${BASE_META_URL}/${locale}/works`;
  const homeUrl = `${BASE_META_URL}/${locale}`;
  const personId = `${BASE_META_URL}/#person`;
  const blogPostingLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        headline: post.title,
        description: post.excerpt ?? undefined,
        url: postUrl,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        image: `${BASE_META_URL}/og.webp`,
        author: { "@type": "Person", "@id": personId, name: "Victor M. Santos" },
        publisher: { "@type": "Person", "@id": personId, name: "Victor M. Santos" },
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        ...(post.tags ? { keywords: post.tags.join(", ") } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
          { "@type": "ListItem", position: 2, name: "Works", item: worksUrl },
          { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
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
            {post.category && (
              <Label size="sm" className="text-muted-foreground tracking-[3px]">
                {post.category.toUpperCase()}
              </Label>
            )}
            {post.estimatedReadingTime && (
              <>
                <span className="w-px h-3 bg-border" />
                <Label size="sm" className="text-muted-foreground">
                  {post.estimatedReadingTime} min read
                </Label>
              </>
            )}
          </div>

          {/* Title */}
          <PostTitle title={post.title} highlight={post.titleHighlight} />

          {/* Excerpt */}
          {post.excerpt && (
            <P size="lg" className="text-muted-foreground max-w-2xl font-light leading-[1.7]">
              {post.excerpt}
            </P>
          )}

          {/* Author + date */}
          <div className="flex items-center gap-4 text-label-sm text-muted-foreground">
            <span>{post.author?.name ?? "Victor M. Santos"}</span>
            <span className="w-px h-3 bg-border" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </header>

        {/* Full-width divider */}
        <div className="w-full h-px bg-border" />

        {/* Body + sidebars */}
        <div className="relative overflow-x-clip">
          <PostSidebarShare />
          <PostSidebarToc sections={sections} />

          <div className="py-16 px-6 md:px-12 lg:px-24 xl:px-0 xl:max-w-2xl xl:mx-auto">
            <PostBody body={post.body} />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-16 pt-10 border-t border-border flex flex-wrap gap-2">
                {post.tags.map((tag) => (
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
