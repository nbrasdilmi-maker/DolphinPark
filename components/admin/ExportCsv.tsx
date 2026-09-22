"use client";

import { useState } from "react";

export function ExportCsv({
  api,
  filename,
  columns,
}: {
  api: string;
  filename: string;
  columns: Array<{ key: string; label: string }>;
}) {
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const res = await fetch(`${api}?take=500`);
      if (!res.ok) return;
      const data = await res.json();
      const items: Record<string, unknown>[] = data.items ?? [];
      const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const lines = [
        columns.map((c) => esc(c.label)).join(","),
        ...items.map((row) => columns.map((c) => esc(row[c.key])).join(",")),
      ];
      const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className="btnLink" disabled={busy} onClick={run}>
      {busy ? "جارٍ التصدير…" : "تصدير CSV"}
    </button>
  );
}
