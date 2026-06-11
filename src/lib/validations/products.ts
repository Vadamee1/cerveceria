import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  price: z.coerce
    .number({ message: "El precio debe ser un número" })
    .positive("El precio debe ser mayor a 0"),
  stock: z.coerce
    .number({ message: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductFormErrors = Partial<
  Record<keyof ProductFormValues, string>
>;
