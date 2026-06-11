import Link from "next/link";
import { Category } from "@/types/category";
import { CreateCategoryDialog } from "@/components/app/inventory/create-category-dialog";
import { getCategories } from "@/actions/category";

export default async function CategoriesPage() {
  const categories: Category[] = await getCategories();

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Categorías</h1>
          <CreateCategoryDialog />
        </div>

        <hr className="my-6 border-gray-700" />

        {categories.length === 0 ? (
          <p className="text-gray-400">No hay categorías registradas.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/inventory/categories/${category.id}/products`}
                className="rounded-2xl border border-white bg-black p-6 shadow-xl transition hover:bg-white/5 hover:shadow-2xl"
              >
                <h2 className="text-lg font-semibold text-white">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {category.productCount}{" "}
                  {category.productCount === 1 ? "producto" : "productos"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
