"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  fileName: string;
  url: string;
  mimeType: string | null;
  size: number | null;
  folder: string | null;
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/media");
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    try {
      for (const f of Array.from(files)) {
        const form = new FormData();
        form.append("file", f);
        const res = await fetch("/api/admin/media", { method: "POST", body: form });
        if (!res.ok) throw new Error("upload");
      }
      await load();
    } catch {
      setError("تعذر رفع الصورة. حاول مرة أخرى.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`هل أنت متأكد من حذف «${name}»؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    const res = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setError("تعذر حذف الصورة. حاول مرة أخرى.");
      return;
    }
    await load();
  }

  return (
    <div>
      <h1>مكتبة الوسائط</h1>
      <label>
        رفع صور
        <input type="file" accept="image/*,video/*" multiple onChange={upload} disabled={busy} />
      </label>
      {busy ? <p>جارٍ الرفع…</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      <div className="adminStats">
        {items.map((it) => (
          <div key={it.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.url} alt={it.fileName} width={140} height={100} />
            <span>{it.fileName}</span>
            <button type="button" onClick={() => remove(it.id, it.fileName)}>
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
