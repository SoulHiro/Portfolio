import { Section } from "@react-email/components";
import {
  Badge,
  EmailButton,
  EmailLayout,
  FooterText,
  Heading,
  Paragraph,
  SocialLinks,
} from "./email-layout";

type Props = {
  name: string;
  subject: string;
};

export function ContactConfirmation({ name, subject }: Props) {
  return (
    <EmailLayout
      preview={`Mensagem recebida, ${name}!`}
      footer={
        <>
          <SocialLinks />
          <FooterText>{`© ${new Date().getFullYear()} Victor M. Santos. Todos os direitos reservados.`}</FooterText>
          <FooterText>
            Você recebeu este email porque enviou uma mensagem pelo formulário
            de contato.
          </FooterText>
        </>
      }
    >
      <Heading>{`Mensagem recebida, ${name}.`}</Heading>

      <Section style={{ marginBottom: "24px" }}>
        <Badge>{subject}</Badge>
      </Section>

      <Paragraph>
        Obrigado por entrar em contato. Recebi sua mensagem e retornarei com uma
        resposta em até{" "}
        <strong style={{ color: "#f0f0f0" }}>48 horas úteis</strong>.
      </Paragraph>

      <Paragraph>
        Enquanto isso, fique à vontade para explorar meus projetos e conhecer um
        pouco mais do <strong style={{ color: "#f0f0f0" }}>meu trabalho</strong>
        .
      </Paragraph>

      <Section style={{ marginTop: "32px" }}>
        <EmailButton href="https://www.victormts.dev">
          Ver portfólio →
        </EmailButton>
      </Section>
    </EmailLayout>
  );
}
