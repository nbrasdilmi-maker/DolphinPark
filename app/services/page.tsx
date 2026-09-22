import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { BookingCTA } from "@/components/BookingCTA";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/Reveal";
import { Waves } from "@/components/Waves";
import { IconByKey } from "@/components/IconByKey";
import { ArrowLeft } from "@/components/icons";
import { RealtimeRefresh } from "@/components/RealtimeRefresh";
import { getDb } from "@/lib/db";
import { getPageCopy, getSeo } from "@/lib/page-content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getSeo(
    "services",
    "الخدمات والأقسام",
    "خدمات منتزه خليج الدولفين: مطعم، كافتيريا، بقالة، جلسات، خيام، كراسي بحرية، ورحلات وأنشطة على البحر."
  );
}

export default async function ServicesPage() {
  const db = await getDb();
  const [services, copy] = await Promise.all([
    db.service.findMany({
      where: { status: "published" },
      orderBy: { sortOrder: "asc" },
    }),
    getPageCopy(
      "services",
      "كل التفاصيل في مكان واحد",
      "خدمات متنوعة تجعل زيارتكم مريحة وممتعة، من المطاعم والبوفيه إلى الأنشطة البحرية."
    ),
  ]);
  return (
    <main>
      <RealtimeRefresh tables={["Service"]} />
      <SiteHeader />
      <PageHero
        eyebrow="الخدمات والأقسام"
        title={copy.heroTitle}
        text={copy.heroText}
      />
      <section className="section services">
        <div className="container">
          <SectionTitle
            eyebrow="ماذا نقدم؟"
            title="خدمات صممت حول راحتكم"
            text="استعرضوا الخدمات المتاحة داخل المنتزه لتعزيز تجربتكم قبل وأثناء الزيارة."
          />
          <div className="servicesGrid">
            {services.map((s, i) => (
              <Reveal key={s.id} className="revealItem" delay={(i % 4) * 80}>
                <Card
                  className="serviceCard"
                  icon={<IconByKey name={s.iconKey} size={24} />}
                  title={s.name}
                  text={s.desc ?? ""}
                />
                <Link className="textLink" href={`/services/${s.slug}`}>
                  التفاصيل <ArrowLeft size={13} />
                </Link>
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
