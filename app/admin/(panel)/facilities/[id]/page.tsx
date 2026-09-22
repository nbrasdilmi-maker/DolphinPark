import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { EntityForm, type FieldDef } from "@/components/admin/EntityForm";
import { PageHead } from "@/components/admin/EntityTable";

const fields: FieldDef[] = [
  { name: "title", label: "العنوان", type: "text", required: true },
  { name: "text", label: "الوصف", type: "textarea" },
  { name: "iconKey", label: "الأيقونة", type: "icon" },
  { name: "imageUrl", label: "الصورة", type: "image" },
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

export default async function FacilityFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const facility = id === "new" ? null : await db.facility.findUnique({ where: { id } });
  if (id !== "new" && !facility) notFound();
  const initial: Record<string, unknown> = facility ?? { status: "published", sortOrder: 0 };
  return (
    <div>
      <PageHead title={id === "new" ? "إضافة مرفق" : "تعديل المرفق"} back="/admin/facilities" />
      <EntityForm fields={fields} initial={initial} base="/admin/facilities" api="/api/admin/facilities" id={id} />
    </div>
  );
}
