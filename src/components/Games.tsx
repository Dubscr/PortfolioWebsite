import { useEffect, useRef, useState } from "react";
import { gamesIntro, ghostGame, murderMystery } from "../data/portfolio";
import { sfx } from "../lib/sfx";
import type { Game } from "../types/portfolio";
import { Ghost } from "./Ghosts";
import { shotImageProps, Thumb } from "./Photo";

const SHOT_SIZES = "(max-width: 760px) 92vw, 46vw";

export function Games() {
  return (
    <section className="section" id="games">
      <div className="wrap">
        <h2 className="heading">Game dev</h2>
        <p className="lede">{gamesIntro}</p>
        <div className="games">
          <MurderGame />
          <HauntedGame />
        </div>
      </div>
    </section>
  );
}

function GameDetails({ game }: { game: Game }) {
  return (
    <>
      <h3 className="title">{game.title}</h3>
      <p>{game.description}</p>
      <a className="btn" href={game.steamUrl} target="_blank" rel="noreferrer">
        Free on Steam
      </a>
    </>
  );
}

function MurderGame() {
  const [revealed, setRevealed] = useState(false);
  const [roleShot, ...otherShots] = murderMystery.shots;

  return (
    <article className="game">
      <button
        type="button"
        className={`role ${revealed ? "is-revealed" : ""}`}
        aria-pressed={revealed}
        aria-label={revealed ? "Hide your role" : "Peek at your role"}
        onClick={() => {
          if (revealed) sfx.click();
          else sfx.sting();
          setRevealed(!revealed);
        }}
      >
        <span className="role__inner">
          <span className="role__face">
            <small>Round start</small>
            <b>Your role</b>
            <small>Tap to peek</small>
          </span>
          <span className="role__face role__face--back">
            <img {...shotImageProps(roleShot)} sizes={SHOT_SIZES} />
          </span>
        </span>
      </button>
      <div className="game__strip">
        {otherShots.map((shot) => (
          <Thumb key={shot.src} shot={shot} />
        ))}
      </div>
      <GameDetails game={murderMystery} />
    </article>
  );
}

function HauntedGame() {
  const [lit, setLit] = useState(false);
  const roomRef = useRef<HTMLDivElement>(null);
  const [roomShot, ...otherShots] = ghostGame.shots;

  useFlashlight(roomRef, lit);

  return (
    <article className="game" id="ugg">
      <div ref={roomRef} className={`room ${lit ? "is-lit" : ""}`}>
        <img {...shotImageProps(roomShot)} sizes={SHOT_SIZES} loading="lazy" />
        <Ghost id="room" className="ghost--room" />
        <div className="room__dark" />
        <p className="scrawl room__hint">something's in here...</p>
      </div>
      <div className="game__strip">
        {otherShots.map((shot) => (
          <Thumb key={shot.src} shot={shot} />
        ))}
        <button
          type="button"
          className={`switch ${lit ? "is-on" : ""}`}
          aria-pressed={lit}
          onClick={() => {
            sfx.click();
            setLit(!lit);
          }}
        >
          <span className="switch__track" />
          Lights
        </button>
      </div>
      <GameDetails game={ghostGame} />
    </article>
  );
}

/** Keeps the flashlight on the pointer, and lets it wander on its own when idle. */
function useFlashlight(ref: React.RefObject<HTMLDivElement | null>, lit: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || lit) return;

    const place = (x: number, y: number) => {
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    };

    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let resumeAt = 0;
    let visible = false;

    const wander = (time: number) => {
      frame = 0;
      if (!visible) return;
      if (time >= resumeAt) {
        const s = time / 1000;
        place(
          el.clientWidth * (0.5 + 0.38 * Math.sin(s * 0.55)),
          el.clientHeight * (0.5 + 0.36 * Math.sin(s * 0.91 + 1)),
        );
      }
      frame = requestAnimationFrame(wander);
    };

    const start = () => {
      if (!calm && !frame) frame = requestAnimationFrame(wander);
    };

    const onPointer = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      resumeAt = e.timeStamp + 2500;
      place(e.clientX - box.left, e.clientY - box.top);
    };

    place(el.clientWidth / 2, el.clientHeight / 2);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    observer.observe(el);
    el.addEventListener("pointermove", onPointer);
    el.addEventListener("pointerdown", onPointer);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onPointer);
      el.removeEventListener("pointerdown", onPointer);
    };
  }, [ref, lit]);
}
