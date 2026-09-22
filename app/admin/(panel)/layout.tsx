import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession, cookieName } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const session = await verifySession(store.get(cookieName())?.value ?? "");
  if (!session) redirect("/admin/login");
  return (
    <AdminShell username={session.username} role={session.role}>
      {children}
    </AdminShell>
  );
}
