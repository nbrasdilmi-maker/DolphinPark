import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";

const BASE = "https://dolphinbaypaark.example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/rooms", "/services", "/offers", "/gallery", "/about", "/contact", "/book"];
  const base: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: now,
  }));
  try {
    const db = await getDb();
    const rooms = await db.room.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    });
    return [
      ...base,
      ...rooms.map((r) => ({
        url: `${BASE}/rooms/${r.slug}`,
        lastModified: r.updatedAt,
      })),
    ];
  } catch {
    return base;
  }
}
