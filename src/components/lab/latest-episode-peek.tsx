"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { EpisodePlayer } from "./episode-player";
import type { YoutubeEpisode } from "@/lib/sanity/youtube";

export function LatestEpisodePeek({ episode }: { episode: YoutubeEpisode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex flex-col gap-2 cursor-pointer text-left shrink-0"
        aria-label={`Assistir episódio ${episode.position}: ${episode.title}`}
      >
        <div className="relative w-48 md:w-56 aspect-video overflow-hidden">
          <img
            src={episode.thumbnail}
            alt={episode.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-200">
            <span className="size-9 border border-white/25 flex items-center justify-center">
              <Play className="size-3.5 fill-white text-white ml-0.5" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-label-xs text-muted-foreground/35">
            Ep {String(episode.position).padStart(2, "0")}
            {episode.duration && ` · ${episode.duration}`}
          </span>
          <span className="text-label-xs text-muted-foreground/25">·</span>
          <span className="text-label-xs text-muted-foreground/45 group-hover:text-muted-foreground transition-colors duration-200">
            assistir
          </span>
        </div>
      </button>

      <EpisodePlayer
        videoId={open ? episode.videoId : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
