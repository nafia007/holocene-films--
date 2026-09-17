"use client";
import MagneticButton from "./MagneticButton";
import { SERVICES } from "@/lib/content";

function Reveal({ children }: { children: React.ReactNode }) {
  return <div className="reveal">{children}</div>;
}

export default function Sections() {
  return (
    <>
      {/* SCENE 01 — HERO */}
      <section id="hero" data-scene="hero" className="scene">
        <div className="scene-inner">
          <div className="kicker rack-focus">Holocene Films · A Living World in Formation</div>
          <h1 className="hero-title rack-focus">
            Transform
            <br />
            Your <span className="accent">Vision</span>
          </h1>
          <p className="hero-sub">
            Holocene Films drives innovation through cutting-edge technology and
            creative excellence in filmmaking. We turn your boldest ideas into
            cinematic reality.
          </p>
          <MagneticButton href="#services">Explore Our Services →</MagneticButton>
        </div>
      </section>

      {/* SCENE 02 — SERVICES */}
      <section id="services" data-scene="services" className="scene">
        <div className="scene-inner">
          <Reveal>
            <div className="kicker">02 — Services · Six Chapters</div>
            <h2 className="section-title">Six worlds, one organism</h2>
            <p className="section-sub">
              Full-service cinematic production layered with blockchain, AI, and
              automation. Technology in service of artistry.
            </p>
          </Reveal>
          <div className="grid-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="card reveal"
                style={{ borderTop: `2px solid ${s.hue}` }}
              >
                <div className="glyph" style={{ color: s.hue }}>{s.glyph}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <a className="learn" href="#consult">Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 03 — TIMELINE (flagship app) */}
      <section id="timeline" data-scene="timeline" className="scene">
        <div className="scene-inner">
          <Reveal>
            <div className="kicker">03 — Timeline · The Main App</div>
            <h2 className="section-title">Timeline</h2>
            <p className="section-sub" style={{ fontSize: 19 }}>
              Our flagship streaming service, built for independent filmmakers —
              by independent filmmakers.
            </p>
            <p className="section-sub">
              Founded by filmmakers Weaam Williams and Nafia Kocks, Timeline is
              the home for independent cinema: a streaming platform where indie
              creators own their work and reach their audience directly. Come and
              watch our award-winning films on Timeline.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <MagneticButton href="https://timeline.uwu.ai/">
                Open Timeline ↗
              </MagneticButton>
              <MagneticButton
                secondary
                href="mailto:info@holocenefilms.xyz?subject=Timeline%20early%20access"
              >
                Get early access →
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* LIVE NETWORK — deployed ecosystem */}
      <section id="network" data-scene="timeline" className="scene">
        <div className="scene-inner">
          <Reveal>
            <div className="kicker">Live — The Ecosystem</div>
            <h2 className="section-title">Deployed &amp; live</h2>
            <p className="section-sub">
              Real platforms running right now across film, finance, and AI.
            </p>
          </Reveal>
          <div className="grid-3">
            {[
              ["HACC", "hacc.uwu.ai", "https://hacc.uwu.ai/"],
              ["Holocene RWA", "holocene-rwa.uwu.ai", "https://holocene-rwa.uwu.ai/"],
              ["AFD Submissions", "afd-submissions.uwu.ai", "https://afd-submissions.uwu.ai/"],
              ["Khwa AI Research", "khwa-ai-research.uwu.ai", "https://khwa-ai-research.uwu.ai/"],
              ["Holo Routes", "holo-routes.vercel.app", "https://holo-routes.vercel.app/"],
              ["StockMag", "stockmag.uwu.ai", "https://stockmag.uwu.ai/"],
            ].map(([title, host, url]) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="card reveal"
              >
                <div className="glyph" style={{ color: "#00F5C0" }}>↗</div>
                <h3>{title}</h3>
                <p>{host}</p>
                <span className="learn">Open live site →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 04 — AI CONSULTATIONS */}
      <section id="consult" data-scene="consult" className="scene">
        <div className="scene-inner">
          <div className="consult-box reveal">
            <div className="kicker">04 — AI Consultations · One-on-One</div>
            <h2 className="section-title">Unlock AI for your business</h2>
            <p className="section-sub">
              Book a 30-minute AI consultation for just $50. Unlock the potential
              of AI for your business.
            </p>
            <ul className="checklist">
              <li>Personalized AI strategy</li>
              <li>Expert insights on implementation</li>
              <li>Tailored recommendations for your industry</li>
            </ul>
            <p style={{ opacity: 0.85, lineHeight: 1.7 }}>
              How to book: email{" "}
              <a href="mailto:info@holocenefilms.xyz" style={{ color: "#FFB84D" }}>
                info@holocenefilms.xyz
              </a>
            </p>
            <MagneticButton href="mailto:info@holocenefilms.xyz?subject=AI%20Consultation%20Booking%20—%20$50%20/%2030min">
              Book Consultation — $50 →
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* SCENE 05 — ABOUT */}
      <section id="about" data-scene="about" className="scene">
        <div className="scene-inner">
          <Reveal>
            <div className="kicker">05 — About · Mission</div>
            <h2 className="section-title">Technology enhances creativity, never replaces it</h2>
            <p className="section-sub" style={{ fontSize: 19 }}>
              Holocene Films is at the forefront of the cinematic revolution,
              blending cutting-edge technology with creative excellence to
              redefine the art of filmmaking.
            </p>
            <p className="section-sub">
              We believe in the power of technology to enhance creativity, not
              replace it. Blockchain for secure, transparent production. AI to
              streamline workflows. Automation to enhance efficiency — always in
              service of the filmmaker&apos;s vision. Join the Revolution.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <MagneticButton href="#contact" secondary>Join the Revolution →</MagneticButton>
              <MagneticButton href="#timeline" secondary>Watch on Timeline</MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SCENE 06 — CONTACT */}
      <section id="contact" data-scene="contact" className="scene" style={{ minHeight: "80vh" }}>
        <div className="scene-inner" style={{ textAlign: "center" }}>
          <Reveal>
            <div className="kicker">06 — Contact · Closing Credits</div>
            <h2 className="section-title">Let&apos;s make the future cinematic</h2>
            <p className="section-sub" style={{ margin: "16px auto 0" }}>
              Tell us about your vision — film, Web3, AI, or all three.
            </p>
            <MagneticButton href="mailto:info@holocenefilms.xyz">
              info@holocenefilms.xyz →
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h4>Holocene Films</h4>
            <a href="#about">About</a>
            <a href="#contact">Careers</a>
            <a href="#contact">Contact</a>
            <a href="#about">Metaverse</a>
            <a href="#projects">HACC</a>
          </div>
          <div>
            <h4>Services</h4>
            <a href="#services">Application Development</a>
            <a href="#services">Blockchain</a>
            <a href="#services">AI Integration</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#contact">Privacy</a>
            <a href="#contact">Terms</a>
          </div>
          <div>
            <h4>Connect</h4>
            <a href="#contact">Twitter</a>
            <a href="#contact">LinkedIn</a>
            <a href="#contact">GitHub</a>
            <a href="#contact">Facebook</a>
            <a href="#contact">Instagram</a>
          </div>
        </div>
        <div className="copy">
          © 2026 Holocene Films. All rights reserved. · Team · Blog · Metaverse · AI Showreel · HACC
        </div>
      </footer>
    </>
  );
}
