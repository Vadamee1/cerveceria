"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCategory } from "@/actions/category";
import {
  categorySchema,
  type CategoryFormErrors,
  type CategoryRow,
} from "@/lib/validations/category";

type UseEditCategoryFormProps = {
  category: CategoryRow;
  onSuccess?: () => void;
};

export function useEditCategoryForm({
  category,
  onSuccess,
}: UseEditCategoryFormProps) {
  const [name, setName] = useState(category.name);
  const [errors, setErrors] = useState<CategoryFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function resetForm() {
    setName(category.name);
    setErrors({});
    setFormError(null);
  }

  function handleSubmit() {
    setFormError(null);

    const result = categorySchema.safeParse({ name });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({ name: fieldErrors.name?.[0] });
      return;
    }

    setErrors({});

    startTransition(async () => {
      const response = await updateCategory(category.id, result.data.name);

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
    errors,
    formError,
    isPending,
    handleSubmit,
    resetForm,
  };
}
