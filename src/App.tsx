import { useState, type ReactElement } from "react";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import LylaLogo from "./components/LylaLogo";
import type { ChatMessage as Message } from "./types";

function uid(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App(): ReactElement {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (content: string): Promise<void> => {
    const userMessage: Message = { id: uid(), role: "user", content };
    const assistantId = uid();
    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      if (!response.body) throw new Error("stream unavailable");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.startsWith("data: ")) continue;
          const payload = event.slice(6);
          if (payload === "[DONE]") continue;
          const parsed = JSON.parse(payload) as { content?: string; error?: string };
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.content) {
            setMessages((prev) =>
              prev.map((item) =>
                item.id === assistantId ? { ...item, content: item.content + parsed.content } : item,
              ),
            );
          }
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "unknown error";
      setMessages((prev) =>
        prev.map((item) =>
          item.id === assistantId ? { ...item, content: `Erreur: ${message}` } : item,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="appShell">
      <header className="topBar">
        <LylaLogo />
      </header>
      <section className="chatList">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </section>
      <footer className="bottomBar">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </footer>
    </main>
  );
}
