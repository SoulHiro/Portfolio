"use client";

import { useEffect, useState } from "react";

export type TocSection = { id: string; title: string; level: "h2" | "h3" };

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
      <div className="sticky top-0 h-screen flex flex-col items-end justify-center w-full px-5 gap-4 pointer-events-auto">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          const isH3 = section.level === "h3";
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
              <span
                className={`leading-snug max-w-[90px] transition-all duration-300 ${
                  isH3 ? "text-[10px] max-w-[78px] opacity-80" : "text-label-xs"
                }`}
              >
                {section.title}
              </span>
              <div
                className={`h-px flex-shrink-0 transition-all duration-300 ${
                  isH3 ? "w-2" : "w-3"
                } ${
                  isActive
                    ? `bg-foreground ${isH3 ? "w-3" : "w-5"}`
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
