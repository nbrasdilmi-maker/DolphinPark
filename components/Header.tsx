"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileSidebar } from "@/components/MobileSidebar";
import {
  Home,
  BedDouble,
  Sparkles,
  Camera,
  Ticket,
  Heart,
  Phone,
} from "@/components/icons";

const defaultLinks: [string, string][] = [
  ["الرئيسية", "/"],
  ["الغرف", "/rooms"],
  ["الخدمات", "/services"],
  ["المعرض", "/gallery"],
  ["العروض", "/offers"],
  ["عن المنتزه", "/about"],
  ["تواصل معنا", "/contact"],
];

function iconFor(href: string): React.ReactNode {
  if (href === "/") return <Home size={20} strokeWidth={1.8} />;
  if (href === "/rooms") return <BedDouble size={20} strokeWidth={1.8} />;
  if (href === "/services") return <Sparkles size={20} strokeWidth={1.8} />;
  if (href === "/gallery") return <Camera size={20} strokeWidth={1.8} />;
  if (href === "/offers") return <Ticket size={20} strokeWidth={1.8} />;
  if (href === "/about") return <Heart size={20} strokeWidth={1.8} />;
  if (href === "/contact") return <Phone size={20} strokeWidth={1.8} />;
  return <Sparkles size={20} strokeWidth={1.8} />;
}

export function Header({ links: propLinks }: { links?: [string, string][] }) {
  const links = propLinks ?? defaultLinks;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={`header ${open ? "open" : ""} ${scrolled ? "scrolled" : ""}`}>
      <div className="nav container">
        <Link className="brand" href="/">
          <Image
            src="/logo.png"
            alt="منتزه خليج الدولفين"
            width={120}
            height={80}
          />
          <span>
            <b>منتزه خليج الدولفين</b>
            <small>الحُديدة</small>
          </span>
        </Link>
        <nav className="desktop">
          {links.map(([t, h]) => (
            <Link key={h} href={h} className={pathname === h ? "active" : ""}>
              {t}
            </Link>
          ))}
        </nav>
        <Link className="navCta" href="/book">
          احجز الآن
        </Link>
        <button
          className="hamb"
          onClick={() => setOpen(!open)}
          aria-label="القائمة"
          aria-expanded={open}
        >
          <i />
          <i />
          <i />
        </button>
      </div>
      <MobileSidebar
        open={open}
        onClose={closeMenu}
        links={links.map(([t, h]) => ({ label: t, href: h, icon: iconFor(h) }))}
      />
    </header>
  );
}