"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Play, X, ArrowRight, ArrowLeft } from "@/components/icons";
import { ik } from "@/lib/content";

export type GalleryItem = {
  id: string;
  mediaUrl: string;
  caption: string | null;
  isVideo: boolean;
};

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") setIndex((v) => (v === null ? v : (v + 1) % items.length));
      if (e.key === "ArrowRight")
        setIndex((v) => (v === null ? v : (v + items.length - 1) % items.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, items.length, close]);

  const current = index !== null ? items[index] : null;

  return (
    <>
      <div className="galleryGrid">
        {items.map((g, i) => (
          <button
            key={g.id}
            type="button"
            className="galleryCard galleryBtn"
            onClick={() => setIndex(i)}
            aria-label={g.caption ?? "صورة"}
          >
            <Image src={ik(g.mediaUrl, 800)} alt={g.caption ?? ""} fill sizes="(max-width:760px) 100vw,33vw" />
            <div className="galleryShade" />
            {g.isVideo ? (
              <span className="play">
                <Play size={22} strokeWidth={2} fill="currentColor" />
              </span>
            ) : null}
            <b>{g.caption ?? ""}</b>
          </button>
        ))}
      </div>
      {current ? (
        <div className="lightbox" onClick={close} role="dialog" aria-label="عارض الصور">
          <figure onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ik(current.mediaUrl, 1600)} alt={current.caption ?? ""} />
            {current.caption ? <figcaption>{current.caption}</figcaption> : null}
          </figure>
          <button type="button" className="lbClose" onClick={close} aria-label="إغلاق">
            <X size={22} />
          </button>
          {items.length > 1 ? (
            <>
              <button
                type="button"
                className="lbPrev"
                aria-label="السابق"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((v) => (v === null ? v : (v + 1) % items.length));
                }}
              >
                <ArrowRight size={22} />
              </button>
              <button
                type="button"
                className="lbNext"
                aria-label="التالي"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((v) => (v === null ? v : (v + items.length - 1) % items.length));
                }}
              >
                <ArrowLeft size={22} />
              </button>
              <span className="lbCount">
                {(index ?? 0) + 1} / {items.length}
              </span>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
