import Link from "next/link";
import { ArrowUpRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ReportChart } from "@/components/app/sales/report/report-chart";
import { type HomeSummary } from "@/actions/home";

type SalesTodayCardProps = {
  summary: HomeSummary;
};

function ComparisonBadge({
  comparison,
}: {
  comparison: HomeSummary["comparison"];
}) {
  if (comparison.direction === "new") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 px-2 py-0.5 text-xs font-medium text-blue-400">
        Sin ventas ayer
      </span>
    );
  }

  if (comparison.direction === "same" || comparison.percentChange === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-2 py-0.5 text-xs font-medium text-gray-400">
        <Minus size={12} />
        Igual que ayer
      </span>
    );
  }

  const isUp = comparison.direction === "up";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
        isUp
          ? "border-green-500/30 text-green-400"
          : "border-red-500/30 text-red-400"
      }`}
    >
      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(comparison.percentChange).toFixed(0)}% vs. ayer
    </span>
  );
}

export function SalesTodayCard({ summary }: SalesTodayCardProps) {
  return (
    <Link
      href="/sales/report"
      className="group flex h-full flex-col rounded-2xl border border-white/20 bg-black p-5 transition hover:border-white/50 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-400">Ventas de hoy</p>
          <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            ${summary.totalAmount.toFixed(2)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-400">
              {summary.totalSales}{" "}
              {summary.totalSales === 1 ? "venta" : "ventas"}
            </span>
            <ComparisonBadge comparison={summary.comparison} />
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-gray-400 transition group-hover:text-white">
          Ver reporte
          <ArrowUpRight
            size={16}
            className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>

      <div className="mt-4 flex-1">
        {summary.chartPoints.length === 0 ? (
          <div className="flex h-full min-h-[220px] items-center justify-center">
            <p className="text-center text-sm text-gray-400">
              Aún no hay ventas registradas hoy.
            </p>
          </div>
        ) : (
          <ReportChart points={summary.chartPoints} />
        )}
      </div>
    </Link>
  );
}
