"use client";

import { type SaleRow } from "@/actions/report";

type ReportTableProps = {
  rows: SaleRow[];
};

export function ReportTable({ rows }: ReportTableProps) {
  if (rows.length === 0) {
    return <p className="text-gray-400">No hay ventas en este período.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/20">
      <table className="w-full min-w-160 text-sm">
        <thead>
          <tr className="border-b border-white/20 text-left text-gray-400">
            <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-4">
              ID
            </th>
            <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-4">
              Fecha
            </th>
            <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-4">
              Vendedor
            </th>
            <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-4">
              Método de pago
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-right font-medium sm:px-4">
              Items
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-right font-medium sm:px-4">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id}
              className={`border-b border-white/10 transition hover:bg-white/5 ${
                i % 2 === 0 ? "bg-transparent" : "bg-white/2"
              }`}
            >
              <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-gray-400 sm:px-4">
                {row.id.slice(0, 8)}…
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-white sm:px-4">
                {row.date}
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-white sm:px-4">
                {row.seller}
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-gray-300 sm:px-4">
                {row.paymentType}
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-right text-gray-300 sm:px-4">
                {row.itemCount}
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-white sm:px-4">
                ${row.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
