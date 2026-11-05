import { useEffect, useRef } from "react";

/** Lets a sticker be peeled off and moved with a mouse. Touch screens are left
    alone so swiping across a sticker still scrolls the page. */
export function useDrag<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let held = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let x = 0;
    let y = 0;

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      held = true;
      moved = false;
      startX = e.clientX - x;
      startY = e.clientY - y;
    };
    const move = (e: PointerEvent) => {
      if (!held) return;
      const nextX = e.clientX - startX;
      const nextY = e.clientY - startY;
      if (!moved && Math.hypot(nextX - x, nextY - y) < 4) return;
      moved = true;
      x = nextX;
      y = nextY;
      el.classList.add("is-held");
      el.style.translate = `${x}px ${y}px`;
    };
    const up = () => {
      held = false;
      el.classList.remove("is-held");
    };
    const click = (e: MouseEvent) => {
      if (moved) e.preventDefault();
    };
    const dragStart = (e: Event) => e.preventDefault();

    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    el.addEventListener("click", click);
    el.addEventListener("dragstart", dragStart);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("click", click);
      el.removeEventListener("dragstart", dragStart);
    };
  }, []);

  return ref;
}
