"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Label } from "@/components/ui/typography";

const locales: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "/flags/us.svg" },
  { code: "pt-br", label: "BR", flag: "/flags/br.svg" },
];

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = locales.find((l) => l.code === locale) ?? locales[0]!;

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
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-300"
        aria-label="Change language"
      >
        <Image src={current.flag} alt={current.label} width={16} height={12} className="rounded-[2px] object-cover" />
        <Label size="sm" className="text-inherit">{current.label}</Label>
        <ChevronDown className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 bg-background border border-border rounded-md overflow-hidden shadow-lg min-w-[120px] z-50">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLocale(l.code)}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-colors duration-200 cursor-pointer ${
                l.code === locale
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Image src={l.flag} alt={l.label} width={18} height={13} className="rounded-[2px] object-cover" />
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
