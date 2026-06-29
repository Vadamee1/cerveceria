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
import { useEditProductForm } from "@/hooks/app/products/use-edit-product-form";
import { type ProductRow } from "@/lib/validations/product";
import { Pencil } from "lucide-react";

type EditProductDialogProps = {
  product: ProductRow;
};

export function EditProductDialog({ product }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    name,
    setName,
    price,
    setPrice,
    stock,
    setStock,
    errors,
    formError,
    isPending,
    handleSubmit,
    resetForm,
  } = useEditProductForm({
    product,
    onSuccess: () => setOpen(false),
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
        aria-label="Editar producto"
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
        <DialogTitle>Editar producto</DialogTitle>

        <DialogContent>
          <div className="flex flex-col gap-4">
            <Input
              id="edit-product-name"
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Input
              id="edit-product-price"
              label="Precio"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={errors.price}
            />
            <Input
              id="edit-product-stock"
              label="Stock"
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              error={errors.stock}
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
