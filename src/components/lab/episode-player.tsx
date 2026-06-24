"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

type EpisodePlayerProps = {
  videoId: string | null;
  onClose: () => void;
};

export function EpisodePlayer({ videoId, onClose }: EpisodePlayerProps) {
  return (
    <Dialog open={!!videoId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-4xl p-0 bg-black border border-border overflow-hidden rounded-none gap-0"
      >
        {videoId && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video"
            title="Episode player"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
