"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type SettingField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
  dir?: "ltr" | "rtl";
};

export function SettingsForm({ fields, back }: { fields: SettingField[]; back: string }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        setValues(d.settings ?? {});
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body: Record<string, string> = {};
      for (const f of fields) body[f.key] = values[f.key] ?? "";
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("save");
      router.push(back);
      router.refresh();
    } catch {
      setError("تعذر حفظ التغييرات. حاول مرة أخرى.");
      setBusy(false);
    }
  }

  if (!loaded) return <p>جارٍ التحميل…</p>;

  return (
    <form className="adminForm" onSubmit={submit}>
      {fields.map((f) => (
        <label key={f.key}>
          {f.label}
          {f.type === "textarea" ? (
            <textarea
              rows={4}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
            />
          ) : (
            <input
              dir={f.dir}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
            />
          )}
        </label>
      ))}
      {error ? <p role="alert">{error}</p> : null}
      <span className="btnRow">
        <button type="submit" disabled={busy}>
          {busy ? "جارٍ الحفظ…" : "حفظ"}
        </button>
      </span>
    </form>
  );
}
