"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ik } from "@/lib/content";

export type HeroSlideItem = {
  mediaUrl: string;
  caption?: string | null;
  link?: string | null;
};

export function HeroSlideshow({ slides }: { slides: HeroSlideItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIndex((v) => (v + 1) % slides.length), 5000);
    return () => window.clearInterval(t);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="heroSlides"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) < 40 || slides.length < 2) return;
        setIndex((v) => (v + (dx < 0 ? 1 : slides.length - 1)) % slides.length);
      }}
    >
      {slides.map((s, i) => (
        <Image
          key={`${s.mediaUrl}-${i}`}
          src={ik(s.mediaUrl, 1920)}
          alt={s.caption ?? "إطلالة بحرية"}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`heroImg${i === index ? " on" : ""}`}
        />
      ))}
      {slides.length > 1 ? (
        <div className="dots heroDots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`صورة ${i + 1}`}
              className={i === index ? "on" : ""}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
