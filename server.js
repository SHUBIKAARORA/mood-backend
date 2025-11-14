import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://mood-journal-frontend-url.vercel.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// POST /suggest → AI activity suggestions
app.post("/suggest", async (req, res) => {
  try {
    const { mood } = req.body;

    const client = new OpenAI({
     apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
});

    const completion = await client.chat.completions.create({
      model:"deepseek-chat",
      messages: [
        {
          role: "system",
          content: "Give 3 helpful, simple activity suggestions based on mood.",
        },
        {
          role: "user",
          content: `Suggest 3 activities for someone feeling: ${mood}`,
        },
      ],
    });

    res.json({
      suggestions: completion.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PORT for local development
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
