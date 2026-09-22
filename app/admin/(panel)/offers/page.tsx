import Link from "next/link";
import { getDb } from "@/lib/db";
import { EntityTable, PageHead } from "@/components/admin/EntityTable";
import type { Prisma } from "@/generated/prisma-postgres";

export default async function OffersAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const db = await getDb();
  const where: Prisma.OfferWhereInput = {};
  if (sp.q) where.OR = [{ name: { contains: sp.q } }, { title: { contains: sp.q } }];
  const offers = await db.offer.findMany({ where, orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <PageHead
        title="إدارة العروض"
        action={
          <Link className="btnLink" href="/admin/offers/new">
            إضافة عرض
          </Link>
        }
      />
      <EntityTable
        columns={[
          { key: "coverUrl", label: "الصورة", kind: "image" },
          { key: "title", label: "العنوان" },
          { key: "badge", label: "الشارة" },
          { key: "price", label: "السعر" },
          { key: "status", label: "الحالة", kind: "status" },
        ]}
        rows={offers}
        base="/admin/offers"
        api="/api/admin/offers"
      />
    </div>
  );
}
