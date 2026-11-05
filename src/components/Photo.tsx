import { useRef, useState } from "react";
import type { Shot } from "../types/portfolio";

const smallVersion = (src: string) => src.replace(".1920x1080.", ".600x338.");

export function shotImageProps(shot: Shot) {
  return {
    src: shot.src,
    srcSet: `${smallVersion(shot.src)} 600w, ${shot.src} 1920w`,
    alt: shot.alt,
    decoding: "async" as const,
  };
}

/** A small thumbnail. Clicking it opens the screenshot at full size. */
export function Thumb({ shot }: { shot: Shot }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);

  return (
    <>
      <button
        type="button"
        className="thumb"
        aria-label={`Enlarge: ${shot.alt}`}
        onClick={() => {
          setOpened(true);
          dialogRef.current?.showModal();
        }}
      >
        <img src={smallVersion(shot.src)} alt="" loading="lazy" />
      </button>
      <dialog
        ref={dialogRef}
        className="lightbox"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        {opened ? <img src={shot.src} alt={shot.alt} /> : null}
        <div className="lightbox__bar">
          <p>{shot.caption}</p>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </dialog>
    </>
  );
}
