import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cairo } from "./fonts";
import { CardGlow } from "@/components/CardGlow";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { SiteWhatsApp } from "@/components/SiteWhatsApp";
import { SiteAdminShortcut } from "@/components/SiteAdminShortcut";
import { ServiceWorker } from "@/components/ServiceWorker";
import { getSettings } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s["site.name"];
  const tagline = s["site.tagline"];
  return {
    metadataBase: new URL("https://dolphinbaypaark.example.com"),
    title: {
      default: `${name} | الحديدة`,
      template: `%s | ${name}`,
    },
    description: `${name} في الحديدة — ${tagline}.`,
    keywords: [
      name,
      "الحديدة",
      "كورنيش الحديدة",
      "مصايف",
      "غرف للايجار",
      "شاطئ الحديدة",
      "ترفيه عائلي",
    ],
    authors: [{ name }],
    applicationName: name,
    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
    },
    openGraph: {
      type: "website",
      locale: "ar_YE",
      url: "https://dolphinbaypaark.example.com",
      siteName: name,
      title: `${name} | الحديدة`,
      description: `${tagline} في الحديدة.`,
      images: [
        {
          url: "/logo.png",
          width: 1536,
          height: 1024,
          alt: `شعار ${name}`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#062f61",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>
        {children}
        <CardGlow />
        <MobileBottomBar />
        <SiteWhatsApp />
        <SiteAdminShortcut />
        <ServiceWorker />
      </body>
    </html>
  );
}