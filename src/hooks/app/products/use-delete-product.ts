"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/products";

type UseDeleteProductProps = {
  productId: string;
  onSuccess?: () => void;
};

export function useDeleteProduct({
  productId,
  onSuccess,
}: UseDeleteProductProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      const response = await deleteProduct(productId);

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
