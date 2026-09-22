import "server-only";
import type { Metadata } from "next";
import { getDb } from "./db";

export type PageCopy = {
  heroTitle: string;
  heroText: string;
};

export async function getSeo(
  slug: string,
  fallbackTitle: string,
  fallbackDescription: string
): Promise<Metadata> {
  try {
    const db = await getDb();
    const row = await db.seoPage.findUnique({ where: { pageSlug: slug } });
    if (!row) return { title: fallbackTitle, description: fallbackDescription };
    return {
      title: row.metaTitle || fallbackTitle,
      description: row.metaDescription || fallbackDescription,
      keywords: row.keywords || undefined,
      alternates: row.canonical ? { canonical: row.canonical } : undefined,
      robots: row.noIndex ? { index: false, follow: false } : undefined,
      openGraph: row.ogImageUrl
        ? { images: [{ url: row.ogImageUrl }] }
        : undefined,
    };
  } catch {
    return { title: fallbackTitle, description: fallbackDescription };
  }
}

export async function getPageCopy(
  slug: string,
  fallbackTitle: string,
  fallbackText: string
): Promise<PageCopy> {
  try {
    const db = await getDb();
    const p = await db.page.findUnique({ where: { slug } });
    if (!p) return { heroTitle: fallbackTitle, heroText: fallbackText };
    return {
      heroTitle: p.title || fallbackTitle,
      heroText: p.description || fallbackText,
    };
  } catch {
    return { heroTitle: fallbackTitle, heroText: fallbackText };
  }
}
