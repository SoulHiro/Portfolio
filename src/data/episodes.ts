export type Episode = {
  id: string;
  videoId: string;
  number: number;
  title: string;
  duration: string;
  date: string;
};

export const EPISODES: Episode[] = [
  {
    id: "ep-001",
    videoId: "dQw4w9WgXcQ",
    number: 1,
    title: "Do zero: por que estou construindo o CampoMind em público",
    duration: "18:42",
    date: "2026-06-01",
  },
  {
    id: "ep-002",
    videoId: "9bZkp7q19f0",
    number: 2,
    title: "Arquitetura de um SaaS multi-tenant com Next.js e Go",
    duration: "31:15",
    date: "2026-06-08",
  },
  {
    id: "ep-003",
    videoId: "jNQXAC9IVRw",
    number: 3,
    title: "Integrando WhatsApp Business API sem enlouquecer",
    duration: "24:07",
    date: "2026-06-15",
  },
  {
    id: "ep-004",
    videoId: "BRssQPuhpa0",
    number: 4,
    title: "Row-level security no PostgreSQL: isolamento real entre tenants",
    duration: "27:53",
    date: "2026-06-22",
  },
  {
    id: "ep-005",
    videoId: "aircAruvnKk",
    number: 5,
    title: "Filas com Redis e BullMQ: geração de PGR em background",
    duration: "22:18",
    date: "2026-06-29",
  },
  {
    id: "ep-006",
    videoId: "ysz5S6PUM-U",
    number: 6,
    title: "Deploy no Vercel com GitHub Actions e variáveis por ambiente",
    duration: "19:44",
    date: "2026-07-06",
  },
];

export const latestEpisode = EPISODES[EPISODES.length - 1] ?? null;
