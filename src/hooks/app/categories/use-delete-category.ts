"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/actions/category";

type UseDeleteCategoryProps = {
  categoryId: string;
  onSuccess?: () => void;
};

export function useDeleteCategory({
  categoryId,
  onSuccess,
}: UseDeleteCategoryProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      const response = await deleteCategory(categoryId);

      if (!response.success) {
        setFormError(response.error);
        return;
      }

      onSuccess?.();
      router.refresh();
    });
  }

  return { formError, isPending, handleDelete };
}
