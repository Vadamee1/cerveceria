"use client";

import { Banknote, ArrowLeftRight, CreditCard } from "lucide-react";
import { type PaymentTypeOption } from "@/actions/payment-types";

const paymentIcons: Record<string, React.ReactNode> = {
  Efectivo: <Banknote size={20} />,
  Transferencia: <ArrowLeftRight size={20} />,
  Tarjeta: <CreditCard size={20} />,
};

type PaymentTypeSelectorProps = {
  options: PaymentTypeOption[];
  value: string | null;
  onChange: (id: string) => void;
  error?: string;
};

export function PaymentTypeSelector({
  options,
  value,
  onChange,
  error,
}: PaymentTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-white">Método de pago</span>

      <div className="flex gap-3">
        {options.map((option) => {
          const isSelected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition
                ${
                  isSelected
                    ? "border-white bg-white text-black"
                    : "border-white/20 bg-black text-gray-400 hover:border-white/50 hover:text-white"
                }`}
            >
              {paymentIcons[option.name]}
              {option.name}
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
