import * as XLSX from "xlsx";
import { type SaleRow, type ReportFilter } from "@/actions/report";

const filterLabel: Record<ReportFilter, string> = {
  day: "hoy",
  week: "esta-semana",
  month: "este-mes",
};

export function exportSalesToExcel(rows: SaleRow[], filter: ReportFilter) {
  const data = rows.map((row) => ({
    "ID Ticket": row.id,
    Fecha: row.date,
    Vendedor: row.seller,
    "Método de pago": row.paymentType,
    "Número de items": row.itemCount,
    "Total ($)": row.amount,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ventas");

  ws["!cols"] = [
    { wch: 36 },
    { wch: 20 },
    { wch: 16 },
    { wch: 18 },
    { wch: 16 },
    { wch: 12 },
  ];

  XLSX.writeFile(wb, `ventas-${filterLabel[filter]}.xlsx`);
}
