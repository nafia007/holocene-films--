"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SCENES } from "@/lib/content";

const ACCENTS = ["#00F5C0", "#7A5CFF", "#FF5CE0", "#FFB84D", "#3BFFB0", "#F4F2ED"];

export default function Navbar({ active }: { active: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onHome = pathname === "/";
  const idx = Math.max(
    0,
    SCENES.findIndex((s) => s.id === active)
  );
  const glow = ACCENTS[idx] ?? "#00F5C0";
  return (
    <nav className={`nav${open ? " open" : ""}`} style={{ boxShadow: `0 1px 40px ${glow}22` }}>
      <Link href="/" className="nav-logo">
        <img src="/logo.svg" alt="Holocene Films" style={{ height: 36, width: "auto" }} />
      </Link>
      <button
        type="button"
        className={`nav-hamburger${open ? " open" : ""}`}
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className="nav-links">
        {SCENES.map((s) => (
          <a
            key={s.id}
            href={onHome ? `#${s.anchor}` : `/#${s.anchor}`}
            className={!onHome ? "" : active === s.id ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {s.label}
          </a>
        ))}
        <Link
          href="/showreel"
          className={`nav-cta${pathname === "/showreel" ? " active" : ""}`}
          onClick={() => setOpen(false)}
        >
          Showreel
        </Link>
        <a href="https://hacc.uwu.ai/" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
          HACC ↗
        </a>
        <a href={onHome ? "#network" : "/#network"} onClick={() => setOpen(false)}>Live Sites</a>
      </div>
    </nav>
  );
}