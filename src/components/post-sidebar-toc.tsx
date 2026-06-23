"use client";

import { useState, useEffect } from "react";

export type TocSection = { id: string; title: string };

function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

export function PostSidebarToc({ sections }: { sections: TocSection[] }) {
  const activeId = useActiveSection(sections.map((s) => s.id));

  if (sections.length === 0) return null;

  return (
    <aside className="absolute right-0 top-0 h-full w-44 hidden xl:flex pointer-events-none">
      <div className="sticky top-0 h-screen flex flex-col items-end justify-center w-full px-5 gap-6 pointer-events-auto">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`group flex items-center gap-2.5 text-right transition-colors duration-300 ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground/35 hover:text-muted-foreground"
              }`}
            >
              <span className="text-label-xs leading-snug max-w-[90px]">
                {section.title}
              </span>
              <div
                className={`w-3 h-px flex-shrink-0 transition-all duration-300 ${
                  isActive
                    ? "bg-foreground w-5"
                    : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                }`}
              />
            </a>
          );
        })}
      </div>
    </aside>
  );
}
