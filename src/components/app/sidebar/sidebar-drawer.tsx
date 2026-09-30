"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navItems } from "@/components/app/sidebar/nav-items";
import { LogoutButton } from "@/components/app/sidebar/logout-button";

type SidebarDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function getActiveHref(pathname: string): string | null {
  const matches = navItems.filter((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  if (matches.length === 0) return null;

  return matches.reduce((longest, item) =>
    item.href.length > longest.href.length ? item : longest,
  ).href;
}

export function SidebarDrawer({ open, onClose }: SidebarDrawerProps) {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 top-20 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r border-white/20 bg-black p-5 pt-20 transition-transform duration-300 ease-in-out xl:w-80 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <span className="text-lg font-bold text-white">Menú</span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-400 transition hover:text-white"
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1.5">
          {navItems.map((item) => {
            const active = activeHref === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition ${
                  active
                    ? "bg-white text-black"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
