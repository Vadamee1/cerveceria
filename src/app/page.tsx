import { getHomeData } from "@/actions/home";
import { SalesTodayCard } from "@/components/app/home/sales-today-card";
import { TopProductsCard } from "@/components/app/home/top-products-card";
import { LowStockList } from "@/components/app/home/low-stock-list";
import { NewSaleCta } from "@/components/app/home/new-sale-cta";

export default async function HomePage() {
  const { summary, topProducts, lowStockProducts } = await getHomeData();

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-xl font-bold text-white sm:text-2xl">Inicio</h1>
        <hr className="my-6 border-gray-700" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesTodayCard summary={summary} />
          </div>

          <div className="flex flex-col gap-6">
            <NewSaleCta />
            <TopProductsCard products={topProducts} />
          </div>
        </div>

        <div className="mt-6">
          <LowStockList products={lowStockProducts} />
        </div>
      </div>
    </div>
  );
}
