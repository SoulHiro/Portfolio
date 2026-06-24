import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { MouseCoords } from "@/components/mouse-coords";
import { Glitch404 } from "@/components/easter-eggs/glitch-404";

export default function NotFound() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-24 flex flex-col justify-center min-h-[80vh] relative">
      <div className="flex flex-col gap-10">

        {/* 404 */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-label-xs tracking-[5px] text-muted-foreground/50 dark:text-muted-foreground/30 uppercase">
            Erro
          </span>
          <Glitch404 />
        </div>

        <div className="w-full h-px bg-border" />

        {/* Message + back link */}
        <div className="flex flex-col gap-8 max-w-md">
          <p className="text-body-md text-muted-foreground leading-relaxed">
            A página que você tentou acessar não existe ou foi movida para outro endereço.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-label-sm text-muted-foreground hover:text-foreground transition-colors duration-300 w-fit"
          >
            <MoveLeft className="size-4" />
            Voltar ao início
          </Link>
        </div>
      </div>

      {/* Mouse coordinates — HUD */}
      <MouseCoords />
    </section>
  );
}
