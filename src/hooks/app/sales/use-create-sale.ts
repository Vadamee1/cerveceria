"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSale } from "@/actions/sales";
import { type CartItem } from "@/lib/validations/sale";

type UseCreateSaleProps = {
  onSuccess?: () => void;
};

export function useCreateSale({ onSuccess }: UseCreateSaleProps = {}) {
  const [paymentTypeId, setPaymentTypeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submitSale(items: CartItem[]) {
    setError(null);

    if (!paymentTypeId) {
      setError("Selecciona un método de pago");
      return;
    }

    if (items.length === 0) {
      setError("Agrega al menos un producto");
      return;
    }

    startTransition(async () => {
      const response = await createSale(
        paymentTypeId,
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      );

      if (!response.success) {
        setError(response.error);
        return;
      }

      setPaymentTypeId(null);
      onSuccess?.();
      router.refresh();
    });
  }

  function resetPayment() {
    setPaymentTypeId(null);
    setError(null);
  }

  return {
    paymentTypeId,
    setPaymentTypeId,
    error,
    isPending,
    submitSale,
    resetPayment,
  };
}
