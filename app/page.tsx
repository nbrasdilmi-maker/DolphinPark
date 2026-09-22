import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { FeatureCard } from "@/components/FeatureCard";
import { GalleryCard } from "@/components/GalleryCard";
import { RoomCard } from "@/components/RoomCard";
import { ContactSection } from "@/components/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";
import { Waves } from "@/components/Waves";
import { DolphinMotif } from "@/components/DolphinMotif";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BookingCTA } from "@/components/BookingCTA";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { IconByKey } from "@/components/IconByKey";
import { RealtimeRefresh } from "@/components/RealtimeRefresh";
import { getDb } from "@/lib/db";
import { getSettings } from "@/lib/site-content";
import { parseList, parseConfig, ik } from "@/lib/content";
import { MapPin, Clock, ExternalLink, ArrowLeft, Play, Star } from "@/components/icons";
import { Users, Target, Waves as WavesIcon } from "@/components/icons";
import { TestimonialForm } from "@/components/TestimonialForm";

const REALTIME_TABLES = [
  "Room",
  "Service",
  "Facility",
  "Offer",
  "GalleryItem",
  "GalleryAlbum",
  "HomeSection",
  "HeroSlide",
  "Testimonial",
];

function cfgCount(json: string | null | undefined): number | undefined {
  try {
    const v: unknown = JSON.parse(json ?? "{}");
    const n =
      typeof v === "object" && v !== null
        ? Number((v as Record<string, unknown>).count)
        : NaN;
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
  } catch {
    return undefined;
  }
}

function cfgStr(json: string | null | undefined, key: string, fallback: string): string {
  try {
    const v: unknown = JSON.parse(json ?? "{}");
    const s =
      typeof v === "object" && v !== null ? (v as Record<string, unknown>)[key] : undefined;
    return typeof s === "string" && s ? s : fallback;
  } catch {
    return fallback;
  }
}

export const revalidate = 60;

export default async function Home() {
  const db = await getDb();
  const [sections, settings] = await Promise.all([
    db.homeSection.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
    getSettings(),
  ]);

  const sec = Object.fromEntries(sections.map((s) => [s.key, s]));
  const hero = sec.hero;
  const about = sec.about;
  const roomsSec = sec.rooms;
  const servicesSec = sec.services;
  const facilitiesSec = sec.facilities;
  const whySec = sec.why;
  const gallerySec = sec.gallery;
  const offersSec = sec.offers;
  const ctaSec = sec.cta;

  const roomsTake = roomsSec ? cfgCount(roomsSec.configJson) : undefined;
  const servicesTake = servicesSec ? cfgCount(servicesSec.configJson) : undefined;
  const galleryAlbum = gallerySec ? cfgStr(gallerySec.configJson, "albumSlug", "main") : "main";
  const galleryTake = gallerySec ? cfgCount(gallerySec.configJson) : undefined;

  const [rooms, services, facilities, offers, album, slides, testimonials] = await Promise.all([
    db.room.findMany({
      where: { status: "published" },
      orderBy: { sortOrder: "asc" },
      ...(roomsTake ? { take: roomsTake } : {}),
    }),
    db.service.findMany({
      where: { status: "published" },
      orderBy: { sortOrder: "asc" },
      ...(servicesTake ? { take: servicesTake } : {}),
    }),
    db.facility.findMany({ where: { status: "published" }, orderBy: { sortOrder: "asc" } }),
    db.offer.findMany({ where: { status: "published" }, orderBy: { sortOrder: "asc" } }),
    db.galleryAlbum.findFirst({
      where: { slug: galleryAlbum, status: "published" },
      include: {
        items: { orderBy: { sortOrder: "asc" }, ...(galleryTake ? { take: galleryTake } : {}) },
      },
    }),
    db.heroSlide.findMany({ where: { status: "published" }, orderBy: { sortOrder: "asc" } }),
    db.testimonial.findMany({ where: { status: "published" }, orderBy: { sortOrder: "asc" } }),
  ]);

  const heroCfg = parseConfig<{
    bgImage?: string;
    primaryBtn?: { label?: string; href?: string };
    secondaryBtn?: { label?: string; href?: string };
  }>(hero?.configJson, {});
  const aboutCfg = parseConfig<{ image?: string; button?: { label?: string; href?: string } }>(
    about?.configJson,
    {}
  );
  const whyCfg = parseConfig<{
    points?: Array<{ title?: string; text?: string; iconKey?: string }>;
  }>(whySec?.configJson, { points: [] });
  const galleryItems = album?.items ?? [];
  const ctaCfg = parseConfig<{
    primaryBtn?: { label?: string; href?: string };
    secondaryBtn?: { label?: string; href?: string };
  }>(ctaSec?.configJson, {});
  const offersIds = parseConfig<{ ids?: string[] }>(offersSec?.configJson, {}).ids;
  const visibleOffers =
    offersIds && offersIds.length > 0 ? offers.filter((o) => offersIds.includes(o.id)) : offers;

  return (
    <main>
      <RealtimeRefresh tables={REALTIME_TABLES} />
      <SiteHeader />
      {hero ? (
        <section className="hero" id="home">
          {slides.length > 0 ? (
            <HeroSlideshow
              slides={slides.map((s) => ({ mediaUrl: s.mediaUrl, caption: s.caption, link: s.link }))}
            />
          ) : (
            <>
              <Image
                src={heroCfg.bgImage ?? ""}
                alt="إطلالة بحرية"
                fill
                priority
                sizes="100vw"
                className="heroImg"
              />
              <div className="dots">
                <i />
                <i className="on" />
                <i />
              </div>
            </>
          )}
          <div className="heroShade" />
          <div className="container heroContent">
            <span className="badge">{hero.eyebrow ?? ""}</span>
            <Image src="/logo.png" alt="منتزه خليج الدولفين" width={320} height={214} />
            <h1>{hero.title ?? ""}</h1>
            <p>{hero.text ?? ""}</p>
            <div className="heroBtns">
              <Button variant="primary" href={heroCfg.primaryBtn?.href ?? "#rooms"}>
                {heroCfg.primaryBtn?.label ?? ""} <ArrowLeft size={16} strokeWidth={2} />
              </Button>
              <Button variant="ghost" href={heroCfg.secondaryBtn?.href ?? "/book"}>
                {heroCfg.secondaryBtn?.label ?? ""}
              </Button>
            </div>
            <a className="heroPlay" href="#gallery" aria-label="شاهد فيديو المنتزه">
              <Play size={26} strokeWidth={1.8} fill="currentColor" />
            </a>
          </div>
          <Waves className="wave" fill="#ffffff" />
        </section>
      ) : null}

      {about ? (
        <section className="section" id="about">
          <div className="container aboutGrid">
            <Reveal className="aboutReveal" delay={0}>
              <div className="aboutMedia">
                <Image
                  src={ik(aboutCfg.image ?? "", 1200)}
                  alt="مرافق بحرية"
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
                  eyebrow={about.eyebrow ?? ""}
                  title={about.title ?? ""}
                  text={about.text ?? ""}
                  right
                />
                <div className="mini">
                  <div>
                    <WavesIcon size={18} strokeWidth={1.8} />
                    <span>
                      <b>أجواء بحرية</b>
                      <small>إطلالة وموقع يمنحان الزيارة طابعًا مميزًا.</small>
                    </span>
                  </div>
                  <div>
                    <Users size={18} strokeWidth={1.8} />
                    <span>
                      <b>للجميع</b>
                      <small>مساحات وخيارات مناسبة للعائلات ومختلف الزوار.</small>
                    </span>
                  </div>
                  <div>
                    <Target size={18} strokeWidth={1.8} />
                    <span>
                      <b>ترفيه وخدمات</b>
                      <small>أنشطة ومرافق متعددة في مكان واحد.</small>
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          <Waves className="sectionWave bottom" fill="#f4fbfe" />
        </section>
      ) : null}

      {roomsSec ? (
        <section className="section rooms" id="rooms">
          <div className="container">
            <SectionTitle
              eyebrow={roomsSec.eyebrow ?? ""}
              title={roomsSec.title ?? ""}
              text={roomsSec.text ?? ""}
            />
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
          </div>
          <Waves className="sectionWave bottom" fill="#ffffff" />
        </section>
      ) : null}

      {servicesSec ? (
        <section className="section services" id="services">
          <div className="container">
            <SectionTitle
              eyebrow={servicesSec.eyebrow ?? ""}
              title={servicesSec.title ?? ""}
              text={servicesSec.text ?? ""}
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
                </Reveal>
              ))}
            </div>
          </div>
          <Waves className="sectionWave bottom" fill="#f4fbfe" />
        </section>
      ) : null}

      {facilitiesSec ? (
        <section className="section facilities" id="facilities">
          <div className="container">
            <SectionTitle
              eyebrow={facilitiesSec.eyebrow ?? ""}
              title={facilitiesSec.title ?? ""}
              text={facilitiesSec.text ?? ""}
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
          </div>
          <Waves className="sectionWave bottom" fill="#ffffff" />
        </section>
      ) : null}

      {whySec ? (
        <section className="section reasons" id="why">
          <DolphinMotif className="dolphinMotif reasonsMotif" stroke="#19c6ee" />
          <div className="container">
            <SectionTitle
              eyebrow={whySec.eyebrow ?? ""}
              title={whySec.title ?? ""}
              text={whySec.text ?? ""}
            />
            <div className="reasonGrid">
              {(whyCfg.points ?? []).map((r, i) => (
                <Reveal key={r.title ?? i} className="revealItem" delay={i * 90}>
                  <Card
                    className="reasonCard"
                    icon={<IconByKey name={r.iconKey} size={26} />}
                    title={r.title ?? ""}
                    text={r.text ?? ""}
                  />
                </Reveal>
              ))}
            </div>
          </div>
          <Waves className="sectionWave bottom" fill="#ffffff" />
        </section>
      ) : null}

      {gallerySec ? (
        <section className="section" id="gallery">
          <div className="container">
            <div className="headRow">
              <SectionTitle
                eyebrow={gallerySec.eyebrow ?? ""}
                title={gallerySec.title ?? ""}
                text={gallerySec.text ?? ""}
                right
              />
              <a className="textLink" href="#contact">
                عرض المزيد <ArrowLeft size={13} />
              </a>
            </div>
            <div className="galleryGrid">
              {galleryItems.map((g, i) => (
                <GalleryCard
                  key={g.id}
                  src={g.mediaUrl}
                  alt={g.caption ?? ""}
                  label={g.caption ?? ""}
                  index={i}
                  video={g.isVideo}
                />
              ))}
            </div>
          </div>
          <Waves className="sectionWave bottom" fill="#f4fbfe" />
        </section>
      ) : null}

      {offersSec ? (
        <section className="section offers" id="offers">
          <div className="container">
            {visibleOffers.length > 0 ? (
              <>
                <SectionTitle
                  eyebrow={offersSec.eyebrow ?? ""}
                  title={offersSec.title ?? ""}
                  text={offersSec.text ?? ""}
                />
                <div className="offerGrid">
                  {visibleOffers.map((o, i) => (
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
                        <a className="textLink" href={o.ctaHref ?? "#contact"}>
                          {o.ctaLabel ?? ""} <ArrowLeft size={13} />
                        </a>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </>
            ) : null}
            <div className="bookingBoxWrap">
              <BookingCTA
                title={ctaSec?.title}
                text={ctaSec?.text}
                primaryLabel={ctaCfg.primaryBtn?.label}
                primaryHref={ctaCfg.primaryBtn?.href}
                secondaryLabel={ctaCfg.secondaryBtn?.label}
                secondaryHref={ctaCfg.secondaryBtn?.href}
              />
            </div>
          </div>
          <Waves className="sectionWave bottom" fill="#ffffff" />
        </section>
      ) : null}

      <section className="section testimonials" id="testimonials">
        <div className="container">
          <SectionTitle
            eyebrow="آراء زوارنا"
            title="ماذا قالوا عن تجربتهم؟"
            text="تجارب حقيقية لزوار عاشوا أجواء خليج الدولفين."
          />
          {testimonials.length > 0 ? (
            <div className="testiGrid">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} className="revealItem" delay={(i % 3) * 90}>
                  <article className="testiCard">
                    <span className="stars">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={15}
                          fill={n <= t.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </span>
                    <p>{t.text}</p>
                    <b>{t.name}</b>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : null}
          <TestimonialForm />
        </div>
        <Waves className="sectionWave bottom" fill="#f4fbfe" />
      </section>

      <section className="section location" id="location">
        <div className="container locationGrid">
          <Reveal className="aboutReveal" delay={0}>
            <div>
              <SectionTitle
                eyebrow="موقعنا"
                title="ننتظركم على كورنيش الحديدة"
                text="يمكنكم الوصول إلى منتزه خليج الدولفين عبر موقعه على كورنيش الحديدة. استخدموا الخريطة للوصول بسهولة."
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
                عرض الموقع في خرائط Google <ExternalLink size={15} strokeWidth={1.8} />
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
              <p className="mapCaption">موقع المنتزه على الخريطة • الحديدة - اليمن</p>
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
      <SiteFooter tripleLogin />
    </main>
  );
}
