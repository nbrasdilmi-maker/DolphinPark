"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowLeft } from "@/components/icons";

export type SideLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export function MobileSidebar({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: SideLink[];
}) {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`sideWrap${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="sideOverlay" onClick={onClose} />
      <aside className="sideDrawer" role="dialog" aria-label="قائمة التنقل">
        <div className="sideHead">
          <span>
            <b>منتزه خليج الدولفين</b>
            <small>الحُديدة</small>
          </span>
          <button type="button" onClick={onClose} aria-label="إغلاق القائمة">
            <X size={22} />
          </button>
        </div>
        <nav>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "active" : ""}
              onClick={onClose}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </nav>
        <Link className="btn primary" href="/book" onClick={onClose}>
          احجز الآن <ArrowLeft size={16} strokeWidth={2} />
        </Link>
      </aside>
    </div>
  );
}
