"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePicker } from "./EntityForm";
import { IconByKey, iconKeys } from "@/components/IconByKey";

type Album = { slug: string; name: string };
type Section = {
  id: string;
  key: string;
  eyebrow: string | null;
  title: string | null;
  text: string | null;
  sortOrder: number;
  visible: boolean;
  configJson: string | null;
};

function parse(json: string | null): Record<string, unknown> {
  if (!json) return {};
  try {
    const v: unknown = JSON.parse(json);
    return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

type Point = { title?: string; text?: string; iconKey?: string };

function getPoints(cfg: Record<string, unknown>): Point[] {
  const v = cfg.points;
  if (!Array.isArray(v)) return [];
  return v.filter(
    (p): p is Point => typeof p === "object" && p !== null
  );
}

function getStrArray(cfg: Record<string, unknown>, key: string): string[] {
  const v = cfg[key];
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

function PointsEditor({
  points,
  onChange,
}: {
  points: Point[];
  onChange: (v: Point[]) => void;
}) {
  return (
    <span className="listEditor">
      {points.map((p, i) => (
        <span key={i} className="pointRow">
          <input
            value={p.title ?? ""}
            placeholder="العنوان"
            onChange={(e) => {
              const next = [...points];
              next[i] = { ...p, title: e.target.value };
              onChange(next);
            }}
          />
          <input
            value={p.text ?? ""}
            placeholder="الوصف"
            onChange={(e) => {
              const next = [...points];
              next[i] = { ...p, text: e.target.value };
              onChange(next);
            }}
          />
          <span className="iconPick">
            <IconByKey name={p.iconKey} size={22} />
            <select
              value={p.iconKey ?? ""}
              onChange={(e) => {
                const next = [...points];
                next[i] = { ...p, iconKey: e.target.value };
                onChange(next);
              }}
            >
              <option value="">بدون</option>
              {iconKeys().map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </span>
          <button type="button" onClick={() => onChange(points.filter((_, j) => j !== i))}>
            حذف
          </button>
        </span>
      ))}
      <span>
        <button type="button" onClick={() => onChange([...points, { title: "", text: "", iconKey: "" }])}>
          إضافة نقطة
        </button>
      </span>
    </span>
  );
}

function OffersSelector({ ids, onChange }: { ids: string[]; onChange: (v: string[]) => void }) {
  const [offers, setOffers] = useState<Array<{ id: string; title: string }>>([]);
  useEffect(() => {
    fetch("/api/admin/offers?take=200")
      .then((r) => r.json())
      .then((d) => setOffers((d.items ?? []).map((o: { id: string; title: string }) => ({ id: o.id, title: o.title }))))
      .catch(() => setOffers([]));
  }, []);
  function toggle(id: string) {
    onChange(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  }
  return (
    <span className="listEditor">
      {offers.map((o) => (
        <label key={o.id}>
          <input type="checkbox" checked={ids.includes(o.id)} onChange={() => toggle(o.id)} />
          {o.title}
        </label>
      ))}
      {offers.length === 0 ? <span>لا توجد عروض. أضف عروضًا أولًا ثم اخترها هنا.</span> : null}
    </span>
  );
}

export function SectionForm({ section, albums }: { section: Section; albums: Album[] }) {
  const router = useRouter();
  const [eyebrow, setEyebrow] = useState(section.eyebrow ?? "");
  const [title, setTitle] = useState(section.title ?? "");
  const [text, setText] = useState(section.text ?? "");
  const [sortOrder, setSortOrder] = useState(String(section.sortOrder));
  const [visible, setVisible] = useState(section.visible);
  const [cfg, setCfg] = useState<Record<string, unknown>>(() => parse(section.configJson));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function setPath(path: string[], v: unknown) {
    setCfg((prev) => {
      const next: Record<string, unknown> = { ...prev };
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) {
        const k = path[i];
        cur[k] = typeof cur[k] === "object" && cur[k] !== null ? { ...(cur[k] as Record<string, unknown>) } : {};
        cur = cur[k] as Record<string, unknown>;
      }
      cur[path[path.length - 1]] = v;
      return next;
    });
  }

  function get(path: string[]): string {
    let cur: unknown = cfg;
    for (const k of path) {
      if (typeof cur !== "object" || cur === null) return "";
      cur = (cur as Record<string, unknown>)[k];
    }
    return str(cur);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/home-sections?id=${encodeURIComponent(section.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eyebrow: eyebrow || null,
          title: title || null,
          text: text || null,
          sortOrder: Number(sortOrder) || 0,
          visible,
          configJson: JSON.stringify(cfg),
        }),
      });
      if (!res.ok) throw new Error("save");
      router.push("/admin/homepage");
      router.refresh();
    } catch {
      setError("تعذر حفظ التغييرات. حاول مرة أخرى.");
      setBusy(false);
    }
  }

  const key = section.key;

  return (
    <form className="adminForm" onSubmit={submit}>
      <label>
        مفتاح القسم
        <b dir="ltr">{key}</b>
      </label>
      <label>
        السطر العلوي
        <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} />
      </label>
      <label>
        العنوان
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        الوصف
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label>
        الترتيب
        <input type="number" dir="ltr" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
      </label>
      <label>
        ظاهر
        <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
      </label>

      {key === "hero" ? (
        <>
          <label>
            صورة الواجهة الرئيسية
            <ImagePicker value={get(["bgImage"])} onPick={(v) => setPath(["bgImage"], v)} />
          </label>
          <label>
            نص الزر الرئيسي
            <input value={get(["primaryBtn", "label"])} onChange={(e) => setPath(["primaryBtn", "label"], e.target.value)} />
          </label>
          <label>
            رابط الزر الرئيسي
            <input dir="ltr" value={get(["primaryBtn", "href"])} onChange={(e) => setPath(["primaryBtn", "href"], e.target.value)} />
          </label>
          <label>
            نص الزر الثانوي
            <input value={get(["secondaryBtn", "label"])} onChange={(e) => setPath(["secondaryBtn", "label"], e.target.value)} />
          </label>
          <label>
            رابط الزر الثانوي
            <input dir="ltr" value={get(["secondaryBtn", "href"])} onChange={(e) => setPath(["secondaryBtn", "href"], e.target.value)} />
          </label>
        </>
      ) : null}

      {key === "about" ? (
        <>
          <label>
            صورة قسم التعريف
            <ImagePicker value={get(["image"])} onPick={(v) => setPath(["image"], v)} />
          </label>
          <label>
            فقرات التعريف (فقرة في كل سطر)
            <textarea
              rows={6}
              value={getStrArray(cfg, "paragraphs").join("\n")}
              onChange={(e) =>
                setPath(
                  ["paragraphs"],
                  e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                )
              }
            />
          </label>
          <label>
            نص الزر
            <input value={get(["button", "label"])} onChange={(e) => setPath(["button", "label"], e.target.value)} />
          </label>
          <label>
            رابط الزر
            <input dir="ltr" value={get(["button", "href"])} onChange={(e) => setPath(["button", "href"], e.target.value)} />
          </label>
        </>
      ) : null}

      {key === "rooms" || key === "services" ? (
        <label>
          عدد العناصر المعروضة
          <input
            type="number"
            dir="ltr"
            value={get(["count"]) || "3"}
            onChange={(e) => setPath(["count"], Number(e.target.value) || 3)}
          />
        </label>
      ) : null}

      {key === "gallery" ? (
        <>
          <label>
            الألبوم المعروض
            <select value={get(["albumSlug"]) || "main"} onChange={(e) => setPath(["albumSlug"], e.target.value)}>
              {albums.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            عدد الصور
            <input
              type="number"
              dir="ltr"
              value={get(["count"]) || "3"}
              onChange={(e) => setPath(["count"], Number(e.target.value) || 3)}
            />
          </label>
        </>
      ) : null}

      {key === "why" ? (
        <label>
          نقاط المميزات
          <PointsEditor points={getPoints(cfg)} onChange={(v) => setPath(["points"], v)} />
        </label>
      ) : null}

      {key === "offers" ? (
        <label>
          العروض الظاهرة (اتركها فارغة لعرض الكل)
          <OffersSelector ids={getStrArray(cfg, "ids")} onChange={(v) => setPath(["ids"], v)} />
        </label>
      ) : null}

      {key === "cta" ? (
        <>
          <label>
            نص الزر الرئيسي
            <input value={get(["primaryBtn", "label"])} onChange={(e) => setPath(["primaryBtn", "label"], e.target.value)} />
          </label>
          <label>
            رابط الزر الرئيسي
            <input dir="ltr" value={get(["primaryBtn", "href"])} onChange={(e) => setPath(["primaryBtn", "href"], e.target.value)} />
          </label>
          <label>
            نص الزر الثانوي
            <input value={get(["secondaryBtn", "label"])} onChange={(e) => setPath(["secondaryBtn", "label"], e.target.value)} />
          </label>
          <label>
            رابط الزر الثانوي
            <input dir="ltr" value={get(["secondaryBtn", "href"])} onChange={(e) => setPath(["secondaryBtn", "href"], e.target.value)} />
          </label>
        </>
      ) : null}

      {error ? <p role="alert">{error}</p> : null}
      <span className="btnRow">
        <button type="submit" disabled={busy}>
          {busy ? "جارٍ الحفظ…" : "حفظ"}
        </button>
      </span>
    </form>
  );
}
