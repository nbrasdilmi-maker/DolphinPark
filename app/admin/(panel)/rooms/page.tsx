import Link from "next/link";
import { getDb } from "@/lib/db";
import { EntityTable, PageHead } from "@/components/admin/EntityTable";
import type { Prisma } from "@/generated/prisma-postgres";

export default async function RoomsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const db = await getDb();
  const where: Prisma.RoomWhereInput = {};
  if (sp.status) where.status = sp.status;
  if (sp.q) where.OR = [{ name: { contains: sp.q } }, { slug: { contains: sp.q } }];
  const rooms = await db.room.findMany({ where, orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <PageHead
        title="إدارة الغرف"
        action={
          <Link className="btnLink" href="/admin/rooms/new">
            إضافة غرفة
          </Link>
        }
      />
      <EntityTable
        columns={[
          { key: "coverUrl", label: "الصورة", kind: "image" },
          { key: "name", label: "الاسم" },
          { key: "type", label: "النوع" },
          { key: "price", label: "السعر" },
          { key: "status", label: "الحالة", kind: "status" },
        ]}
        rows={rooms}
        base="/admin/rooms"
        api="/api/admin/rooms"
      />
    </div>
  );
}
