import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { GalleryGrid } from "@/components/GalleryGrid";
import { BookingCTA } from "@/components/BookingCTA";
import { Waves } from "@/components/Waves";
import { RealtimeRefresh } from "@/components/RealtimeRefresh";
import { getDb } from "@/lib/db";
import { getPageCopy, getSeo } from "@/lib/page-content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getSeo(
    "gallery",
    "معرض الصور والفيديو",
    "صور وفيديوهات من منتزه خليج الدولفين في الحديدة: البحر، الغرف، الأنشطة، وأجواء العائلات."
  );
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ album?: string }>;
}) {
  const sp = await searchParams;
  const db = await getDb();
  const [albums, items, copy] = await Promise.all([
    db.galleryAlbum.findMany({
      where: { status: "published" },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, name: true },
    }),
    db.galleryItem.findMany({
      where: {
        album: {
          status: "published",
          ...(sp.album ? { slug: sp.album } : {}),
        },
      },
      orderBy: [{ album: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    }),
    getPageCopy(
      "gallery",
      "شاهد المنتزه قبل زيارتك",
      "صور من البحر والغرف والأنشطة وأجواء العائلات، لتتعرف على ما ينتظرك في خليج الدولفين."
    ),
  ]);
  return (
    <main>
      <RealtimeRefresh tables={["GalleryItem", "GalleryAlbum"]} />
      <SiteHeader />
      <PageHero
        eyebrow="معرض الصور والفيديو"
        title={copy.heroTitle}
        text={copy.heroText}
      />
      <section className="section">
        <div className="container">
          {albums.length > 1 ? (
            <div className="chipRow">
              <Link href="/gallery" className={!sp.album ? "active" : ""}>
                الكل
              </Link>
              {albums.map((a) => (
                <Link
                  key={a.slug}
                  href={`/gallery?album=${encodeURIComponent(a.slug)}`}
                  className={sp.album === a.slug ? "active" : ""}
                >
                  {a.name}
                </Link>
              ))}
            </div>
          ) : null}
          <GalleryGrid
            items={items.map((g) => ({
              id: g.id,
              mediaUrl: g.mediaUrl,
              caption: g.caption,
              isVideo: g.isVideo,
            }))}
          />
          <div className="pageCta">
            <BookingCTA />
          </div>
        </div>
        <Waves className="sectionWave bottom" fill="#f4fbfe" />
      </section>
      <SiteFooter />
    </main>
  );
}
