import { z } from "zod";

export const saleItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive("La cantidad debe ser mayor a 0"),
});

export const saleSchema = z.object({
  paymentTypeId: z.string().min(1, "Selecciona un método de pago"),
  items: z.array(saleItemSchema).min(1, "Agrega al menos un producto"),
});

export type SaleFormValues = z.infer<typeof saleSchema>;
export type SaleItemInput = z.infer<typeof saleItemSchema>;

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};
