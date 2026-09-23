"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "@/components/icons";

export function AdminShortcutButton({ show }: { show: boolean }) {
  const pathname = usePathname();
  if (!show || pathname.startsWith("/admin")) return null;
  return (
    <Link className="adminShortcut" href="/admin" aria-label="العودة إلى لوحة التحكم">
      <LayoutDashboard size={20} strokeWidth={1.8} />
      <span>لوحة التحكم</span>
    </Link>
  );
}
