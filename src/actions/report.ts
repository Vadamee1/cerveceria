"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { startOfDay, startOfWeek, startOfMonth, endOfDay } from "date-fns";

export type ReportFilter = "day" | "week" | "month";

export type SaleRow = {
  id: string;
  date: string;
  amount: number;
  paymentType: string;
  seller: string;
  itemCount: number;
};

export type SaleChartPoint = {
  label: string;
  total: number;
};

export type ReportData = {
  rows: SaleRow[];
  chartPoints: SaleChartPoint[];
  totalAmount: number;
  totalSales: number;
};

function getDateRange(filter: ReportFilter): { from: Date; to: Date } {
  const now = new Date();
  const to = endOfDay(now);

  switch (filter) {
    case "day":
      return { from: startOfDay(now), to };
    case "week":
      return { from: startOfWeek(now, { weekStartsOn: 1 }), to };
    case "month":
      return { from: startOfMonth(now), to };
  }
}

function formatLabel(date: Date, filter: ReportFilter): string {
  switch (filter) {
    case "day":
      return date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "week":
      return date.toLocaleDateString("es-MX", {
        weekday: "short",
        day: "numeric",
      });
    case "month":
      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
      });
  }
}

export async function getSalesReport(
  filter: ReportFilter,
): Promise<ReportData> {
  await requireAuth();

  const { from, to } = getDateRange(filter);

  const sales = await prisma.sale.findMany({
    where: { date: { gte: from, lte: to } },
    select: {
      id: true,
      date: true,
      amount: true,
      paymentType: { select: { name: true } },
      user: { select: { username: true } },
      products: { select: { quantity: true } },
    },
    orderBy: { date: "asc" },
  });

  const rows: SaleRow[] = sales.map((sale) => ({
    id: sale.id,
    date: sale.date.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    amount: Number(sale.amount),
    paymentType: sale.paymentType.name,
    seller: sale.user.username,
    itemCount: sale.products.reduce((sum, p) => sum + p.quantity, 0),
  }));

  const chartMap = new Map<string, number>();
  for (const sale of sales) {
    const label = formatLabel(sale.date, filter);
    chartMap.set(label, (chartMap.get(label) ?? 0) + Number(sale.amount));
  }

  const chartPoints: SaleChartPoint[] = Array.from(chartMap.entries()).map(
    ([label, total]) => ({ label, total }),
  );

  const totalAmount = rows.reduce((sum, r) => sum + r.amount, 0);

  return { rows, chartPoints, totalAmount, totalSales: rows.length };
}
