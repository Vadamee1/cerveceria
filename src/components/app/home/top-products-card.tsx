import { Trophy } from "lucide-react";
import { type TopProduct } from "@/actions/home";

type TopProductsCardProps = {
  products: TopProduct[];
};

export function TopProductsCard({ products }: TopProductsCardProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/20 bg-black p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Trophy size={18} className="text-amber-400" />
        <p className="text-sm font-medium text-white">Top productos de hoy</p>
      </div>

      {products.length === 0 ? (
        <p className="mt-4 text-sm text-gray-400">
          Aún no hay productos vendidos hoy.
        </p>
      ) : (
        <ol className="mt-4 flex-1 space-y-2">
          {products.map((product, i) => (
            <li
              key={product.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-white">
                {product.name}
              </span>
              <span className="shrink-0 whitespace-nowrap text-xs text-gray-400">
                {product.quantity}{" "}
                {product.quantity === 1 ? "unidad" : "unidades"}
              </span>
              <span className="shrink-0 text-sm font-semibold text-white">
                ${product.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
