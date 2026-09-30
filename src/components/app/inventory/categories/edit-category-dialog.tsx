"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogAcceptButton,
  DialogCancelButton,
} from "@/components/shared/dialog";
import { Input } from "@/components/shared/text-input";
import { useEditCategoryForm } from "@/hooks/app/categories/use-edit-category-form";
import { type CategoryRow } from "@/lib/validations/category";
import { Pencil } from "lucide-react";

type EditCategoryDialogProps = {
  category: CategoryRow;
};

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    name,
    setName,
    errors,
    formError,
    isPending,
    handleSubmit,
    resetForm,
  } = useEditCategoryForm({
    category,
    onSuccess: () => setOpen(false),
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
        aria-label="Editar categoría"
      >
        <Pencil size={16} />
      </button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) resetForm();
        }}
      >
        <DialogTitle>Editar categoría</DialogTitle>

        <DialogContent>
          <div className="flex flex-col gap-4">
            <Input
              id="edit-category-name"
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />

            {formError && <p className="text-sm text-red-400">{formError}</p>}
          </div>
        </DialogContent>

        <DialogFooter>
          <DialogCancelButton>Cancelar</DialogCancelButton>
          <DialogAcceptButton onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar"}
          </DialogAcceptButton>
        </DialogFooter>
      </Dialog>
    </>
  );
}
