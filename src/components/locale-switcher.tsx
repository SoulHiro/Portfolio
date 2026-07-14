"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/typography";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const locales: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "pt-br", label: "BR" },
];

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    setOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-300"
        aria-label="Change language"
      >
        <Globe className="size-3.5" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 bg-background border border-border rounded-md overflow-hidden shadow-lg min-w-[120px] z-50">
          {locales.map((l) => (
            <button
              type="button"
              key={l.code}
              onClick={() => switchLocale(l.code)}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-colors duration-200 cursor-pointer ${
                l.code === locale
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Globe className="size-3.5 shrink-0" strokeWidth={1.5} />
              <Label size="sm" className="text-inherit">
                {l.code === "en" ? "English" : "Português"}
              </Label>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
