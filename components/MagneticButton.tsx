"use client";
import { useRef } from "react";

export default function MagneticButton({
  children,
  href,
  secondary,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  secondary?: boolean;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
  };
  const reset = () => {
    const el = ref.current as HTMLElement | null;
    if (el) el.style.transform = "translate(0,0)";
  };
  const burst = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    for (let i = 0; i < 10; i++) {
      const s = document.createElement("span");
      s.className = "burst";
      const a = (i / 10) * Math.PI * 2;
      s.style.setProperty("--dx", `${Math.cos(a) * (40 + Math.random() * 50)}px`);
      s.style.setProperty("--dy", `${Math.sin(a) * (40 + Math.random() * 50)}px`);
      s.style.left = "50%";
      s.style.top = "50%";
      el.appendChild(s);
      setTimeout(() => s.remove(), 750);
    }
    onClick?.();
  };

  const cls = `btn-magnetic${secondary ? " secondary" : ""}`;
  if (href) {
    return (
      <a
        // @ts-expect-error ref union
        ref={ref}
        href={href}
        className={cls}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onClick={burst}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      // @ts-expect-error ref union
      ref={ref}
      className={cls}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={burst}
    >
      {children}
    </button>
  );
}
