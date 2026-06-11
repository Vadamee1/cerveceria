import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
export type CategoryFormErrors = Partial<
  Record<keyof CategoryFormValues, string>
>;
