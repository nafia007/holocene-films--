"use client";
import { SCENES } from "@/lib/content";

const ACCENTS = ["#00F5C0", "#7A5CFF", "#FF5CE0", "#FFB84D", "#3BFFB0", "#F4F2ED"];

export default function Navbar({ active }: { active: string }) {
  const idx = Math.max(
    0,
    SCENES.findIndex((s) => s.id === active)
  );
  const glow = ACCENTS[idx] ?? "#00F5C0";
  return (
    <nav className="nav" style={{ boxShadow: `0 1px 40px ${glow}22` }}>
      <a href="#hero" className="nav-logo">
        HOLOCENE <span>FILMS</span>
      </a>
      <div className="nav-links">
        {SCENES.map((s) => (
          <a
            key={s.id}
            href={`#${s.anchor}`}
            className={active === s.id ? "active" : ""}
          >
            {s.label}
          </a>
        ))}
        <a href="https://hacc.uwu.ai/" target="_blank" rel="noreferrer">
          HACC ↗
        </a>
        <a href="#network">Live Sites</a>
        <a href="#contact" title="Team, Blog, Metaverse, AI Showreel">
          More
        </a>
      </div>
      <a className="nav-cta" href="#consult">
        Book AI Consult — $50
      </a>
    </nav>
  );
}
