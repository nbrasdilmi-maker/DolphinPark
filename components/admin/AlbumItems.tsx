"use client";

import { useCallback, useEffect, useState } from "react";

type Item = { id: string; mediaUrl: string; caption: string | null; isVideo: boolean };
type Media = { id: string; fileName: string; url: string };

export function AlbumItems({ albumId }: { albumId: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [pickOpen, setPickOpen] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/gallery-items?f_albumId=${encodeURIComponent(albumId)}&take=200`);
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.items ?? []);
  }, [albumId]);

  useEffect(() => {
    load();
  }, [albumId, load]);

  async function openPicker() {
    setPickOpen(true);
    const res = await fetch("/api/admin/media");
    if (!res.ok) return;
    const data = await res.json();
    setMedia(data.items ?? []);
  }

  async function add(mediaUrl: string) {
    setError("");
    const res = await fetch("/api/admin/gallery-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ albumId, mediaUrl, sortOrder: items.length }),
    });
    if (!res.ok) {
      setError("تعذر إضافة الصورة.");
      return;
    }
    setPickOpen(false);
    await load();
  }

  async function remove(id: string) {
    if (!window.confirm("هل أنت متأكد من حذف هذه الصورة من الألبوم؟")) return;
    await fetch(`/api/admin/gallery-items?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h2>صور الألبوم</h2>
      {error ? <p role="alert">{error}</p> : null}
      <span className="btnRow">
        <button type="button" onClick={openPicker}>
          إضافة صور من المكتبة
        </button>
      </span>
      <div className="mediaGrid">
        {items.map((it) => (
          <span key={it.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.mediaUrl} alt={it.caption ?? ""} width={120} height={80} />
            <button type="button" onClick={() => remove(it.id)}>
              حذف
            </button>
          </span>
        ))}
      </div>
      {pickOpen ? (
        <span className="modalOverlay" onClick={() => setPickOpen(false)}>
          <span className="modalBox" onClick={(e) => e.stopPropagation()}>
            <b>اختيار صور</b>
            <span className="mediaGrid">
              {media.map((m) => (
                <button key={m.id} type="button" onClick={() => add(m.url)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.fileName} width={120} height={80} />
                </button>
              ))}
              {media.length === 0 ? <span>المكتبة فارغة.</span> : null}
            </span>
            <button type="button" onClick={() => setPickOpen(false)}>
              إغلاق
            </button>
          </span>
        </span>
      ) : null}
    </div>
  );
}
