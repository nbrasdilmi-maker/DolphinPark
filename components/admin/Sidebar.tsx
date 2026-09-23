"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  Sparkles,
  FerrisWheel,
  Ticket,
  Camera,
  Image as ImageIcon,
  Home,
  FileText,
  Navigation,
  Phone,
  Settings,
  Globe,
  CalendarCheck,
  MessageSquare,
  Users,
  Clock,
  LogOut,
  X,
  Star,
} from "@/components/icons";

type Item = { label: string; href: string; icon: React.ReactNode };
type Group = { title: string; items: Item[] };

const groups: Group[] = [
  {
    title: "الإدارة",
    items: [
      { label: "القيادة", href: "/admin", icon: <LayoutDashboard size={20} strokeWidth={1.8} /> },
      { label: "الغرف", href: "/admin/rooms", icon: <BedDouble size={20} strokeWidth={1.8} /> },
      { label: "الخدمات", href: "/admin/services", icon: <Sparkles size={20} strokeWidth={1.8} /> },
      { label: "المرافق", href: "/admin/facilities", icon: <FerrisWheel size={20} strokeWidth={1.8} /> },
      { label: "العروض", href: "/admin/offers", icon: <Ticket size={20} strokeWidth={1.8} /> },
      { label: "المعرض", href: "/admin/gallery", icon: <Camera size={20} strokeWidth={1.8} /> },
      { label: "الوسائط", href: "/admin/media", icon: <ImageIcon size={20} strokeWidth={1.8} /> },
    ],
  },
  {
    title: "الموقع",
    items: [
      { label: "الرئيسية", href: "/admin/homepage", icon: <Home size={20} strokeWidth={1.8} /> },
      { label: "صور الواجهة", href: "/admin/hero", icon: <ImageIcon size={20} strokeWidth={1.8} /> },
      { label: "الصفحات", href: "/admin/pages", icon: <FileText size={20} strokeWidth={1.8} /> },
      { label: "التنقل", href: "/admin/navigation", icon: <Navigation size={20} strokeWidth={1.8} /> },
      { label: "التواصل", href: "/admin/contact", icon: <Phone size={20} strokeWidth={1.8} /> },
      { label: "الآراء", href: "/admin/testimonials", icon: <Star size={20} strokeWidth={1.8} /> },
    ],
  },
  {
    title: "النظام",
    items: [
      { label: "الإعدادات", href: "/admin/settings", icon: <Settings size={20} strokeWidth={1.8} /> },
      { label: "SEO", href: "/admin/seo", icon: <Globe size={20} strokeWidth={1.8} /> },
      { label: "الحجوزات", href: "/admin/bookings", icon: <CalendarCheck size={20} strokeWidth={1.8} /> },
      { label: "الرسائل", href: "/admin/messages", icon: <MessageSquare size={20} strokeWidth={1.8} /> },
      { label: "المستخدمون", href: "/admin/users", icon: <Users size={20} strokeWidth={1.8} /> },
      { label: "النشاط", href: "/admin/activity", icon: <Clock size={20} strokeWidth={1.8} /> },
    ],
  },
];

export function Sidebar({
  username,
  role,
  open,
  onClose,
}: {
  username: string;
  role: string;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function active(href: string): boolean {
    return pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <div
        className={`adminOverlay${open ? " open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`adminSidebar${open ? " open" : ""}`} aria-label="القائمة الجانبية">
        <div className="adminSideHead">
          <span className="adminLogo">D</span>
          <b>DolphinPark</b>
          <button type="button" className="adminSideClose" onClick={onClose} aria-label="إغلاق القائمة">
            <X size={20} />
          </button>
        </div>
        <div className="adminSideUser">
          <i />
          <span>
            <b>{username}</b>
            <small>{role === "superadmin" ? "المدير" : role === "admin" ? "مدير" : "محرر"}</small>
          </span>
        </div>
        <Link className="adminViewSite" href="/" onClick={onClose}>
          <Globe size={18} strokeWidth={1.8} />
          عرض الموقع
        </Link>
        <nav>
          {groups.map((g) => (
            <div key={g.title}>
              <small>{g.title}</small>
              {g.items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className={active(it.href) ? "active" : ""}
                  onClick={onClose}
                >
                  {it.icon}
                  {it.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <button type="button" className="adminLogout" onClick={logout}>
          <LogOut size={18} />
          خروج
        </button>
      </aside>
    </>
  );
}
