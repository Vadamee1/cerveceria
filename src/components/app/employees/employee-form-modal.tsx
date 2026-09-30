"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { type EmployeeRow } from "@/actions/employees";

type EmployeeFormModalProps = {
  employee: EmployeeRow | null;
  isSubmitting: boolean;
  serverError: string | null;
  onClose: () => void;
  onSubmit: (values: {
    username: string;
    password?: string;
  }) => Promise<boolean>;
};

export function EmployeeFormModal({
  employee,
  isSubmitting,
  serverError,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const isEditing = employee !== null;

  const [username, setUsername] = useState(employee?.username ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setFormError("El usuario es requerido.");
      return;
    }

    if (!isEditing && password.length === 0) {
      setFormError("La contraseña es requerida.");
      return;
    }
    if (password.length > 0) {
      if (password.length < 6) {
        setFormError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (password !== confirmPassword) {
        setFormError("Las contraseñas no coinciden.");
        return;
      }
    }

    const ok = await onSubmit({
      username: trimmedUsername,
      password: password.length > 0 ? password : undefined,
    });

    if (ok) onClose();
  }

  const displayError = formError ?? serverError;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-md flex-col gap-8 rounded-2xl border border-white/20 bg-black p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Editar empleado" : "Añadir empleado"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-400 transition hover:text-white"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              autoFocus
              className="w-full rounded-lg border border-white/20 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-white/50 disabled:opacity-50"
              placeholder="nombre.apellido"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">
              {isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-white/20 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-white/50 disabled:opacity-50"
              placeholder={
                isEditing
                  ? "Dejar en blanco para no cambiarla"
                  : "Mínimo 6 caracteres"
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-white/20 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-white/50 disabled:opacity-50"
              placeholder="Repite la contraseña"
            />
          </div>

          {displayError && (
            <p className="text-sm text-red-400">{displayError}</p>
          )}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-gray-300 transition hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Guardando..."
                : isEditing
                  ? "Guardar cambios"
                  : "Crear empleado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
