import { Prisma } from "@/generated/prisma/client";
import { DuplicateError } from "@/lib/errors";

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const field = (error.meta?.target as string[])?.[0] ?? "valor";
      throw new DuplicateError(field);
    }
  }

  throw error;
}
