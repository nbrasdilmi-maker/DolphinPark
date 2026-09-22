import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { parseList } from "@/lib/content";
import { EntityForm, type FieldDef } from "@/components/admin/EntityForm";
import { PageHead } from "@/components/admin/EntityTable";

const fields: FieldDef[] = [
  { name: "name", label: "اسم الغرفة", type: "text", required: true },
  { name: "slug", label: "الرابط المختصر", type: "text", required: true, dir: "ltr" },
  { name: "number", label: "رقم الغرفة", type: "text", dir: "ltr" },
  {
    name: "type",
    label: "النوع",
    type: "select",
    options: [
      ["", "—"],
      ["عائلية", "عائلية"],
      ["جناح", "جناح"],
      ["مزدوجة", "مزدوجة"],
      ["أخرى", "أخرى"],
    ],
  },
  { name: "shortDesc", label: "الوصف المختصر", type: "textarea" },
  { name: "longDesc", label: "الوصف التفصيلي", type: "textarea", rows: 6 },
  { name: "price", label: "السعر", type: "text" },
  { name: "currency", label: "العملة", type: "text" },
  { name: "capacity", label: "السعة", type: "number" },
  { name: "beds", label: "عدد الأسرة", type: "number" },
  { name: "featuresJson", label: "المميزات", type: "list" },
  { name: "coverUrl", label: "الصورة الرئيسية", type: "image" },
  { name: "galleryJson", label: "معرض الصور", type: "imagelist" },
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

export default async function RoomFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const room =
    id === "new" ? null : await db.room.findUnique({ where: { id } });
  if (id !== "new" && !room) notFound();
  const initial: Record<string, unknown> = room
    ? {
        ...room,
        featuresJson: parseList(room.featuresJson),
        galleryJson: parseList(room.galleryJson),
      }
    : { status: "draft", currency: "ر.ي", sortOrder: 0 };
  return (
    <div>
      <PageHead title={id === "new" ? "إضافة غرفة" : "تعديل الغرفة"} back="/admin/rooms" />
      <EntityForm fields={fields} initial={initial} base="/admin/rooms" api="/api/admin/rooms" id={id} />
    </div>
  );
}
