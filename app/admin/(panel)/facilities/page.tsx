import Link from "next/link";
import { getDb } from "@/lib/db";
import { EntityTable, PageHead } from "@/components/admin/EntityTable";
import type { Prisma } from "@/generated/prisma-postgres";

export default async function FacilitiesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const db = await getDb();
  const where: Prisma.FacilityWhereInput = {};
  if (sp.q) where.title = { contains: sp.q };
  const facilities = await db.facility.findMany({ where, orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <PageHead
        title="إدارة المرافق"
        action={
          <Link className="btnLink" href="/admin/facilities/new">
            إضافة مرفق
          </Link>
        }
      />
      <EntityTable
        columns={[
          { key: "title", label: "العنوان" },
          { key: "status", label: "الحالة", kind: "status" },
        ]}
        rows={facilities}
        base="/admin/facilities"
        api="/api/admin/facilities"
      />
    </div>
  );
}
