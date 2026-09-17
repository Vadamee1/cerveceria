"use client";

import { ArrowLeft } from "lucide-react";
import { type ProductRow } from "@/lib/validations/product";

type SaleProductGridProps = {
  categoryName: string;
  products: ProductRow[];
  onSelect: (product: ProductRow) => void;
  onBack: () => void;
};

export function SaleProductGrid({
  categoryName,
  products,
  onSelect,
  onBack,
}: SaleProductGridProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-lg border border-white/30 p-2 text-white transition hover:bg-white/10"
          aria-label="Volver a categorías"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-semibold text-white">{categoryName}</h2>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-400">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              disabled={product.stock === 0}
              className="flex h-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-white bg-black px-4 text-center text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <span className="text-base font-medium">{product.name}</span>
              <span className="text-sm text-gray-400">
                ${product.price.toFixed(2)}
              </span>
              {product.stock === 0 && (
                <span className="text-xs text-red-400">Sin stock</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
