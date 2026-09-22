import Link from "next/link";
import { getDb } from "@/lib/db";
import { EntityTable, PageHead } from "@/components/admin/EntityTable";

export default async function PagesAdminPage() {
  const db = await getDb();
  const pages = await db.page.findMany({ orderBy: { slug: "asc" } });
  return (
    <div>
      <PageHead
        title="إدارة الصفحات"
        action={
          <Link className="btnLink" href="/admin/pages/new">
            إضافة صفحة
          </Link>
        }
      />
      <EntityTable
        columns={[
          { key: "slug", label: "المسار" },
          { key: "title", label: "العنوان" },
          { key: "status", label: "الحالة", kind: "status" },
        ]}
        rows={pages}
        base="/admin/pages"
        api="/api/admin/pages"
      />
    </div>
  );
}
