"use client";

import { useState, useRef, useEffect } from "react";
import type { Lesson } from "@/lib/lessons";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatUI({ lesson }: { lesson: Lesson }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm your FluentPal tutor. Let's practice the **${lesson.title}** scenario. Ready to begin?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          messages: newMessages,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to get response");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantText,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/lessons"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition"
            >
              ← Back
            </Link>
            <span className="text-neutral-300">|</span>
            <span className="text-2xl">{lesson.emoji}</span>
            <span className="font-semibold">{lesson.title}</span>
          </div>
          <span className="hidden sm:block text-xs text-neutral-400 bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
            AI tutor active
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-6 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-neutral-900 text-white"
                    : "bg-white border border-neutral-200 text-neutral-900 shadow-sm"
                }`}
              >
                {msg.content || (
                  <span className="inline-flex gap-1 items-center text-neutral-400">
                    <span className="animate-bounce">·</span>
                    <span className="animate-bounce [animation-delay:150ms]">·</span>
                    <span className="animate-bounce [animation-delay:300ms]">·</span>
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-neutral-200 bg-white">
        <form
          onSubmit={sendMessage}
          className="mx-auto flex max-w-2xl items-center gap-3 px-6 py-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message…"
            disabled={loading}
            className="flex-1 rounded-full border border-neutral-300 px-5 py-3 text-base placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
