import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { H1, P, Label } from "@/components/ui/typography";
import { ProjectHero } from "@/components/lab/project-hero";
import { PhaseRoadmap } from "@/components/lab/phase-roadmap";
import { BuildStatus } from "@/components/lab/build-status";
import { LabMetrics } from "@/components/lab/lab-metrics";
import { EpisodeList } from "@/components/lab/episode-list";
import { PastProjects } from "@/components/lab/past-projects";
import { LatestEpisodePeek } from "@/components/lab/latest-episode-peek";
import { client } from "@/lib/sanity/client";
import { LAB_SETTINGS_QUERY, LAB_PROJECT_FALLBACK_QUERY, LAB_STATUS_QUERY } from "@/lib/sanity/queries";
import type { SanityLabSettings, SanityLabProject, SanityLabStatus } from "@/lib/sanity/types";
import { fetchPlaylistEpisodes } from "@/lib/sanity/youtube";

type Props = { params: Promise<{ locale: string }> };

const BASE_URL = "https://www.victormts.dev";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LabPage" });
  const otherLocale = locale === "en" ? "pt-br" : "en";
  const pageUrl = `${BASE_URL}/${locale}/lab`;
  const altUrl = `${BASE_URL}/${otherLocale}/lab`;
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
        "x-default": `${BASE_URL}/en/lab`,
      },
    },
  };
}

export default async function LabPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LabPage");

  // Fetch Sanity data in parallel
  const [settings, labStatus] = await Promise.all([
    client.fetch<SanityLabSettings | null>(
      LAB_SETTINGS_QUERY,
      {},
      { next: { tags: ["lab"] } },
    ),
    client.fetch<SanityLabStatus | null>(
      LAB_STATUS_QUERY,
      {},
      { next: { tags: ["lab"] } },
    ),
  ]);

  // Se não há labSettings configurado, usa o primeiro projeto cadastrado
  const project: SanityLabProject | null =
    settings?.featuredProject ??
    (await client.fetch<SanityLabProject | null>(
      LAB_PROJECT_FALLBACK_QUERY,
      {},
      { next: { tags: ["lab"] } },
    ));

  // Fetch YouTube episodes via playlist ID stored on the project
  const episodes = project?.youtubePlaylistId
    ? await fetchPlaylistEpisodes(project.youtubePlaylistId)
    : [];

  const latestEpisode = episodes.length > 0 ? episodes[episodes.length - 1] : null;
  const roadmapSteps = project?.roadmap ?? [];

  return (
    <section className="flex flex-col gap-20 py-24 px-6 md:px-12 lg:px-24">

      {/* 1 — Header: título + episódio mais recente */}
      <div className="flex flex-col gap-8">
        <div className="w-full h-px bg-border" />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-red-500" />
                </span>
                <span className="text-label-xs text-red-500 tracking-[3px] font-semibold animate-pulse">
                  REC
                </span>
              </span>
              <span className="w-px h-3 bg-border" />
              <Label size="sm" className="text-muted-foreground tracking-[4px]">
                {t("label")}
              </Label>
            </div>

            {project?.name && (
              <H1 className="text-display-xl">{project.name}</H1>
            )}

            {project?.description && (
              <P className="text-muted-foreground max-w-xl">{project.description}</P>
            )}
          </div>

          {latestEpisode && <LatestEpisodePeek episode={latestEpisode} />}
        </div>
      </div>

      {/* 2 — Roadmap */}
      {roadmapSteps.length > 0 && (
        <PhaseRoadmap label={t("roadmapTitle")} steps={roadmapSteps} />
      )}

      {/* 3 — Situação atual */}
      {labStatus && (
        <BuildStatus body={labStatus.body} updatedAt={labStatus.updatedAt} />
      )}

      {/* 4 — Episódios */}
      <EpisodeList label={t("episodesTitle")} episodes={episodes} />

      {/* 5 — Arquitetura */}
      {project && <ProjectHero project={project} />}

      {/* 6 — Métricas */}
      <LabMetrics
        labels={{ commits: t("metricsCommits"), episodes: t("metricsEpisodes") }}
        commitsCount={project?.commitsCount ?? null}
        episodesCount={episodes.length}
      />

      {/* 7 — Histórico */}
      <PastProjects label={t("archiveTitle")} />

    </section>
  );
}
