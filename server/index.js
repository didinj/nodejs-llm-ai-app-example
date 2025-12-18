import express from "express";
import dotenv from "dotenv";
import { sendPrompt } from "./llm.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const conversations = new Map();

app.use(express.json());
app.use(cors());

app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res
        .status(400)
        .json({ error: "Message and sessionId are required" });
    }

    // Initialize conversation if not exists
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, [
        { role: "system", content: "You are a helpful AI assistant." }
      ]);
    }

    const history = conversations.get(sessionId);

    // Add user message
    history.push({ role: "user", content: message });

    // Send full history to LLM
    const reply = await sendPrompt(history);

    // Add AI reply to history
    history.push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "LLM request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
