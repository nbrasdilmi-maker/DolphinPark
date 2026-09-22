import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { EntityForm, type FieldDef } from "@/components/admin/EntityForm";
import { PageHead } from "@/components/admin/EntityTable";

const fields: FieldDef[] = [
  { name: "name", label: "اسم العرض", type: "text", required: true },
  { name: "slug", label: "الرابط المختصر", type: "text", required: true, dir: "ltr" },
  { name: "title", label: "العنوان", type: "text", required: true },
  { name: "desc", label: "الوصف", type: "textarea" },
  { name: "price", label: "السعر", type: "text" },
  { name: "prevPrice", label: "السعر السابق", type: "text" },
  { name: "coverUrl", label: "صورة العرض", type: "image" },
  { name: "startDate", label: "تاريخ البداية", type: "datetime" },
  { name: "endDate", label: "تاريخ النهاية", type: "datetime" },
  { name: "details", label: "تفاصيل العرض", type: "textarea", rows: 6 },
  { name: "ctaLabel", label: "نص زر الحجز", type: "text" },
  { name: "ctaHref", label: "رابط زر الحجز", type: "text", dir: "ltr" },
  { name: "badge", label: "الشارة", type: "text" },
  { name: "iconKey", label: "الأيقونة", type: "icon" },
  {
    name: "status",
    label: "الحالة",
    type: "select",
    options: [
      ["draft", "مسودة"],
      ["published", "منشور"],
      ["hidden", "مخفي"],
    ],
  },
  { name: "sortOrder", label: "الترتيب", type: "number" },
];

export default async function OfferFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const offer = id === "new" ? null : await db.offer.findUnique({ where: { id } });
  if (id !== "new" && !offer) notFound();
  const initial: Record<string, unknown> = offer ?? {
    status: "draft",
    sortOrder: 0,
    ctaLabel: "احجز العرض",
    ctaHref: "/book",
  };
  return (
    <div>
      <PageHead title={id === "new" ? "إضافة عرض" : "تعديل العرض"} back="/admin/offers" />
      <EntityForm fields={fields} initial={initial} base="/admin/offers" api="/api/admin/offers" id={id} />
    </div>
  );
}
