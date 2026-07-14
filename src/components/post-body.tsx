"use client";

import { PortableText } from "next-sanity";
import { PostBlockquote } from "@/components/post-blockquote";
import { PostCodeBlock } from "@/components/post-code-block";
import { H2, H3, P } from "@/components/ui/typography";

function SectionSeparator() {
  return (
    <div className="flex items-center justify-center gap-8 py-10 md:py-16">
      <div className="w-16 h-px bg-border" />
      <div className="size-1.5 rounded-full bg-border" />
      <div className="w-16 h-px bg-border" />
    </div>
  );
}

const portableTextComponents: any = {
  types: {
    code: ({
      value,
    }: {
      value: { code: string; language?: string; filename?: string };
    }) => <PostCodeBlock value={value} />,
  },
  block: {
    h2: ({ children, value }: { children: React.ReactNode; value: any }) => {
      const text = (value?.children ?? [])
        .map((c: any) => c.text ?? "")
        .join("");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return (
        <H2 id={id} className="mt-2 mb-6 scroll-mt-28">
          {children}
        </H2>
      );
    },
    h3: ({ children, value }: { children: React.ReactNode; value: any }) => {
      const text = (value?.children ?? [])
        .map((c: any) => c.text ?? "")
        .join("");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return (
        <H3
          id={id}
          className="mt-6 md:mt-8 mb-3 md:mb-4 font-sans font-semibold text-h4 scroll-mt-28"
        >
          {children}
        </H3>
      );
    },
    normal: ({ children }: { children: React.ReactNode }) => (
      <P size="md" className="leading-[1.85] mb-5 text-foreground/90">
        {children}
      </P>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <PostBlockquote>{children}</PostBlockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="font-display italic">{children}</em>
    ),
    code: ({ children }: { children: React.ReactNode }) => (
      <code className="text-code-inline bg-muted px-1.5 py-0.5 rounded-sm font-mono">
        {children}
      </code>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href?: string };
      children: React.ReactNode;
    }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={
          value?.href?.startsWith("http") ? "noopener noreferrer" : undefined
        }
        className="underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground transition-colors duration-200"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="flex flex-col gap-2.5 mb-5">{children}</ul>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <ol className="flex flex-col gap-2.5 mb-5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <li className="flex gap-3 text-body-md leading-[1.8] text-foreground/90">
        <span className="text-muted-foreground flex-shrink-0 select-none mt-px">
          —
        </span>
        <span>{children}</span>
      </li>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <li className="text-body-md leading-[1.8] text-foreground/90 pl-1">
        {children}
      </li>
    ),
  },
};

export function PostBody({ body }: { body: unknown[] }) {
  // Group blocks into sections split by h2 — each section gets a visual separator between them
  const sections: unknown[][] = [];
  let current: unknown[] = [];

  for (const block of body) {
    const b = block as { _type?: string; style?: string };
    if (b._type === "block" && b.style === "h2" && current.length > 0) {
      sections.push(current);
      current = [block];
    } else {
      current.push(block);
    }
  }
  if (current.length > 0) sections.push(current);

  return (
    <div>
      {sections.map((section, i) => (
        <div key={i}>
          {i > 0 && <SectionSeparator />}
          <PortableText
            value={section as any}
            components={portableTextComponents}
          />
        </div>
      ))}
    </div>
  );
}
