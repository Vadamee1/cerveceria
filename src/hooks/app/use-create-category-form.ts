"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  categorySchema,
  type CategoryFormErrors,
} from "@/lib/validations/category";
import { createCategory } from "@/actions/category";

type UseCreateCategoryFormProps = {
  onSuccess?: () => void;
};

export function useCreateCategoryForm({
  onSuccess,
}: UseCreateCategoryFormProps = {}) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<CategoryFormErrors>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function resetForm() {
    setName("");
    setErrors({});
  }

  function handleSubmit() {
    const result = categorySchema.safeParse({ name });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
      });
      return;
    }

    setErrors({});

    startTransition(async () => {
      try {
        await createCategory(result.data.name);
        resetForm();
        onSuccess?.();
        router.refresh();
      } catch {
        setErrors({ name: "Ocurrió un error al crear la categoría" });
      }
    });
  }

  return {
    name,
    setName,
    errors,
    isPending,
    handleSubmit,
    resetForm,
  };
}
