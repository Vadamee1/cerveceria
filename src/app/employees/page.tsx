import { getEmployees } from "@/actions/employees";
import { EmployeesView } from "@/components/app/employees/employees-view";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  return <EmployeesView initialEmployees={employees} />;
}
