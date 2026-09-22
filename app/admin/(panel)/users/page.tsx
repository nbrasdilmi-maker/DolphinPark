import Link from "next/link";
import { getDb } from "@/lib/db";
import { PageHead } from "@/components/admin/EntityTable";
import { getAdminSession } from "@/lib/admin-guard";

export default async function UsersAdminPage() {
  const session = await getAdminSession();
  const db = await getDb();
  const users = await db.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, username: true, name: true, role: true, lastLoginAt: true },
  });
  const roleLabel = (r: string) =>
    r === "superadmin" ? "مدير عام" : r === "admin" ? "مدير" : "محرر";
  return (
    <div>
      <PageHead
        title="المستخدمون"
        action={
          session?.role === "superadmin" ? (
            <Link className="btnLink" href="/admin/users/new">
              إضافة مستخدم
            </Link>
          ) : undefined
        }
      />
      <div className="tableWrap">
        <table className="adminTable">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>المستخدم</th>
              <th>الدور</th>
              <th>آخر دخول</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>
                  <span dir="ltr">{u.username}</span>
                </td>
                <td>{roleLabel(u.role)}</td>
                <td>
                  <span dir="ltr">
                    {u.lastLoginAt ? u.lastLoginAt.toLocaleString("en-GB") : "—"}
                  </span>
                </td>
                <td>
                  {session?.role === "superadmin" ? (
                    <span className="rowActions">
                      <Link href={`/admin/users/${u.id}`}>تعديل</Link>
                    </span>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
