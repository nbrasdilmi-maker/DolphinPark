import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { RoomCard } from "@/components/RoomCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { Waves } from "@/components/Waves";
import { RealtimeRefresh } from "@/components/RealtimeRefresh";
import { getDb } from "@/lib/db";
import { parseList, ik } from "@/lib/content";
import { Users, BedDouble, Check, ArrowLeft, Sparkles } from "@/components/icons";

export const revalidate = 60;

export async function generateStaticParams() {
  const db = await getDb();
  const rooms = await db.room.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = await getDb();
  const room = await db.room.findUnique({ where: { slug } });
  if (!room) return { title: "الغرف" };
  return {
    title: room.seoTitle || room.name,
    description: room.seoDescription || room.shortDesc || undefined,
  };
}

export default async function RoomDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const room = await db.room.findFirst({ where: { slug, status: "published" } });
  if (!room) notFound();
  const features = parseList(room.featuresJson);
  const gallery = parseList(room.galleryJson);
  const others = await db.room.findMany({
    where: { status: "published", id: { not: room.id } },
    orderBy: { sortOrder: "asc" },
    take: 2,
  });

  return (
    <main>
      <RealtimeRefresh tables={["Room"]} />
      <SiteHeader />
      <PageHero eyebrow="الغرف والإقامات" title={room.name} text={room.shortDesc ?? ""} />
      <section className="section">
        <div className="container">
          <div className="detailHero">
            {room.coverUrl ? (
              <Image src={ik(room.coverUrl, 1200)} alt={room.name} fill priority sizes="100vw" />
            ) : null}
            <div className="detailShade" />
            <div className="detailHeroText">
              <span className="detailPrice">
                <b>{room.price ?? ""}</b>
                <small>ليلة واحدة</small>
              </span>
            </div>
          </div>
          <div className="detailInfo">
            <span>
              <Users size={16} strokeWidth={1.8} /> السعة: حتى {room.capacity ?? "—"} أشخاص
            </span>
            <span>
              <BedDouble size={16} strokeWidth={1.8} /> الأسرة: {room.beds ?? "—"}
            </span>
            {room.type ? (
              <span>
                <Sparkles size={16} strokeWidth={1.8} /> {room.type}
              </span>
            ) : null}
            {room.number ? <span>رقم الغرفة: {room.number}</span> : null}
          </div>
          {room.longDesc ? (
            <div className="aboutText">
              <p>{room.longDesc}</p>
            </div>
          ) : null}
          {features.length > 0 ? (
            <>
              <SectionTitle eyebrow="المميزات" title="ماذا تشمل الغرفة؟" text="" />
              <ul className="detailFeats">
                {features.map((f) => (
                  <li key={f}>
                    <Check size={15} strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {gallery.length > 0 ? (
            <div className="detailGrid">
              {gallery.map((src, i) => (
                <Reveal key={`${src}-${i}`} className="revealItem" delay={(i % 2) * 90}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${room.name} ${i + 1}`} loading="lazy" />
                </Reveal>
              ))}
            </div>
          ) : null}
          <div className="detailBook">
            <span>
              <b>{room.price ?? ""}</b>
              <small>شامل الخدمات الأساسية — التأكيد عبر الإدارة</small>
            </span>
            <Button variant="primary" href={`/book?room=${encodeURIComponent(room.slug)}`}>
              احجز هذه الغرفة <ArrowLeft size={16} strokeWidth={2} />
            </Button>
          </div>
          {others.length > 0 ? (
            <>
              <SectionTitle eyebrow="خيارات أخرى" title="غرف قد تعجبك" text="" />
              <div className="roomGrid">
                {others.map((r, i) => (
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
            </>
          ) : null}
          <Link className="textLink" href="/rooms">
            العودة إلى الغرف <ArrowLeft size={13} />
          </Link>
        </div>
        <Waves className="sectionWave bottom" fill="#f4fbfe" />
      </section>
      <SiteFooter />
    </main>
  );
}
