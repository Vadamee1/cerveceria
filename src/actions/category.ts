"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth-utils";
import { handlePrismaError } from "@/lib/handle-prisma-error";
import { AppError } from "@/lib/errors";

export async function getCategories() {
  await requireAuth();

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    productCount: category._count.products,
  }));
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; field?: string };

export async function createCategory(
  name: string,
): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    await requireRole("Admin");

    const category = await prisma.category.create({
      data: { name },
      select: { id: true, name: true },
    });

    return { success: true, data: category };
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

    return { success: false, error: "Ocurrió un error al crear la categoría" };
  }
}

export async function updateCategory(
  categoryId: string,
  name: string,
): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    await requireRole("Admin");

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name },
      select: { id: true, name: true },
    });

    return { success: true, data: category };
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
      error: "Ocurrió un error al actualizar la categoría",
    };
  }
}

export async function deleteCategory(
  categoryId: string,
): Promise<ActionResult> {
  try {
    await requireRole("Admin");

    await prisma.$transaction([
      prisma.product.deleteMany({ where: { categoryId } }),
      prisma.category.delete({ where: { id: categoryId } }),
    ]);

    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: "Ocurrió un error al eliminar la categoría",
    };
  }
}
