import Link from "next/link";
import { getDb } from "@/lib/db";
import { EntityTable, PageHead } from "@/components/admin/EntityTable";

export default async function TestimonialsAdminPage() {
  const db = await getDb();
  const items = await db.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <PageHead
        title="آراء الزوار"
        action={
          <Link className="btnLink" href="/admin/testimonials/new">
            إضافة رأي
          </Link>
        }
      />
      <EntityTable
        columns={[
          { key: "name", label: "الاسم" },
          { key: "rating", label: "التقييم" },
          { key: "status", label: "الحالة", kind: "status" },
        ]}
        rows={items}
        base="/admin/testimonials"
        api="/api/admin/testimonials"
      />
    </div>
  );
}
