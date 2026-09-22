"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserForm({ id, initial }: { id: string; initial: Record<string, string> }) {
  const router = useRouter();
  const isNew = id === "new";
  const [username, setUsername] = useState(initial.username ?? "");
  const [name, setName] = useState(initial.name ?? "");
  const [role, setRole] = useState(initial.role ?? "editor");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body: Record<string, string> = { name, role };
      if (isNew) {
        body.username = username;
        body.password = password;
      } else if (password) {
        body.password = password;
      }
      const res = await fetch(isNew ? "/api/admin/users" : `/api/admin/users?id=${encodeURIComponent(id)}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === "exists"
            ? "اسم المستخدم موجود مسبقًا."
            : "تعذر الحفظ. تأكد من إكمال الحقول وكلمة مرور 8 أحرف على الأقل."
        );
        setBusy(false);
        return;
      }
      router.push("/admin/users");
      router.refresh();
    } catch {
      setError("تعذر حفظ التغييرات. حاول مرة أخرى.");
      setBusy(false);
    }
  }

  return (
    <form className="adminForm" onSubmit={submit}>
      <label>
        اسم المستخدم
        <input dir="ltr" value={username} onChange={(e) => setUsername(e.target.value)} disabled={!isNew} required={isNew} />
      </label>
      <label>
        الاسم
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        الدور
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="editor">محرر</option>
          <option value="admin">مدير</option>
          <option value="superadmin">مدير عام</option>
        </select>
      </label>
      <label>
        {isNew ? "كلمة المرور" : "كلمة مرور جديدة (اتركها فارغة للإبقاء)"}
        <input
          type="password"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={isNew}
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      {error ? <p role="alert">{error}</p> : null}
      <span className="btnRow">
        <button type="submit" disabled={busy}>
          {busy ? "جارٍ الحفظ…" : "حفظ"}
        </button>
      </span>
    </form>
  );
}
