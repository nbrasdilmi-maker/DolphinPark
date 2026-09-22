import "server-only";
import { getDb } from "./db";
import { siteConfig } from "./site";

const HEADER_FALLBACK: Array<[string, string]> = [
  ["الرئيسية", "/"],
  ["الغرف", "/rooms"],
  ["الخدمات", "/services"],
  ["المعرض", "/gallery"],
  ["العروض", "/offers"],
  ["عن المنتزه", "/about"],
  ["تواصل معنا", "/contact"],
];

const FOOTER_FALLBACK: Array<[string, string]> = [
  ["عن المنتزه", "/about"],
  ["الغرف", "/rooms"],
  ["الخدمات", "/services"],
  ["المعرض", "/gallery"],
  ["تواصل معنا", "/contact"],
];

export async function getNav(location: "header" | "footer"): Promise<Array<[string, string]>> {
  try {
    const db = await getDb();
    const items = await db.navItem.findMany({
      where: { location, visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (items.length > 0) return items.map((i) => [i.label, i.href] as [string, string]);
    return location === "header" ? HEADER_FALLBACK : FOOTER_FALLBACK;
  } catch {
    return location === "header" ? HEADER_FALLBACK : FOOTER_FALLBACK;
  }
}

const FALLBACKS: Record<string, string> = {
  "site.name": siteConfig.name,
  "site.shortName": siteConfig.shortName,
  "site.tagline": siteConfig.tagline,
  "map.embedUrl": "https://www.google.com/maps?q=14.7847149,42.9450447&z=17&output=embed",
  "map.linkUrl": "https://maps.app.goo.gl/mWtCVQqsBcDbdkx69",
  "map.address": siteConfig.map.address,
  "map.hours": siteConfig.map.hours,
  "contact.phone": siteConfig.contact.phone,
  "contact.email": siteConfig.contact.email,
  "social.whatsapp": siteConfig.social.whatsapp,
  "social.instagram": siteConfig.social.instagram,
  "social.facebook": siteConfig.social.facebook,
  "social.youtube": siteConfig.social.youtube,
  "social.tiktok": siteConfig.social.tiktok,
};

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const db = await getDb();
    const rows = await db.siteSetting.findMany();
    const out = { ...FALLBACKS };
    for (const r of rows) {
      if (r.value) out[r.key] = r.value;
    }
    return out;
  } catch {
    return { ...FALLBACKS };
  }
}
