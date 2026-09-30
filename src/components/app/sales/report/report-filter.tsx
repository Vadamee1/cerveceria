"use client";

import { type ReportFilter } from "@/actions/report";

const filters: { value: ReportFilter; label: string }[] = [
  { value: "day", label: "Hoy" },
  { value: "week", label: "Esta semana" },
  { value: "month", label: "Este mes" },
];

type ReportFilterProps = {
  value: ReportFilter;
  onChange: (filter: ReportFilter) => void;
  disabled?: boolean;
};

export function ReportFilterSelector({
  value,
  onChange,
  disabled,
}: ReportFilterProps) {
  return (
    <div className="flex w-full rounded-lg border border-white/20 overflow-hidden lg:w-auto">
      {filters.map((f) => (
        <button
          key={f.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(f.value)}
          className={`flex-1 cursor-pointer whitespace-nowrap px-2 py-2 text-xs font-medium transition disabled:opacity-50 sm:px-3 sm:text-sm lg:flex-initial lg:px-4
            ${
              value === f.value
                ? "bg-white text-black"
                : "bg-black text-gray-400 hover:text-white"
            }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
