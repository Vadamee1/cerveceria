"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { type EmployeeRow } from "@/actions/employees";
import { useEmployees } from "@/hooks/app/employees/use-employees";
import { EmployeesTable } from "@/components/app/employees/employees-table";
import { EmployeeFormModal } from "@/components/app/employees/employee-form-modal";
import { ConfirmDialog } from "@/components/app/employees/confirm-dialog";

type EmployeesViewProps = {
  initialEmployees: EmployeeRow[];
};

export function EmployeesView({ initialEmployees }: EmployeesViewProps) {
  const {
    employees,
    isPending,
    error,
    create,
    update,
    toggleStatus,
    setError,
  } = useEmployees({ initialEmployees });

  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRow | null>(
    null,
  );
  const [pendingDisable, setPendingDisable] = useState<EmployeeRow | null>(
    null,
  );

  function openCreate() {
    setEditingEmployee(null);
    setError(null);
    setFormOpen(true);
  }

  function openEdit(employee: EmployeeRow) {
    setEditingEmployee(employee);
    setError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingEmployee(null);
  }

  async function handleSubmit(values: { username: string; password?: string }) {
    if (editingEmployee) {
      return update({
        id: editingEmployee.id,
        username: values.username,
        password: values.password,
      });
    }
    return create({
      username: values.username,
      password: values.password ?? "",
    });
  }

  function handleToggleClick(employee: EmployeeRow) {
    if (employee.isActive) {
      setPendingDisable(employee);
    } else {
      toggleStatus(employee.id, true);
    }
  }

  function confirmDisable() {
    if (!pendingDisable) return;
    toggleStatus(pendingDisable.id, false);
    setPendingDisable(null);
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Empleados
          </h1>
          <button
            type="button"
            onClick={openCreate}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            <Plus size={16} />
            Añadir empleado
          </button>
        </div>

        <hr className="my-6 border-gray-700" />

        <EmployeesTable
          employees={employees}
          isPending={isPending}
          onEdit={openEdit}
          onToggleStatus={handleToggleClick}
        />
      </div>

      {formOpen && (
        <EmployeeFormModal
          key={editingEmployee?.id ?? "create"}
          employee={editingEmployee}
          isSubmitting={isPending}
          serverError={error}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        open={pendingDisable !== null}
        title="Inhabilitar empleado"
        description={
          pendingDisable
            ? `¿Seguro que quieres inhabilitar a "${pendingDisable.username}"? No podrá iniciar sesión hasta que lo vuelvas a habilitar.`
            : ""
        }
        confirmLabel="Inhabilitar"
        isLoading={isPending}
        onConfirm={confirmDisable}
        onCancel={() => setPendingDisable(null)}
      />
    </div>
  );
}
