import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Explicitly allow the major AI/LLM crawlers by name, so it's clear
      // and future-proof rather than relying only on the wildcard above.
      { userAgent: "GPTBot", allow: "/" }, // OpenAI (training)
      { userAgent: "ChatGPT-User", allow: "/" }, // ChatGPT live browsing
      { userAgent: "OAI-SearchBot", allow: "/" }, // ChatGPT search
      { userAgent: "ClaudeBot", allow: "/" }, // Anthropic (training)
      { userAgent: "Claude-Web", allow: "/" }, // Claude live browsing/search
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" }, // Perplexity live search
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" }, // Gemini / AI Overviews training
      { userAgent: "Applebot-Extended", allow: "/" }, // Apple Intelligence
      { userAgent: "Amazonbot", allow: "/" }, // Alexa / Amazon AI
      { userAgent: "Bytespider", allow: "/" }, // ByteDance / TikTok AI
      { userAgent: "CCBot", allow: "/" }, // Common Crawl (feeds many LLMs)
    ],
    sitemap: "https://solarleadads.com/sitemap.xml",
  };
}
