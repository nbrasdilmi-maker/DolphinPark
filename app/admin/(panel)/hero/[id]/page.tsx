import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { EntityForm, type FieldDef } from "@/components/admin/EntityForm";
import { PageHead } from "@/components/admin/EntityTable";

const fields: FieldDef[] = [
  { name: "mediaUrl", label: "الصورة", type: "static" },
  { name: "caption", label: "التسمية", type: "text" },
  { name: "link", label: "الرابط عند النقر", type: "text", dir: "ltr" },
  { name: "sortOrder", label: "الترتيب", type: "number" },
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
];

export default async function HeroSlideFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const slide = await db.heroSlide.findUnique({ where: { id } });
  if (!slide) notFound();
  const initial: Record<string, unknown> = { ...slide };
  return (
    <div>
      <PageHead title="تعديل صورة الواجهة" back="/admin/hero" />
      <EntityForm fields={fields} initial={initial} base="/admin/hero" api="/api/admin/hero-slides" id={id} />
    </div>
  );
}
