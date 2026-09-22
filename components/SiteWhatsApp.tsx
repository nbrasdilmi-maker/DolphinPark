import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { getSettings } from "@/lib/site-content";

export async function SiteWhatsApp() {
  const s = await getSettings();
  return <WhatsAppFloat href={s["social.whatsapp"] ?? ""} />;
}
