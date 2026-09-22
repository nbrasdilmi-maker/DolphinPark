import { getDb } from "@/lib/db";
import { PageHead } from "@/components/admin/EntityTable";
import { StatusActions } from "@/components/admin/StatusActions";
import { ExportCsv } from "@/components/admin/ExportCsv";

const OPTIONS: Array<[string, string]> = [
  ["new", "جديد"],
  ["seen", "مقروء"],
  ["done", "تم"],
];

function label(v: string): string {
  return OPTIONS.find(([x]) => x === v)?.[1] ?? v;
}

export default async function MessagesAdminPage() {
  const db = await getDb();
  const items = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div>
      <PageHead
        title="رسائل التواصل"
        action={
          <ExportCsv
            api="/api/admin/messages"
            filename="messages.csv"
            columns={[
              { key: "name", label: "الاسم" },
              { key: "phone", label: "الهاتف" },
              { key: "subject", label: "الموضوع" },
              { key: "message", label: "الرسالة" },
              { key: "status", label: "الحالة" },
            ]}
          />
        }
      />
      <div className="tableWrap">
        <table className="adminTable">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الهاتف</th>
              <th>الموضوع</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>
                  <span dir="ltr">{m.phone}</span>
                </td>
                <td>{m.subject ?? "—"}</td>
                <td>
                  <span className={`badge st-${m.status}`}>{label(m.status)}</span>
                </td>
                <td>
                  <StatusActions api="/api/admin/messages" id={m.id} current={m.status} options={OPTIONS} />
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={5}>لا توجد رسائل بعد.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
