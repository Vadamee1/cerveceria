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
import { useDeleteProduct } from "@/hooks/app/products/use-delete-product";
import { Trash2 } from "lucide-react";

type DeleteProductDialogProps = {
  productId: string;
  productName: string;
};

export function DeleteProductDialog({
  productId,
  productName,
}: DeleteProductDialogProps) {
  const [open, setOpen] = useState(false);

  const { formError, isPending, handleDelete } = useDeleteProduct({
    productId,
    onSuccess: () => setOpen(false),
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
        aria-label="Eliminar producto"
      >
        <Trash2 size={16} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle>Eliminar producto</DialogTitle>

        <DialogContent>
          <p className="text-sm text-gray-300">
            ¿Estás seguro de que deseas eliminar{" "}
            <span className="font-semibold text-white">{productName}</span>?
            Esta acción no se puede deshacer.
          </p>

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
