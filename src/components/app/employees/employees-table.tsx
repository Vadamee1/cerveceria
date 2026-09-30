"use client";

import { Pencil, UserCheck, UserX } from "lucide-react";
import { type EmployeeRow } from "@/actions/employees";

type EmployeesTableProps = {
  employees: EmployeeRow[];
  isPending: boolean;
  onEdit: (employee: EmployeeRow) => void;
  onToggleStatus: (employee: EmployeeRow) => void;
};

export function EmployeesTable({
  employees,
  isPending,
  onEdit,
  onToggleStatus,
}: EmployeesTableProps) {
  if (employees.length === 0) {
    return <p className="text-gray-400">No hay empleados registrados.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/20">
      <table className="w-full min-w-120 text-sm">
        <thead>
          <tr className="border-b border-white/20 text-left text-gray-400">
            <th className="px-3 py-3 font-medium sm:px-4">Usuario</th>
            <th className="px-3 py-3 font-medium sm:px-4">Estado</th>
            <th className="px-3 py-3 text-right font-medium sm:px-4">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, i) => (
            <tr
              key={employee.id}
              className={`border-b border-white/10 transition hover:bg-white/5 ${
                i % 2 === 0 ? "bg-transparent" : "bg-white/2"
              }`}
            >
              <td className="whitespace-nowrap px-3 py-3 text-white sm:px-4">
                {employee.username}
              </td>
              <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                    employee.isActive
                      ? "border-green-500/30 text-green-400"
                      : "border-red-500/30 text-red-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      employee.isActive ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  {employee.isActive ? "Activo" : "Inhabilitado"}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(employee)}
                    disabled={isPending}
                    className="cursor-pointer rounded-lg border border-white/20 p-2 text-gray-300 transition hover:text-white disabled:opacity-50"
                    aria-label="Editar empleado"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleStatus(employee)}
                    disabled={isPending}
                    className="cursor-pointer rounded-lg border border-white/20 p-2 text-gray-300 transition hover:text-white disabled:opacity-50"
                    aria-label={
                      employee.isActive
                        ? "Inhabilitar empleado"
                        : "Habilitar empleado"
                    }
                  >
                    {employee.isActive ? (
                      <UserX size={16} />
                    ) : (
                      <UserCheck size={16} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
