import { cookies } from "next/headers";
import { verifySession, cookieName } from "@/lib/auth";
import { AdminShortcutButton } from "./AdminShortcutButton";

export async function SiteAdminShortcut() {
  const store = await cookies();
  const session = await verifySession(store.get(cookieName())?.value ?? "");
  return <AdminShortcutButton show={!!session} />;
}
