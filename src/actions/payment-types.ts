"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export type PaymentTypeOption = {
  id: string;
  name: "Efectivo" | "Transferencia" | "Tarjeta";
};

export async function getPaymentTypeOptions(): Promise<PaymentTypeOption[]> {
  await requireAuth();

  const paymentTypes = await prisma.paymentType.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return paymentTypes as PaymentTypeOption[];
}
