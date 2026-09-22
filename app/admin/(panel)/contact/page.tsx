import { PageHead } from "@/components/admin/EntityTable";
import { SettingsForm, type SettingField } from "@/components/admin/SettingsForm";

const fields: SettingField[] = [
  { key: "map.address", label: "العنوان", type: "text" },
  { key: "map.hours", label: "أوقات العمل", type: "text" },
  { key: "map.embedUrl", label: "رابط الخريطة المضمنة", type: "textarea", dir: "ltr" },
  { key: "map.linkUrl", label: "رابط خرائط Google", type: "textarea", dir: "ltr" },
  { key: "contact.phone", label: "رقم الهاتف", type: "text", dir: "ltr" },
  { key: "contact.email", label: "البريد الإلكتروني", type: "text", dir: "ltr" },
  { key: "social.whatsapp", label: "واتساب", type: "text", dir: "ltr" },
  { key: "social.instagram", label: "انستغرام", type: "text", dir: "ltr" },
  { key: "social.facebook", label: "فيسبوك", type: "text", dir: "ltr" },
  { key: "social.youtube", label: "يوتيوب", type: "text", dir: "ltr" },
  { key: "social.tiktok", label: "تيك توك", type: "text", dir: "ltr" },
];

export default function ContactAdminPage() {
  return (
    <div>
      <PageHead title="معلومات المنتزه والتواصل" />
      <SettingsForm fields={fields} back="/admin/contact" />
    </div>
  );
}
