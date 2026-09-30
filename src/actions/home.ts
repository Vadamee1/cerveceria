"use server";

import { prisma } from "@/lib/prisma";
import { type SaleChartPoint } from "@/actions/report";

const TOP_PRODUCTS_LIMIT = 5;
const LOW_STOCK_THRESHOLD = 5;

export type SalesComparison = {
  percentChange: number | null;
  direction: "up" | "down" | "same" | "new";
  yesterdayAmount: number;
};

export type HomeSummary = {
  totalAmount: number;
  totalSales: number;
  chartPoints: SaleChartPoint[];
  comparison: SalesComparison;
};

export type TopProduct = {
  id: string;
  name: string;
  quantity: number;
  amount: number;
};

export type LowStockProduct = {
  id: string;
  name: string;
  categoryName: string;
  stock: number;
  status: "out" | "low";
};

export type HomeData = {
  summary: HomeSummary;
  topProducts: TopProduct[];
  lowStockProducts: LowStockProduct[];
};

function getDateRange(daysAgo: number) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - daysAgo);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

async function getAmountForRange(start: Date, end: Date): Promise<number> {
  const result = await prisma.sale.aggregate({
    where: { date: { gte: start, lt: end } },
    _sum: { amount: true },
  });
  return Number(result._sum.amount ?? 0);
}

function computeComparison(
  todayAmount: number,
  yesterdayAmount: number,
): SalesComparison {
  if (yesterdayAmount === 0) {
    return {
      percentChange: null,
      direction: todayAmount > 0 ? "new" : "same",
      yesterdayAmount,
    };
  }

  const percentChange =
    ((todayAmount - yesterdayAmount) / yesterdayAmount) * 100;

  return {
    percentChange,
    direction: percentChange > 0 ? "up" : percentChange < 0 ? "down" : "same",
    yesterdayAmount,
  };
}

async function getTodaySummary(): Promise<HomeSummary> {
  const { start, end } = getDateRange(0);
  const { start: yStart, end: yEnd } = getDateRange(1);

  const [sales, yesterdayAmount] = await Promise.all([
    prisma.sale.findMany({
      where: { date: { gte: start, lt: end } },
      select: { amount: true, date: true },
      orderBy: { date: "asc" },
    }),
    getAmountForRange(yStart, yEnd),
  ]);

  const totalAmount = sales.reduce((sum, s) => sum + Number(s.amount), 0);
  const totalSales = sales.length;

  const hourlyTotals = new Map<number, number>();
  for (const sale of sales) {
    const hour = sale.date.getHours();
    hourlyTotals.set(hour, (hourlyTotals.get(hour) ?? 0) + Number(sale.amount));
  }

  const chartPoints: SaleChartPoint[] = Array.from(hourlyTotals.entries())
    .sort(([a], [b]) => a - b)
    .map(([hour, total]) => ({
      label: `${hour.toString().padStart(2, "0")}:00`,
      total,
    }));

  return {
    totalAmount,
    totalSales,
    chartPoints,
    comparison: computeComparison(totalAmount, yesterdayAmount),
  };
}

async function getTopProducts(): Promise<TopProduct[]> {
  const { start, end } = getDateRange(0);

  const grouped = await prisma.productSale.groupBy({
    by: ["productId"],
    where: { sale: { date: { gte: start, lt: end } } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: TOP_PRODUCTS_LIMIT,
  });

  if (grouped.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: grouped.map((g) => g.productId) } },
    select: { id: true, name: true, price: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  return grouped.map((g) => {
    const product = productMap.get(g.productId);
    const quantity = g._sum.quantity ?? 0;
    return {
      id: g.productId,
      name: product?.name ?? "Producto eliminado",
      quantity,
      amount: product ? Number(product.price) * quantity : 0,
    };
  });
}

async function getLowStockProducts(): Promise<LowStockProduct[]> {
  const products = await prisma.product.findMany({
    where: { stock: { lte: LOW_STOCK_THRESHOLD } },
    select: {
      id: true,
      name: true,
      stock: true,
      category: { select: { name: true } },
    },
    orderBy: { stock: "asc" },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    categoryName: p.category.name,
    stock: p.stock,
    status: p.stock === 0 ? "out" : "low",
  }));
}

export async function getHomeData(): Promise<HomeData> {
  const [summary, topProducts, lowStockProducts] = await Promise.all([
    getTodaySummary(),
    getTopProducts(),
    getLowStockProducts(),
  ]);

  return { summary, topProducts, lowStockProducts };
}
