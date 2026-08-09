import Head from "next/head";
import { useState } from "react";

const CONFETTI_COLORS = ["#c1443c", "#e3a34c", "#1d2b4f", "#3f8f3f"];

export default function Home() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("cards"); // "cards" | "quiz"
  const [flipped, setFlipped] = useState({});
  const [answers, setAnswers] = useState({});
  const [genRipples, setGenRipples] = useState([]);

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  function fireRipple(e, setter) {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now() + Math.random();
    setter((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => {
      setter((prev) => prev.filter((r) => r.id !== id));
    }, 650);
  }

  async function handleGenerate(e) {
    fireRipple(e, setGenRipples);
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

  const answeredCount = Object.keys(answers).length;
  const quizTotal = result ? result.quiz.length : 0;
  const quizScore =
    result && answeredCount === quizTotal
      ? result.quiz.reduce(
          (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
          0
        )
      : null;
  const isPerfect = quizScore !== null && quizScore === quizTotal && quizTotal > 0;

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
              {genRipples.map((r) => (
                <span
                  key={r.id}
                  className="ripple"
                  style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
                />
              ))}
            </button>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading && (
          <>
            <div className="loading-caption">Reading your notes and building cards</div>
            <div className="skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton-card"
                  style={{ animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>
          </>
        )}

        {result && (
          <>
            <div className="topic-tag">{result.topic}</div>

            <div className={`mode-toggle ${mode === "quiz" ? "quiz-active" : ""}`}>
              <span className="slider" />
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
                    style={{ animationDelay: `${i * 0.07}s` }}
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
                <div className="quiz-progress-track">
                  <div
                    className="quiz-progress-fill"
                    style={{
                      width: `${quizTotal ? (answeredCount / quizTotal) * 100 : 0}%`,
                    }}
                  />
                </div>

                {quizScore !== null && (
                  <div className="score-banner">
                    Score: {quizScore} / {quizTotal}
                    {isPerfect &&
                      Array.from({ length: 18 }).map((_, i) => (
                        <span
                          key={i}
                          className="confetti-piece"
                          style={{
                            left: `${Math.random() * 100}%`,
                            background:
                              CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                            animationDelay: `${Math.random() * 0.3}s`,
                          }}
                        />
                      ))}
                  </div>
                )}

                {result.quiz.map((q, qi) => {
                  const chosen = answers[qi];
                  return (
                    <div
                      className="quiz-card"
                      key={qi}
                      style={{ animationDelay: `${qi * 0.06}s` }}
                    >
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
