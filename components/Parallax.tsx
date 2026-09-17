"use client";
import { useEffect, useRef } from "react";

export const PARALLAX_LAYERS = 4;

/* Multi-axis push transitions:
   Hero→Services: PUSH LEFT
   Services→Timeline: PUSH UP
   Timeline→Team: PUSH RIGHT
   Team→Consult: Slow zoom-out
   Consult→About: PUSH UP decelerating
   About→Contact: PUSH UP to stop */
const PUSH_VECTORS: Record<string, [number, number]> = {
  hero:      [0,    0],
  services:  [0.9,  0],
  timeline:  [0.9,  0.8],
  team:      [0.2,  1.6],
  consult:   [-0.4, 2.0],
  about:     [-0.4, 2.3],
  contact:   [-0.4, 3.0],
};
const SCENE_KEYS = ["hero", "services", "timeline", "team", "consult", "about", "contact"] as const;
type SceneKey = typeof SCENE_KEYS[number];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function getPushFor(progress: number): [number, number] {
  const total = SCENE_KEYS.length - 1;
  const idx = Math.min(total - 1, Math.floor(progress * total));
  const t = (progress * total) - idx;
  const a = PUSH_VECTORS[SCENE_KEYS[idx]];
  const b = PUSH_VECTORS[SCENE_KEYS[idx + 1]];
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
}

export function useParallaxPush(containerRef: React.RefObject<HTMLDivElement | null>) {
  const layersRef = useRef<Map<number, HTMLDivElement>>(new Map());

  const registerLayer = (depth: number, el: HTMLDivElement | null) => {
    if (el) layersRef.current.set(depth, el);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      const [pushX, pushY] = getPushFor(progress);
      const speeds = [0.12, 0.35, 0.7, 1.0]; // bg, mid, fg, post

      layersRef.current.forEach((el, depth) => {
        const speed = speeds[depth] ?? 0.5;
        const tx = pushX * 100 * speed;
        const ty = pushY * 60 * speed;
        el.style.transform = `translate3d(${-tx}px, ${-ty}px, 0)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  return { registerLayer };
}

/* Table Mountain silhouette — stylized ridge line */
export function MountainSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1920 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMax slice"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <path
        d="M0 400 L0 280 L80 270 L160 260 L240 240 L320 220 L400 200
           L440 190 L480 170 L520 150 L560 130 L600 110 L640 95
           L680 85 L720 78 L760 74 L800 72 L840 73 L880 76
           L920 82 L960 90 L1000 85 L1040 78 L1080 72 L1120 68
           L1160 66 L1200 68 L1240 72 L1280 80 L1320 90 L1360 100
           L1400 115 L1440 130 L1480 150 L1520 175 L1560 200
           L1600 225 L1640 250 L1680 270 L1720 285 L1760 295
           L1800 305 L1840 315 L1880 325 L1920 335 L1920 400 Z"
        fill="url(#mt-gradient)"
        opacity="0.35"
      />
      <defs>
        <linearGradient id="mt-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c2233" />
          <stop offset="100%" stopColor="#0b0d14" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* Cape Town geometric border pattern (abstracted Cape Malay rhythm) */
export function CapePattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: "100%", height: 8, display: "block" }}
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <g key={i}>
          <rect x={i * 20} y={0} width={8} height={8} fill="#00F5C0" opacity={0.2 + (i % 3) * 0.1} />
          <rect x={i * 20 + 10} y={2} width={4} height={4} fill="#7A5CFF" opacity={0.15 + (i % 2) * 0.1} />
        </g>
      ))}
    </svg>
  );
}
