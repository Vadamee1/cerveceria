"use client";

import { useState, useTransition } from "react";
import {
  getSalesReport,
  type ReportFilter,
  type ReportData,
} from "@/actions/report";

export function useReport(initialData: ReportData) {
  const [filter, setFilter] = useState<ReportFilter>("day");
  const [data, setData] = useState<ReportData>(initialData);
  const [isPending, startTransition] = useTransition();

  function changeFilter(newFilter: ReportFilter) {
    setFilter(newFilter);
    startTransition(async () => {
      const result = await getSalesReport(newFilter);
      setData(result);
    });
  }

  return { filter, data, isPending, changeFilter };
}
