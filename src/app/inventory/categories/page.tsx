import Link from "next/link";
import { getCategories } from "@/actions/category";
import { CreateCategoryDialog } from "@/components/app/inventory/categories/create-category-dialog";
import { EditCategoryDialog } from "@/components/app/inventory/categories/edit-category-dialog";
import { DeleteCategoryDialog } from "@/components/app/inventory/categories/delete-category-dialog";

export default async function CategoriesPage() {
  const categories = await getCategories();

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
              <div
                key={category.id}
                className="rounded-2xl border border-white bg-black p-6 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <Link
                    href={`/inventory/categories/${category.id}/products`}
                    className="flex-1"
                  >
                    <h2 className="text-lg font-semibold text-white transition hover:text-gray-300">
                      {category.name}
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                      {category.productCount}{" "}
                      {category.productCount === 1 ? "producto" : "productos"}
                    </p>
                  </Link>

                  <div className="flex items-center gap-1">
                    <EditCategoryDialog category={category} />
                    <DeleteCategoryDialog
                      categoryId={category.id}
                      categoryName={category.name}
                      productCount={category.productCount}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
