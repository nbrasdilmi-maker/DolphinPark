import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { EntityForm, type FieldDef } from "@/components/admin/EntityForm";
import { PageHead } from "@/components/admin/EntityTable";

const fields: FieldDef[] = [
  { name: "name", label: "الاسم", type: "text", required: true },
  { name: "text", label: "النص", type: "textarea", rows: 5, required: true },
  {
    name: "rating",
    label: "التقييم",
    type: "select",
    options: [
      ["5", "5 نجوم"],
      ["4", "4 نجوم"],
      ["3", "3 نجوم"],
      ["2", "نجمتان"],
      ["1", "نجمة"],
    ],
  },
  {
    name: "status",
    label: "الحالة",
    type: "select",
    options: [
      ["pending", "بانتظار الاعتماد"],
      ["published", "منشور"],
      ["hidden", "مخفي"],
    ],
  },
  { name: "sortOrder", label: "الترتيب", type: "number" },
];

export default async function TestimonialFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const item = id === "new" ? null : await db.testimonial.findUnique({ where: { id } });
  if (id !== "new" && !item) notFound();
  const initial: Record<string, unknown> = item ?? { rating: 5, status: "pending", sortOrder: 0 };
  return (
    <div>
      <PageHead title={id === "new" ? "إضافة رأي" : "تعديل الرأي"} back="/admin/testimonials" />
      <EntityForm fields={fields} initial={initial} base="/admin/testimonials" api="/api/admin/testimonials" id={id} />
    </div>
  );
}
