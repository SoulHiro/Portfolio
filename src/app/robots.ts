import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.victormts.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Scrapers de treinamento — coletam e somem, não trazem tráfego
      {
        userAgent: [
          "GPTBot",          // OpenAI training crawler
          "CCBot",           // Common Crawl (base do GPT-3/4)
          "anthropic-ai",    // Anthropic training
          "ClaudeBot",       // Anthropic training crawler
          "Google-Extended", // Google Gemini training
          "Bytespider",      // ByteDance / TikTok training
          "Applebot-Extended",
          "cohere-ai",
          "Diffbot",
          "PetalBot",
        ],
        disallow: "/",
      },
      // Bots de busca em tempo real — trazem visitas reais quando citam você
      // OAI-SearchBot  = ChatGPT Browse (busca em tempo real)
      // ChatGPT-User   = quando um usuário manda o ChatGPT acessar uma URL
      // PerplexityBot  = Perplexity Answer Engine
      {
        userAgent: ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot"],
        allow: "/",
      },
      // Todo o resto (Googlebot, Bingbot, etc.)
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
