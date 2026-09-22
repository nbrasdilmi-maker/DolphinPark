import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { RoomCard } from "@/components/RoomCard";
import { BookingCTA } from "@/components/BookingCTA";
import { Waves } from "@/components/Waves";
import { RealtimeRefresh } from "@/components/RealtimeRefresh";
import { getDb } from "@/lib/db";
import { parseList } from "@/lib/content";
import { getPageCopy, getSeo } from "@/lib/page-content";
import { SearchBox } from "@/components/SearchBox";
import type { Prisma } from "@/generated/prisma-postgres";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getSeo(
    "rooms",
    "الغرف والإقامات",
    "غرف وجناحات منتزه خليج الدولفين في الحديدة — غرف عائلية، جناح مميز، وغرف مزدوجة بأسعار تناسب الجميع."
  );
}

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const db = await getDb();
  const where: Prisma.RoomWhereInput = { status: "published" };
  if (sp.q) {
    where.OR = [
      { name: { contains: sp.q } },
      { type: { contains: sp.q } },
      { shortDesc: { contains: sp.q } },
    ];
  }
  const [rooms, copy] = await Promise.all([
    db.room.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    }),
    getPageCopy(
      "rooms",
      "غرف مريحة تطل على البحر",
      "اختر الغرفة الأنسب لعائلتك أو لحجوزاتك الفردية، مع كل وسائل الراحة والخدمات المتميزة."
    ),
  ]);
  return (
    <main>
      <RealtimeRefresh tables={["Room"]} />
      <SiteHeader />
      <PageHero
        eyebrow="الغرف والإقامات"
        title={copy.heroTitle}
        text={copy.heroText}
      />
      <section className="section rooms">
        <div className="container">
          <SearchBox placeholder="ابحث عن غرفة…" />
          {sp.q ? <p className="searchCount">نتائج البحث عن «{sp.q}»: {rooms.length}</p> : null}
          {rooms.length === 0 ? (
            <p className="searchEmpty">لا توجد غرف مطابقة لبحثك.</p>
          ) : (
          <div className="roomGrid">
            {rooms.map((r, i) => (
              <RoomCard
                key={r.id}
                slug={r.slug}
                src={r.coverUrl ?? ""}
                alt={r.name}
                title={r.name}
                desc={r.shortDesc ?? ""}
                capacity={r.capacity ?? 0}
                features={parseList(r.featuresJson)}
                price={r.price ?? ""}
                index={i}
              />
            ))}
          </div>
          )}
          <div className="pageCta">
            <BookingCTA />
          </div>
        </div>
        <Waves className="sectionWave bottom" fill="#ffffff" />
      </section>
      <SiteFooter />
    </main>
  );
}
