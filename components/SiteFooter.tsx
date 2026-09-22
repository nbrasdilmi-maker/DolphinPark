import { Footer } from "@/components/Footer";
import { getNav, getSettings } from "@/lib/site-content";

export async function SiteFooter({ tripleLogin }: { tripleLogin?: boolean }) {
  const [links, s] = await Promise.all([getNav("footer"), getSettings()]);
  return (
    <Footer
      tripleLogin={tripleLogin}
      links={links}
      name={s["site.name"]}
      tagline={s["site.tagline"]}
      phone={s["contact.phone"]}
      email={s["contact.email"]}
      copyright={s["site.copyright"] ?? ""}
      social={{
        whatsapp: s["social.whatsapp"],
        instagram: s["social.instagram"],
        facebook: s["social.facebook"],
        youtube: s["social.youtube"],
        tiktok: s["social.tiktok"],
      }}
    />
  );
}
