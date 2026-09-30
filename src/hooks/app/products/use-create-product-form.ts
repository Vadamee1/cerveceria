"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/actions/products";
import { ProductFormErrors, productSchema } from "@/lib/validations/product";

type UseCreateProductFormProps = {
  categoryId: string;
  onSuccess?: () => void;
};

export function useCreateProductForm({
  categoryId,
  onSuccess,
}: UseCreateProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function resetForm() {
    setName("");
    setPrice("");
    setStock("");
    setErrors({});
    setFormError(null);
  }

  function handleSubmit() {
    setFormError(null);

    const result = productSchema.safeParse({ name, price, stock });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        price: fieldErrors.price?.[0],
        stock: fieldErrors.stock?.[0],
      });
      return;
    }

    setErrors({});

    startTransition(async () => {
      const response = await createProduct(
        categoryId,
        result.data.name,
        result.data.price,
        result.data.stock,
      );

      if (!response.success) {
        if (response.field === "name") {
          setErrors({ name: response.error });
        } else {
          setFormError(response.error);
        }
        return;
      }

      resetForm();
      onSuccess?.();
      router.refresh();
    });
  }

  return {
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
  };
}
