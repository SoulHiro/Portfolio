"use client";

import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToTop() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full size-8 border border-border hover:bg-accent transition-all duration-300"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
    >
      <ArrowUp className="size-3.5" />
    </Button>
  );
}
