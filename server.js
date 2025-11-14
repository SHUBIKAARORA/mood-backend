import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

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

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model:"llama-3.1-8b-instant",
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
