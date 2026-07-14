import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { H1, Label, P } from "@/components/ui/typography";
import { WorksContent } from "@/components/works-content";
import { client } from "@/lib/sanity/client";
import { POSTS_QUERY } from "@/lib/sanity/queries";
import type { SanityPostListing } from "@/lib/sanity/types";

type Props = { params: Promise<{ locale: string }> };

const BASE_URL = "https://www.victormts.dev";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "WorksPage" });
  const otherLocale = locale === "en" ? "pt-br" : "en";
  const pageUrl = `${BASE_URL}/${locale}/works`;
  const altUrl = `${BASE_URL}/${otherLocale}/works`;
  const ogImage = `${BASE_URL}/og.webp`;

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      type: "website",
      url: pageUrl,
      locale: locale === "pt-br" ? "pt_BR" : "en_US",
      siteName: "Victor M. Santos",
      title: t("title"),
      description: t("description"),
      images: [{ url: ogImage, width: 1200, height: 630, alt: t("title") }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@victormts_dev",
      title: t("title"),
      description: t("description"),
      images: [ogImage],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        en: locale === "en" ? pageUrl : altUrl,
        "pt-BR": locale === "pt-br" ? pageUrl : altUrl,
        "x-default": `${BASE_URL}/en/works`,
      },
    },
  };
}

export default async function WorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("WorksPage");

  const postsFromSanity = await client.fetch<SanityPostListing[]>(
    POSTS_QUERY,
    { locale },
    { next: { tags: ["post"] } },
  );

  const posts = postsFromSanity.length > 0 ? postsFromSanity : [];

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${t("title")} — Victor M. Santos`,
    url: `${BASE_URL}/${locale}/works`,
    description: t("description"),
    author: {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "Victor M. Santos",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
      <section className="flex flex-col gap-16 py-24">
        {/* Header */}
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Label size="sm" className="text-muted-foreground tracking-[4px]">
                {t("label")}
              </Label>
            </div>
            <H1 className="text-display-xl">{t("title")}</H1>
          </div>
          <P className="text-muted-foreground max-w-lg mt-6">
            {t("description")}
          </P>
        </div>

        <Suspense>
          <WorksContent
            posts={posts}
            labels={{
              readMin: t("readMin"),
              noPosts: t("noPosts"),
            }}
          />
        </Suspense>
      </section>
    </>
  );
}
