"use client";

import { Plus, Minus, Trash2 } from "lucide-react";
import { type CartItem } from "@/lib/validations/sale";
import { type PaymentTypeOption } from "@/actions/payment-types";
import { PaymentTypeSelector } from "@/components/shared/payment-type-selector";

type SaleTicketProps = {
  items: CartItem[];
  total: number;
  paymentOptions: PaymentTypeOption[];
  paymentTypeId: string | null;
  onPaymentChange: (id: string) => void;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  onPay: () => void;
  onCancel: () => void;
  error?: string | null;
  isPending: boolean;
  canPay: boolean;
};

export function SaleTicket({
  items,
  total,
  paymentOptions,
  paymentTypeId,
  onPaymentChange,
  onIncrement,
  onDecrement,
  onRemove,
  onPay,
  onCancel,
  error,
  isPending,
  canPay,
}: SaleTicketProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-white bg-black p-5">
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">
              Selecciona productos para agregarlos al ticket.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      ${item.price.toFixed(2)} · Cantidad: {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onIncrement(item.productId)}
                      className="cursor-pointer rounded-md border border-white/30 p-1 text-white transition hover:bg-white/10"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDecrement(item.productId)}
                      className="cursor-pointer rounded-md border border-white/30 p-1 text-white transition hover:bg-white/10"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.productId)}
                      className="cursor-pointer rounded-md border border-red-400/30 p-1 text-red-400 transition hover:bg-red-500/10"
                      aria-label="Quitar producto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 shrink-0 border-t border-white/20 pt-4">
          <p className="text-lg font-semibold text-white">
            Total: ${total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4 shrink-0">
        <PaymentTypeSelector
          options={paymentOptions}
          value={paymentTypeId}
          onChange={onPaymentChange}
        />
      </div>

      {error && <p className="mt-3 shrink-0 text-sm text-red-400">{error}</p>}

      <div className="mt-4 flex shrink-0 gap-3">
        <button
          type="button"
          onClick={onPay}
          disabled={isPending || !canPay}
          className="flex-1 cursor-pointer rounded-lg bg-white px-4 py-3 font-medium text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Procesando..." : "Pagar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending || items.length === 0}
          className="flex-1 cursor-pointer rounded-lg bg-red-500/10 px-4 py-3 font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
