import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { H1, P, Label } from "@/components/ui/typography";
import { client } from "@/lib/sanity/client";
import { POSTS_QUERY } from "@/lib/sanity/queries";
import type { SanityPostListing } from "@/lib/sanity/types";

import { WorksContent } from "@/components/works-content";

type Props = { params: Promise<{ locale: string }> };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "WorksPage" });
  return { title: t("title") };
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

  return (
    <section className="flex flex-col gap-16 py-24 px-6 md:px-12 lg:px-24">
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
        <P className="text-muted-foreground max-w-lg mt-6">{t("description")}</P>
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
  );
}
