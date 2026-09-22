"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export function TripleClickLogin({
  enabled,
  children,
}: {
  enabled?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const count = useRef(0);
  const timer = useRef<number | null>(null);

  function click() {
    if (!enabled) return;
    count.current += 1;
    if (timer.current) window.clearTimeout(timer.current);
    if (count.current >= 3) {
      count.current = 0;
      router.push("/admin/login");
      return;
    }
    timer.current = window.setTimeout(() => {
      count.current = 0;
    }, 1500);
  }

  return <span onClick={click}>{children}</span>;
}
