import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { EntityForm, type FieldDef } from "@/components/admin/EntityForm";
import { PageHead } from "@/components/admin/EntityTable";

const fields: FieldDef[] = [
  { name: "label", label: "الاسم", type: "text", required: true },
  { name: "href", label: "الرابط", type: "text", required: true, dir: "ltr" },
  {
    name: "location",
    label: "المكان",
    type: "select",
    options: [
      ["header", "علوي"],
      ["footer", "سفلي"],
    ],
  },
  { name: "sortOrder", label: "الترتيب", type: "number" },
  { name: "visible", label: "ظاهر", type: "checkbox" },
];

export default async function NavFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const item = id === "new" ? null : await db.navItem.findUnique({ where: { id } });
  if (id !== "new" && !item) notFound();
  const initial: Record<string, unknown> = item ?? { location: "header", sortOrder: 0, visible: true };
  return (
    <div>
      <PageHead title={id === "new" ? "إضافة عنصر" : "تعديل العنصر"} back="/admin/navigation" />
      <EntityForm fields={fields} initial={initial} base="/admin/navigation" api="/api/admin/navigation" id={id} />
    </div>
  );
}
