import { Link } from "@/i18n/navigation";
import { MoveLeft, MoveRight } from "lucide-react";
import type { SanityPostListing } from "@/lib/sanity/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type PostRelatedProps = {
  posts: SanityPostListing[];
  backLabel: string;
  backHref: string;
};

export function PostRelated({ posts, backLabel, backHref }: PostRelatedProps) {
  return (
    <div className="px-6 md:px-12 lg:px-24 py-16 flex flex-col gap-12 border-t border-border">
      {posts.length > 0 && (
        <div className="flex flex-col gap-6">
          <span className="text-label-xs tracking-[3px] text-muted-foreground/50 font-semibold">
            CONTINUAR LENDO
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/works/${post.slug}`}
                className="group flex flex-col gap-4 p-6 border border-border hover:border-foreground/25 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  {post.category && (
                    <span className="font-mono text-label-xs text-muted-foreground/40 uppercase tracking-widest">
                      {post.category}
                    </span>
                  )}
                  <MoveRight className="size-3.5 text-muted-foreground/25 group-hover:text-muted-foreground/60 group-hover:translate-x-0.5 transition-all duration-200 ml-auto" />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <span className="text-body-sm font-medium leading-snug line-clamp-2 group-hover:text-foreground transition-colors duration-200">
                    {post.title}
                  </span>
                  {post.excerpt && (
                    <span className="text-label-sm text-muted-foreground/60 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-auto">
                  <span className="font-mono text-label-xs text-muted-foreground/30">
                    {formatDate(post.publishedAt)}
                  </span>
                  {post.estimatedReadingTime && (
                    <>
                      <span className="text-muted-foreground/20">·</span>
                      <span className="font-mono text-label-xs text-muted-foreground/30">
                        {post.estimatedReadingTime} min
                      </span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 text-label-sm w-fit"
      >
        <MoveLeft className="size-4" />
        {backLabel}
      </Link>
    </div>
  );
}
