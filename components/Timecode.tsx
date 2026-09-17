"use client";
import { useEffect, useState } from "react";
import { SCENES } from "@/lib/content";
import { shotFor } from "./FilmBackground";

export default function Timecode({
  active,
  progress,
}: {
  active: string;
  progress: number;
}) {
  const scene = SCENES.find((s) => s.id === active) ?? SCENES[0];
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    const total = Math.floor(progress * 6000);
    const f = String(total % 24).padStart(2, "0");
    const s = String(Math.floor(total / 24) % 60).padStart(2, "0");
    const m = String(Math.floor(total / 1440) % 60).padStart(2, "0");
    setTc(`00:${m}:${s}:${f}`);
  }, [progress]);
  return (
    <>
      <div className="timecode-bar">
        <div className="timecode-fill" style={{ height: `${progress * 100}%` }} />
      </div>
      <div className="timecode">
        {scene.index} — {scene.label} · SHOT 0{shotFor(progress) + 1}/07 · {tc}
      </div>
    </>
  );
}
