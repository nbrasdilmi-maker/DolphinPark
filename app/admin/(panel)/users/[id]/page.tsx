import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-guard";
import { PageHead } from "@/components/admin/EntityTable";
import { UserForm } from "@/components/admin/UserForm";

export default async function UserFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session || session.role !== "superadmin") redirect("/admin/users");
  const { id } = await params;
  const db = await getDb();
  const user = id === "new" ? null : await db.adminUser.findUnique({ where: { id } });
  if (id !== "new" && !user) notFound();
  return (
    <div>
      <PageHead title={id === "new" ? "إضافة مستخدم" : "تعديل المستخدم"} back="/admin/users" />
      <UserForm
        id={id}
        initial={{ username: user?.username ?? "", name: user?.name ?? "", role: user?.role ?? "editor" }}
      />
    </div>
  );
}
