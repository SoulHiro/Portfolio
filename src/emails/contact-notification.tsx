import { Hr, Section } from "@react-email/components";
import {
  Badge,
  colors,
  DataCard,
  EmailButton,
  EmailLayout,
  FieldRow,
  FooterText,
  Heading,
  Paragraph,
} from "./email-layout";

type Props = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactNotification({ name, email, subject, message }: Props) {
  return (
    <EmailLayout
      preview={`Nova mensagem de ${name} — ${subject}`}
      footer={
        <>
          <FooterText>Notificação automática — Victor M. Santos</FooterText>
          <FooterText>
            Enviada via formulário de contato em victormts.dev
          </FooterText>
        </>
      }
    >
      <Heading>Nova mensagem recebida.</Heading>

      <Section style={{ marginBottom: "24px" }}>
        <Badge>{subject}</Badge>
      </Section>

      <DataCard>
        <table>
          <tbody>
            <FieldRow label="NOME" value={name} />
            <FieldRow label="EMAIL" value={email} />
            <FieldRow label="ASSUNTO" value={subject} />
          </tbody>
        </table>
        <Hr style={{ borderColor: colors.border, margin: "16px 0" }} />
        <Paragraph>{message}</Paragraph>
      </DataCard>

      <Paragraph muted>
        Responda diretamente este email ou clique abaixo para responder ao
        remetente.
      </Paragraph>

      <Section style={{ marginTop: "24px" }}>
        <EmailButton
          href={`mailto:${email}`}
        >{`Responder → ${name}`}</EmailButton>
      </Section>
    </EmailLayout>
  );
}
