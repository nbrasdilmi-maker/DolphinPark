"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BedDouble, Camera, Ticket, Phone } from "@/components/icons";

const items = [
  { label: "الرئيسية", href: "/", icon: <Home size={22} strokeWidth={1.8} /> },
  { label: "الغرف", href: "/rooms", icon: <BedDouble size={22} strokeWidth={1.8} /> },
  { label: "المعرض", href: "/gallery", icon: <Camera size={22} strokeWidth={1.8} /> },
  { label: "العروض", href: "/offers", icon: <Ticket size={22} strokeWidth={1.8} /> },
  { label: "تواصل", href: "/contact", icon: <Phone size={22} strokeWidth={1.8} /> },
];

export function MobileBottomBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <nav className="mobileBottomBar" aria-label="التنقل السريع">
      {items.map((it) => (
        <Link key={it.href} href={it.href} className={pathname === it.href ? "active" : ""}>
          {it.icon}
          <small>{it.label}</small>
        </Link>
      ))}
    </nav>
  );
}
