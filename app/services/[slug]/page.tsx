import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { Waves } from "@/components/Waves";
import { RealtimeRefresh } from "@/components/RealtimeRefresh";
import { IconByKey } from "@/components/IconByKey";
import { getDb } from "@/lib/db";
import { parseList, ik } from "@/lib/content";
import { Check, ArrowLeft, Sparkles, Clock, Ticket } from "@/components/icons";

export const revalidate = 60;

export async function generateStaticParams() {
  const db = await getDb();
  const services = await db.service.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = await getDb();
  const service = await db.service.findUnique({ where: { slug } });
  if (!service) return { title: "الخدمات" };
  return {
    title: service.seoTitle || service.name,
    description: service.seoDescription || service.desc || undefined,
  };
}

export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const service = await db.service.findFirst({ where: { slug, status: "published" } });
  if (!service) notFound();
  const features = parseList(service.featuresJson);
  const gallery = parseList(service.galleryJson);
  const others = await db.service.findMany({
    where: { status: "published", id: { not: service.id } },
    orderBy: { sortOrder: "asc" },
    take: 4,
  });

  return (
    <main>
      <RealtimeRefresh tables={["Service"]} />
      <SiteHeader />
      <PageHero eyebrow="الخدمات والأقسام" title={service.name} text={service.desc ?? ""} />
      <section className="section">
        <div className="container">
          {service.coverUrl ? (
            <div className="detailHero">
              <Image src={ik(service.coverUrl, 1200)} alt={service.name} fill priority sizes="100vw" />
              <div className="detailShade" />
              <div className="detailHeroText">
                <span className="detailPrice">
                  <b>{service.price ?? ""}</b>
                  <small>{service.hours ?? ""}</small>
                </span>
              </div>
            </div>
          ) : null}
          <div className="detailInfo">
            <span>
              <Sparkles size={16} strokeWidth={1.8} /> {service.category ?? "خدمة"}
            </span>
            {service.hours ? (
              <span>
                <Clock size={16} strokeWidth={1.8} /> {service.hours}
              </span>
            ) : null}
            {service.price ? (
              <span>
                <Ticket size={16} strokeWidth={1.8} /> {service.price}
              </span>
            ) : null}
          </div>
          {service.longDesc ? (
            <div className="aboutText">
              <p>{service.longDesc}</p>
            </div>
          ) : null}
          {features.length > 0 ? (
            <>
              <SectionTitle eyebrow="المميزات" title="ماذا تشمل الخدمة؟" text="" />
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
                  <img src={ik(src, 800)} alt={`${service.name} ${i + 1}`} loading="lazy" />
                </Reveal>
              ))}
            </div>
          ) : null}
          <div className="detailBook">
            <span>
              <b>{service.name}</b>
              <small>للاستفسار والحجز تواصل معنا مباشرة</small>
            </span>
            <Button variant="primary" href="/book">
              احجز الآن <ArrowLeft size={16} strokeWidth={2} />
            </Button>
          </div>
          {others.length > 0 ? (
            <>
              <SectionTitle eyebrow="خدمات أخرى" title="اكتشف المزيد" text="" />
              <div className="servicesGrid">
                {others.map((s, i) => (
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
            </>
          ) : null}
          <Link className="textLink" href="/services">
            العودة إلى الخدمات <ArrowLeft size={13} />
          </Link>
        </div>
        <Waves className="sectionWave bottom" fill="#f4fbfe" />
      </section>
      <SiteFooter />
    </main>
  );
}
