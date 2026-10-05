"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { SHOWREEL_SRC } from "@/lib/showreel";

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ShowreelPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [duration, setDuration] = useState(0);

  const onMeta = useCallback(() => {
    const el = videoRef.current;
    if (el) setDuration(el.duration);
  }, []);

  const play = useCallback(async () => {
    const el = videoRef.current;
    if (!el) return;
    setStarted(true);
    try {
      await el.play();
    } catch {
      setFailed(true);
    }
  }, []);

  /* Escape plays / pauses once the viewer has engaged with the reel. */
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const el = videoRef.current;
      if (!el) return;
      if (el.paused) void el.play().catch(() => setFailed(true));
      else el.pause();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started]);

  return (
    <div className="showreel">
      <div className="showreel-frame">
        <video
          ref={videoRef}
          className="showreel-video"
          src={SHOWREEL_SRC}
          controls
          playsInline
          preload="metadata"
          onLoadedMetadata={onMeta}
          onError={() => setFailed(true)}
          onCanPlay={() => setFailed(false)}
        />

        {!started && (
          <button type="button" className="showreel-overlay" onClick={play}>
            <span className="showreel-play" aria-hidden>
              <svg viewBox="0 0 40 40" width="26" height="26">
                <path d="M14 10 L30 20 L14 30 Z" fill="currentColor" />
              </svg>
            </span>
            <span className="showreel-overlay-label">
              Play showreel — {clock(duration)}
            </span>
          </button>
        )}

        {failed && (
          <div className="showreel-error" role="alert">
            <span className="kicker">Signal lost · Codec fallback</span>
            <p>
              Your browser could not decode this QuickTime master. Open the file
              directly to watch it.
            </p>
            <a
              className="learn"
              href={SHOWREEL_SRC}
              target="_blank"
              rel="noreferrer"
            >
              Open master file ↗
            </a>
          </div>
        )}
      </div>

      <div className="showreel-meta">
        <span>Reel 01 · Holocene Films</span>
        <span>Runtime {clock(duration)}</span>
        <span>QuickTime master · streamed</span>
      </div>
    </div>
  );
}