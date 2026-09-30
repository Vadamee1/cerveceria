"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/app/sidebar/navbar";
import { SidebarDrawer } from "@/components/app/sidebar/sidebar-drawer";

function normalizeRole(role: unknown): string | null {
  if (typeof role === "string") return role.toLowerCase();
  if (
    role &&
    typeof role === "object" &&
    "name" in role &&
    typeof (role as { name: unknown }).name === "string"
  ) {
    return (role as { name: string }).name.toLowerCase();
  }
  return null;
}

type AppShellProps = {
  role: unknown;
  children: React.ReactNode;
};

export function AppShell({ role, children }: AppShellProps) {
  const [open, setOpen] = useState(false);
  const normalizedRole = normalizeRole(role);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!normalizedRole) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full">
      <Navbar role={role} onMenuClick={() => setOpen(true)} />

      {normalizedRole === "admin" && (
        <SidebarDrawer open={open} onClose={() => setOpen(false)} />
      )}

      <main className="pt-24">{children}</main>
    </div>
  );
}
