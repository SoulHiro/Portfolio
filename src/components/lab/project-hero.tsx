import { GitCommitHorizontal } from "lucide-react";

const GITHUB_REPO = "SoulHiro/campomind";

type LastCommit = { message: string; relativeTime: string } | null;

async function fetchLastCommit(): Promise<LastCommit> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const [commit] = await res.json();
    const date = new Date(commit.commit.author.date);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);
    const diffDays = Math.floor(diffHours / 24);
    let relativeTime: string;
    if (diffHours < 1) relativeTime = "agora mesmo";
    else if (diffHours < 24) relativeTime = `${diffHours}h atrás`;
    else if (diffDays === 1) relativeTime = "ontem";
    else if (diffDays < 30) relativeTime = `${diffDays}d atrás`;
    else relativeTime = date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
    return { message: commit.commit.message.split("\n")[0].slice(0, 72), relativeTime };
  } catch {
    return null;
  }
}

const TECH = [
  "TypeScript", "Go", "Next.js 15", "React 19", "Tailwind 4",
  "Fastify", "PostgreSQL", "Redis", "Prisma", "shadcn/ui",
  "motion/react", "Docker", "Vercel", "Sanity", "Stripe", "WhatsApp API",
];

export async function ProjectHero() {
  const lastCommit = await fetchLastCommit();

  return (
    <div className="flex flex-col gap-8">

      {/* Decisões arquiteturais — o "por quê", não o "o quê" */}
      <div className="flex flex-col gap-3 max-w-2xl">
        <p className="text-body-md text-foreground leading-relaxed">
          Go cuida do webhook layer: o WhatsApp exige resposta em menos de 200ms
          ou reenvia o evento, e a concorrência nativa elimina overhead de thread
          sem pool manual. O isolamento entre tenants é feito via row-level
          security no PostgreSQL — nenhum filtro na aplicação, o banco rejeita
          queries que cruzam fronteiras. Geração de PGR agrega meses de dados;
          vai pra fila no Redis e processa em background enquanto o colaborador
          recebe confirmação instantânea no WhatsApp.
        </p>
      </div>

      {/* Inventário técnico compacto */}
      <p className="font-mono text-label-xs text-muted-foreground/35 leading-loose">
        {TECH.join("  ·  ")}
      </p>

      {/* Último commit */}
      {lastCommit && (
        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <GitCommitHorizontal className="size-3.5 text-muted-foreground/25 shrink-0" />
          <span className="font-mono text-label-xs text-muted-foreground/40 truncate">
            {lastCommit.message}
          </span>
          <span className="font-mono text-label-xs text-muted-foreground/25 shrink-0 ml-auto">
            {lastCommit.relativeTime}
          </span>
        </div>
      )}
    </div>
  );
}
