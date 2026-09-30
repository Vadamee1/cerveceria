import Link from "next/link";
import { Plus } from "lucide-react";

export function NewSaleCta() {
  return (
    <Link
      href="/sales"
      className="group flex items-center justify-between gap-3 rounded-2xl border border-white bg-white p-5 transition hover:bg-gray-200 sm:p-6"
    >
      <div>
        <p className="mt-1 text-lg font-bold text-black">Nueva venta</p>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white transition group-hover:scale-105">
        <Plus size={20} />
      </span>
    </Link>
  );
}
