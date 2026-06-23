"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryStates, parseAsString } from "nuqs";
import { Link } from "@/i18n/navigation";
import { H3, H4, P, Label } from "@/components/ui/typography";
import { MoveRight, ArrowUpRight, Search, X } from "lucide-react";
import type { SanityProjectListing, SanityPostListing } from "@/lib/sanity/types";

const MONTHS_PER_PAGE = 3;

type Props = {
  projects: (SanityProjectListing & { stack?: string[]; liveUrl?: string | null })[];
  posts: SanityPostListing[];
  labels: {
    projectsLabel: string;
    writingLabel: string;
    readMin: string;
    noProjects: string;
    noPosts: string;
  };
};

/* ─── Date utils ─── */
function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getYear(iso: string) {
  return String(new Date(iso).getFullYear());
}

function groupByMonth(posts: SanityPostListing[]) {
  const groups: Record<string, SanityPostListing[]> = {};
  for (const post of posts) {
    const d = new Date(post.publishedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(post);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

/* ─── Project Card ─── */
function ProjectCard({
  project,
  index,
}: {
  project: SanityProjectListing & { stack?: string[]; liveUrl?: string | null };
  index: number;
}) {
  const inner = (
    <div className="group border border-border p-6 md:p-7 flex flex-col gap-5 aspect-[4/3] hover:bg-accent transition-colors duration-300">
      <div className="flex items-start justify-between">
        <span className="text-label-xs text-muted-foreground font-mono tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-label-xs text-muted-foreground">{project.year}</span>
          <span className="px-2 py-0.5 border border-border text-label-xs text-muted-foreground">
            {project.category}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <H3 className="leading-tight text-h4 md:text-h3">{project.title}</H3>
        {project.tagline && (
          <P size="sm" className="text-muted-foreground font-light line-clamp-2">
            {project.tagline}
          </P>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {(project.stack ?? []).slice(0, 3).map((tech) => (
            <span key={tech} className="text-label-xs text-muted-foreground/60">
              {tech}
            </span>
          ))}
        </div>
        {project.liveUrl && (
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300 flex-shrink-0" />
        )}
      </div>
    </div>
  );

  if (project.liveUrl) {
    return (
      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
}

/* ─── Post Card — portrait ─── */
function PostCard({ post, readMin }: { post: SanityPostListing; readMin: string }) {
  return (
    <Link href={`/works/${post.slug}`}>
      <div className="group border border-border p-5 flex flex-col aspect-[3/4] max-h-[400px] hover:bg-accent transition-colors duration-300">
        <div className="flex items-start justify-between mb-auto">
          {post.category && (
            <span className="text-label-xs text-muted-foreground tracking-[2px]">
              {post.category.toUpperCase()}
            </span>
          )}
          <MoveRight className="size-3.5 text-muted-foreground/40 group-hover:text-foreground group-hover:-rotate-45 transition-all duration-300 flex-shrink-0" />
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <H4 className="leading-snug text-h5 md:text-h4 group-hover:translate-x-0.5 transition-transform duration-300">
            {post.title}
          </H4>
          <span className="text-label-xs text-muted-foreground/60">
            {formatDate(post.publishedAt)}
            {post.estimatedReadingTime ? ` · ${post.estimatedReadingTime} ${readMin}` : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Main component ─── */
export function WorksContent({ projects, posts, labels }: Props) {
  const [filters, setFilters] = useQueryStates({
    q: parseAsString.withDefault(""),
    cat: parseAsString.withDefault(""),
    yr: parseAsString.withDefault(""),
  });

  const [localSearch, setLocalSearch] = useState(filters.q);
  const [visibleMonths, setVisibleMonths] = useState(MONTHS_PER_PAGE);

  useEffect(() => {
    setLocalSearch(filters.q);
  }, [filters.q]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleMonths(MONTHS_PER_PAGE);
  }, [filters.q, filters.cat, filters.yr]);

  const handleSearch = useCallback(
    (value: string) => {
      setLocalSearch(value);
      const timer = setTimeout(() => {
        setFilters({ q: value || null });
      }, 300);
      return () => clearTimeout(timer);
    },
    [setFilters],
  );

  const categories = Array.from(
    new Set(posts.map((p) => p.category).filter(Boolean) as string[]),
  ).sort();

  const years = Array.from(new Set(posts.map((p) => getYear(p.publishedAt)))).sort(
    (a, b) => Number(b) - Number(a),
  );

  const filteredPosts = posts.filter((p) => {
    const matchQ =
      !filters.q ||
      p.title.toLowerCase().includes(filters.q.toLowerCase()) ||
      (p.excerpt ?? "").toLowerCase().includes(filters.q.toLowerCase());
    const matchCat = !filters.cat || p.category === filters.cat;
    const matchYr = !filters.yr || getYear(p.publishedAt) === filters.yr;
    return matchQ && matchCat && matchYr;
  });

  const grouped = groupByMonth(filteredPosts);
  const hasFilters = !!(filters.q || filters.cat || filters.yr);
  // Show all when a filter is active so results aren't cut off
  const visibleGroups = hasFilters ? grouped : grouped.slice(0, visibleMonths);
  const hasMore = !hasFilters && grouped.length > visibleMonths;

  const pillBase =
    "px-3 py-1 border text-label-xs transition-colors duration-200 cursor-pointer";
  const pillActive = "border-foreground bg-foreground text-background";
  const pillInactive =
    "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground";

  return (
    <div className="flex flex-col gap-20">
      {/* Projects */}
      <div className="flex flex-col gap-6">
        <Label size="sm" className="text-muted-foreground tracking-[4px]">
          {labels.projectsLabel}
        </Label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {projects.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>
      </div>

      {/* Writing */}
      <div className="flex flex-col gap-5">
        <Label size="sm" className="text-muted-foreground tracking-[4px]">
          {labels.writingLabel}
        </Label>

        {/* Search — full width, prominent */}
        <div className="flex items-center gap-3 border-b border-border pb-3 focus-within:border-foreground transition-colors duration-200">
          <Search className="size-4 text-muted-foreground/50 flex-shrink-0" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search posts..."
            className="flex-1 bg-transparent text-body-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filters — left-aligned below search */}
        {(categories.length > 0 || years.length > 0) && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilters({ cat: null })}
              className={`${pillBase} ${!filters.cat ? pillActive : pillInactive}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilters({ cat: filters.cat === cat ? null : cat })}
                className={`${pillBase} ${filters.cat === cat ? pillActive : pillInactive}`}
              >
                {cat}
              </button>
            ))}

            {years.length > 1 && (
              <>
                <div className="w-px h-4 bg-border mx-1" />
                {years.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setFilters({ yr: filters.yr === yr ? null : yr })}
                    className={`${pillBase} font-mono ${filters.yr === yr ? pillActive : pillInactive}`}
                  >
                    {yr}
                  </button>
                ))}
              </>
            )}

            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setFilters({ q: null, cat: null, yr: null });
                  setLocalSearch("");
                }}
                className="ml-auto text-label-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 cursor-pointer underline underline-offset-4"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Grouped posts */}
        {grouped.length === 0 ? (
          <P size="md" className="text-muted-foreground py-12 text-center">
            {labels.noPosts}
          </P>
        ) : (
          <div className="flex flex-col gap-12">
            {visibleGroups.map(([monthKey, groupPosts]) => (
              <div key={monthKey} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-label-xs text-muted-foreground/60 font-mono tracking-[2px] uppercase">
                    {formatMonthYear(`${monthKey}-01`)}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-label-xs text-muted-foreground/40">
                    {groupPosts.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
                  {groupPosts.map((post) => (
                    <PostCard key={post._id} post={post} readMin={labels.readMin} />
                  ))}
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleMonths((v) => v + MONTHS_PER_PAGE)}
                  className="px-6 py-2.5 border border-border text-label-sm text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                >
                  Carregar mais
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
