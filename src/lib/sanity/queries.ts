import { groq } from "next-sanity";

export const PROJECTS_QUERY = groq`
  *[_type == "project"] | order(order asc, publishedAt desc) {
    _id,
    title,
    "tagline": select($locale == "en" => coalesce(tagline_en, tagline), tagline),
    "slug": slug.current,
    category,
    year,
    heroImage,
    color,
    featured,
    order,
    "stack": stack[].name
  }
`;

export const PROJECT_BY_SLUG_QUERY = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "tagline": select($locale == "en" => coalesce(tagline_en, tagline), tagline),
    "slug": slug.current,
    category,
    year,
    duration,
    client,
    "role": select($locale == "en" => coalesce(role_en, role), role),
    liveUrl,
    color,
    heroImage,
    stack,
    "challenge": select($locale == "en" => coalesce(challenge_en, challenge), challenge),
    "approach": select($locale == "en" => coalesce(approach_en, approach), approach),
    features,
    gallery,
    results,
    testimonial,
    publishedAt
  }
`;

export const ALL_PROJECT_SLUGS_QUERY = groq`
  *[_type == "project"] | order(order asc, publishedAt desc) {
    "slug": slug.current
  }
`;

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "titleHighlight": coalesce(titleHighlight, null),
    "slug": slug.current,
    "excerpt": select($locale == "en" => coalesce(excerpt_en, excerpt), excerpt),
    "category": categories[0]->title,
    estimatedReadingTime,
    publishedAt,
    tags,
    author-> { name, handle },
    "body": select(
      $locale == "en" => coalesce(body_en, body),
      body
    )
  }
`;

export const ALL_POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const POSTS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "excerpt": select($locale == "en" => coalesce(excerpt_en, excerpt), excerpt),
    "category": coalesce(categories[0]->title, tags[0]),
    publishedAt,
    estimatedReadingTime
  }
`;

// ─── Lab ──────────────────────────────────────────────────────────────────────

const LAB_PROJECT_FIELDS = groq`
  _id,
  name,
  description,
  architectureNotes,
  technologies,
  liveUrl,
  githubRepo,
  commitsCount,
  youtubePlaylistId,
  "roadmap": roadmap[] | order(phase asc) {
    phase, title, description, status
  }
`;

// Busca via singleton de configurações (quando existe featuredProject selecionado)
export const LAB_SETTINGS_QUERY = groq`
  *[_type == "labSettings"][0] {
    "featuredProject": featuredProject-> { ${LAB_PROJECT_FIELDS} }
  }
`;

// Fallback: pega o primeiro labProject publicado diretamente
export const LAB_PROJECT_FALLBACK_QUERY = groq`
  *[_type == "labProject"] | order(_createdAt asc) [0] {
    ${LAB_PROJECT_FIELDS}
  }
`;

export const LATEST_POSTS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    "excerpt": select($locale == "en" => coalesce(excerpt_en, excerpt), excerpt),
    "category": coalesce(categories[0]->title, tags[0]),
    publishedAt,
    estimatedReadingTime
  }
`;

export const RELATED_POSTS_QUERY = groq`
  *[_type == "post" && slug.current != $slug && defined(slug.current)] | order(publishedAt desc) [0...2] {
    _id,
    title,
    "slug": slug.current,
    "excerpt": select($locale == "en" => coalesce(excerpt_en, excerpt), excerpt),
    "category": coalesce(categories[0]->title, tags[0]),
    publishedAt,
    estimatedReadingTime
  }
`;

export const LAB_STATUS_QUERY = groq`
  *[_type == "labStatus"][0] {
    body,
    "updatedAt": _updatedAt
  }
`;
