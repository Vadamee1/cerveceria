"use client";

import { useState, useTransition } from "react";
import {
  type EmployeeRow,
  type CreateEmployeeInput,
  type UpdateEmployeeInput,
  createEmployee,
  updateEmployee,
  setEmployeeStatus,
} from "@/actions/employees";

type UseEmployeesProps = {
  initialEmployees: EmployeeRow[];
};

export function useEmployees({ initialEmployees }: UseEmployeesProps) {
  const [employees, setEmployees] = useState<EmployeeRow[]>(initialEmployees);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function create(input: CreateEmployeeInput) {
    return new Promise<boolean>((resolve) => {
      setError(null);
      startTransition(async () => {
        const result = await createEmployee(input);
        if (!result.success) {
          setError(result.error);
          resolve(false);
          return;
        }
        setEmployees((prev) =>
          [...prev, result.data].sort((a, b) =>
            a.username.localeCompare(b.username),
          ),
        );
        resolve(true);
      });
    });
  }

  function update(input: UpdateEmployeeInput) {
    return new Promise<boolean>((resolve) => {
      setError(null);
      startTransition(async () => {
        const result = await updateEmployee(input);
        if (!result.success) {
          setError(result.error);
          resolve(false);
          return;
        }
        setEmployees((prev) =>
          prev.map((e) => (e.id === result.data.id ? result.data : e)),
        );
        resolve(true);
      });
    });
  }

  function toggleStatus(id: string, nextStatus: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await setEmployeeStatus(id, nextStatus);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setEmployees((prev) =>
        prev.map((e) => (e.id === result.data.id ? result.data : e)),
      );
    });
  }

  return {
    employees,
    isPending,
    error,
    create,
    update,
    toggleStatus,
    setError,
  };
}
