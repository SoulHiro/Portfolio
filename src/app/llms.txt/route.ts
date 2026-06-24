const BASE_URL = "https://www.victormts.dev";

const content = `# Victor M. Santos

> Software developer and product designer based in Brazil, building in public.

Victor M. Santos is a full-stack developer and product designer with experience in JavaScript/TypeScript, Python, and Go. He documents his building process through a devlog and a YouTube channel, covering architecture decisions, product strategy, and the day-to-day of building software.

## About

Victor's work sits at the intersection of engineering and product thinking. He writes about what he learns, the decisions he makes, and the tradeoffs he navigates — with the goal of building software that fits its problem space exactly.

## Pages

- [Portfolio](${BASE_URL}): Overview, selected works, and contact form.
- [Lab](${BASE_URL}/en/lab): Current project in active development. Includes roadmap, build status, architecture notes, and episode list from the devlog YouTube series.
- [Devlog](${BASE_URL}/en/works): Technical writing about software development, product thinking, architecture decisions, and building in public.

## Contact

Contact form at ${BASE_URL} (scroll to contact section) or via victormts.contato@gmail.com.

## Tech Stack

Frontend: Next.js (App Router), TypeScript, React, Tailwind CSS, Sanity CMS
Backend: Node.js, Go, PostgreSQL
Tooling: Docker, Vercel, Git
Learning: Rust
`;

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
