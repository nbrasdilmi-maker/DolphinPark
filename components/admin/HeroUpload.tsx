"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroUpload() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    try {
      for (const f of Array.from(files)) {
        const form = new FormData();
        form.append("file", f);
        form.append("caption", caption);
        form.append("link", link);
        const res = await fetch("/api/admin/hero-slides", { method: "POST", body: form });
        if (!res.ok) throw new Error("upload");
      }
      setCaption("");
      setLink("");
      router.refresh();
    } catch {
      setError("تعذر رفع الصورة. تأكد أنها صورة وأقل من 25MB.");
      setBusy(false);
    } finally {
      e.target.value = "";
      setBusy(false);
    }
  }

  return (
    <div className="adminForm">
      <label>
        التسمية (اختياري)
        <input value={caption} onChange={(e) => setCaption(e.target.value)} />
      </label>
      <label>
        الرابط عند النقر (اختياري)
        <input dir="ltr" value={link} onChange={(e) => setLink(e.target.value)} placeholder="/offers" />
      </label>
      <label>
        رفع صور الواجهة
        <input type="file" accept="image/*" multiple onChange={upload} disabled={busy} />
      </label>
      {busy ? <p>جارٍ الرفع إلى السحابة…</p> : null}
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
