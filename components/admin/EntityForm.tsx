"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconByKey, iconKeys } from "@/components/IconByKey";

export type FieldDef = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "select"
    | "image"
    | "imagelist"
    | "list"
    | "checkbox"
    | "datetime"
    | "icon"
    | "static";
  options?: Array<[string, string]>;
  required?: boolean;
  dir?: "ltr" | "rtl";
  rows?: number;
};

type MediaItem = { id: string; fileName: string; url: string };

export function ImagePicker({ value, onPick }: { value: string; onPick: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  useEffect(() => {
    if (!open) return;
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));
  }, [open]);
  return (
    <span className="imgPick">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" width={120} height={80} />
      ) : null}
      <input value={value} onChange={(e) => onPick(e.target.value)} dir="ltr" placeholder="رابط الصورة" />
      <button type="button" onClick={() => setOpen(true)}>
        اختيار من المكتبة
      </button>
      {open ? (
        <span className="modalOverlay" onClick={() => setOpen(false)}>
          <span className="modalBox" onClick={(e) => e.stopPropagation()}>
            <b>اختيار صورة</b>
            <span className="mediaGrid">
              {items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    onPick(it.url);
                    setOpen(false);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.url} alt={it.fileName} width={120} height={80} />
                </button>
              ))}
              {items.length === 0 ? <span>المكتبة فارغة. ارفع صورًا من صفحة الوسائط.</span> : null}
            </span>
            <button type="button" onClick={() => setOpen(false)}>
              إغلاق
            </button>
          </span>
        </span>
      ) : null}
    </span>
  );
}

function ListEditor({ value, onChange, image }: { value: string[]; onChange: (v: string[]) => void; image?: boolean }) {
  const [draft, setDraft] = useState("");
  return (
    <span className="listEditor">
      {value.map((v, i) => (
        <span key={i}>
          {image && v ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={v} alt="" width={80} height={54} />
          ) : null}
          <input value={v} onChange={(e) => {
            const next = [...value];
            next[i] = e.target.value;
            onChange(next);
          }} />
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}>
            حذف
          </button>
        </span>
      ))}
      <span>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="عنصر جديد" />
        <button
          type="button"
          onClick={() => {
            if (!draft.trim()) return;
            onChange([...value, draft.trim()]);
            setDraft("");
          }}
        >
          إضافة
        </button>
      </span>
    </span>
  );
}

export function EntityForm({
  fields,
  initial,
  base,
  api,
  id,
}: {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  base: string;
  api: string;
  id: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set(name: string, v: unknown) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body: Record<string, unknown> = {};
      for (const f of fields) {
        if (f.type === "static") continue;
        const v = values[f.name];
        if (f.type === "number") {
          body[f.name] = v === "" || v === null || v === undefined ? null : Number(v);
        } else if (f.type === "checkbox") {
          body[f.name] = Boolean(v);
        } else if (f.type === "datetime") {
          body[f.name] = v ? new Date(String(v)).toISOString() : null;
        } else if (f.type === "list" || f.type === "imagelist") {
          body[f.name] = JSON.stringify(Array.isArray(v) ? v : []);
        } else if (typeof v === "string") {
          body[f.name] = v === "" ? null : v;
        } else {
          body[f.name] = v ?? null;
        }
      }
      const isNew = id === "new";
      const res = await fetch(isNew ? api : `${api}?id=${encodeURIComponent(id)}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("save");
      router.push(base);
      router.refresh();
    } catch {
      setError("تعذر حفظ التغييرات. حاول مرة أخرى.");
      setBusy(false);
    }
  }

  return (
    <form className="adminForm" onSubmit={submit}>
      {fields.map((f) => (
        <label key={f.name}>
          {f.label}
          {f.type === "static" ? (
            <b dir="ltr">{String(values[f.name] ?? "")}</b>
          ) : f.type === "textarea" ? (
            <textarea
              rows={f.rows ?? 4}
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
              required={f.required}
            />
          ) : f.type === "number" ? (
            <input
              type="number"
              dir="ltr"
              value={values[f.name] === null || values[f.name] === undefined ? "" : String(values[f.name])}
              onChange={(e) => set(f.name, e.target.value)}
            />
          ) : f.type === "select" ? (
            <select value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)}>
              {(f.options ?? []).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          ) : f.type === "checkbox" ? (
            <input type="checkbox" checked={Boolean(values[f.name])} onChange={(e) => set(f.name, e.target.checked)} />
          ) : f.type === "datetime" ? (
            <input
              type="datetime-local"
              dir="ltr"
              value={values[f.name] ? String(values[f.name]).slice(0, 16) : ""}
              onChange={(e) => set(f.name, e.target.value)}
            />
          ) : f.type === "icon" ? (
            <span className="iconPick">
              <IconByKey name={typeof values[f.name] === "string" ? (values[f.name] as string) : null} size={26} />
              <select value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)}>
                <option value="">بدون</option>
                {iconKeys().map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </span>
          ) : f.type === "image" ? (
            <ImagePicker value={String(values[f.name] ?? "")} onPick={(v) => set(f.name, v)} />
          ) : f.type === "list" || f.type === "imagelist" ? (
            <ListEditor
              value={Array.isArray(values[f.name]) ? (values[f.name] as string[]) : []}
              onChange={(v) => set(f.name, v)}
              image={f.type === "imagelist"}
            />
          ) : (
            <input
              dir={f.dir}
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
              required={f.required}
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
