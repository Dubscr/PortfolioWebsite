import { useCallback, useEffect, useRef, useState } from "react";
import { musicIntro, tracks } from "../data/portfolio";
import { sfx } from "../lib/sfx";
import type { Track } from "../types/portfolio";
import { Ghost } from "./Ghosts";

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "--:--";
  const whole = Math.floor(seconds);
  return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(whole % 60).padStart(2, "0")}`;
};

export function Music() {
  return (
    <section className="section section--tint" id="music">
      <div className="wrap">
        <h2 className="heading heading--bounce" aria-label="Music">
          {[..."Music"].map((letter, i) => (
            <span key={i} aria-hidden="true">
              {letter}
            </span>
          ))}
        </h2>
        <p className="lede">{musicIntro}</p>
        <TapeDeck />
      </div>
    </section>
  );
}

function TapeDeck() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);

  const [track, setTrack] = useState<Track>(tracks[0]);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(NaN);

  /* The analyser can only be wired up after a click, so it happens on first play. */
  const connectAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!contextRef.current) {
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      context.createMediaElementSource(audio).connect(analyser);
      analyser.connect(context.destination);
      contextRef.current = context;
      analyserRef.current = analyser;
    }
    if (contextRef.current.state === "suspended") void contextRef.current.resume();
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      connectAudio();
      void audio.play();
    } else {
      audio.pause();
    }
  };

  const loadTape = (next: Track) => {
    const audio = audioRef.current;
    if (!audio || next.id === track.id) return;
    sfx.clunk();
    audio.src = next.src;
    connectAudio();
    setTrack(next);
    setTime(0);
    setDuration(NaN);
    void audio.play();
  };

  useVisualizer(canvasRef, analyserRef, playing, track.color);

  const progress = Number.isFinite(duration) && duration > 0 ? time / duration : 0;

  return (
    <div className="deck">
      <audio
        ref={audioRef}
        src={tracks[0].src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      <div className="deck__well">
        <Cassette track={track} spinning={playing} progress={progress} />
        <Ghost id="deck" className="ghost--deck" />
      </div>

      <div className="deck__panel">
        <div className="deck__tabs">
          {tracks.map((item) => (
            <button
              key={item.id}
              type="button"
              className="deck__tab"
              aria-pressed={item.id === track.id}
              onClick={() => loadTape(item)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <p className="deck__note">{track.note}</p>
        <canvas ref={canvasRef} className="deck__viz" aria-hidden="true" />
        <div className="deck__transport">
          <button type="button" className="deck__play" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {playing ? <path d="M5 4h5v16H5zM14 4h5v16h-5z" /> : <path d="M6 3v18l15-9z" />}
            </svg>
          </button>
          <input
            type="range"
            aria-label="Seek"
            min={0}
            max={Number.isFinite(duration) ? duration : 0}
            step={0.1}
            value={time}
            style={{ "--fill": `${progress * 100}%` } as React.CSSProperties}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (audioRef.current) audioRef.current.currentTime = next;
              setTime(next);
            }}
          />
          <output>
            {formatTime(time)} / {formatTime(duration)}
          </output>
        </div>
      </div>
    </div>
  );
}

function Cassette({ track, spinning, progress }: { track: Track; spinning: boolean; progress: number }) {
  const left = Math.sqrt(1 - progress * 0.85) * 34;
  const right = Math.sqrt(0.15 + progress * 0.85) * 34;

  return (
    <svg className={`cassette ${spinning ? "is-spinning" : ""}`} viewBox="0 0 320 200" role="img" aria-label={`Cassette: ${track.title}`}>
      <rect x="2" y="2" width="316" height="196" rx="12" fill={track.color} stroke="#1a1430" strokeWidth="4" />
      <rect x="20" y="16" width="280" height="130" rx="6" fill="#f7f5fa" stroke="#1a1430" strokeWidth="3" />
      <path d="M32 54h256" stroke="#1a1430" strokeOpacity=".25" strokeWidth="2" />
      <text x="36" y="44" className="cassette__label">
        {track.label}
      </text>
      <rect x="64" y="72" width="192" height="60" rx="30" fill="#2c2440" stroke="#1a1430" strokeWidth="3" />
      <clipPath id="tape-window">
        <rect x="66" y="74" width="188" height="56" rx="28" />
      </clipPath>
      <g clipPath="url(#tape-window)">
        <circle cx="110" cy="102" r={left} fill="#5a4a6a" />
        <circle cx="210" cy="102" r={right} fill="#5a4a6a" />
      </g>
      {[110, 210].map((cx) => (
        <g key={cx} className="cassette__reel">
          <circle cx={cx} cy="102" r="17" fill="#f7f5fa" stroke="#1a1430" strokeWidth="3" />
          <path
            d={`M${cx} 90v8M${cx} 106v8M${cx - 12} 102h8M${cx + 4} 102h8`}
            stroke="#1a1430"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      ))}
      <path d="M72 198l14-38h148l14 38" fill="#1a1430" fillOpacity=".18" stroke="#1a1430" strokeWidth="3" />
    </svg>
  );
}

/** LED bars in the deck, and the bass that makes the Music heading jump. */
function useVisualizer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  analyserRef: React.RefObject<AnalyserNode | null>,
  playing: boolean,
  color: string,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const section = canvas.closest<HTMLElement>(".section");
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const samples = new Uint8Array(128);
    let frame = 0;

    const draw = () => {
      const scale = devicePixelRatio || 1;
      const width = Math.round(canvas.clientWidth * scale);
      const height = Math.round(canvas.clientHeight * scale);
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      const analyser = analyserRef.current;
      if (analyser && playing) analyser.getByteFrequencyData(samples);
      else samples.fill(0);

      context.clearRect(0, 0, width, height);
      const cell = Math.max(5, Math.round(height / 7));
      const gap = Math.max(1, Math.round(cell / 4));
      const columns = Math.floor(width / (cell + gap));
      const rows = Math.floor(height / (cell + gap));

      for (let col = 0; col < columns; col++) {
        const index = Math.floor(Math.pow(col / columns, 1.6) * samples.length * 0.8);
        const lit = Math.round((samples[index] / 255) * rows);
        for (let row = 0; row < rows; row++) {
          context.fillStyle = row < lit ? color : "rgba(255,255,255,.08)";
          context.fillRect(col * (cell + gap), height - (row + 1) * (cell + gap) + gap, cell, cell);
        }
      }

      if (section && !calm) section.style.setProperty("--beat", String(samples[2] / 255));
      if (playing) frame = requestAnimationFrame(draw);
    };

    draw();
    const redraw = new ResizeObserver(draw);
    redraw.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      redraw.disconnect();
      section?.style.setProperty("--beat", "0");
    };
  }, [canvasRef, analyserRef, playing, color]);
}
