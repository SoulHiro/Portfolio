"use client";

import { MoveRight, Search, X } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { H4, P } from "@/components/ui/typography";
import { Link, useRouter } from "@/i18n/navigation";
import type { SanityPostListing } from "@/lib/sanity/types";

const MONTHS_PER_PAGE = 3;
const MAX_SUGGESTIONS = 3;

type Props = {
  posts: SanityPostListing[];
  labels: {
    readMin: string;
    noPosts: string;
  };
};

/* ─── Date utils ─── */
function parseUTC(iso: string) {
  const d = new Date(iso);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), day: d.getUTCDate() };
}

function formatMonthYear(iso: string) {
  const { y, m } = parseUTC(iso);
  return new Date(Date.UTC(y, m, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDate(iso: string) {
  const { y, m, day } = parseUTC(iso);
  return new Date(Date.UTC(y, m, day)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getYear(iso: string) {
  return String(parseUTC(iso).y);
}

function groupByMonth(posts: SanityPostListing[]) {
  const groups: Record<string, SanityPostListing[]> = {};
  for (const post of posts) {
    const { y, m } = parseUTC(post.publishedAt);
    const key = `${y}-${String(m + 1).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(post);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

/* ─── Search autocomplete ─── */
function SearchBox({
  posts,
  readMin,
}: {
  posts: SanityPostListing[];
  readMin: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = query.trim()
    ? posts
        .filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            (p.excerpt ?? "").toLowerCase().includes(query.toLowerCase()) ||
            (p.category ?? "").toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, MAX_SUGGESTIONS)
    : [];

  const showDropdown = open && query.trim().length > 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function clear() {
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const post = suggestions[activeIndex];
      if (post) {
        router.push(`/works/${post.slug}`);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div className="flex items-center gap-3 border-b border-border pb-3 focus-within:border-foreground transition-colors duration-200">
        <Search className="size-4 text-muted-foreground/50 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search posts..."
          autoComplete="off"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          role="combobox"
          aria-haspopup="listbox"
          className="flex-1 bg-transparent text-body-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 border border-border border-t-0 bg-background"
        >
          {suggestions.length === 0 ? (
            <div className="px-5 py-4">
              <P size="sm" className="text-muted-foreground/60">
                No posts found.
              </P>
            </div>
          ) : (
            suggestions.map((post, i) => (
              <Link
                key={post._id}
                href={`/works/${post.slug}`}
                role="option"
                aria-selected={i === activeIndex}
                onClick={() => setOpen(false)}
                className={`flex flex-col gap-1.5 px-5 py-4 transition-colors duration-150 border-b border-border last:border-b-0 ${
                  i === activeIndex ? "bg-accent" : "hover:bg-accent"
                }`}
              >
                {/* Category */}
                {post.category && (
                  <span className="text-label-xs text-muted-foreground/50 tracking-[2px] uppercase">
                    {post.category}
                  </span>
                )}

                {/* Title + date on the same row */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-body-sm text-foreground font-medium leading-snug">
                    {post.title}
                  </span>
                  <span className="text-label-xs text-muted-foreground/50 font-mono shrink-0">
                    {formatDate(post.publishedAt)}
                    {post.estimatedReadingTime
                      ? ` · ${post.estimatedReadingTime} ${readMin}`
                      : ""}
                  </span>
                </div>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-label-xs text-muted-foreground/60 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Post Card — portrait ─── */
function PostCard({
  post,
  readMin,
}: {
  post: SanityPostListing;
  readMin: string;
}) {
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
            {post.estimatedReadingTime
              ? ` · ${post.estimatedReadingTime} ${readMin}`
              : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Main component ─── */
export function WorksContent({ posts, labels }: Props) {
  const [filters, setFilters] = useQueryStates({
    cat: parseAsString.withDefault(""),
    yr: parseAsString.withDefault(""),
  });

  const [visibleMonths, setVisibleMonths] = useState(MONTHS_PER_PAGE);

  // biome-ignore lint/correctness/useExhaustiveDependencies: primitive values from nuqs, more precise than full filters object
  useEffect(() => {
    setVisibleMonths(MONTHS_PER_PAGE);
  }, [filters.cat, filters.yr]);

  const categories = Array.from(
    new Set(posts.map((p) => p.category).filter(Boolean) as string[]),
  ).sort();

  const years = Array.from(
    new Set(posts.map((p) => getYear(p.publishedAt))),
  ).sort((a, b) => Number(b) - Number(a));

  const filteredPosts = posts.filter((p) => {
    const matchCat = !filters.cat || p.category === filters.cat;
    const matchYr = !filters.yr || getYear(p.publishedAt) === filters.yr;
    return matchCat && matchYr;
  });

  const grouped = groupByMonth(filteredPosts);
  const hasFilters = !!(filters.cat || filters.yr);
  const visibleGroups = hasFilters ? grouped : grouped.slice(0, visibleMonths);
  const hasMore = !hasFilters && grouped.length > visibleMonths;

  const pillBase =
    "px-3 py-1 border text-label-xs transition-colors duration-200 cursor-pointer";
  const pillActive = "border-foreground bg-foreground text-background";
  const pillInactive =
    "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground";

  return (
    <div className="flex flex-col gap-5">
      {/* Search autocomplete */}
      <SearchBox posts={posts} readMin={labels.readMin} />

      {/* Filters */}
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
              onClick={() =>
                setFilters({ cat: filters.cat === cat ? null : cat })
              }
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
                  onClick={() =>
                    setFilters({ yr: filters.yr === yr ? null : yr })
                  }
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
              onClick={() => setFilters({ cat: null, yr: null })}
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
        <div className="flex flex-col gap-12 mt-4">
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
                  <PostCard
                    key={post._id}
                    post={post}
                    readMin={labels.readMin}
                  />
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
  );
}
