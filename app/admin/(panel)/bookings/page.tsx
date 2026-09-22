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

export default async function BookingsAdminPage() {
  const db = await getDb();
  const items = await db.bookingRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div>
      <PageHead
        title="طلبات الحجز"
        action={
          <ExportCsv
            api="/api/admin/bookings"
            filename="bookings.csv"
            columns={[
              { key: "name", label: "الاسم" },
              { key: "phone", label: "الهاتف" },
              { key: "type", label: "النوع" },
              { key: "guests", label: "الضيوف" },
              { key: "date", label: "التاريخ" },
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
              <th>النوع</th>
              <th>التاريخ</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>
                  <span dir="ltr">{b.phone}</span>
                </td>
                <td>{b.type ?? "—"}</td>
                <td>{b.date ?? "—"}</td>
                <td>
                  <span className={`badge st-${b.status}`}>{label(b.status)}</span>
                </td>
                <td>
                  <StatusActions api="/api/admin/bookings" id={b.id} current={b.status} options={OPTIONS} />
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={6}>لا توجد طلبات بعد.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
