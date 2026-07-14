export type SanityImageValue = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
};

export type SanityProjectListing = {
  _id: string;
  title: string;
  tagline: string | null;
  slug: string;
  category: string;
  year: number;
  heroImage: SanityImageValue;
  color: string | null;
  featured: boolean | null;
  order: number | null;
  stack: string[];
};

export type SanityPostListing = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  publishedAt: string;
  estimatedReadingTime: number | null;
};

export type SanityPostFull = {
  _id: string;
  title: string;
  titleHighlight: string | null;
  slug: string;
  excerpt: string | null;
  category: string | null;
  estimatedReadingTime: number | null;
  publishedAt: string;
  tags: string[] | null;
  author: { name: string; handle: string | null } | null;
  body: unknown[];
};

// ─── Lab ──────────────────────────────────────────────────────────────────────

export type SanityRoadmapStep = {
  phase: number;
  title: string;
  description: string | null;
  status: "done" | "active" | "upcoming";
};

export type SanityLabProject = {
  _id: string;
  name: string;
  projectType: "youtube" | "personal" | null;
  description: string | null;
  architectureNotes: string | null;
  technologies: string[] | null;
  liveUrl: string | null;
  githubRepo: string | null;
  commitsCount: number | null;
  youtubePlaylistId: string | null;
  roadmap: SanityRoadmapStep[] | null;
};

export type SanityLabSettings = {
  featuredProject: SanityLabProject | null;
};

export type SanityLabStatus = {
  body: string;
  updatedAt: string;
};

export type SanityLabProjectListing = {
  _id: string;
  name: string;
  description: string | null;
  technologies: string[] | null;
  liveUrl: string | null;
  githubRepo: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────

export type SanityProjectFull = {
  _id: string;
  title: string;
  tagline: string | null;
  slug: string;
  category: string;
  year: number;
  duration: string | null;
  client: string | null;
  role: string | null;
  liveUrl: string | null;
  color: string | null;
  heroImage: SanityImageValue;
  stack: { name: string; category: string }[] | null;
  challenge: string | null;
  approach: string | null;
  features:
    | { title: string; description: string; image: SanityImageValue }[]
    | null;
  gallery: (SanityImageValue & { alt?: string })[] | null;
  results: { metric: string; label: string; detail: string }[] | null;
  testimonial: { quote: string; author: string; role: string } | null;
  publishedAt: string;
};
