// Prototype local. Aucune authentification, bind 127.0.0.1.
// Ne pas exposer sur Internet. Voir README section Securite et limites.

import express, { Request, Response } from "express";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { createServer as createViteServer } from "vite";
import { personaSystemPrompt } from "./src/persona";

const PORT = 3000;
const HOST = "127.0.0.1";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.7,
  });

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    const { messages } = req.body as { messages?: ChatMessage[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages must be a non-empty array" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const history: BaseMessage[] = [
        new SystemMessage(personaSystemPrompt),
        ...messages.map((m) =>
          m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content),
        ),
      ];

      const stream = await model.stream(history);
      for await (const chunk of stream) {
        const content = typeof chunk.content === "string" ? chunk.content : "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "unknown error";
      if (!res.headersSent) {
        res.status(500).json({ error: message });
      } else {
        res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
        res.end();
      }
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "unknown startup error";
  console.error(message);
  process.exit(1);
});
