import Link from "next/link";
import { getDb } from "@/lib/db";
import { PageHead } from "@/components/admin/EntityTable";
import { BooleanToggle } from "@/components/admin/RowActions";

export default async function NavigationAdminPage() {
  const db = await getDb();
  const items = await db.navItem.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <PageHead
        title="إدارة التنقل"
        action={
          <Link className="btnLink" href="/admin/navigation/new">
            إضافة عنصر
          </Link>
        }
      />
      <div className="tableWrap">
        <table className="adminTable">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الرابط</th>
              <th>المكان</th>
              <th>الظهور</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>{it.label}</td>
                <td>
                  <span dir="ltr">{it.href}</span>
                </td>
                <td>{it.location === "header" ? "علوي" : "سفلي"}</td>
                <td>
                  <span className={`badge ${it.visible ? "st-published" : "st-hidden"}`}>
                    {it.visible ? "ظاهر" : "مخفي"}
                  </span>
                </td>
                <td>
                  <span className="rowActions">
                    <Link href={`/admin/navigation/${it.id}`}>تعديل</Link>
                    <BooleanToggle
                      api="/api/admin/navigation"
                      id={it.id}
                      field="visible"
                      value={it.visible}
                      onLabel="إخفاء"
                      offLabel="إظهار"
                    />
                  </span>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={5}>لا توجد عناصر بعد.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
