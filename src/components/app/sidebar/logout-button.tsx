"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";

type LogoutButtonProps = {
  variant?: "block" | "inline";
};

export function LogoutButton({ variant = "block" }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={
          variant === "block"
            ? "flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
            : "flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-gray-300 transition hover:border-red-500/30 hover:text-red-400"
        }
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </form>
  );
}
