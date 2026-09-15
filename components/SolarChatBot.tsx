"use client";

import ChatWidget, { type ChatBotReply, type ChatHistoryMessage } from "@/components/ChatWidget";
import { getFaqResponse } from "@/lib/chatbot/faq-bot";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Messages this short/low-effort almost never need real AI reasoning (e.g.
// "ok", "hi", "??", a single emoji). Catching these before even touching
// getFaqResponse/the AI endpoint saves a wasted round trip and keeps the
// free path snappy. Real one-word questions ("pricing?") are still long
// enough to pass this and get a proper answer.
const MIN_MESSAGE_LENGTH = 4;
// Message is "just punctuation/emoji" if there's no letter or digit in it.
const HAS_WORD_CHARACTER = /[\p{L}\p{N}]/u;

function isTrivialInput(message: string): boolean {
  const trimmed = message.trim();
  if (trimmed.length < MIN_MESSAGE_LENGTH) return true;
  if (!HAS_WORD_CHARACTER.test(trimmed)) return true;
  return false;
}

export default function SolarChatBot() {
  async function handleSend(
    userMessage: string,
    history: ChatHistoryMessage[]
  ): Promise<ChatBotReply> {
    // Step 0: trivial input never reaches the FAQ matcher or the AI — just
    // a friendly nudge, no API call.
    if (isTrivialInput(userMessage)) {
      await delay(200);
      return {
        text: 'Try asking me something like "how much does this cost" or "do you cover the UK" — happy to help!',
      };
    }

    // Step 1: try the free FAQ matcher first.
    await delay(200);
    const faqReply = getFaqResponse(userMessage, history);

    if (faqReply.matched) {
      // Real topic match — answer instantly, no Groq call made.
      return { text: faqReply.text, suggestQuote: faqReply.suggestQuote };
    }

    // Step 2: FAQ matcher fell through to its fallback — escalate to the
    // AI endpoint for a real answer.
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user", content: userMessage }],
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || typeof data.reply !== "string") {
        return { text: "Something went wrong — try again, or use the contact form." };
      }

      return { text: data.reply, suggestQuote: Boolean(data.suggestQuote) };
    } catch {
      return { text: "Something went wrong — try again, or use the contact form." };
    }
  }

  return (
    <ChatWidget
      botName="Sol"
      greeting="Hi! I'm Sol, here 24/7 — ask me about pricing, leads, regions we cover, or how it works."
      onSend={handleSend}
    />
  );
}
