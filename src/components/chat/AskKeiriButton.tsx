"use client";

import { useChat } from "./chat-context";

/**
 * Opens the chat widget. Replaces the legacy global `openChat()` that every
 * page called via an inline `onclick`.
 */
export function AskKeiriButton({
  children = "Ask Keiri",
  className = "btn btn-ghost",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { open } = useChat();
  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  );
}
