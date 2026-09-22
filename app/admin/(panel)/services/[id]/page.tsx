import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { parseList } from "@/lib/content";
import { EntityForm, type FieldDef } from "@/components/admin/EntityForm";
import { PageHead } from "@/components/admin/EntityTable";

const fields: FieldDef[] = [
  { name: "name", label: "اسم الخدمة", type: "text", required: true },
  { name: "slug", label: "الرابط المختصر", type: "text", required: true, dir: "ltr" },
  { name: "shortName", label: "الاسم المختصر", type: "text" },
  { name: "desc", label: "الوصف", type: "textarea" },
  { name: "longDesc", label: "الوصف التفصيلي", type: "textarea", rows: 6 },
  { name: "category", label: "القسم", type: "text" },
  { name: "iconKey", label: "الأيقونة", type: "icon" },
  { name: "coverUrl", label: "الصورة الرئيسية", type: "image" },
  { name: "galleryJson", label: "معرض الصور", type: "imagelist" },
  { name: "price", label: "السعر", type: "text" },
  { name: "hours", label: "ساعات العمل", type: "text" },
  { name: "featuresJson", label: "المميزات", type: "list" },
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
  { name: "seoTitle", label: "عنوان SEO", type: "text" },
  { name: "seoDescription", label: "وصف SEO", type: "textarea" },
];

export default async function ServiceFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const service = id === "new" ? null : await db.service.findUnique({ where: { id } });
  if (id !== "new" && !service) notFound();
  const initial: Record<string, unknown> = service
    ? {
        ...service,
        featuresJson: parseList(service.featuresJson),
        galleryJson: parseList(service.galleryJson),
      }
    : { status: "draft", sortOrder: 0 };
  return (
    <div>
      <PageHead title={id === "new" ? "إضافة خدمة" : "تعديل الخدمة"} back="/admin/services" />
      <EntityForm fields={fields} initial={initial} base="/admin/services" api="/api/admin/services" id={id} />
    </div>
  );
}
