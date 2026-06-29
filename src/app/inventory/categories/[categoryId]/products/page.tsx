import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "@/actions/products";
import { CreateProductDialog } from "@/components/app/inventory/products/create-product-dialog";
import { EditProductDialog } from "@/components/app/inventory/products/edit-product-dialog";
import { DeleteProductDialog } from "@/components/app/inventory/products/delete-product-dialog";

type PageProps = {
  params: Promise<{ categoryId: string }>;
};

export default async function ProductsPage({ params }: PageProps) {
  const { categoryId } = await params;
  const data = await getProductsByCategory(categoryId);

  if (!data) notFound();

  const { category, products } = data;

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/inventory/categories"
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Volver a categorías
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{category.name}</h1>
          <CreateProductDialog categoryId={category.id} />
        </div>

        <hr className="my-6 border-gray-700" />

        {products.length === 0 ? (
          <p className="text-gray-400">No hay productos en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-white bg-black p-6 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    {product.name}
                  </h2>

                  <div className="flex items-center gap-1">
                    <EditProductDialog
                      product={{
                        id: product.id,
                        name: product.name,
                        price: Number(product.price),
                        stock: product.stock,
                      }}
                    />
                    <DeleteProductDialog
                      productId={product.id}
                      productName={product.name}
                    />
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  ${Number(product.price).toFixed(2)} · Stock: {product.stock}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
