
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigin =
  process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "20kb" }));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are the friendly AI assistant for Vibe's World,
a portfolio about a young boy who dreams of becoming
a software engineer.

Answer questions about the portfolio, its projects,
the character's journey, and beginner programming topics.
Be friendly, clear, and helpful. Use simple explanations.
Do not claim features or projects exist unless you know
they are part of the portfolio.
`;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI server is running" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please provide a message.",
      });
    }

    const safeMessages = messages
      .filter(
        (message) =>
          message &&
          ["user", "assistant"].includes(message.role) &&
          typeof message.content === "string"
      )
      .slice(-12)
      .map((message) => ({
        role: message.role,
        content: message.content.slice(0, 4000),
      }));

    if (safeMessages.length === 0) {
      return res.status(400).json({
        error: "No valid messages were provided.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...safeMessages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    res.json({
      reply:
        completion.choices[0]?.message?.content ||
        "Sorry, I couldn't generate a response.",
    });
  } catch (error) {
    console.error("Groq API error:", error.message);

    res.status(500).json({
      error: "The AI assistant could not respond. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI server running at http://localhost:${PORT}`);
});
