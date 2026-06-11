"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";

export async function getCategories() {
  await requireRole("Admin");

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    productCount: category._count.products,
  }));
}

export async function createCategory(name: string) {
  await requireRole("Admin");

  const category = await prisma.category.create({
    data: { name },
  });

  return category;
}
