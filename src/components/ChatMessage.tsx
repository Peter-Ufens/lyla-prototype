import type { ReactElement } from "react";
import type { ChatMessage as Message } from "../types";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props): ReactElement {
  const isUser = message.role === "user";
  return (
    <article className={`bubble ${isUser ? "bubbleUser" : "bubbleAssistant"}`}>
      <p className="bubbleRole">{isUser ? "Vous" : "Lyla"}</p>
      <p className="bubbleContent">{message.content}</p>
    </article>
  );
}
