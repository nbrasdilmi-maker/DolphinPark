"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RowActions({
  base,
  api,
  id,
  status,
}: {
  base: string;
  api: string;
  id: string;
  status?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (status === undefined) return;
    setBusy(true);
    try {
      await fetch(`${api}?id=${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status === "published" ? "hidden" : "published" }),
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
      <Link href={`${base}/${id}`}>تعديل</Link>
      {status !== undefined ? (
        <button type="button" disabled={busy} onClick={toggle}>
          {status === "published" ? "إخفاء" : "نشر"}
        </button>
      ) : null}
      <button type="button" className="danger" disabled={busy} onClick={remove}>
        حذف
      </button>
    </span>
  );
}

export function BooleanToggle({
  api,
  id,
  field,
  value,
  onLabel,
  offLabel,
}: {
  api: string;
  id: string;
  field: string;
  value: boolean;
  onLabel: string;
  offLabel: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function flip() {
    setBusy(true);
    try {
      await fetch(`${api}?id=${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !value }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }
  return (
    <button type="button" className="btnLink" disabled={busy} onClick={flip}>
      {value ? onLabel : offLabel}
    </button>
  );
}
