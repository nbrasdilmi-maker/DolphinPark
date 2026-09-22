import Image from "next/image";
import Link from "next/link";
import { Waves } from "@/components/Waves";
import { DolphinMotif } from "@/components/DolphinMotif";
import { TripleClickLogin } from "@/components/TripleClickLogin";
import { siteConfig } from "@/lib/site";
import {
  Facebook,
  Instagram,
  Youtube,
  TikTok,
  WhatsApp,
} from "@/components/icons";
export type FooterSocial = {
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
};

export function Footer({
  links,
  name,
  tagline,
  phone,
  email,
  copyright,
  social,
  tripleLogin,
}: {
  links?: Array<[string, string]>;
  name?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  copyright?: string;
  social?: FooterSocial;
  tripleLogin?: boolean;
}) {
  const items = links ?? [
    ["عن المنتزه", "/about"],
    ["الغرف", "/rooms"],
    ["الخدمات", "/services"],
    ["المعرض", "/gallery"],
    ["تواصل معنا", "/contact"],
  ];
  const s = social ?? siteConfig.social;
  const displayName = name ?? siteConfig.name;
  const displayTagline = tagline ?? "متعة البحر تبدأ من هنا.";
  const displayPhone = phone ?? siteConfig.contact.phone;
  const displayEmail = email ?? siteConfig.contact.email;
  const devName = "محمد ابراهيم الديلمي";
  const devMsg =
    "السلام عليكم، أعجبني موقع منتزه خليج الدولفين وأرغب بتصميم موقع احترافي لمشروعي، هل يمكننا التواصل؟";
  const devHref = `https://wa.me/967776668662?text=${encodeURIComponent(devMsg)}`;
  return (
    <footer className="footer">
      <Waves className="footerWave" fill="#032650" flip />
      <DolphinMotif className="dolphinMotif footerMotif" stroke="#19c6ee" />
      <div className="container footerGrid">
        <div className="footerBrand">
          <Image
            src="/logo.png"
            alt={displayName}
            width={150}
            height={100}
          />
          <div>
            <b>{displayName}</b>
            <p>{displayTagline}</p>
          </div>
        </div>
        <div className="footerLinks">
          {items.map(([t, h]) => (
            <Link key={h} href={h}>
              {t}
            </Link>
          ))}
        </div>
        <div className="footerLinks contactLinks">
          <a href={s.whatsapp} target="_blank" rel="noreferrer">
            واتساب
          </a>
          <a href={`tel:${displayPhone.replace(/\s/g, "")}`}>
            {displayPhone}
          </a>
          <a href={`mailto:${displayEmail}`}>
            {displayEmail}
          </a>
        </div>
        <div className="social">
          <a
            href={s.whatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label="تواصل عبر واتساب"
          >
            <WhatsApp size={17} />
          </a>
          <a
            href={s.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="تابعنا على إنستغرام"
          >
            <Instagram size={17} strokeWidth={1.8} />
          </a>
          <a
            href={s.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="تابعنا على فيسبوك"
          >
            <Facebook size={17} strokeWidth={1.8} />
          </a>
          <a
            href={s.youtube}
            target="_blank"
            rel="noreferrer"
            aria-label="شاهدنا على يوتيوب"
          >
            <Youtube size={17} strokeWidth={1.8} />
          </a>
          <a
            href={s.tiktok}
            target="_blank"
            rel="noreferrer"
            aria-label="تابعنا على تيك توك"
          >
            <TikTok size={17} strokeWidth={1.8} />
          </a>
        </div>
      </div>
      <div className="container copy">
        <TripleClickLogin enabled={tripleLogin}>
          © {new Date().getFullYear()} {copyright || displayName}. جميع الحقوق محفوظة.
        </TripleClickLogin>
        <span className="devCredit">
          تطوير:{" "}
          <a href={devHref} target="_blank" rel="noreferrer">
            {devName} <WhatsApp size={13} />
          </a>
        </span>
      </div>
    </footer>
  );
}
