import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

export const colors = {
  bg: "#050505",
  card: "#111111",
  border: "#1e1e1e",
  foreground: "#f0f0f0",
  muted: "#6b6b6b",
  accent: "#a0a0a0",
};

export function EmailLayout({
  preview,
  children,
  footer,
}: {
  preview: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: colors.bg, margin: 0, padding: 0 }}>
        <Container
          style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px" }}
        >
          <Text
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: "20px",
              color: colors.foreground,
              margin: "0 0 32px 0",
            }}
          >
            VS.
          </Text>
          <Hr style={{ borderColor: colors.border, margin: "0 0 24px 0" }} />
          <Text
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              color: colors.muted,
              margin: "0 0 32px 0",
              letterSpacing: "1px",
            }}
          >
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "America/Sao_Paulo",
            })}
          </Text>
          {children}
          <Hr style={{ borderColor: colors.border, margin: "40px 0 24px 0" }} />
          {footer}
        </Container>
      </Body>
    </Html>
  );
}

export function Badge({ children }: { children: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "monospace",
        fontSize: "11px",
        color: colors.accent,
        border: `1px solid ${colors.border}`,
        borderRadius: "100px",
        padding: "4px 14px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

export function EmailButton({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: "13px",
        fontWeight: 500,
        color: colors.bg,
        backgroundColor: colors.foreground,
        border: `1px solid ${colors.foreground}`,
        borderRadius: "4px",
        padding: "10px 24px",
        textDecoration: "none",
        letterSpacing: "0.5px",
      }}
    >
      {children}
    </Link>
  );
}

export function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td
        style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: colors.muted,
          textTransform: "uppercase",
          letterSpacing: "1px",
          paddingRight: "20px",
          paddingBottom: "8px",
          verticalAlign: "top",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </td>
      <td
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "14px",
          color: colors.foreground,
          fontWeight: 600,
          paddingBottom: "8px",
          verticalAlign: "top",
        }}
      >
        {value}
      </td>
    </tr>
  );
}

export function DataCard({ children }: { children: ReactNode }) {
  return (
    <Section
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: "6px",
        padding: "24px",
        margin: "24px 0",
      }}
    >
      {children}
    </Section>
  );
}

export function Heading({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: "Georgia, serif",
        fontSize: "28px",
        fontWeight: 700,
        color: colors.foreground,
        lineHeight: "1.2",
        margin: "0 0 16px 0",
      }}
    >
      {children}
    </Text>
  );
}

export function Paragraph({
  children,
  muted,
}: {
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <Text
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: "14px",
        lineHeight: "1.7",
        color: muted ? colors.muted : colors.accent,
        margin: "0 0 12px 0",
      }}
    >
      {children}
    </Text>
  );
}

export function SocialLinks() {
  const links = [
    { label: "Portfólio", href: "https://www.victormts.dev" },
    { label: "Instagram", href: "https://instagram.com/soulhirostudio" },
    { label: "LinkedIn", href: "https://linkedin.com/in/victormts" },
  ];
  return (
    <Section style={{ marginBottom: "16px" }}>
      {links.map((link, i) => (
        <Link
          key={link.label}
          href={link.href}
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "12px",
            color: colors.muted,
            textDecoration: "underline",
            marginRight: i < links.length - 1 ? "16px" : "0",
          }}
        >
          {link.label}
        </Link>
      ))}
    </Section>
  );
}

export function FooterText({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: "11px",
        color: "#3a3a3a",
        lineHeight: "1.6",
        margin: "0",
      }}
    >
      {children}
    </Text>
  );
}
