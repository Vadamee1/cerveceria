"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth-utils";
import { handlePrismaError } from "@/lib/handle-prisma-error";
import { AppError } from "@/lib/errors";
import { ActionResult } from "./category";

export async function getProductsByCategory(categoryId: string) {
  await requireAuth();

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, name: true },
  });

  if (!category) return null;

  const products = await prisma.product.findMany({
    where: { categoryId },
    select: { id: true, name: true, price: true, stock: true },
    orderBy: { name: "asc" },
  });

  return { category, products };
}

export async function createProduct(
  categoryId: string,
  name: string,
  price: number,
  stock: number,
): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    await requireRole("Admin");

    const product = await prisma.product.create({
      data: {
        categoryId,
        name,
        price,
        stock,
      },
      select: { id: true, name: true },
    });

    return { success: true, data: product };
  } catch (error) {
    try {
      handlePrismaError(error);
    } catch (appError) {
      if (appError instanceof AppError) {
        return {
          success: false,
          error: appError.message,
          field: appError.code === "DUPLICATE" ? "name" : undefined,
        };
      }
    }

    return { success: false, error: "Ocurrió un error al crear el producto" };
  }
}

export async function updateProduct(
  productId: string,
  name: string,
  price: number,
  stock: number,
): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    await requireRole("Admin");

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        stock,
      },
      select: { id: true, name: true },
    });

    return { success: true, data: product };
  } catch (error) {
    try {
      handlePrismaError(error);
    } catch (appError) {
      if (appError instanceof AppError) {
        return {
          success: false,
          error: appError.message,
          field: appError.code === "DUPLICATE" ? "name" : undefined,
        };
      }
    }

    return {
      success: false,
      error: "Ocurrió un error al actualizar el producto",
    };
  }
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  try {
    await requireRole("Admin");

    await prisma.product.delete({ where: { id: productId } });

    return { success: true, data: undefined };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      error: "Ocurrió un error al eliminar el producto",
    };
  }
}
