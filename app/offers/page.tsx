import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { BookingCTA } from "@/components/BookingCTA";
import { Reveal } from "@/components/Reveal";
import { Waves } from "@/components/Waves";
import { ArrowLeft } from "@/components/icons";
import { IconByKey } from "@/components/IconByKey";
import { RealtimeRefresh } from "@/components/RealtimeRefresh";
import { getDb } from "@/lib/db";
import { getPageCopy, getSeo } from "@/lib/page-content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getSeo(
    "offers",
    "العروض والخصومات",
    "عروض منتزه خليج الدولفين الحالية: عروض نهاية الأسبوع، عروض العائلات، والعروض الموسمية بخصومات مميزة."
  );
}

export default async function OffersPage() {
  const db = await getDb();
  const [offers, copy] = await Promise.all([
    db.offer.findMany({
      where: { status: "published" },
      orderBy: { sortOrder: "asc" },
    }),
    getPageCopy(
      "offers",
      "عروض خاصة لمناسباتكم",
      "تابعوا عروضنا الموسمية الخاصة بالغرف والجلسات والأنشطة، واستفيدوا من الخصومات المتاحة."
    ),
  ]);
  return (
    <main>
      <RealtimeRefresh tables={["Offer"]} />
      <SiteHeader />
      <PageHero
        eyebrow="العروض والخصومات"
        title={copy.heroTitle}
        text={copy.heroText}
      />
      <section className="section offers">
        <div className="container">
          <SectionTitle
            eyebrow="العروض الحالية"
            title="اختيار الأنسب لميزانيتك"
            text="عروض موسمية تتجدد باستمرار — احجز مبكرًا للاستفادة من أفضل الأسعار."
          />
          <div className="offerGrid">
            {offers.map((o, i) => (
              <Reveal key={o.id} className="revealItem" delay={i * 90}>
                <article className="offerCard">
                  <div className="offerTop">
                    <span className="offerIcon">
                      <IconByKey name={o.iconKey} size={24} />
                    </span>
                    <span className="offerBadge">{o.badge ?? ""}</span>
                  </div>
                  <h3>{o.title}</h3>
                  <p>{o.desc ?? ""}</p>
                  <a className="textLink" href={o.ctaHref ?? "/book"}>
                    {o.ctaLabel ?? ""} <ArrowLeft size={13} />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
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
