"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { EpisodePlayer } from "./episode-player";
import { EPISODES } from "@/data/episodes";
export type { Episode } from "@/data/episodes";

export function EpisodeList({ label }: { label: string }) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-card]");
    const amount = firstCard ? firstCard.offsetWidth + 16 : 300;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (EPISODES.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <span className="text-label-xs tracking-[3px] text-muted-foreground/50 font-semibold">
          {label}
        </span>
        <p className="text-body-sm text-muted-foreground/35 italic">
          Nenhum episódio ainda — o primeiro sai em breve.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header: label + count + arrows */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-4">
          <span className="text-label-xs tracking-[3px] text-muted-foreground/50 font-semibold">
            {label}
          </span>
          <span className="font-mono text-label-xs text-muted-foreground/25">
            {EPISODES.length} ep.
          </span>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Episódio anterior"
            className="size-8 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Próximo episódio"
            className="size-8 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Scroll track */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        <div className="flex gap-4">
          {EPISODES.map((ep, i) => (
            <motion.button
              key={ep.id}
              data-card
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05, duration: 0.25, ease: "easeOut" }}
              onClick={() => setActiveVideoId(ep.videoId)}
              className="group shrink-0 w-64 md:w-72 lg:w-80 snap-start text-left flex flex-col border border-border overflow-hidden hover:border-foreground/25 transition-colors duration-200 cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted shrink-0">
                <img
                  src={`https://img.youtube.com/vi/${ep.videoId}/hqdefault.jpg`}
                  alt={ep.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="size-9 border border-white/25 flex items-center justify-center">
                    <Play className="size-3.5 fill-white text-white ml-0.5" />
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1.5 p-4 flex-1">
                <span className="font-mono text-label-xs text-muted-foreground/35">
                  EP {String(ep.number).padStart(2, "0")} · {ep.duration}
                </span>
                <span className="text-body-sm font-medium leading-snug line-clamp-2 group-hover:text-foreground transition-colors duration-200">
                  {ep.title}
                </span>
              </div>
            </motion.button>
          ))}

          {/* Trailing spacer so last card scrolls fully into view */}
          <div className="shrink-0 w-1" aria-hidden />
        </div>
      </div>

      <EpisodePlayer
        videoId={activeVideoId}
        onClose={() => setActiveVideoId(null)}
      />
    </div>
  );
}
