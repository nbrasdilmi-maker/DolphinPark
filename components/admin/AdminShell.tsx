"use client";

import { useState } from "react";
import { Menu } from "@/components/icons";
import { Sidebar } from "./Sidebar";

export function AdminShell({
  username,
  role,
  children,
}: {
  username: string;
  role: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="adminShell" dir="rtl">
      <button type="button" className="adminFab" onClick={() => setOpen(true)} aria-label="فتح القائمة">
        <Menu size={24} />
      </button>
      <Sidebar username={username} role={role} open={open} onClose={() => setOpen(false)} />
      <main className="adminMain">{children}</main>
    </div>
  );
}
