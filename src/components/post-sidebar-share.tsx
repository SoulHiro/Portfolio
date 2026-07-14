"use client";

import {
  IconBrandLinkedin,
  IconBrandOpenai,
  IconBrandX,
  IconLink,
} from "@tabler/icons-react";
import { Check } from "lucide-react";
import { useState } from "react";

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

  const openInChatGPT = () => {
    const url = window.location.href;
    const prompt = `Por favor, abra esta URL com busca na web e leia o artigo completo: ${url}\n\nDepois de ler o conteúdo real, faça o seguinte:\n\n1) Explique o que o autor está construindo, aprendendo ou questionando — sem jargão técnico. Foque no raciocínio por trás das decisões, não só no que foi feito.\n\n2) Destaque 3 pontos que provavelmente não ficaram óbvios numa leitura rápida: uma decisão de arquitetura, uma tensão que o autor resolveu de forma não convencional, ou algo mencionado de passagem mas com impacto real.\n\n3) Sugira uma coisa concreta que alguém que leu isso poderia tentar, testar ou pesquisar em seguida — algo acionável, não genérico.\n\n4) Sugira uma pergunta que o próprio autor provavelmente gostaria que o leitor fizesse depois de ler isso.`;
    window.open(
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
      "_blank",
      "noopener,noreferrer",
    );
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
        <button
          type="button"
          onClick={openInChatGPT}
          className={btnClass}
          aria-label="Summarize with ChatGPT"
          title="Resumir com ChatGPT"
        >
          <IconBrandOpenai size={18} stroke={1.5} />
        </button>
      </div>
    </aside>
  );
}
