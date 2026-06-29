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
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function resetForm() {
    setName("");
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
      const response = await createCategory(result.data.name);

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
