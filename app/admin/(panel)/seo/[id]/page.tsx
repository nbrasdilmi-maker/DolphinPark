import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { EntityForm, type FieldDef } from "@/components/admin/EntityForm";
import { PageHead } from "@/components/admin/EntityTable";

const fields: FieldDef[] = [
  { name: "pageSlug", label: "مسار الصفحة", type: "text", required: true, dir: "ltr" },
  { name: "metaTitle", label: "عنوان Meta", type: "text" },
  { name: "metaDescription", label: "وصف Meta", type: "textarea" },
  { name: "keywords", label: "الكلمات المفتاحية", type: "textarea" },
  { name: "ogImageUrl", label: "صورة OG", type: "image" },
  { name: "canonical", label: "الرابط المعياري", type: "text", dir: "ltr" },
  { name: "noIndex", label: "منع الفهرسة", type: "checkbox" },
];

export default async function SeoFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const row = id === "new" ? null : await db.seoPage.findUnique({ where: { id } });
  if (id !== "new" && !row) notFound();
  const initial: Record<string, unknown> = row ?? { noIndex: false };
  return (
    <div>
      <PageHead title={id === "new" ? "إضافة صفحة" : "تعديل SEO"} back="/admin/seo" />
      <EntityForm fields={fields} initial={initial} base="/admin/seo" api="/api/admin/seo" id={id} />
    </div>
  );
}
