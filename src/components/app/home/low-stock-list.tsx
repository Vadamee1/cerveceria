import { PackageX, PackageMinus } from "lucide-react";
import { type LowStockProduct } from "@/actions/home";

type LowStockListProps = {
  products: LowStockProduct[];
};

export function LowStockList({ products }: LowStockListProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/20 bg-black p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PackageX size={18} className="text-amber-400" />
          <p className="text-sm font-medium text-white">Stock bajo</p>
        </div>
        {products.length > 0 && (
          <span className="rounded-full border border-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-400">
            {products.length}
          </span>
        )}
      </div>

      {products.length === 0 ? (
        <p className="mt-4 text-sm text-gray-400">
          Todos los productos tienen stock suficiente.
        </p>
      ) : (
        <ul className="mt-4 flex-1 space-y-2 overflow-y-auto">
          {products.map((product) => (
            <li
              key={product.id}
              className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${
                product.status === "out"
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-amber-500/20 bg-amber-500/5"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                {product.status === "out" ? (
                  <PackageX size={14} className="shrink-0 text-red-400" />
                ) : (
                  <PackageMinus size={14} className="shrink-0 text-amber-400" />
                )}
                <span className="truncate text-sm text-white">
                  {product.name}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="whitespace-nowrap text-xs text-gray-400">
                  {product.categoryName}
                </span>
                <span
                  className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${
                    product.status === "out"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {product.status === "out"
                    ? "Agotado"
                    : `${product.stock} uds.`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
