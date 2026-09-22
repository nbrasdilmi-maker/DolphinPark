import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { FeatureCard } from "@/components/FeatureCard";
import { BookingCTA } from "@/components/BookingCTA";
import { DolphinMotif } from "@/components/DolphinMotif";
import { Reveal } from "@/components/Reveal";
import { Waves } from "@/components/Waves";
import { IconByKey } from "@/components/IconByKey";
import { RealtimeRefresh } from "@/components/RealtimeRefresh";
import { getDb } from "@/lib/db";
import { parseConfig, ik } from "@/lib/content";
import { getPageCopy, getSeo } from "@/lib/page-content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getSeo(
    "about",
    "عن المنتزه",
    "تعرف على منتزه خليج الدولفين في الحديدة — وجهة ترفيهية عائلية على البحر تجمع الراحة والإقامة والخدمات."
  );
}

export default async function AboutPage() {
  const db = await getDb();
  const [facilities, aboutSec, copy] = await Promise.all([
    db.facility.findMany({ where: { status: "published" }, orderBy: { sortOrder: "asc" } }),
    db.homeSection.findUnique({ where: { key: "about" } }),
    getPageCopy(
      "about",
      "أكثر من مجرد مكان للزيارة",
      "منتزه خليج الدولفين وجهة عائلية على ساحل الحديدة، صُممت لتجمع الاسترخاء والأنشطة والخدمات في تجربة واحدة."
    ),
  ]);
  const aboutCfg = parseConfig<{ image?: string; paragraphs?: string[] }>(aboutSec?.configJson, {});
  const paragraphs =
    aboutCfg.paragraphs && aboutCfg.paragraphs.length > 0 ? aboutCfg.paragraphs : [];
  return (
    <main>
      <RealtimeRefresh tables={["Facility", "HomeSection"]} />
      <SiteHeader />
      <PageHero
        eyebrow="عن المنتزه"
        title={copy.heroTitle}
        text={copy.heroText}
      />
      <section className="section">
        <div className="container aboutGrid">
          <Reveal className="aboutReveal" delay={0}>
            <div className="aboutMedia">
              <Image
                src={ik(aboutCfg.image ?? "", 1200)}
                alt="أجواء المنتزه"
                fill
                sizes="(max-width:900px) 100vw,50vw"
              />
              <div className="caption">
                <DolphinMotif className="captionMotif" stroke="#19c6ee" />
                <span>
                  <b>دولفين</b>
                  <small>ذكريات من قلب البحر</small>
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal className="aboutReveal" delay={120}>
            <div>
              <SectionTitle
                eyebrow="قصتنا"
                title="وجهة صُممت حول تجربتكم"
                text="بدأت فكرة المنتزه لتكون نقطة التقاء العائلات بالبحر في الحديدة، مع مساحات للاسترخاء وخيارات إقامة وخدمات تجعل كل زيارة مريحة وسهلة."
                right
              />
              <div className="aboutText">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
        <Waves className="sectionWave bottom" fill="#f4fbfe" />
      </section>

      <section className="section facilities" id="facilities">
        <div className="container">
          <SectionTitle
            eyebrow="مرافق المنتزه"
            title="ما الذي ستجده عند زيارتك؟"
            text="فكرة واضحة عما ينتظرك داخل المنتزه من مرافق وخدمات."
          />
          <div className="featureGrid">
            {facilities.map((f, i) => (
              <FeatureCard
                key={f.id}
                icon={<IconByKey name={f.iconKey} size={26} />}
                title={f.title}
                text={f.text ?? ""}
                index={i}
              />
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
