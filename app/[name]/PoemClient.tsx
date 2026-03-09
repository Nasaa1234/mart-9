"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

interface Props {
  name: string;
  poem: string;
  secretMessage: string;
}

const PETAL_EMOJIS = ["🌸", "🌷", "💮", "🌺", "✿", "🏵️", "💐"];

function generatePetals(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: PETAL_EMOJIS[i % PETAL_EMOJIS.length],
    left: `${(i * 17 + 5) % 100}%`,
    delay: `${(i * 1.3) % 14}s`,
    duration: `${7 + (i * 1.1) % 9}s`,
    size: `${1 + (i % 5) * 0.35}rem`,
  }));
}

const GARDEN_FLOWERS = [
  { emoji: "🌹", left: "3%", delay: "0s", size: "1.8rem" },
  { emoji: "🌷", left: "12%", delay: "0.3s", size: "1.5rem" },
  { emoji: "🌸", left: "22%", delay: "0.6s", size: "1.6rem" },
  { emoji: "💐", left: "30%", delay: "0.2s", size: "1.9rem" },
  { emoji: "🌺", left: "40%", delay: "0.8s", size: "1.4rem" },
  { emoji: "🌻", left: "50%", delay: "0.4s", size: "1.7rem" },
  { emoji: "🌹", left: "58%", delay: "0.1s", size: "1.5rem" },
  { emoji: "🌷", left: "67%", delay: "0.7s", size: "1.8rem" },
  { emoji: "🌸", left: "76%", delay: "0.5s", size: "1.3rem" },
  { emoji: "🌺", left: "85%", delay: "0.9s", size: "1.6rem" },
  { emoji: "🌹", left: "94%", delay: "0.2s", size: "1.5rem" },
];

const CORNER_FLOWERS = [
  { emoji: "🌹", className: "corner-flower corner-tl-1" },
  { emoji: "🌸", className: "corner-flower corner-tl-2" },
  { emoji: "🌷", className: "corner-flower corner-tl-3" },
  { emoji: "🌺", className: "corner-flower corner-tr-1" },
  { emoji: "🌸", className: "corner-flower corner-tr-2" },
  { emoji: "💮", className: "corner-flower corner-tr-3" },
  { emoji: "🌷", className: "corner-flower corner-bl-1" },
  { emoji: "🌹", className: "corner-flower corner-bl-2" },
  { emoji: "🌸", className: "corner-flower corner-bl-3" },
  { emoji: "🌸", className: "corner-flower corner-br-1" },
  { emoji: "🌺", className: "corner-flower corner-br-2" },
  { emoji: "🌷", className: "corner-flower corner-br-3" },
];

const LOADING_FLOWERS = [
  { emoji: "🌸", left: "8%", top: "15%", delay: "0s" },
  { emoji: "🌷", left: "85%", top: "20%", delay: "1.2s" },
  { emoji: "🌹", left: "15%", top: "75%", delay: "0.8s" },
  { emoji: "🌺", left: "90%", top: "80%", delay: "0.4s" },
  { emoji: "💮", left: "50%", top: "8%", delay: "1.6s" },
  { emoji: "🌸", left: "5%", top: "45%", delay: "2s" },
  { emoji: "🌷", left: "92%", top: "50%", delay: "0.6s" },
  { emoji: "🌹", left: "45%", top: "90%", delay: "1.4s" },
];

interface DeviceMotionEvt extends DeviceMotionEvent {
  requestPermission?: never;
}

export default function PoemClient({ name, poem, secretMessage }: Props) {
  const [phase, setPhase] = useState<"loading" | "envelope" | "poem">("loading");
  const [loadingStep, setLoadingStep] = useState(0);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [secretText, setSecretText] = useState("");
  const [secretTypingDone, setSecretTypingDone] = useState(false);
  const [, setShakePermission] = useState<"granted" | "denied" | "unknown">("unknown");
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastShakeRef = useRef(0);

  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  const petals = useMemo(() => generatePetals(25), []);

  const loadingMessages = useMemo(
    () => [
      `${displayName}-д зориулсан шүлэг ачаалж байна...`,
      "Одны тоос цуглуулж байна...",
      "Үгсийг зохиож байна...",
      "Бараг бэлэн боллоо...",
    ],
    [displayName]
  );

  // Loading phase
  useEffect(() => {
    if (phase !== "loading") return;
    const timers = loadingMessages.map((_, i) =>
      setTimeout(() => setLoadingStep(i + 1), (i + 1) * 1200)
    );
    const endTimer = setTimeout(
      () => setPhase("envelope"),
      loadingMessages.length * 1200 + 1000
    );
    return () => { timers.forEach(clearTimeout); clearTimeout(endTimer); };
  }, [phase, loadingMessages]);

  // Typewriter
  useEffect(() => {
    if (phase !== "poem") return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i <= poem.length) {
        setDisplayedText(poem.slice(0, i));
      } else {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [phase, poem]);

  // Secret message typewriter
  useEffect(() => {
    if (!secretRevealed) return;
    let i = 0;
    setSecretText("");
    setSecretTypingDone(false);
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        if (i <= secretMessage.length) {
          setSecretText(secretMessage.slice(0, i));
        } else {
          clearInterval(interval);
          setSecretTypingDone(true);
        }
      }, 60);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(delay);
  }, [secretRevealed, secretMessage]);

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  // Shake detection
  useEffect(() => {
    if (phase !== "poem" || secretRevealed) return;

    const THRESHOLD = 25;
    const COOLDOWN = 2000;

    const handleMotion = (e: DeviceMotionEvt) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
      const now = Date.now();

      if (force > THRESHOLD && now - lastShakeRef.current > COOLDOWN) {
        lastShakeRef.current = now;
        setSecretRevealed(true);
      }
    };

    const requestPermission = async () => {
      const DM = DeviceMotionEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DM.requestPermission === "function") {
        try {
          const perm = await DM.requestPermission();
          setShakePermission(perm === "granted" ? "granted" : "denied");
          if (perm === "granted") {
            window.addEventListener("devicemotion", handleMotion as EventListener);
          }
        } catch {
          setShakePermission("denied");
        }
      } else {
        setShakePermission("granted");
        window.addEventListener("devicemotion", handleMotion as EventListener);
      }
    };

    requestPermission();
    return () => window.removeEventListener("devicemotion", handleMotion as EventListener);
  }, [phase, secretRevealed]);

  // Desktop fallback: press S key
  useEffect(() => {
    if (phase !== "poem" || secretRevealed) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") setSecretRevealed(true);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, secretRevealed]);

  const handleEnvelopeClick = useCallback(() => {
    if (envelopeOpen) return;
    setEnvelopeOpen(true);
    const audio = audioRef.current;
    if (audio) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    setTimeout(() => setPhase("poem"), 1500);
  }, [envelopeOpen]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  }, [duration]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const revealSecret = useCallback(() => {
    setSecretRevealed(true);
  }, []);

  return (
    <div className="poem-page">
      <audio ref={audioRef} src="/music.mp3" preload="auto" loop />

      {/* Falling petals */}
      {phase !== "loading" && (
        <div className="petals-container">
          {petals.map((p) => (
            <div
              key={p.id}
              className="petal"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                fontSize: p.size,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      )}

      {/* ══════ LOADING ══════ */}
      {phase === "loading" && (
        <div className="loading-screen">
          <div className="stars-container">
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  left: `${(i * 19 + 3) % 100}%`,
                  top: `${(i * 23 + 7) % 100}%`,
                  animationDelay: `${(i * 0.3) % 3}s`,
                  width: `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                }}
              />
            ))}
          </div>
          {LOADING_FLOWERS.map((f, i) => (
            <div
              key={i}
              className="loading-flower"
              style={{ left: f.left, top: f.top, animationDelay: f.delay }}
            >
              {f.emoji}
            </div>
          ))}
          <div className="loading-messages">
            {loadingMessages.map((msg, i) => (
              <p
                key={i}
                className={`loading-msg ${loadingStep > i ? "visible" : ""}`}
              >
                {msg}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ══════ ENVELOPE ══════ */}
      {phase === "envelope" && (
        <div className="envelope-scene" onClick={handleEnvelopeClick}>
          {CORNER_FLOWERS.map((f, i) => (
            <div key={i} className={f.className}>{f.emoji}</div>
          ))}
          <div className="flower-garden">
            {GARDEN_FLOWERS.map((f, i) => (
              <div
                key={i}
                className="garden-flower"
                style={{ left: f.left, animationDelay: f.delay, fontSize: f.size }}
              >
                {f.emoji}
              </div>
            ))}
            <div className="garden-grass" />
          </div>
          <div className="envelope-wrapper">
            <div className={`envelope ${envelopeOpen ? "open" : ""}`}>
              <div className="envelope-back" />
              <div className="envelope-letter">
                <p className="envelope-name">{displayName}-д зориулав</p>
                <p className="envelope-heart-small">♡</p>
              </div>
              <div className="envelope-front" />
              <div className="envelope-flap">
                <div className="envelope-flap-face" />
              </div>
              <div className="envelope-seal">❤️</div>
            </div>
          </div>
          {!envelopeOpen && <p className="tap-hint">нээхийн тулд дарна уу</p>}
        </div>
      )}

      {/* ══════ POEM (scrollable) ══════ */}
      {phase === "poem" && (
        <>
          <div className="scroll-bg" />

          {CORNER_FLOWERS.map((f, i) => (
            <div key={i} className={f.className}>{f.emoji}</div>
          ))}

          <section className="poem-section">
            <div className="poem-card">
              <div className="poem-header">
                <span className="poem-flower-icon">🌸</span>
                <span className="poem-for">{displayName}-д зориулав</span>
                <span className="poem-flower-icon">🌸</span>
              </div>
              <div className="poem-divider" />
              <div className="poem-text">
                {displayedText}
                {!typingDone && <span className="poem-cursor">|</span>}
              </div>
              {typingDone && (
                <div className="poem-footer">
                  <span className="poem-end-heart">💝</span>
                </div>
              )}
            </div>

            {typingDone && !secretRevealed && (
              <button className="shake-hint" onClick={revealSecret}>
                <span className="shake-sparkle">✨</span>
                <span>утсаа сэгсэрвэл нууц гарна</span>
                <span className="shake-sparkle">✨</span>
              </button>
            )}

            {typingDone && (
              <div className="scroll-hint">
                <span>доош гүйлгэнэ үү</span>
                <span className="scroll-arrow">↓</span>
              </div>
            )}
          </section>

          <section className="music-section">
            <div className="music-card">
              <div className={`vinyl-container ${isPlaying ? "playing" : ""}`}>
                <div className="vinyl">
                  <div className="vinyl-label">🌸</div>
                </div>
              </div>
              <div className="music-info">
                <p className="music-title">Чамд зориулсан дуу</p>
                <p className="music-subtitle">сонсохын тулд дарна уу</p>
              </div>
              <button className="music-play-btn" onClick={toggleMusic}>
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.14v14l11-7-11-7z" />
                  </svg>
                )}
              </button>
              <div className="music-progress-wrap" onClick={handleSeek}>
                <div className="music-progress-bar">
                  <div
                    className="music-progress-fill"
                    style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
                  />
                </div>
                <div className="music-times">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="romantic-footer">
            <div className="footer-flowers">
              🌹 🌸 🌷 💐 🌺 🌻 🌹 🌸 🌷
            </div>
            <p className="footer-msg">хайраар бүтээв</p>
            <span className="footer-heart">♥</span>
          </section>

          <button
            className={`floating-music-btn ${isPlaying ? "playing" : ""}`}
            onClick={toggleMusic}
          >
            <span className="floating-music-icon">♪</span>
          </button>
        </>
      )}

      {/* ══════ SECRET OVERLAY ══════ */}
      {secretRevealed && (
        <div className="secret-overlay" onClick={() => setSecretRevealed(false)}>
          <div className="secret-stars">
            {Array.from({ length: 40 }, (_, i) => (
              <div
                key={i}
                className="secret-star"
                style={{
                  left: `${(i * 17 + 11) % 100}%`,
                  top: `${(i * 23 + 5) % 100}%`,
                  animationDelay: `${(i * 0.2) % 2}s`,
                  width: `${2 + (i % 4)}px`,
                  height: `${2 + (i % 4)}px`,
                }}
              />
            ))}
          </div>

          <div className="secret-glow" />

          <div className="secret-content" onClick={(e) => e.stopPropagation()}>
            <div className="secret-sparkles">
              {["✦", "✧", "⋆", "✦", "✧", "⋆", "✦", "✧"].map((s, i) => (
                <span
                  key={i}
                  className="secret-sparkle-item"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  {s}
                </span>
              ))}
            </div>

            <p className="secret-label">зөвхөн чамд зориулсан нууц</p>

            <div className="secret-divider" />

            <p className="secret-text">
              {secretText}
              {!secretTypingDone && <span className="secret-cursor">|</span>}
            </p>

            {secretTypingDone && (
              <div className="secret-heart-row">
                <span>🤍</span>
              </div>
            )}
          </div>

          <p className="secret-dismiss">хаахын тулд дурын газар дарна уу</p>
        </div>
      )}
    </div>
  );
}
