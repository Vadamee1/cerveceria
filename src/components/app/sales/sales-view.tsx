"use client";

import { useState } from "react";
import { useCategoryNavigation } from "@/hooks/app/sales/use-category-navigation";
import { useSaleCart } from "@/hooks/app/sales/use-sale-cart";
import { useCreateSale } from "@/hooks/app/sales/use-create-sale";
import { getProductsByCategory } from "@/actions/products";
import { SaleCategoryGrid } from "@/components/app/sales/category-grid";
import { SaleProductGrid } from "@/components/app/sales/product-grid";
import { SaleTicket } from "@/components/app/sales/ticket";
import { ConfirmPaymentDialog } from "@/components/app/sales/confirm-payment-dialog";
import { CancelSaleDialog } from "@/components/app/sales/cancel-sale-dialog";
import { type CategoryRow } from "@/lib/validations/category";
import { type ProductRow } from "@/lib/validations/product";
import { type PaymentTypeOption } from "@/actions/payment-types";

type SalesViewProps = {
  categories: CategoryRow[];
  paymentOptions: PaymentTypeOption[];
};

export function SalesView({ categories, paymentOptions }: SalesViewProps) {
  const { selectedCategory, selectCategory, backToCategories } =
    useCategoryNavigation();

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const cart = useSaleCart();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const sale = useCreateSale({
    onSuccess: () => {
      cart.clearCart();
      setConfirmOpen(false);
      backToCategories();
    },
  });

  async function handleSelectCategory(category: CategoryRow) {
    selectCategory(category);
    setLoadingProducts(true);

    const data = await getProductsByCategory(category.id);
    setProducts(data ? data.products : []);

    setLoadingProducts(false);
  }

  function handleSelectProduct(product: ProductRow) {
    cart.addProduct(product);
  }

  function handleCancelSale() {
    cart.clearCart();
    sale.resetPayment();
    setCancelOpen(false);
  }

  const canPay = cart.items.length > 0 && !!sale.paymentTypeId;

  return (
    <div className="flex h-screen flex-col bg-black p-4 md:p-8">
      <h1 className="text-2xl font-bold text-white">Ventas</h1>
      <hr className="my-6 shrink-0 border-gray-700" />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 md:grid-cols-[1fr_340px] lg:gap-8 lg:grid-cols-[1fr_400px]">
        {/* Lado izquierdo: categorías / productos */}
        <div className="min-h-0 overflow-y-auto pr-2">
          {selectedCategory ? (
            loadingProducts ? (
              <p className="text-gray-400">Cargando productos...</p>
            ) : (
              <SaleProductGrid
                categoryName={selectedCategory.name}
                products={products}
                onSelect={handleSelectProduct}
                onBack={backToCategories}
              />
            )
          ) : (
            <SaleCategoryGrid
              categories={categories}
              onSelect={handleSelectCategory}
            />
          )}
        </div>

        <div className="min-h-0">
          <SaleTicket
            items={cart.items}
            total={cart.total}
            paymentOptions={paymentOptions}
            paymentTypeId={sale.paymentTypeId}
            onPaymentChange={sale.setPaymentTypeId}
            onIncrement={cart.increment}
            onDecrement={cart.decrement}
            onRemove={cart.removeItem}
            onPay={() => setConfirmOpen(true)}
            onCancel={() => setCancelOpen(true)}
            error={sale.error}
            isPending={sale.isPending}
            canPay={canPay}
          />
        </div>
      </div>

      <ConfirmPaymentDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        total={cart.total}
        onConfirm={() => sale.submitSale(cart.items)}
        isPending={sale.isPending}
      />

      <CancelSaleDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onConfirm={handleCancelSale}
      />
    </div>
  );
}
