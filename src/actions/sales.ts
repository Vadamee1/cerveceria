"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { auth } from "@/auth";
import { saleSchema, type SaleItemInput } from "@/lib/validations/sale";
import { type ActionResult } from "@/actions/category";
import { Prisma } from "@/generated/prisma/client";

export async function createSale(
  paymentTypeId: string,
  items: SaleItemInput[],
): Promise<ActionResult<{ id: string; amount: number }>> {
  const session = await requireAuth();

  const result = saleSchema.safeParse({ paymentTypeId, items });
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Datos inválidos",
    };
  }

  try {
    const sale = await prisma.$transaction(async (tx) => {
      const productIds = items.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      let total = new Prisma.Decimal(0);

      for (const item of items) {
        const product = productMap.get(item.productId);

        if (!product) {
          throw new Error(`Producto no encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Stock insuficiente para "${product.name}" (disponible: ${product.stock})`,
          );
        }

        total = total.add(product.price.mul(item.quantity));
      }

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const createdSale = await tx.sale.create({
        data: {
          userId: session!.user.id,
          paymentTypeId,
          amount: total,
          products: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      });

      return createdSale;
    });

    return {
      success: true,
      data: { id: sale.id, amount: Number(sale.amount) },
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ocurrió un error al procesar la venta";
    return { success: false, error: message };
  }
}
