import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { PageHead } from "@/components/admin/EntityTable";
import { SectionForm } from "@/components/admin/SectionForm";

export default async function SectionFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const [section, albums] = await Promise.all([
    db.homeSection.findUnique({ where: { id } }),
    db.galleryAlbum.findMany({
      where: { status: "published" },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, name: true },
    }),
  ]);
  if (!section) notFound();
  return (
    <div>
      <PageHead title={`تعديل قسم ${section.key}`} back="/admin/homepage" />
      <SectionForm section={section} albums={albums} />
    </div>
  );
}
