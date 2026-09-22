import { getDb } from "@/lib/db";
import { PageHead } from "@/components/admin/EntityTable";

export default async function ActivityAdminPage() {
  const db = await getDb();
  const items = await db.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div>
      <PageHead title="سجل النشاط" />
      <div className="tableWrap">
        <table className="adminTable">
          <thead>
            <tr>
              <th>العملية</th>
              <th>الكيان</th>
              <th>التفاصيل</th>
              <th>الوقت</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{a.action}</td>
                <td>{a.entity}</td>
                <td>{a.summary ?? "—"}</td>
                <td>
                  <span dir="ltr">{a.createdAt.toLocaleString("en-GB")}</span>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={4}>لا يوجد نشاط بعد.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
