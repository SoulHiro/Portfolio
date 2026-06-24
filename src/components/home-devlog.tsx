import { Link } from "@/i18n/navigation";
import { MoveRight } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { LATEST_POSTS_QUERY } from "@/lib/sanity/queries";
import type { SanityPostListing } from "@/lib/sanity/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function HomeDevlog({ locale }: { locale: string }) {
  const posts = await client.fetch<SanityPostListing[]>(
    LATEST_POSTS_QUERY,
    { locale },
    { next: { tags: ["post"] } },
  );

  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 flex flex-col gap-10">
      {/* Header */}
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-label-xs tracking-[5px] text-muted-foreground/30 uppercase">
            Devlog
          </span>
          <h2 className="font-display text-display-md tracking-tight leading-tight">
            O que estou{" "}
            <span className="italic text-muted-foreground">escrevendo</span>
          </h2>
        </div>
        <Link
          href="/works"
          className="hidden sm:inline-flex items-center gap-1.5 text-label-sm text-muted-foreground hover:text-foreground transition-colors duration-300 shrink-0 mt-1"
        >
          Ver todos
          <MoveRight className="size-3.5 -rotate-45" />
        </Link>
      </div>

      <div className="w-full h-px bg-border" />

      {/* Post list */}
      <div className="flex flex-col">
        {posts.map((post, i) => (
          <div key={post._id}>
            <Link
              href={`/works/${post.slug}`}
              className="group grid items-center gap-x-6 py-5 transition-colors duration-200 hover:bg-foreground/[0.03] -mx-4 px-4 rounded-sm
                grid-cols-[2rem_1fr_1.5rem]
                md:grid-cols-[2rem_8rem_1fr_auto_1.5rem]"
            >
              {/* Col 1 — Number */}
              <span className="font-mono text-label-xs text-muted-foreground/30">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Col 2 — Category (desktop only) */}
              <span className="hidden md:inline-flex self-center border border-border text-label-xs text-muted-foreground px-3 py-1 rounded-full w-fit">
                {post.category ?? "—"}
              </span>

              {/* Col 3 — Title + excerpt */}
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="font-display text-h4 tracking-tight leading-tight truncate">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-body-sm text-muted-foreground line-clamp-1">
                    {post.excerpt}
                  </p>
                )}
              </div>

              {/* Col 4 — Date + time (desktop only) */}
              <div className="hidden md:flex items-center gap-2 whitespace-nowrap">
                <span className="font-mono text-label-xs text-muted-foreground/40">
                  {formatDate(post.publishedAt)}
                </span>
                {post.estimatedReadingTime && (
                  <>
                    <span className="size-1 rounded-full bg-muted-foreground/20" />
                    <span className="font-mono text-label-xs text-muted-foreground/40">
                      {post.estimatedReadingTime} min
                    </span>
                  </>
                )}
              </div>

              {/* Col 5 — Arrow */}
              <MoveRight className="size-4 text-muted-foreground/25 group-hover:text-foreground group-hover:-rotate-45 transition-all duration-300 justify-self-end" />
            </Link>
            <div className="w-full h-px bg-border" />
          </div>
        ))}
      </div>

      {/* Mobile "ver todos" */}
      <Link
        href="/works"
        className="sm:hidden inline-flex items-center gap-1.5 text-label-sm text-muted-foreground hover:text-foreground transition-colors duration-300 w-fit"
      >
        Ver todos os artigos
        <MoveRight className="size-3.5 -rotate-45" />
      </Link>
    </section>
  );
}
