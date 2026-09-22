"use client";

import { usePathname } from "next/navigation";
import { WhatsApp } from "@/components/icons";

export function WhatsAppFloat({ href }: { href: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || !href) return null;
  return (
    <a className="waFloat" href={href} target="_blank" rel="noreferrer" aria-label="تواصل واتساب">
      <WhatsApp size={28} />
    </a>
  );
}
