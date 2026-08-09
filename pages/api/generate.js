export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { notes } = req.body || {};

  if (!notes || typeof notes !== "string" || notes.trim().length < 20) {
    return res.status(400).json({
      error: "Paste at least a few sentences of notes before generating.",
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error:
        "Server is missing OPENAI_API_KEY. Add it in your Vercel project's Environment Variables.",
    });
  }

  const systemPrompt = `You convert study notes into active-recall material.
Return ONLY valid JSON, no markdown fences, no commentary, matching exactly this shape:
{
  "topic": "short 2-5 word title for the notes",
  "flashcards": [ { "front": "question or term", "back": "concise answer" }, ... ],
  "quiz": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "one sentence why"
    }
  ]
}
Rules:
- Produce between 5 and 8 flashcards covering the most important facts, in the notes' own terminology.
- Produce exactly 5 multiple-choice quiz questions, each with 4 options and one correct index (0-3).
- Keep flashcard backs under 25 words. Keep quiz explanations under 20 words.
- Base everything strictly on the provided notes. Do not invent facts not implied by the notes.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: notes.slice(0, 8000) },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      return res.status(502).json({ error: "The AI service failed to respond. Try again." });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(502).json({ error: "Couldn't parse the AI response. Try again." });
    }

    if (!Array.isArray(parsed.flashcards) || !Array.isArray(parsed.quiz)) {
      return res.status(502).json({ error: "AI response was incomplete. Try again." });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong generating your study set." });
  }
}
