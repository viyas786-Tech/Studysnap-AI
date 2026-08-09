import { useRef, useState } from "react";

export default function Hero() {
  const graphicRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e) {
    const rect = graphicRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 14 });
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 });
  }

  function scrollToApp() {
    document.getElementById("app")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="grid-dots" />
        <div className="glow glow-a" />
        <div className="glow glow-b" />
      </div>

      <nav className="hero-nav">
        <div className="brand">
          <span className="brand-mark">◆</span> StudySnap AI
        </div>
        <div className="nav-links">
          <a href="#app">Try it</a>
          <a href="#how">How it works</a>
          <a
            href="https://github.com/viyas786-Tech/Studysnap-AI"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
        <button className="nav-cta" onClick={scrollToApp}>
          Launch App <span className="arrow">→</span>
        </button>
      </nav>

      <div className="hero-content">
        <div className="hero-left">
          <div className="badge-ring">
            <span>AI · 2026</span>
          </div>
          <h1 className="hero-title">
            Notes In.
            <br />
            <span className="glow-text">Active Recall</span> Out.
          </h1>
          <p className="hero-sub">
            Paste any notes and StudySnap AI instantly builds flip flashcards
            and a scored quiz — so you practice remembering, not just re-reading.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={scrollToApp}>
              Try it now <span className="arrow">→</span>
            </button>
            <a
              className="btn-ghost"
              href="https://github.com/viyas786-Tech/Studysnap-AI"
              target="_blank"
              rel="noreferrer"
            >
              View source
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <strong>8s</strong>
              <span>avg. generation time</span>
            </div>
            <div>
              <strong>5–8</strong>
              <span>cards per note set</span>
            </div>
            <div>
              <strong>$0</strong>
              <span>to run, free-tier AI</span>
            </div>
          </div>
        </div>

        <div
          className="hero-right"
          ref={graphicRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
        >
          <div
            className="orbit-scene"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          >
            <svg className="orbit-rings" viewBox="0 0 400 400">
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c5cff" />
                  <stop offset="100%" stopColor="#33d9ff" />
                </linearGradient>
              </defs>
              <circle
                cx="200"
                cy="200"
                r="160"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="1"
                strokeDasharray="4 10"
                opacity="0.6"
              />
              <circle
                cx="200"
                cy="200"
                r="120"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="1.5"
                opacity="0.35"
              />
              <circle
                cx="200"
                cy="200"
                r="80"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="1"
                strokeDasharray="2 6"
                opacity="0.5"
              />
            </svg>

            <div className="orbit-dot dot-1" />
            <div className="orbit-dot dot-2" />
            <div className="orbit-dot dot-3" />

            <div className="core-icon">
              <svg viewBox="0 0 64 64" width="46" height="46">
                <rect
                  x="10"
                  y="14"
                  width="44"
                  height="36"
                  rx="4"
                  fill="none"
                  stroke="#eaf0ff"
                  strokeWidth="2"
                />
                <line x1="18" y1="26" x2="46" y2="26" stroke="#33d9ff" strokeWidth="2" />
                <line x1="18" y1="34" x2="38" y2="34" stroke="#7c5cff" strokeWidth="2" />
                <line x1="18" y1="42" x2="42" y2="42" stroke="#eaf0ff" strokeWidth="1.5" opacity="0.6" />
              </svg>
            </div>

            <div className="float-card card-top">
              <div className="fc-icon">✓</div>
              <div className="fc-lines">
                <span />
                <span style={{ width: "70%" }} />
              </div>
            </div>

            <div className="float-card card-bottom">
              <div className="fc-quiz">
                <span className="fc-dot" />
                Quiz 4/5
              </div>
              <div className="fc-lines">
                <span style={{ width: "85%" }} />
              </div>
            </div>
          </div>

          <div className="scroll-hint">
            <span className="scroll-text">SCROLL DOWN</span>
            <span className="scroll-dot" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          background: #0a0b14;
          color: #eaf0ff;
          overflow: hidden;
          padding-bottom: 60px;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .grid-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            rgba(234, 240, 255, 0.08) 1px,
            transparent 1px
          );
          background-size: 26px 26px;
          mask-image: radial-gradient(ellipse at 30% 20%, black 40%, transparent 80%);
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.35;
        }

        .glow-a {
          width: 420px;
          height: 420px;
          background: #7c5cff;
          top: -120px;
          right: -80px;
        }

        .glow-b {
          width: 320px;
          height: 320px;
          background: #33d9ff;
          bottom: -100px;
          left: 10%;
          opacity: 0.18;
        }

        .hero-nav {
          position: relative;
          z-index: 2;
          max-width: 1180px;
          margin: 0 auto;
          padding: 26px 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .brand {
          font-weight: 700;
          font-size: 17px;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-mark {
          color: #7c5cff;
        }

        .nav-links {
          display: flex;
          gap: 26px;
          font-size: 14px;
        }

        .nav-links a {
          color: #b9c2de;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .nav-links a:hover {
          color: #eaf0ff;
        }

        .nav-cta {
          font-size: 13px;
          font-weight: 600;
          background: linear-gradient(135deg, #7c5cff, #5a3ce0);
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 999px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -8px rgba(124, 92, 255, 0.6);
        }

        .nav-cta .arrow {
          transition: transform 0.18s ease;
        }

        .nav-cta:hover .arrow {
          transform: translateX(3px);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1180px;
          margin: 0 auto;
          padding: 60px 24px 0;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 40px;
          align-items: center;
        }

        .badge-ring {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(124, 92, 255, 0.5);
          color: #b9a9ff;
          font-size: 11px;
          letter-spacing: 0.12em;
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 22px;
          animation: floatY 4s ease-in-out infinite;
        }

        .hero-title {
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1.08;
          font-weight: 800;
          margin: 0 0 20px;
          letter-spacing: -0.01em;
        }

        .glow-text {
          background: linear-gradient(120deg, #7c5cff, #33d9ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-sub {
          font-size: 16.5px;
          color: #aeb7d4;
          max-width: 46ch;
          line-height: 1.65;
          margin-bottom: 32px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 46px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #7c5cff, #5a3ce0);
          color: white;
          border: none;
          font-weight: 600;
          font-size: 14.5px;
          padding: 14px 26px;
          border-radius: 10px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px -10px rgba(124, 92, 255, 0.65);
        }

        .btn-primary:hover .arrow {
          transform: translateX(4px);
        }

        .btn-primary .arrow {
          transition: transform 0.18s ease;
        }

        .btn-ghost {
          color: #eaf0ff;
          border: 1px solid rgba(234, 240, 255, 0.25);
          background: transparent;
          font-size: 14.5px;
          font-weight: 500;
          padding: 14px 22px;
          border-radius: 10px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: border-color 0.18s ease, background 0.18s ease;
        }

        .btn-ghost:hover {
          border-color: rgba(234, 240, 255, 0.6);
          background: rgba(234, 240, 255, 0.05);
        }

        .hero-stats {
          display: flex;
          gap: 34px;
          flex-wrap: wrap;
        }

        .hero-stats div {
          display: flex;
          flex-direction: column;
        }

        .hero-stats strong {
          font-size: 22px;
          color: #eaf0ff;
        }

        .hero-stats span {
          font-size: 12px;
          color: #7c86a8;
          margin-top: 2px;
        }

        /* ---------- Right graphic ---------- */
        .hero-right {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 420px;
          perspective: 1000px;
        }

        .orbit-scene {
          position: relative;
          width: 380px;
          height: 380px;
          max-width: 90vw;
          transition: transform 0.15s ease-out;
          transform-style: preserve-3d;
        }

        .orbit-rings {
          width: 100%;
          height: 100%;
          animation: spin 26s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .core-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: rgba(124, 92, 255, 0.12);
          border: 1px solid rgba(124, 92, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 40px rgba(124, 92, 255, 0.35);
          animation: pulseCore 3.2s ease-in-out infinite;
        }

        @keyframes pulseCore {
          0%,
          100% {
            box-shadow: 0 0 30px rgba(124, 92, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 55px rgba(51, 217, 255, 0.45);
          }
        }

        .orbit-dot {
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #33d9ff;
          box-shadow: 0 0 10px #33d9ff;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
        }

        .dot-1 {
          animation: orbit1 8s linear infinite;
        }
        .dot-2 {
          animation: orbit2 12s linear infinite reverse;
          background: #7c5cff;
          box-shadow: 0 0 10px #7c5cff;
        }
        .dot-3 {
          animation: orbit3 16s linear infinite;
        }

        @keyframes orbit1 {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(160px);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(160px);
          }
        }
        @keyframes orbit2 {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(120px);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(120px);
          }
        }
        @keyframes orbit3 {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(80px);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(80px);
          }
        }

        .float-card {
          position: absolute;
          background: rgba(16, 18, 32, 0.85);
          border: 1px solid rgba(234, 240, 255, 0.14);
          border-radius: 12px;
          padding: 12px 14px;
          width: 150px;
          backdrop-filter: blur(6px);
          animation: floatY 5s ease-in-out infinite;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .float-card:hover {
          transform: translateY(-6px) scale(1.04);
          box-shadow: 0 16px 30px -12px rgba(124, 92, 255, 0.5);
        }

        .card-top {
          top: 6%;
          right: -4%;
          animation-delay: 0.3s;
        }

        .card-bottom {
          bottom: 8%;
          left: -6%;
          animation-delay: 1s;
        }

        @keyframes floatY {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .fc-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(63, 200, 130, 0.18);
          color: #6be3a1;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .fc-quiz {
          font-size: 11px;
          color: #b9c2de;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .fc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #33d9ff;
        }

        .fc-lines span {
          display: block;
          height: 5px;
          background: rgba(234, 240, 255, 0.14);
          border-radius: 3px;
          margin-top: 6px;
          width: 100%;
        }

        .scroll-hint {
          position: absolute;
          right: -18px;
          bottom: -10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .scroll-text {
          writing-mode: vertical-rl;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #6a7396;
        }

        .scroll-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #33d9ff;
          animation: bounceDot 1.6s ease-in-out infinite;
        }

        @keyframes bounceDot {
          0%,
          100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(10px);
            opacity: 0.4;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .badge-ring,
          .orbit-rings,
          .core-icon,
          .orbit-dot,
          .float-card,
          .scroll-dot {
            animation: none !important;
          }
        }

        @media (max-width: 900px) {
          .hero-content {
            grid-template-columns: 1fr;
            padding-top: 40px;
          }
          .hero-right {
            min-height: 340px;
            order: -1;
          }
          .orbit-scene {
            width: 300px;
            height: 300px;
          }
          .scroll-hint {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .hero-nav {
            padding-top: 20px;
          }
          .nav-links {
            display: none;
          }
          .hero-stats {
            gap: 22px;
          }
          .float-card {
            width: 120px;
            padding: 10px 12px;
          }
        }
      `}</style>
    </section>
  );
}
