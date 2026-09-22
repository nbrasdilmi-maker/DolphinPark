import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { EntityForm, type FieldDef } from "@/components/admin/EntityForm";
import { PageHead } from "@/components/admin/EntityTable";
import { AlbumItems } from "@/components/admin/AlbumItems";

const fields: FieldDef[] = [
  { name: "name", label: "اسم الألبوم", type: "text", required: true },
  { name: "slug", label: "الرابط المختصر", type: "text", required: true, dir: "ltr" },
  { name: "desc", label: "الوصف", type: "textarea" },
  { name: "coverUrl", label: "الصورة الرئيسية", type: "image" },
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

export default async function AlbumFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const album = id === "new" ? null : await db.galleryAlbum.findUnique({ where: { id } });
  if (id !== "new" && !album) notFound();
  const initial: Record<string, unknown> = album ?? { status: "published", sortOrder: 0 };
  return (
    <div>
      <PageHead title={id === "new" ? "إضافة ألبوم" : "تعديل الألبوم"} back="/admin/gallery" />
      <EntityForm fields={fields} initial={initial} base="/admin/gallery" api="/api/admin/albums" id={id} />
      {id !== "new" ? <AlbumItems albumId={id} /> : null}
    </div>
  );
}
