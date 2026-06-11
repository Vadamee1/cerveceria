"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogAcceptButton,
  DialogCancelButton,
} from "@/components/shared/dialog";
import { createCategory } from "@/actions/category";
import { Input } from "@/components/shared/text-input";

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit() {
    if (!name.trim()) {
      setError("El nombre es requerido");
      return;
    }

    startTransition(async () => {
      try {
        await createCategory(name.trim());
        setName("");
        setError(null);
        setOpen(false);
        router.refresh();
      } catch {
        setError("Ocurrió un error al crear la categoría");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
      >
        Agregar categoría
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle>Nueva categoría</DialogTitle>

        <DialogContent>
          <Input
            id="category-name"
            label="Nombre"
            placeholder="Ej. Cervezas artesanales"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error ?? undefined}
          />
        </DialogContent>

        <DialogFooter>
          <DialogCancelButton>Cancelar</DialogCancelButton>
          <DialogAcceptButton onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Guardando..." : "Aceptar"}
          </DialogAcceptButton>
        </DialogFooter>
      </Dialog>
    </>
  );
}
