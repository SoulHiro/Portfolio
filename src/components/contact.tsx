import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";
import { H2, P } from "@/components/ui/typography";

const EMAIL = "victormts.s1@gmail.com";

export async function Contact() {
  const t = await getTranslations("Contact");

  return (
    <section
      id="contact"
      className="flex items-center justify-center min-h-screen py-24 md:py-32"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full">
        {/* Left — info */}
        <div data-reveal className="flex flex-col gap-8 justify-center">
          <H2>
            {t("title1")}{" "}
            <span className="text-muted-foreground italic">
              {t("titleHighlight")}
            </span>
          </H2>

          <P size="lg" className="text-muted-foreground font-light max-w-xs">
            {t("description")}
          </P>

          <address className="not-italic flex flex-col gap-1.5">
            <span className="font-display text-h3 italic leading-tight tracking-tight">
              R. País Leme, 215 — Conj. 1713
            </span>
            <span className="text-body-md text-muted-foreground">
              Pinheiros · São Paulo, SP
            </span>
            <span className="font-mono text-label-sm text-muted-foreground/50 mt-1">
              CEP 05424-150
            </span>
          </address>

          <a
            href={`mailto:${EMAIL}`}
            className="text-body-md text-muted-foreground hover:text-foreground transition-colors duration-300 w-fit"
          >
            {EMAIL}
          </a>
        </div>

        {/* Right — form */}
        <div data-reveal className="flex flex-col justify-center">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
