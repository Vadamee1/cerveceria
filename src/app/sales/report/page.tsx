import { getSalesReport } from "@/actions/report";
import { ReportView } from "@/components/app/sales/report/report-view";

export default async function ReportPage() {
  const data = await getSalesReport("day");

  return <ReportView initialData={data} />;
}
