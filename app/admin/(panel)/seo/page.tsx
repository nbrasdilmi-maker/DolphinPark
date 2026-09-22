import Link from "next/link";
import { getDb } from "@/lib/db";
import { EntityTable, PageHead } from "@/components/admin/EntityTable";

export default async function SeoAdminPage() {
  const db = await getDb();
  const rows = await db.seoPage.findMany({ orderBy: { pageSlug: "asc" } });
  return (
    <div>
      <PageHead
        title="إدارة SEO"
        action={
          <Link className="btnLink" href="/admin/seo/new">
            إضافة صفحة
          </Link>
        }
      />
      <EntityTable
        columns={[
          { key: "pageSlug", label: "الصفحة" },
          { key: "metaTitle", label: "العنوان" },
        ]}
        rows={rows}
        base="/admin/seo"
        api="/api/admin/seo"
        withStatus={false}
      />
    </div>
  );
}
