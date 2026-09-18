"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type SaleChartPoint } from "@/actions/report";

type ReportChartProps = {
  points: SaleChartPoint[];
};

export function ReportChart({ points }: ReportChartProps) {
  if (points.length === 0) {
    return <p className="text-gray-400">No hay datos para mostrar.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300} minWidth={0}>
      <BarChart
        data={points}
        margin={{ top: 8, right: 8, left: -12, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={48}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value: unknown) => {
            const amount =
              typeof value === "number" ? value : Number(value ?? 0);
            return [`$${amount.toFixed(2)}`, "Total"];
          }}
        />
        <Bar
          dataKey="total"
          fill="#ffffff"
          radius={[4, 4, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
