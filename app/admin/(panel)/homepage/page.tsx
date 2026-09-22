import Link from "next/link";
import { getDb } from "@/lib/db";
import { PageHead } from "@/components/admin/EntityTable";
import { BooleanToggle } from "@/components/admin/RowActions";

export default async function HomepageAdminPage() {
  const db = await getDb();
  const sections = await db.homeSection.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <PageHead title="إدارة الصفحة الرئيسية" />
      <div className="tableWrap">
        <table className="adminTable">
          <thead>
            <tr>
              <th>القسم</th>
              <th>العنوان</th>
              <th>الظهور</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.id}>
                <td>
                  <span dir="ltr">{s.key}</span>
                </td>
                <td>{s.title ?? "—"}</td>
                <td>
                  <span className={`badge ${s.visible ? "st-published" : "st-hidden"}`}>
                    {s.visible ? "ظاهر" : "مخفي"}
                  </span>
                </td>
                <td>
                  <span className="rowActions">
                    <Link href={`/admin/homepage/${s.id}`}>تعديل</Link>
                    <BooleanToggle
                      api="/api/admin/home-sections"
                      id={s.id}
                      field="visible"
                      value={s.visible}
                      onLabel="إخفاء"
                      offLabel="إظهار"
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
