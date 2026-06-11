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
import { useCreateProductForm } from "@/hooks/app/use-create-product-form";
import { useState } from "react";

type CreateProductDialogProps = {
  categoryId: string;
};

export function CreateProductDialog({ categoryId }: CreateProductDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    name,
    setName,
    price,
    setPrice,
    stock,
    setStock,
    errors,
    isPending,
    handleSubmit,
    resetForm,
  } = useCreateProductForm({
    categoryId,
    onSuccess: () => setOpen(false),
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
      >
        Agregar producto
      </button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) resetForm();
        }}
      >
        <DialogTitle>Nuevo producto</DialogTitle>

        <DialogContent>
          <div className="flex flex-col gap-4">
            <Input
              id="product-name"
              label="Nombre"
              placeholder="Ej. IPA Artesanal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />

            <Input
              id="product-price"
              label="Precio"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={errors.price}
            />

            <Input
              id="product-stock"
              label="Stock"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              error={errors.stock}
            />
          </div>
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
