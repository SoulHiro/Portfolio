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
import { latestEpisode } from "@/data/episodes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LabPage" });
  return { title: t("title") };
}

export default async function LabPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("LabPage");

  return (
    <section className="flex flex-col gap-20 py-24 px-6 md:px-12 lg:px-24">

      {/* 1 — Header: título + episódio mais recente */}
      <div className="flex flex-col gap-8">
        <div className="w-full h-px bg-border" />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Esquerda: identidade do projeto */}
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

            <H1 className="text-display-xl">CampoMind</H1>

            <P className="text-muted-foreground max-w-xl">
              Plataforma de saúde mental para o agronegócio via WhatsApp.
              Automatiza a geração do PGR conforme a NR-1 e acompanha o
              bem-estar dos colaboradores rurais — documentado do zero à
              produção, em público.
            </P>
          </div>

          {/* Direita: último episódio */}
          {latestEpisode && <LatestEpisodePeek episode={latestEpisode} />}
        </div>
      </div>

      {/* 2 — Roadmap: onde está e para onde vai */}
      <PhaseRoadmap label={t("roadmapTitle")} />

      {/* 3 — Situação atual: o que está sendo trabalhado agora */}
      <BuildStatus />

      {/* 4 — Episódios: o conteúdo do build in public */}
      <EpisodeList label={t("episodesTitle")} />

      {/* 5 — Arquitetura: decisões técnicas + stack compacta */}
      <ProjectHero />

      {/* 6 — Prova: commits e episódios com contexto */}
      <LabMetrics
        labels={{
          commits: t("metricsCommits"),
          episodes: t("metricsEpisodes"),
        }}
      />

      {/* 7 — Histórico: projetos anteriores */}
      <PastProjects label={t("archiveTitle")} />

    </section>
  );
}
