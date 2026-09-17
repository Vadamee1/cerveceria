import { getCategories } from "@/actions/category";
import { getPaymentTypeOptions } from "@/actions/payment-types";
import { SalesView } from "@/components/app/sales/sales-view";

export default async function SalesPage() {
  const [categories, paymentOptions] = await Promise.all([
    getCategories(),
    getPaymentTypeOptions(),
  ]);

  return (
    <div className="px-48">
      <SalesView categories={categories} paymentOptions={paymentOptions} />
    </div>
  );
}
