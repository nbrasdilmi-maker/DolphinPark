import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { EntityForm, type FieldDef } from "@/components/admin/EntityForm";
import { PageHead } from "@/components/admin/EntityTable";

const fields: FieldDef[] = [
  { name: "slug", label: "المسار", type: "text", required: true, dir: "ltr" },
  { name: "title", label: "العنوان", type: "text", required: true },
  { name: "description", label: "الوصف", type: "textarea" },
  { name: "heroImageUrl", label: "صورة الواجهة", type: "image" },
  { name: "content", label: "المحتوى", type: "textarea", rows: 10 },
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
  { name: "seoTitle", label: "عنوان SEO", type: "text" },
  { name: "seoDescription", label: "وصف SEO", type: "textarea" },
];

export default async function PageFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const page = id === "new" ? null : await db.page.findUnique({ where: { id } });
  if (id !== "new" && !page) notFound();
  const initial: Record<string, unknown> = page ?? { status: "published" };
  return (
    <div>
      <PageHead title={id === "new" ? "إضافة صفحة" : "تعديل الصفحة"} back="/admin/pages" />
      <EntityForm fields={fields} initial={initial} base="/admin/pages" api="/api/admin/pages" id={id} />
    </div>
  );
}
