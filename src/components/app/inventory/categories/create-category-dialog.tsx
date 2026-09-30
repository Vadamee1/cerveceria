"use client";

import {
  Dialog,
  DialogAcceptButton,
  DialogCancelButton,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/shared/dialog";
import { Input } from "@/components/shared/text-input";
import { useCreateCategoryForm } from "@/hooks/app/categories/use-create-category-form";
import { useState } from "react";

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);

  const {
    name,
    setName,
    errors,
    isPending,
    handleSubmit,
    resetForm,
    formError,
  } = useCreateCategoryForm({
    onSuccess: () => setOpen(false),
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
      >
        Agregar categoría
      </button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) resetForm();
        }}
      >
        <DialogTitle>Nueva categoría</DialogTitle>

        <DialogContent>
          <Input
            id="category-name"
            label="Nombre"
            placeholder="Ej. Cervezas artesanales"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          {formError && (
            <p className="mt-2 text-sm text-red-400">{formError}</p>
          )}
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
