"use client";
import { useEffect, useRef, useState } from "react";

/* ── REC BAR (top) ─────────────────────────────────────────────── */
function RecBar({ progress }: { progress: number }) {
  const [tc, setTc] = useState("00:00:00:00");
  const [rec, setRec] = useState(true);
  useEffect(() => {
    const total = Math.floor(progress * 6000);
    const f = String(total % 24).padStart(2, "0");
    const s = String(Math.floor(total / 24) % 60).padStart(2, "0");
    const m = String(Math.floor(total / 1440) % 60).padStart(2, "0");
    setTc(`00:${m}:${s}:${f}`);
    const id = setInterval(() => setRec((r) => !r), 900);
    return () => clearInterval(id);
  }, [progress]);
  return (
    <div className="hud-rec-bar">
      <span className="hud-rec-dot" style={{ opacity: rec ? 1 : 0.15 }}>●</span>
      <span className="hud-rec-label">REC</span>
      <span className="hud-rec-tc">{tc}</span>
      <span className="hud-rec-meter">
        <span style={{ width: `${Math.min(100, 40 + progress * 60)}%` }} />
        CHAIN_SYNC
      </span>
      <span className="hud-rec-meter">
        <span style={{ width: `${Math.min(100, 20 + progress * 80)}%` }} />
        RENDER
      </span>
    </div>
  );
}

/* ── CORNER BRACKETS ───────────────────────────────────────────── */
function CornerBrackets({ active }: { active: string }) {
  const labels: Record<string, string> = {
    hero:    "LOCKED — CAPE_TOWN // ATLANTIC_SEABOARD",
    services: "LOCKED — SERVICES_06 // ORGANISM",
    timeline: "LOCKED — TIMELINE_APP // STREAMING",
    team:    "LOCKED — FOUNDERS_02 // WEAM_WILLIAMS",
    consult: "LOCKED — AI_CONSULT // $50_30MIN",
    about:   "LOCKED — MISSION // HOLOCENE_EPOCH",
    contact: "LOCKED — CREDITS // END_TRANSMISSION",
  };
  return (
    <div className="hud-brackets" aria-hidden>
      <div className="hud-bracket hud-bracket--tl" />
      <div className="hud-bracket hud-bracket--tr" />
      <div className="hud-bracket hud-bracket--bl" />
      <div className="hud-bracket hud-bracket--br" />
      <div className="hud-bracket-label">{labels[active] ?? labels.hero}</div>
    </div>
  );
}

/* ── LEDGER TICKER (bottom) ────────────────────────────────────── */
function LedgerTicker() {
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!strip.current) return;
    let x = 0;
    const tick = () => {
      x -= 1.2;
      if (strip.current) strip.current.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const data = Array.from({ length: 40 }, (_, i) => {
    const block = 18472930 + i;
    const hash = ((block * 9301 + 49297) % 233280).toString(16).padStart(8, "0");
    const gas = (21 + (i % 12)).toString();
    return `BLK:${block} 0x${hash}… GAS:${gas}gwei`;
  }).join("  ·  ");
  return (
    <div className="hud-ledger">
      <div ref={strip} className="hud-ledger-strip">
        <span>{data}</span>
        <span>{data}</span>
      </div>
    </div>
  );
}

/* ── CENTER RETICLE ────────────────────────────────────────────── */
function Reticle() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      ref.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div className="hud-reticle" ref={ref} aria-hidden>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="40" stroke="#00F5C0" strokeWidth="0.5" opacity="0.3" />
        <circle cx="60" cy="60" r="22" stroke="#00F5C0" strokeWidth="0.4" opacity="0.2" />
        <line x1="60" y1="10" x2="60" y2="30" stroke="#00F5C0" strokeWidth="0.5" opacity="0.35" />
        <line x1="60" y1="90" x2="60" y2="110" stroke="#00F5C0" strokeWidth="0.5" opacity="0.35" />
        <line x1="10" y1="60" x2="30" y2="60" stroke="#00F5C0" strokeWidth="0.5" opacity="0.35" />
        <line x1="90" y1="60" x2="110" y2="60" stroke="#00F5C0" strokeWidth="0.5" opacity="0.35" />
        <rect x="55" y="55" width="10" height="10" stroke="#7A5CFF" strokeWidth="0.4" opacity="0.25" />
      </svg>
    </div>
  );
}

/* ── NEURAL TRACE (animated scan lines over terrain) ───────────── */
function NeuralTrace() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let cancelled = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; life: number; maxLife: number }> = [];
    const spawn = () => {
      if (cancelled || lines.length > 8) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * (0.2 + Math.random() * 0.6);
      const cy = h * (0.3 + Math.random() * 0.4);
      const segs = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < segs; i++) {
        const angle = Math.random() * Math.PI * 2;
        const len = 40 + Math.random() * 120;
        lines.push({
          x1: cx + Math.cos(angle) * i * 30,
          y1: cy + Math.sin(angle) * i * 30,
          x2: cx + Math.cos(angle) * (i * 30 + len),
          y2: cy + Math.sin(angle) * (i * 30 + len),
          life: 0,
          maxLife: 40 + Math.random() * 60,
        });
      }
      setTimeout(spawn, 800 + Math.random() * 2000);
    };
    spawn();

    const draw = () => {
      if (cancelled) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = lines.length - 1; i >= 0; i--) {
        const l = lines[i];
        l.life++;
        if (l.life > l.maxLife) { lines.splice(i, 1); continue; }
        const alpha = Math.min(1, l.life / 10) * Math.max(0, 1 - (l.life / l.maxLife));
        ctx.strokeStyle = `rgba(0, 245, 192, ${alpha * 0.25})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
        // confidence readout at midpoint
        if (l.life === 15) {
          const conf = (94 + Math.random() * 5.5).toFixed(1);
          ctx.fillStyle = `rgba(0, 245, 192, ${alpha * 0.5})`;
          ctx.font = `${9 * dpr}px monospace`;
          ctx.fillText(`${conf}%`, (l.x1 + l.x2) / 2, (l.y1 + l.y2) / 2 - 6 * dpr);
        }
      }
      requestAnimationFrame(draw);
    };
    const raf = requestAnimationFrame(draw);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="hud-neural" aria-hidden />;
}

/* ── TRANSITION BURST (one-word flash at section boundary) ──────── */
function TransitionBurst({ scene }: { scene: string }) {
  const [flash, setFlash] = useState("");
  const prev = useRef(scene);
  useEffect(() => {
    if (prev.current === scene) return;
    prev.current = scene;
    const beats: Record<string, string> = {
      services:  "INITIATING >>",
      timeline:  "SYSTEMS ONLINE",
      team:      "PERSONNEL LOCKED",
      consult:   "SIGNAL LOCKED",
      about:     "ANALYSIS COMPLETE",
      contact:   "TRANSMISSION COMPLETE",
    };
    const text = beats[scene];
    if (!text) return;
    setFlash(text);
    const t = setTimeout(() => setFlash(""), 450);
    return () => clearTimeout(t);
  }, [scene]);
  if (!flash) return null;
  return (
    <div className="hud-burst" key={flash}>
      <span>{flash}</span>
    </div>
  );
}

/* ── POWER DOWN (closing credits) ──────────────────────────────── */
function PowerDown({ scene }: { scene: string }) {
  const off = scene === "contact";
  return (
    <div className={`hud-powerdown${off ? " off" : ""}`} aria-hidden>
      <span>■ CHAIN_SYNC</span>
      <span>■ RENDER</span>
      <span>■ NEURAL_TRACE</span>
      <span>■ LEDGER</span>
    </div>
  );
}

/* ── MASTER HUD OVERLAY ────────────────────────────────────────── */
export default function HudOverlay({
  active,
  progress,
}: {
  active: string;
  progress: number;
}) {
  return (
    <div className="hud-layer" aria-hidden>
      <RecBar progress={progress} />
      <CornerBrackets active={active} />
      <Reticle />
      <NeuralTrace />
      <LedgerTicker />
      <TransitionBurst scene={active} />
      <PowerDown scene={active} />
    </div>
  );
}
