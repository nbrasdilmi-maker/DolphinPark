import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { Suspense } from "react";
import { BookForm } from "@/components/BookForm";
import { Waves } from "@/components/Waves";
import { getSettings } from "@/lib/site-content";
import { getPageCopy, getSeo } from "@/lib/page-content";
import { getDb } from "@/lib/db";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getSeo(
    "book",
    "الحجز",
    "احجز إقامتك في منتزه خليج الدولفين بالحديدة — اختر الغرفة وتاريخ الزيارة وسجل طلبك وسنتواصل معك للتأكيد."
  );
}

export default async function BookPage() {
  const [settings, rooms, copy] = await Promise.all([
    getSettings(),
    (async () => {
      try {
        const db = await getDb();
        return await db.room.findMany({
          where: { status: "published" },
          orderBy: { sortOrder: "asc" },
          select: { slug: true, name: true },
        });
      } catch {
        return [];
      }
    })(),
    getPageCopy(
      "book",
      "احجزوا تجربتكم على البحر",
      "املأ الطلب بالأسفل وسيتواصل معكم فريق المنتزه لتأكيد الحجز وتجهيز كل التفاصيل."
    ),
  ]);
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="الحجز"
        title={copy.heroTitle}
        text={copy.heroText}
      />
      <section className="section book">
        <Suspense>
          <BookForm phone={settings["contact.phone"]} email={settings["contact.email"]} rooms={rooms} />
        </Suspense>
        <Waves className="sectionWave bottom" fill="#f4fbfe" />
      </section>
      <SiteFooter />
    </main>
  );
}