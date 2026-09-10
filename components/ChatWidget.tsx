"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

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

function ChatBubbleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12c0-4.4 3.8-8 8.5-8s8.5 3.6 8.5 8-3.8 8-8.5 8c-1.1 0-2.1-.2-3-.5L4 21l1.6-4.2C4.6 15.5 4 13.8 4 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="12" r="1.1" fill="currentColor" />
      <circle cx="12.5" cy="12" r="1.1" fill="currentColor" />
      <circle cx="16.5" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
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
        className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-trust-500 text-white shadow-soft transition-transform hover:scale-105"
      >
        {isOpen ? <CloseIcon /> : <ChatBubbleIcon />}
        {!isOpen && (
          <span
            aria-hidden="true"
            className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-leaf-500"
          />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex h-[80vh] w-full flex-col rounded-t-2xl border border-navy/10 bg-white shadow-soft sm:inset-auto sm:bottom-[168px] sm:right-5 sm:h-[500px] sm:w-[360px] sm:rounded-xl2">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-navy/10 bg-surface-alt px-4 py-3 sm:rounded-t-xl2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-trust-500/10 text-trust-500">
                <ChatBubbleIcon size={18} />
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
              <div className="flex justify-start gap-2">
                <button
                  type="button"
                  onClick={openLeadForm}
                  className="rounded-full bg-trust-500 px-3.5 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
                >
                  Get a free audit
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
