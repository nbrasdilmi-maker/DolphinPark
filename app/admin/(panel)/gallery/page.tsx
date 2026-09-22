import Link from "next/link";
import { getDb } from "@/lib/db";
import { EntityTable, PageHead } from "@/components/admin/EntityTable";
import type { Prisma } from "@/generated/prisma-postgres";

export default async function AlbumsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const db = await getDb();
  const where: Prisma.GalleryAlbumWhereInput = {};
  if (sp.q) where.name = { contains: sp.q };
  const albums = await db.galleryAlbum.findMany({
    where,
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { items: true } } },
  });
  return (
    <div>
      <PageHead
        title="إدارة المعرض"
        action={
          <Link className="btnLink" href="/admin/gallery/new">
            إضافة ألبوم
          </Link>
        }
      />
      <EntityTable
        columns={[
          { key: "coverUrl", label: "الغلاف", kind: "image" },
          { key: "name", label: "الألبوم" },
          { key: "status", label: "الحالة", kind: "status" },
        ]}
        rows={albums}
        base="/admin/gallery"
        api="/api/admin/albums"
      />
    </div>
  );
}
