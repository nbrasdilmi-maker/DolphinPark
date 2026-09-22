"use client";

import { useEffect } from "react";

const SELECTOR =
  ".feature,.card,.roomCard,.offerCard,.serviceCard,.galleryCard,.reasonCard,.reasonGrid article";

export function CardGlow() {
  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!hover.matches || reduced.matches) return;

    const resolve = (target: EventTarget | null) =>
      target instanceof Element ? (target.closest(SELECTOR) as HTMLElement | null) : null;

    const onMove = (event: PointerEvent) => {
      const el = resolve(event.target);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mouse-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--mouse-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    };

    const onOut = (event: PointerEvent) => {
      const el = resolve(event.target);
      if (!el) return;
      const next = event.relatedTarget;
      if (next instanceof Node && el.contains(next)) return;
      el.style.setProperty("--mouse-x", "50%");
      el.style.setProperty("--mouse-y", "50%");
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return null;
}