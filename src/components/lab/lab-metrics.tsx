import { Stat } from "@/components/ui/typography";

type LabMetricsProps = {
  labels: { commits: string; episodes: string };
  commitsCount: number | null;
  episodesCount: number;
};

export function LabMetrics({ labels, commitsCount, episodesCount }: LabMetricsProps) {
  const hasMetrics = commitsCount != null || episodesCount > 0;
  if (!hasMetrics) return null;

  return (
    <div className="flex gap-12 md:gap-20">
      {commitsCount != null && (
        <Stat value={String(commitsCount)} title={labels.commits} />
      )}
      {episodesCount > 0 && (
        <Stat value={String(episodesCount)} title={labels.episodes} />
      )}
    </div>
  );
}
