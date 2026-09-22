import { PageHead } from "@/components/admin/EntityTable";
import { SettingsForm, type SettingField } from "@/components/admin/SettingsForm";

const fields: SettingField[] = [
  { key: "site.name", label: "اسم المنتزه", type: "text" },
  { key: "site.shortName", label: "الاسم المختصر", type: "text" },
  { key: "site.tagline", label: "الوصف التعريفي", type: "text" },
  { key: "site.logoUrl", label: "الشعار", type: "image" },
  { key: "site.faviconUrl", label: "الأيقونة المفضلة", type: "image" },
  { key: "site.copyright", label: "حقوق النشر", type: "text" },
  { key: "notify.webhook", label: "رابط إشعارات الطلبات (Webhook)", type: "text", dir: "ltr" },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHead title="إعدادات الموقع" />
      <SettingsForm fields={fields} back="/admin/settings" />
    </div>
  );
}
