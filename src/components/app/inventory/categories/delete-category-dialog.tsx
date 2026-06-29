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
import { useDeleteCategory } from "@/hooks/app/categories/use-delete-category";
import { Trash2 } from "lucide-react";

type DeleteCategoryDialogProps = {
  categoryId: string;
  categoryName: string;
  productCount: number;
};

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
  productCount,
}: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const { formError, isPending, handleDelete } = useDeleteCategory({
    categoryId,
    onSuccess: () => setOpen(false),
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
        aria-label="Eliminar categoría"
      >
        <Trash2 size={16} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle>Eliminar categoría</DialogTitle>

        <DialogContent>
          <p className="text-sm text-gray-300">
            ¿Estás seguro de que deseas eliminar{" "}
            <span className="font-semibold text-white">{categoryName}</span>?
          </p>

          {productCount > 0 && (
            <p className="mt-2 text-sm text-red-400">
              Esta acción también eliminará{" "}
              <span className="font-semibold">
                {productCount} {productCount === 1 ? "producto" : "productos"}
              </span>{" "}
              asociados. No se puede deshacer.
            </p>
          )}

          {formError && (
            <p className="mt-3 text-sm text-red-400">{formError}</p>
          )}
        </DialogContent>

        <DialogFooter>
          <DialogCancelButton>Cancelar</DialogCancelButton>
          <DialogAcceptButton onClick={handleDelete} disabled={isPending}>
            {isPending ? "Eliminando..." : "Eliminar"}
          </DialogAcceptButton>
        </DialogFooter>
      </Dialog>
    </>
  );
}
