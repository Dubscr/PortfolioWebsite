import { useState } from "react";
import { isMuted, setMuted, sfx } from "../lib/sfx";
import { GhostTally } from "./Ghosts";

const LINKS = [
  { href: "#games", label: "Games" },
  { href: "#music", label: "Music" },
  { href: "#videos", label: "Videos" },
  { href: "#hi", label: "Say hi" },
];

export function Header() {
  const [muted, setMutedState] = useState(isMuted);

  return (
    <header className="bar">
      <a className="bar__logo" href="#top" aria-label="Back to the cover">
        <img src="/dubscr-logo-256.png" alt="" width="256" height="256" />
      </a>
      <nav className="bar__nav" aria-label="Sections">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="bar__tools">
        <GhostTally />
        <button
          type="button"
          className="bar__sound"
          aria-pressed={!muted}
          aria-label="Sound effects"
          title={muted ? "Sound effects off" : "Sound effects on"}
          onClick={() => {
            setMuted(!muted);
            setMutedState(!muted);
            if (muted) sfx.click();
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9z" fill="currentColor" />
            {muted ? (
              <path d="m16 9 6 6m0-6-6 6" stroke="currentColor" strokeWidth="2.5" fill="none" />
            ) : (
              <path d="M15 8.5a5 5 0 0 1 0 7M18 5.5a9 9 0 0 1 0 13" stroke="currentColor" strokeWidth="2.5" fill="none" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}
