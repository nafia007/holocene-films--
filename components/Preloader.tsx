"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`preloader${done ? " done" : ""}`} aria-hidden={done}>
      <div className="loader-orb" />
      <div className="loader-text">Holocene Films</div>
      <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: "0.3em" }}>
        FORMING WORLD…
      </div>
    </div>
  );
}
