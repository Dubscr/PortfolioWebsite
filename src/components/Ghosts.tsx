import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ghostGame } from "../data/portfolio";
import { sfx } from "../lib/sfx";

const STORAGE_KEY = "dubscr-ghosts";
const GHOST_IDS = ["cover", "room", "deck", "video"] as const;
export type GhostId = (typeof GHOST_IDS)[number];
export const TOTAL_GHOSTS = GHOST_IDS.length;

interface GhostState {
  found: Set<GhostId>;
  catchGhost: (id: GhostId) => void;
}

const GhostContext = createContext<GhostState | null>(null);

function useGhosts() {
  const value = useContext(GhostContext);
  if (!value) throw new Error("useGhosts needs a GhostProvider");
  return value;
}

function loadFound() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as GhostId[];
    return new Set(saved.filter((id) => GHOST_IDS.includes(id)));
  } catch {
    return new Set<GhostId>();
  }
}

export function GhostProvider({ children }: { children: ReactNode }) {
  const [found, setFound] = useState(loadFound);
  const [toast, setToast] = useState<{ key: number; text: string } | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...found]));
    } catch {
      /* Private mode: progress just won't persist. */
    }
  }, [found]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const catchGhost = useCallback(
    (id: GhostId) => {
      if (found.has(id)) return;
      const next = new Set(found).add(id);
      setFound(next);
      if (next.size === TOTAL_GHOSTS) {
        sfx.fanfare();
        setCelebrating(true);
      } else {
        sfx.caught();
        setToast({ key: Date.now(), text: `Got one! ${next.size} of ${TOTAL_GHOSTS}` });
      }
    },
    [found],
  );

  const value = useMemo(() => ({ found, catchGhost }), [found, catchGhost]);

  return (
    <GhostContext.Provider value={value}>
      {children}
      <div className="ghost-toast-slot" role="status">
        {toast ? (
          <p className="ghost-toast" key={toast.key}>
            <GhostArt /> {toast.text}
          </p>
        ) : null}
      </div>
      {celebrating ? <Celebration onClose={() => setCelebrating(false)} /> : null}
      {found.size === TOTAL_GHOSTS ? <GhostBuddy /> : null}
    </GhostContext.Provider>
  );
}

const SPRITE = [
  "....XXXX....",
  "..XXXXXXXX..",
  ".XXXXXXXXXX.",
  ".XXOOXXOOXX.",
  "XXXOOXXOOXXX",
  "XXXXXXXXXXXX",
  "XXXXXOOXXXXX",
  "XXXXXOOXXXXX",
  "XXXXXXXXXXXX",
  "XXXXXXXXXXXX",
  "XX.XXX.XXX.X",
  "X...X...X...",
];

const pixelPath = (char: string) =>
  SPRITE.flatMap((row, y) => [...row].map((c, x) => (c === char ? `M${x} ${y}h1v1h-1z` : ""))).join("");

const BODY_PATH = pixelPath("X");
const FACE_PATH = pixelPath("O");

export function GhostArt() {
  return (
    <svg className="ghost-art" viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true">
      <path d={BODY_PATH} fill="#fff" />
      <path d={FACE_PATH} fill="#1a1430" />
    </svg>
  );
}

export function Ghost({ id, className = "" }: { id: GhostId; className?: string }) {
  const { found, catchGhost } = useGhosts();
  const [poofing, setPoofing] = useState(false);

  if (found.has(id) && !poofing) return null;

  return (
    <button
      type="button"
      className={`ghost ${poofing ? "is-poofing" : ""} ${className}`}
      aria-label="A ghost! Catch it"
      onClick={() => {
        setPoofing(true);
        catchGhost(id);
      }}
      onAnimationEnd={(e) => {
        if (e.animationName === "ghost-poof") setPoofing(false);
      }}
    >
      <GhostArt />
    </button>
  );
}

export function GhostTally() {
  const { found } = useGhosts();
  const label = `${found.size} of ${TOTAL_GHOSTS} ghosts found`;
  return (
    <span className="tally" title={label} aria-label={label}>
      <GhostArt />
      <span aria-hidden="true">
        {found.size}/{TOTAL_GHOSTS}
      </span>
    </span>
  );
}

function Celebration({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const raining = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        animationDelay: `${((i * 13) % 20) / 10}s`,
        animationDuration: `${2.4 + ((i * 7) % 16) / 10}s`,
      })),
    [],
  );

  return (
    <dialog ref={dialogRef} className="celebration" onClose={onClose}>
      <div className="celebration__rain" aria-hidden="true">
        {raining.map((style, i) => (
          <span key={i} style={style}>
            <GhostArt />
          </span>
        ))}
      </div>
      <div className="celebration__card">
        <h2>All {TOTAL_GHOSTS} caught!</h2>
        <p>The full game took two years to make and it's free. One of them is following you now, sorry.</p>
        <div className="button-row">
          <a className="btn" href={ghostGame.steamUrl} target="_blank" rel="noreferrer">
            Play {ghostGame.title}
          </a>
          <form method="dialog">
            <button className="btn btn--plain">Keep reading</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

/** The reward: one ghost trails the mouse. On touch screens it just hovers in the corner. */
function GhostBuddy() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = innerWidth - 80;
    let targetY = innerHeight - 80;
    let x = targetX;
    let y = targetY;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX + 18;
      targetY = e.clientY + 18;
    };
    const tick = () => {
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      el.style.transform = `translate(${x}px, ${y}px) scaleX(${targetX < x ? -1 : 1})`;
      frame = requestAnimationFrame(tick);
    };

    el.classList.add("is-following");
    window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="ghost-buddy" aria-hidden="true">
      <GhostArt />
    </div>
  );
}
