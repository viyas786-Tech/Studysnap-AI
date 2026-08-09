import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("cards"); // "cards" | "quiz"
  const [flipped, setFlipped] = useState({});
  const [answers, setAnswers] = useState({});

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  async function handleGenerate() {
    setError("");
    setResult(null);
    setFlipped({});
    setAnswers({});
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
        setMode("cards");
      }
    } catch (e) {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleFlip(i) {
    setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  function selectAnswer(qIndex, optIndex) {
    if (answers[qIndex] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }

  const quizScore =
    result && Object.keys(answers).length === result.quiz.length
      ? result.quiz.reduce(
          (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
          0
        )
      : null;

  return (
    <>
      <Head>
        <title>StudySnap AI — Notes to flashcards, instantly</title>
        <meta
          name="description"
          content="Paste your notes and get active-recall flashcards and a quiz in seconds."
        />
      </Head>

      <div className="wrap">
        <div className="eyebrow">Card 001 · Study Tool</div>
        <h1 className="display">StudySnap AI</h1>
        <p className="sub">
          Paste any notes, textbook paragraph, or lecture transcript. Get back a stack
          of flashcards and a 5-question quiz built for active recall — not just re-reading.
        </p>

        <div className="entry-card">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your notes here... e.g. 'Mitochondria are the powerhouse of the cell. They generate ATP through oxidative phosphorylation...'"
          />
          <div className="row">
            <span className="count">{wordCount} words</span>
            <button
              className="primary"
              onClick={handleGenerate}
              disabled={loading || notes.trim().length < 20}
            >
              {loading ? "Generating…" : "Generate study set"}
            </button>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {loading && <div className="loading-state">Reading your notes and building cards…</div>}

        {result && (
          <>
            <div className="topic-tag">{result.topic}</div>

            <div className="mode-toggle">
              <button
                className={mode === "cards" ? "active" : ""}
                onClick={() => setMode("cards")}
              >
                Flashcards
              </button>
              <button
                className={mode === "quiz" ? "active" : ""}
                onClick={() => setMode("quiz")}
              >
                Quiz
              </button>
            </div>

            {mode === "cards" && (
              <div className="card-grid">
                {result.flashcards.map((card, i) => (
                  <div
                    key={i}
                    className={`flip-card ${flipped[i] ? "flipped" : ""}`}
                    onClick={() => toggleFlip(i)}
                  >
                    <div className="flip-inner">
                      <div className="flip-face flip-front">
                        {card.front}
                        <span className="flip-hint">Tap to flip</span>
                      </div>
                      <div className="flip-face flip-back">{card.back}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mode === "quiz" && (
              <div>
                {quizScore !== null && (
                  <div className="score-banner">
                    Score: {quizScore} / {result.quiz.length}
                  </div>
                )}
                {result.quiz.map((q, qi) => {
                  const chosen = answers[qi];
                  return (
                    <div className="quiz-card" key={qi}>
                      <div className="quiz-q">
                        {qi + 1}. {q.question}
                      </div>
                      <div className="quiz-options">
                        {q.options.map((opt, oi) => {
                          let cls = "quiz-option";
                          if (chosen !== undefined) {
                            if (oi === q.correctIndex) cls += " correct";
                            else if (oi === chosen) cls += " incorrect";
                          }
                          return (
                            <button
                              key={oi}
                              className={cls}
                              onClick={() => selectAnswer(qi, oi)}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {chosen !== undefined && (
                        <div className="quiz-explain">{q.explanation}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!result && !loading && (
          <div className="empty-state">
            Your flashcards and quiz will show up here once you generate a study set.
          </div>
        )}

        <footer className="foot">Built for HackDevengers 1.0 · StudySnap AI</footer>
      </div>
    </>
  );
}
