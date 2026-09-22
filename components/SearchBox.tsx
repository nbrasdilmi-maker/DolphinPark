"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBox({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [value, setValue] = useState(sp.get("q") ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams(sp.toString());
    if (value.trim()) {
      p.set("q", value.trim());
    } else {
      p.delete("q");
    }
    router.push(`${pathname}?${p.toString()}`);
  }

  return (
    <form className="searchBox" onSubmit={submit} role="search">
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
      <button type="submit">بحث</button>
    </form>
  );
}
