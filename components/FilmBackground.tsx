"use client";
import { useEffect, useRef } from "react";

export const FILM_FRAMES = 242;
export const FILM_SHOTS = 7;

export function shotFor(progress: number) {
  return Math.min(FILM_SHOTS - 1, Math.floor(progress * FILM_SHOTS));
}

/* Scroll-driven film matte: the potrace SVG sequence renders as a black
   organic matte over a brand-palette light field, so the neural/coral
   structures glow like bioluminescence. Scrollbar = timeline. */
export default function FilmBackground({ staticFrame = false }: { staticFrame?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<Array<HTMLImageElement | null>>(new Array(FILM_FRAMES).fill(null));
  const drawn = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let cancelled = false;

    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1 : 1.5);
    const fit = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      drawn.current = -1; // force redraw on resize
    };
    fit();
    window.addEventListener("resize", fit);

    const src = (i: number) =>
      `/film/frame-${String(i).padStart(3, "0")}.svg`;
    const load = (i: number) =>
      new Promise<void>((res) => {
        if (imgs.current[i]) return res();
        const im = new Image();
        im.onload = () => {
          imgs.current[i] = im;
          res();
        };
        im.onerror = () => res();
        im.src = src(i);
      });

    const draw = (idx: number) => {
      const im = imgs.current[idx];
      if (!im || !im.complete || im.naturalWidth === 0) return false;
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
      const w = im.naturalWidth * s;
      const h = im.naturalHeight * s;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
      drawn.current = idx;
      return true;
    };

    // Priority: hero/bookend frames first, then the rest in idle chunks
    (async () => {
      for (let i = 0; i < 48; i++) {
        await load(i);
        if (cancelled) return;
      }
      draw(0);
      if (staticFrame) {
        await load(120);
        if (!cancelled) draw(120);
        return;
      }
      for (let i = 48; i < FILM_FRAMES; i++) {
        await load(i);
        if (cancelled) return;
        if (i % 24 === 0) await new Promise((r) => setTimeout(r, 0));
      }
    })();

    if (staticFrame) {
      return () => {
        cancelled = true;
        window.removeEventListener("resize", fit);
      };
    }

    // Scroll → frame driver
    let target = 0;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      target = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Anticipatory preload around the playhead
    let lastPreload = -1;
    const tick = () => {
      if (cancelled) return;
      const idx = Math.min(
        FILM_FRAMES - 1,
        Math.floor(target * FILM_FRAMES)
      );
      if (idx !== drawn.current) {
        if (!draw(idx) && Math.abs(idx - lastPreload) > 4) {
          lastPreload = idx;
          for (let k = 0; k < 24; k++) {
            const a = idx - k;
            const b = idx + k;
            if (a >= 0) void load(a);
            if (b < FILM_FRAMES) void load(b);
          }
        }
      }
      requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", fit);
    };
  }, [staticFrame]);

  return (
    <>
      {/* brand light field shining through the matte */}
      <div className="film-light" aria-hidden />
      <canvas ref={canvasRef} className="film-canvas" aria-hidden />
      {/* LUT grade: crushed blacks, teal/violet push, vignette */}
      <div className="film-grade" aria-hidden />
    </>
  );
}
