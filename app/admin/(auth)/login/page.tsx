"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError(res.status === 429 ? "محاولات كثيرة. حاول بعد 10 دقائق." : "بيانات الدخول غير صحيحة.");
        setBusy(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("تعذر الاتصال. حاول مرة أخرى.");
      setBusy(false);
    }
  }

  return (
    <div className="adminLogin" dir="rtl">
      <form onSubmit={submit}>
        <Image
          className="loginLogo"
          src="/logo.png"
          alt="شعار منتزه خليج الدولفين"
          width={140}
          height={93}
        />
        <h1>لوحة إدارة المنتزه</h1>
        <p className="loginSub">مرحبًا بعودتك — سجّل الدخول لإدارة محتوى الموقع.</p>
        <label>
          اسم المستخدم
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            dir="ltr"
          />
        </label>
        <label>
          كلمة المرور
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            dir="ltr"
          />
        </label>
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit" disabled={busy}>
          {busy ? "جارٍ الدخول…" : "دخول"}
        </button>
      </form>
    </div>
  );
}
