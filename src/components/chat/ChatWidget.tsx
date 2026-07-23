"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChatIcon, SendIcon } from "@/components/icons";
import { FAQS, GREETING } from "@/server/chat/knowledge";

import { useChat } from "./chat-context";

/**
 * The Keiri chat widget.
 *
 * Visually and behaviourally the legacy widget (KEIRITECH-INVENTORY.md §5),
 * with the scripted brain replaced by the streaming `/api/chat` endpoint. The
 * legacy timings are preserved deliberately — they are what make it feel like
 * a person typing rather than a form:
 *
 *   • 600–1000 ms randomised delay before a reply begins
 *   • the four FAQ chips appear 1.2 s after the greeting
 *   • the input autofocuses 300 ms after opening
 *   • the unread badge clears on first open
 *
 * The transcript is held here and posted back in full each turn; the endpoint
 * is stateless.
 */

interface Message {
  readonly role: "user" | "assistant";
  readonly content: string;
}

const TYPING_MIN_MS = 600;
const TYPING_JITTER_MS = 400;
const CHIPS_DELAY_MS = 1200;
const FOCUS_DELAY_MS = 300;

export function ChatWidget() {
  const { isOpen, toggle, close } = useChat();

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const startedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Greeting on first open, then chips 1.2s later — as the legacy widget did.
  useEffect(() => {
    if (!isOpen) return;

    // `started` is a ref, not state: it gates this effect but is never
    // rendered, and setting it as state here would be a synchronous setState
    // inside an effect (cascading render). The badge clear is deferred a frame
    // for the same reason.
    const badgeFrame = requestAnimationFrame(() => setHasUnread(false));

    const focusTimer = window.setTimeout(
      () => inputRef.current?.focus(),
      FOCUS_DELAY_MS,
    );

    if (startedRef.current) {
      return () => {
        cancelAnimationFrame(badgeFrame);
        window.clearTimeout(focusTimer);
      };
    }
    startedRef.current = true;

    const typingDelay =
      TYPING_MIN_MS + Math.floor(Math.random() * TYPING_JITTER_MS);
    setIsTyping(true);

    const greetTimer = window.setTimeout(() => {
      setIsTyping(false);
      setMessages([{ role: "assistant", content: GREETING }]);
    }, typingDelay);

    const chipsTimer = window.setTimeout(
      () => setShowChips(true),
      typingDelay + CHIPS_DELAY_MS,
    );

    return () => {
      cancelAnimationFrame(badgeFrame);
      window.clearTimeout(focusTimer);
      window.clearTimeout(greetTimer);
      window.clearTimeout(chipsTimer);
    };
  }, [isOpen]);

  // Keep the transcript pinned to the newest message.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [messages, isTyping]);

  // Escape closes, matching the mobile menu.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setShowChips(false);
      setDraft("");

      const history: Message[] = [
        ...messages.filter((m) => m.content !== GREETING),
        { role: "user", content: trimmed },
      ];
      setMessages((current) => [
        ...current,
        { role: "user", content: trimmed },
      ]);
      setIsTyping(true);

      // The legacy pause before the reply. Worth keeping: without it a
      // streamed reply starts mid-keystroke and reads as a machine.
      await new Promise((resolve) =>
        window.setTimeout(
          resolve,
          TYPING_MIN_MS + Math.floor(Math.random() * TYPING_JITTER_MS),
        ),
      );

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!response.ok || !response.body) {
          const body = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          setIsTyping(false);
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content:
                body.error ??
                "Sorry — I couldn't reach my brain just then. Please email business@keiritech.com.",
            },
          ]);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let started = false;

        // Read SSE frames: `data: {...}\n\n`, terminated by `data: [DONE]`.
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            const line = frame.trim();
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") continue;

            let parsed: { type: string; text?: string; message?: string };
            try {
              parsed = JSON.parse(payload);
            } catch {
              // A partial frame we can't use. Skip it rather than crashing
              // the whole reply.
              continue;
            }

            if (parsed.type === "lead_captured") {
              setLeadCaptured(true);
              continue;
            }

            const chunk = parsed.text ?? parsed.message ?? "";
            if (!chunk) continue;

            if (!started) {
              started = true;
              setIsTyping(false);
              setMessages((current) => [
                ...current,
                { role: "assistant", content: chunk },
              ]);
            } else {
              setMessages((current) => {
                const next = [...current];
                const last = next[next.length - 1];
                if (last?.role === "assistant") {
                  next[next.length - 1] = {
                    role: "assistant",
                    content: last.content + chunk,
                  };
                }
                return next;
              });
            }
          }
        }

        setIsTyping(false);
      } catch {
        setIsTyping(false);
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content:
              "Sorry — the connection dropped. Please try again, or email business@keiritech.com.",
          },
        ]);
      }
    },
    [messages, isTyping],
  );

  return (
    <>
      <button
        type="button"
        className="chat-fab"
        onClick={toggle}
        aria-label="Chat with Keiri"
        aria-expanded={isOpen}
      >
        <ChatIcon />
        {hasUnread && <span className="fab-badge">1</span>}
      </button>

      <div
        className={isOpen ? "chat-win open" : "chat-win"}
        role="dialog"
        aria-label="Chat with Keiri"
        aria-hidden={!isOpen}
      >
        <div className="chat-head">
          <Image
            src="/keiri.png"
            alt="Keiri"
            width={40}
            height={40}
            unoptimized
          />
          <div>
            <div className="ch-name">Keiri</div>
            <div className="ch-status">Online · automation assistant</div>
          </div>
          <button
            type="button"
            className="chat-close"
            onClick={close}
            aria-label="Close chat"
          >
            &times;
          </button>
        </div>

        <div className="chat-body" ref={bodyRef} role="log" aria-live="polite">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={message.role === "user" ? "msg user" : "msg bot"}
            >
              {message.content}
            </div>
          ))}

          {isTyping && (
            <div className="typing" aria-label="Keiri is typing">
              <span />
              <span />
              <span />
            </div>
          )}

          {leadCaptured && (
            <div className="msg bot" style={{ borderColor: "var(--gold)" }}>
              ✓ Your details are with the team — they&apos;ll be in touch.
            </div>
          )}
        </div>

        {showChips && (
          <div className="chips">
            {FAQS.slice(0, 4).map((faq) => (
              <button
                key={faq.q}
                type="button"
                className="chip"
                onClick={() => void send(faq.q)}
              >
                {faq.q}
              </button>
            ))}
          </div>
        )}

        <form
          className="chat-input"
          onSubmit={(event) => {
            event.preventDefault();
            void send(draft);
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about automating your finance work…"
            aria-label="Message"
            maxLength={2000}
          />
          <button type="submit" aria-label="Send">
            <SendIcon />
          </button>
        </form>
      </div>
    </>
  );
}
