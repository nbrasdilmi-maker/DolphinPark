import { getDb } from "@/lib/db";
import { EntityTable, PageHead } from "@/components/admin/EntityTable";
import { HeroUpload } from "@/components/admin/HeroUpload";

export default async function HeroAdminPage() {
  const db = await getDb();
  const slides = await db.heroSlide.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <PageHead title="صور الواجهة الرئيسية" />
      <HeroUpload />
      <br />
      <EntityTable
        columns={[
          { key: "mediaUrl", label: "الصورة", kind: "image" },
          { key: "caption", label: "التسمية" },
          { key: "status", label: "الحالة", kind: "status" },
        ]}
        rows={slides}
        base="/admin/hero"
        api="/api/admin/hero-slides"
      />
    </div>
  );
}
