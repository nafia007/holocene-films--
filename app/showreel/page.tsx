import type { Metadata } from "next";
import FilmBackground from "@/components/FilmBackground";
import MagneticButton from "@/components/MagneticButton";
import Navbar from "@/components/Navbar";
import ShowreelPlayer from "@/components/ShowreelPlayer";

export const metadata: Metadata = {
  title: "Showreel — Holocene Films",
  description:
    "The Holocene Films showreel — full-service cinematic production, Web3, AI and automation.",
};

export default function ShowreelPage() {
  return (
    <div className="grain">
      <FilmBackground staticFrame />
      <Navbar active="" />
      <main className="content-layer">
        <section className="showreel-scene">
          <div className="scene-inner">
            <div className="kicker rack-focus">Reel 01 — Showreel</div>
            <h1 className="showreel-title rack-focus">
              The <span className="accent">Showreel</span>
            </h1>
            <p className="hero-sub">
              Two decades of cinematography, direction and finishing — under one
              reel.
            </p>

            <ShowreelPlayer />

            <div className="showreel-actions">
              <MagneticButton href="/">Back to the site →</MagneticButton>
              <MagneticButton secondary href="mailto:info@holocenefilms.xyz?subject=Project%20Enquiry">
                Book a project →
              </MagneticButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}