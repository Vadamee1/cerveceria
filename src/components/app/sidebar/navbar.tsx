"use client";

import { Menu } from "lucide-react";
import { LogoutButton } from "@/components/app/sidebar/logout-button";

type NavbarProps = {
  role: unknown;
  onMenuClick: () => void;
};

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

export function Navbar({ role, onMenuClick }: NavbarProps) {
  const normalizedRole = normalizeRole(role);
  const isAdmin = normalizedRole === "admin";
  const isVendor = normalizedRole === "seller";

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-20 w-full items-center justify-between border-b-2 border-white/10 bg-black px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {isAdmin && (
          <button
            type="button"
            onClick={onMenuClick}
            className="cursor-pointer text-white transition hover:text-gray-300"
            aria-label="Abrir menú"
          >
            <Menu size={26} />
          </button>
        )}
        <span className="text-base font-bold tracking-wide text-white sm:text-lg">
          CERVECERÍA
        </span>
      </div>

      {isVendor && <LogoutButton variant="inline" />}
    </header>
  );
}
