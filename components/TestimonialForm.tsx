"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Check } from "@/components/icons";

export function TestimonialForm() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState("5");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text, rating: Number(rating) }),
      });
      if (!res.ok) throw new Error("send");
      setSent(true);
    } catch {
      setError("تعذر إرسال رأيك. حاول مرة أخرى.");
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="bookOk">
        <Check size={20} strokeWidth={2} />
        <p>شكرًا لك! سيظهر رأيك بعد مراجعة الإدارة.</p>
      </div>
    );
  }

  return (
    <form className="form testiForm" onSubmit={submit}>
      <h3>شاركنا تجربتك</h3>
      <div className="formRow">
        <label>
          الاسم
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" />
        </label>
        <label>
          التقييم
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">5 نجوم</option>
            <option value="4">4 نجوم</option>
            <option value="3">3 نجوم</option>
            <option value="2">نجمتان</option>
            <option value="1">نجمة</option>
          </select>
        </label>
      </div>
      <label>
        رأيك
        <textarea required rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="حدثنا عن زيارتك…" />
      </label>
      {error ? <p role="alert">{error}</p> : null}
      <Button variant="primary" type="submit" disabled={busy}>
        إرسال الرأي <ArrowLeft size={16} strokeWidth={2} />
      </Button>
    </form>
  );
}
