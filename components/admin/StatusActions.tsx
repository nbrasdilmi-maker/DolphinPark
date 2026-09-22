"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StatusActions({
  api,
  id,
  current,
  options,
}: {
  api: string;
  id: string;
  current: string;
  options: Array<[string, string]>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function set(status: string) {
    setBusy(true);
    try {
      await fetch(`${api}?id=${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    setBusy(true);
    try {
      await fetch(`${api}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="rowActions">
      {options
        .filter(([v]) => v !== current)
        .map(([v, l]) => (
          <button key={v} type="button" disabled={busy} onClick={() => set(v)}>
            {l}
          </button>
        ))}
      <button type="button" className="danger" disabled={busy} onClick={remove}>
        حذف
      </button>
    </span>
  );
}
