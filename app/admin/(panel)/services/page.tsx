import Link from "next/link";
import { getDb } from "@/lib/db";
import { EntityTable, PageHead } from "@/components/admin/EntityTable";
import type { Prisma } from "@/generated/prisma-postgres";

export default async function ServicesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const db = await getDb();
  const where: Prisma.ServiceWhereInput = {};
  if (sp.q) where.OR = [{ name: { contains: sp.q } }, { slug: { contains: sp.q } }];
  const services = await db.service.findMany({ where, orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <PageHead
        title="إدارة الخدمات"
        action={
          <Link className="btnLink" href="/admin/services/new">
            إضافة خدمة
          </Link>
        }
      />
      <EntityTable
        columns={[
          { key: "name", label: "الاسم" },
          { key: "category", label: "القسم" },
          { key: "status", label: "الحالة", kind: "status" },
        ]}
        rows={services}
        base="/admin/services"
        api="/api/admin/services"
      />
    </div>
  );
}
