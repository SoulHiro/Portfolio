import { defineConfig, defineType, defineField, defineArrayMember } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// ─── Portable Text (body dos posts) ─────────────────────────────────────────

const blockContent = defineType({
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Citação", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Negrito", value: "strong" },
          { title: "Itálico", value: "em" },
          { title: "Código", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [{ name: "href", type: "url", title: "URL" }],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "code",
      options: { language: "typescript", withFilename: true },
    }),
  ],
});

// ─── Post (Devlog) ───────────────────────────────────────────────────────────

const post = defineType({
  name: "post",
  title: "Post — Devlog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Clique em Gerar para preencher automaticamente.",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Descrição curta",
      description: "Aparece abaixo do título na hero do post e nos cards da lista.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description: "Ex: Engineering, Product, Go, NR-1",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "estimatedReadingTime",
      title: "Tempo de leitura (min)",
      type: "number",
    }),
    defineField({
      name: "publishedAt",
      title: "Data de publicação",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "body",
      title: "Conteúdo",
      type: "blockContent",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt" },
  },
  orderings: [{ title: "Mais recente", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
});

// ─── Lab Project ─────────────────────────────────────────────────────────────

const roadmapStep = defineType({
  name: "roadmapStep",
  title: "Step do Roadmap",
  type: "object",
  fields: [
    defineField({ name: "phase", title: "Fase (número)", type: "number", validation: (r) => r.required().min(1).max(6) }),
    defineField({ name: "title", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Descrição", type: "text", rows: 2 }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Concluído", value: "done" },
          { title: "Em andamento", value: "active" },
          { title: "Futuro", value: "upcoming" },
        ],
        layout: "radio",
      },
      initialValue: "upcoming",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "status" },
    prepare({ title, subtitle }) {
      const icon = subtitle === "done" ? "✓" : subtitle === "active" ? "●" : "○";
      return { title: `${icon} ${title}` };
    },
  },
});

const labProject = defineType({
  name: "labProject",
  title: "Projeto — Lab",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nome do projeto", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "projectType",
      title: "Tipo de projeto",
      type: "string",
      description: "YouTube: mostra seção de episódios. Pessoal: oculta episódios.",
      options: {
        list: [
          { title: "📺 YouTube — documentado em vídeo", value: "youtube" },
          { title: "🔒 Pessoal — sem episódios", value: "personal" },
        ],
        layout: "radio",
      },
      initialValue: "youtube",
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Descrição curta", description: "Aparece abaixo do título na hero do Lab.", type: "text", rows: 3 }),
    defineField({
      name: "architectureNotes",
      title: "Notas de arquitetura",
      description: "O parágrafo que explica as decisões técnicas (por que Go, por que PostgreSQL, etc).",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "technologies",
      title: "Tecnologias",
      description: "Lista completa: TypeScript, Go, Next.js, Tailwind, Fastify, PostgreSQL...",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "liveUrl", title: "URL ao vivo", type: "url" }),
    defineField({
      name: "githubRepo",
      title: "Repositório GitHub",
      description: "Formato: usuario/repo (ex: SoulHiro/campomind)",
      type: "string",
    }),
    defineField({ name: "commitsCount", title: "Qtd. de commits", description: "Atualize manualmente quando quiser.", type: "number" }),
    defineField({
      name: "youtubePlaylistId",
      title: "ID da playlist do YouTube",
      description: "Só o ID, ex: PLrAXtmErZgOeiKm4sgNOknc9TTnRtbHlX",
      type: "string",
    }),
    defineField({
      name: "roadmap",
      title: "Roadmap (máx 6 fases)",
      type: "array",
      of: [{ type: "roadmapStep" }],
      validation: (r) => r.max(6),
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});

// ─── Lab Status (singleton — data = _updatedAt automático) ──────────────────

const labStatus = defineType({
  name: "labStatus",
  title: "Lab — Situação Atual",
  type: "document",
  fields: [
    defineField({
      name: "body",
      title: "O que está sendo trabalhado agora",
      description: "A data exibida na página é gerada automaticamente quando você salva.",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "body" } },
});

// ─── Lab Settings (singleton) ────────────────────────────────────────────────

const labSettings = defineType({
  name: "labSettings",
  title: "Lab — Configurações",
  type: "document",
  fields: [
    defineField({
      name: "featuredProject",
      title: "Projeto em destaque",
      type: "reference",
      to: [{ type: "labProject" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "youtubePlaylistId",
      title: "ID da playlist do YouTube",
      description: "Só o ID, ex: PLrAXtmErZgOeiKm4sgNOknc9TTnRtbHlX",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "featuredProject.name" },
    prepare({ title }) {
      return { title: `Configurações — ${title ?? "sem projeto"}` };
    },
  },
});

// ─── Structure (Studio sidebar) ──────────────────────────────────────────────

function structure(S: import("sanity/structure").StructureBuilder) {
  return S.list()
    .title("Conteúdo")
    .items([
      S.listItem()
        .title("Posts — Devlog")
        .schemaType("post")
        .child(S.documentTypeList("post").title("Posts").defaultOrdering([{ field: "publishedAt", direction: "desc" }])),

      S.divider(),

      S.listItem()
        .title("Projeto em Destaque")
        .schemaType("labProject")
        .child(S.documentTypeList("labProject").title("Projetos")),

      S.listItem()
        .title("Situação Atual")
        .child(
          S.editor()
            .id("labStatus-singleton")
            .schemaType("labStatus")
            .documentId("labStatus-singleton"),
        ),

      S.listItem()
        .title("Configurações do Lab")
        .child(
          S.editor()
            .id("labSettings-singleton")
            .schemaType("labSettings")
            .documentId("labSettings-singleton"),
        ),
    ]);
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default defineConfig({
  name: "portfolio-studio",
  title: "Victor — Studio",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool(),
    codeInput(),
  ],
  schema: {
    types: [blockContent, post, roadmapStep, labProject, labStatus, labSettings],
  },
});
