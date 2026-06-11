"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";

export async function getProductsByCategory(categoryId: string) {
  await requireRole("Admin");

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, name: true },
  });

  if (!category) {
    return null;
  }

  const products = await prisma.product.findMany({
    where: { categoryId },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
    orderBy: { name: "asc" },
  });

  return { category, products };
}

export async function createProduct(
  categoryId: string,
  name: string,
  price: number,
  stock: number,
) {
  await requireRole("Admin");

  const product = await prisma.product.create({
    data: {
      categoryId,
      name,
      price,
      stock,
    },
  });

  return product;
}
