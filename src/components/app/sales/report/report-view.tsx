"use client";

import { useState } from "react";
import { BarChart2, TableIcon, Download } from "lucide-react";
import { useReport } from "@/hooks/app/sales/report/use-report";
import { ReportFilterSelector } from "@/components/app/sales/report/report-filter";
import { ReportTable } from "@/components/app/sales/report/report-table";
import { ReportChart } from "@/components/app/sales/report/report-chart";
import { exportSalesToExcel } from "@/lib/export-excel";
import { type ReportData } from "@/actions/report";

type ReportViewProps = {
  initialData: ReportData;
};

type ViewMode = "table" | "chart";

export function ReportView({ initialData }: ReportViewProps) {
  const { filter, data, isPending, changeFilter } = useReport(initialData);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-xl font-bold text-white sm:text-2xl">
          Reporte de ventas
        </h1>
        <hr className="my-6 border-gray-700" />

        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-white bg-black p-4 sm:p-5">
            <p className="text-xs text-gray-400 sm:text-sm">Total recaudado</p>
            <p className="mt-1 text-lg font-bold text-white sm:text-2xl">
              ${data.totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="rounded-2xl border border-white bg-black p-4 sm:p-5">
            <p className="text-xs text-gray-400 sm:text-sm">
              Ventas realizadas
            </p>
            <p className="mt-1 text-lg font-bold text-white sm:text-2xl">
              {data.totalSales}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <ReportFilterSelector
            value={filter}
            onChange={changeFilter}
            disabled={isPending}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:justify-end lg:gap-3">
            <div className="flex w-full rounded-lg border border-white/20 overflow-hidden sm:w-auto">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex-1 cursor-pointer p-2 transition sm:flex-initial
                  ${viewMode === "table" ? "bg-white text-black" : "bg-black text-gray-400 hover:text-white"}`}
                aria-label="Ver tabla"
              >
                <TableIcon size={18} className="mx-auto" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("chart")}
                className={`flex-1 cursor-pointer p-2 transition sm:flex-initial
                  ${viewMode === "chart" ? "bg-white text-black" : "bg-black text-gray-400 hover:text-white"}`}
                aria-label="Ver gráfica"
              >
                <BarChart2 size={18} className="mx-auto" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => exportSalesToExcel(data.rows, filter)}
              disabled={data.rows.length === 0}
              className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Download size={16} />
              Exportar Excel
            </button>
          </div>
        </div>

        {isPending ? (
          <p className="text-gray-400">Cargando datos...</p>
        ) : viewMode === "table" ? (
          <ReportTable rows={data.rows} />
        ) : (
          <div className="rounded-2xl border border-white bg-black p-4 sm:p-6">
            <ReportChart points={data.chartPoints} />
          </div>
        )}
      </div>
    </div>
  );
}
