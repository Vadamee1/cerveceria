"use client";

import { useState } from "react";
import { ShoppingCart, LayoutGrid } from "lucide-react";
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

type MobileTab = "products" | "ticket";

export function SalesView({ categories, paymentOptions }: SalesViewProps) {
  const { selectedCategory, selectCategory, backToCategories } =
    useCategoryNavigation();

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("products");

  const cart = useSaleCart();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const sale = useCreateSale({
    onSuccess: () => {
      cart.clearCart();
      setConfirmOpen(false);
      backToCategories();
      setMobileTab("products");
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
    setMobileTab("products");
  }

  const canPay = cart.items.length > 0 && !!sale.paymentTypeId;

  const leftPanel = (
    <div className="min-h-0 overflow-y-auto pr-2 pb-18 md:pb-0">
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
  );

  const rightPanel = (
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
  );

  return (
    <div className="flex h-screen flex-col bg-black p-4 md:p-8">
      <h1 className="shrink-0 text-2xl font-bold text-white">Ventas</h1>
      <hr className="my-4 shrink-0 border-gray-700 md:my-6" />

      <div className="hidden min-h-0 flex-1 gap-6 md:grid md:grid-cols-[1fr_340px] lg:gap-8 lg:grid-cols-[1fr_400px]">
        {leftPanel}
        {rightPanel}
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:hidden">
        <div className="min-h-0 flex-1 pb-20">
          {mobileTab === "products" ? leftPanel : rightPanel}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-white/20 bg-black md:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("products")}
          className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium transition
            ${
              mobileTab === "products"
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
        >
          <LayoutGrid size={18} />
          Productos
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("ticket")}
          className={`relative flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium transition
            ${
              mobileTab === "ticket"
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
        >
          <ShoppingCart size={18} />
          Ticket
          {cart.items.length > 0 && (
            <span className="absolute right-8 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {cart.items.length}
            </span>
          )}
        </button>
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
