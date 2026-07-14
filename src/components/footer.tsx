import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { P } from "@/components/ui/typography";

export async function Footer() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="w-full">
      <Container className="flex items-center py-6">
        <P size="xs" className="text-muted-foreground">
          {t("copyright", { year })}
        </P>
      </Container>
    </footer>
  );
}
