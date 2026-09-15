"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { whatsappLink } from "@/lib/site-config";

export type ChatBotReply = {
  text: string;
  /** When true, the widget shows "Get a free audit" / "Not now" buttons after this reply. */
  suggestQuote?: boolean;
};

export type ChatHistoryMessage = { role: "user" | "assistant"; content: string };

type UIMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
};

type LeadStatus = "idle" | "submitting" | "success" | "error";

export type ChatWidgetProps = {
  botName: string;
  greeting: string;
  placeholder?: string;
  onSend: (
    userMessage: string,
    history: ChatHistoryMessage[]
  ) => Promise<ChatBotReply> | ChatBotReply;
};

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `msg-${idCounter}-${Date.now()}`;
}

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12l16-7-6 16-2.5-6.5L4 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WhatsAppIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.94 9.94 0 0 0 4.84 1.23h.01c5.5 0 9.96-4.46 9.96-9.96C22 6.46 17.55 2 12.04 2zm5.83 14.24c-.25.7-1.45 1.33-2 1.42-.53.08-1.13.12-3.14-.66-2.64-1.03-4.36-3.7-4.5-3.87-.13-.18-1.08-1.44-1.08-2.75 0-1.3.68-1.94.93-2.2.24-.26.53-.32.7-.32h.51c.16 0 .38-.03.58.44.25.6.83 2.06.9 2.2.07.14.12.31.02.5-.1.19-.15.31-.3.48-.15.16-.31.36-.44.49-.15.15-.3.31-.13.6.16.3.72 1.19 1.55 1.93 1.06.94 1.96 1.24 2.26 1.38.3.14.47.12.65-.07.18-.19.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.71.81 2 .96.3.14.49.22.56.34.08.13.08.72-.17 1.42z" />
    </svg>
  );
}

function SpinnerIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function ChatWidget({
  botName,
  greeting,
  placeholder = "Type a message...",
  onSend,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [promptMessageId, setPromptMessageId] = useState<string | null>(null);

  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadError, setLeadError] = useState("");

  const listRef = useRef<HTMLDivElement>(null);

  // Show the greeting the first time the panel is opened.
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: nextId(), role: "bot", text: greeting }]);
    }
  }, [isOpen, messages.length, greeting]);

  // Keep the panel scrolled to the latest message.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, leadFormOpen, isSending]);

  function historyFor(list: UIMessage[]): ChatHistoryMessage[] {
    return list.map((m) => ({
      role: m.role === "bot" ? "assistant" : "user",
      content: m.text,
    }));
  }

  async function handleSend(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const historySoFar = historyFor(messages);
    const userMsg: UIMessage = { id: nextId(), role: "user", text };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPromptMessageId(null);
    setLeadFormOpen(false);
    setIsSending(true);

    try {
      const reply = await onSend(text, historySoFar);
      const botMsg: UIMessage = { id: nextId(), role: "bot", text: reply.text };
      setMessages((prev) => [...prev, botMsg]);
      setPromptMessageId(reply.suggestQuote ? botMsg.id : null);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "bot",
          text: "Something went wrong — try again, or use the contact form.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function openWhatsApp() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const context = lastUser
      ? `Hi, I was chatting with Sol on your site about: "${lastUser.text}" — can we continue here?`
      : undefined;
    window.open(whatsappLink(context), "_blank", "noopener,noreferrer");
  }

  function openLeadForm() {
    setLeadFormOpen(true);
    setLeadError("");
    setLeadStatus("idle");
    if (!leadMessage) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (lastUser) setLeadMessage(lastUser.text);
    }
  }

  function dismissPrompt() {
    setPromptMessageId(null);
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "bot", text: "No problem — ask away anytime." },
    ]);
  }

  async function submitLead(e: FormEvent) {
    e.preventDefault();

    if (!leadName.trim() || !leadEmail.trim() || !leadCompany.trim() || !leadMessage.trim()) {
      setLeadError("Please fill in all fields.");
      return;
    }

    setLeadStatus("submitting");
    setLeadError("");

    try {
      const res = await fetch("/api/chatbot-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName.trim(),
          email: leadEmail.trim(),
          company: leadCompany.trim(),
          message: leadMessage.trim(),
          source: "chat_bot",
        }),
      });

      const data = await res.json().catch(() => ({ success: false }));

      if (!res.ok || !data.success) {
        setLeadStatus("error");
        setLeadError(data.error || "Something went wrong — please try again.");
        return;
      }

      setLeadStatus("success");
      setLeadFormOpen(false);
      setPromptMessageId(null);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "bot",
          text: "Thanks — that's been sent. We'll follow up with your free lead audit within 1–2 business days.",
        },
      ]);
      setLeadName("");
      setLeadEmail("");
      setLeadCompany("");
      setLeadMessage("");
    } catch {
      setLeadStatus("error");
      setLeadError("Network error — please try again.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center sm:bottom-6 sm:right-6"
      >
        {isOpen ? (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-trust-500 text-white shadow-soft transition-transform hover:scale-105">
            <CloseIcon />
          </span>
        ) : (
          <>
            {/* Soft ellipse "ground shadow" beneath the icon — shrinks and
                fades as the icon rises, sold together with the bob above
                it as one hovering object. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-1/2 h-2.5 w-10 animate-shadowPulse rounded-full bg-navy/50 blur-[3px]"
            />
            <span className="relative block h-14 w-14 animate-floatSlow overflow-hidden rounded-full shadow-[0_10px_18px_-4px_rgba(11,37,69,0.4)] transition-transform hover:scale-105">
              <Image
                src="/chatbot-icon.jpg"
                alt="Chat with Sol"
                fill
                sizes="56px"
                className="object-cover"
              />
              {/* Diagonal gloss highlight for a glossy, floating read
                  rather than a flat sticker look. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/25 to-white/0"
              />
            </span>
            <span
              aria-hidden="true"
              className="absolute right-1 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-leaf-500"
            />
          </>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex h-[80vh] w-full flex-col rounded-t-2xl border border-navy/10 bg-white shadow-soft sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[500px] sm:w-[360px] sm:rounded-xl2">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-navy/10 bg-surface-alt px-4 py-3 sm:rounded-t-xl2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-trust-500/10">
                <Image src="/chatbot-icon.jpg" alt="Sol" fill sizes="36px" className="object-cover" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-navy">{botName}</p>
                <p className="text-xs text-ink-400">AI-powered</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-white hover:text-navy"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] whitespace-pre-line rounded-xl2 px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-trust-500 text-white" : "bg-surface-alt text-navy"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-xl2 bg-surface-alt px-3.5 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300 [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300 [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300" />
                </div>
              </div>
            )}

            {promptMessageId && !leadFormOpen && (
              <div className="flex flex-wrap justify-start gap-2">
                <button
                  type="button"
                  onClick={openLeadForm}
                  className="rounded-full bg-trust-500 px-3.5 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
                >
                  Get a quote
                </button>
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="inline-flex items-center gap-1.5 rounded-full bg-leaf-500 px-3.5 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
                >
                  <WhatsAppIcon />
                  WhatsApp us
                </button>
                <button
                  type="button"
                  onClick={dismissPrompt}
                  className="rounded-full border border-navy/15 px-3.5 py-2 text-xs font-medium text-navy transition-colors hover:border-trust-500/60"
                >
                  Not now
                </button>
              </div>
            )}

            {leadFormOpen && (
              <form
                onSubmit={submitLead}
                className="space-y-2 rounded-xl2 border border-navy/10 bg-surface-alt p-3"
              >
                <input
                  type="text"
                  placeholder="Your name"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-trust-500"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-trust-500"
                />
                <input
                  type="text"
                  placeholder="Company name"
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-trust-500"
                />
                <textarea
                  placeholder="What does your business need?"
                  rows={2}
                  value={leadMessage}
                  onChange={(e) => setLeadMessage(e.target.value)}
                  className="w-full resize-none rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-trust-500"
                />
                {leadError && <p className="text-xs text-red-600">{leadError}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={leadStatus === "submitting"}
                    className="inline-flex items-center gap-1.5 rounded-full bg-trust-500 px-3.5 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {leadStatus === "submitting" && <SpinnerIcon />}
                    {leadStatus === "submitting" ? "Sending..." : "Send"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadFormOpen(false)}
                    className="rounded-full border border-navy/15 px-3.5 py-2 text-xs font-medium text-navy"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-navy/10 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              maxLength={1000}
              className="flex-1 rounded-full border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy outline-none transition-colors focus:border-trust-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-trust-500 text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
