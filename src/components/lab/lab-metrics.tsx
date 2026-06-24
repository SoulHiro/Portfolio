import { Stat } from "@/components/ui/typography";

// Update these as the project progresses
const COMMITS = "247";
const EPISODES = "6";

export function LabMetrics({
  labels,
}: {
  labels: { commits: string; episodes: string };
}) {
  return (
    <div className="flex gap-12 md:gap-20">
      <Stat value={COMMITS} title={labels.commits} />
      <Stat value={EPISODES} title={labels.episodes} />
    </div>
  );
}
