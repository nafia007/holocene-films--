"use client";
import { useEffect, useState } from "react";
import FilmBackground from "@/components/FilmBackground";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import Sections from "@/components/Sections";
import Timecode from "@/components/Timecode";

export default function Page() {
  const [active, setActive] = useState("hero");
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).dataset.scene;
            if (id) setActive(id);
          }
          if (e.isIntersecting) e.target.classList.add("inview");
        });
      },
      { threshold: 0.3 }
    );
    els.forEach((el) => io.observe(el));

    // reveal-on-scroll for cards
    const cards = Array.from(document.querySelectorAll(".reveal"));
    const rio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((c) => rio.observe(c));
    return () => {
      io.disconnect();
      rio.disconnect();
    };
  }, []);

  return (
    <div className="grain">
      <Preloader />
      <FilmBackground staticFrame={reducedMotion} />
      <Navbar active={active} />
      <Timecode active={active} progress={progress} />
      <main className="content-layer">
        <Sections />
      </main>
    </div>
  );
}
