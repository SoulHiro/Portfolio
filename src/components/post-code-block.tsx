"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  value: {
    code: string;
    language?: string;
    filename?: string;
  };
};

export function PostCodeBlock({ value }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="my-6 rounded-none border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <span className="font-mono text-label-xs text-muted-foreground tracking-wide">
          {value.filename ?? value.language ?? "code"}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-label-xs text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          aria-label="Copiar código"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? "copiado" : "copiar"}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-5 bg-[oklch(0.08_0_0)] dark:bg-[oklch(0.06_0_0)]">
        <code className="font-mono text-code-block text-[oklch(0.82_0_0)] leading-[1.65]">
          {value.code}
        </code>
      </pre>
    </div>
  );
}
