import { BUILD_STATUS } from "@/data/build-status";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BuildStatus() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline gap-4">
        <span className="text-label-xs tracking-[3px] text-muted-foreground/50 font-semibold">
          SITUAÇÃO ATUAL
        </span>
        <span className="font-mono text-label-xs text-muted-foreground/25">
          {formatDate(BUILD_STATUS.updatedAt)}
        </span>
      </div>

      <p className="text-body-lg text-foreground/80 leading-relaxed max-w-2xl font-light">
        {BUILD_STATUS.body}
      </p>
    </div>
  );
}
