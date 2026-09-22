import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { SectionTitle } from "@/components/SectionTitle";
import { ContactSection } from "@/components/ContactSection";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { Waves } from "@/components/Waves";
import { getSettings } from "@/lib/site-content";
import { getPageCopy, getSeo } from "@/lib/page-content";
import { MapPin, Clock, ExternalLink } from "@/components/icons";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getSeo(
    "contact",
    "تواصل معنا",
    "تواصل مع منتزه خليج الدولفين في الحديدة — الهاتف، البريد، موقع المنتزه على الخريطة، وكل قنوات التواصل."
  );
}

export default async function ContactPage() {
  const [settings, copy] = await Promise.all([
    getSettings(),
    getPageCopy(
      "contact",
      "نحن هنا للإجابة عن أسئلتكم",
      "سواء كان لديكم استفسار عن الغرف أو العروض أو حجز خاص بمناسبة، فريقنا جاهز للرد."
    ),
  ]);
  return (
    <main>
      <SiteHeader />
      <PageHero
        eyebrow="تواصل معنا"
        title={copy.heroTitle}
        text={copy.heroText}
      />
      <section className="section location" id="location">
        <div className="container locationGrid">
          <Reveal className="aboutReveal" delay={0}>
            <div>
              <SectionTitle
                eyebrow="موقعنا"
                title="ننتظركم على كورنيش الحديدة"
                text="استخدموا الخريطة للوصول إلينا بسهولة، أو تواصلوا عبر القنوات المتاحة."
                right
              />
              <div className="locInfo">
                <div>
                  <MapPin size={18} strokeWidth={1.8} />
                  <span>
                    <b>العنوان</b>
                    <small>{settings["map.address"]}</small>
                  </span>
                </div>
                <div>
                  <Clock size={18} strokeWidth={1.8} />
                  <span>
                    <b>أوقات الزيارة</b>
                    <small>{settings["map.hours"]}</small>
                  </span>
                </div>
              </div>
              <Button
                variant="primary"
                href={settings["map.linkUrl"]}
                target="_blank"
                rel="noreferrer"
              >
                عرض الموقع في خرائط Google{" "}
                <ExternalLink size={15} strokeWidth={1.8} />
              </Button>
            </div>
          </Reveal>
          <Reveal className="aboutReveal" delay={120}>
            <div className="map">
              <iframe
                src={settings["map.embedUrl"]}
                title={`خريطة موقع ${settings["site.name"]}`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="mapLabel">
                <b>{settings["site.name"]}</b>
                <small>{settings["map.address"]}</small>
              </div>
              <p className="mapCaption">
                موقع المنتزه على الخريطة • الحديدة - اليمن
              </p>
            </div>
          </Reveal>
        </div>
        <Waves className="sectionWave bottom" fill="#062f61" />
      </section>
      <ContactSection
        phone={settings["contact.phone"]}
        email={settings["contact.email"]}
        social={{
          whatsapp: settings["social.whatsapp"],
          instagram: settings["social.instagram"],
          facebook: settings["social.facebook"],
          youtube: settings["social.youtube"],
          tiktok: settings["social.tiktok"],
        }}
      />
      <SiteFooter />
    </main>
  );
}