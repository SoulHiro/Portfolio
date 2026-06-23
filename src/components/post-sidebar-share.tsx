"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  IconBrandX,
  IconBrandLinkedin,
  IconLink,
} from "@tabler/icons-react";

export function PostSidebarShare() {
  const [copied, setCopied] = useState(false);

  const shareOnX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnClass =
    "flex items-center justify-center size-10 border border-border text-muted-foreground transition-all duration-300 hover:text-foreground hover:border-foreground cursor-pointer";

  return (
    <aside className="absolute left-0 top-0 h-full w-44 hidden xl:flex pointer-events-none">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center gap-5 w-full pointer-events-auto">
        <button
          type="button"
          onClick={shareOnX}
          className={btnClass}
          aria-label="Share on X"
        >
          <IconBrandX size={18} stroke={1.5} />
        </button>
        <button
          type="button"
          onClick={shareOnLinkedIn}
          className={btnClass}
          aria-label="Share on LinkedIn"
        >
          <IconBrandLinkedin size={18} stroke={1.5} />
        </button>
        <button
          type="button"
          onClick={copyLink}
          className={btnClass}
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="size-[18px]" />
          ) : (
            <IconLink size={18} stroke={1.5} />
          )}
        </button>
      </div>
    </aside>
  );
}
