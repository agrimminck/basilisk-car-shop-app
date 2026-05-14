"use client";

import { AppShell } from "@/components/app-shell";
import { ProductGrid } from "@/components/pos/product-grid";
import { CartPanel } from "@/components/pos/cart-panel";
import { PaymentModal } from "@/components/pos/payment-modal";
import { usePosStore } from "@/hooks/use-pos-store";

export default function PosPage() {
  const paymentOpen = usePosStore((s) => s.paymentOpen);
  const setPaymentOpen = usePosStore((s) => s.setPaymentOpen);

  return (
    <AppShell>
      <div className="flex h-screen gap-0 overflow-hidden border border-white/10 bg-black/30 shadow-2xl backdrop-blur-md">
        <div className="flex h-full w-full flex-col md:w-[65%] p-4">
          <ProductGrid />
        </div>
        <div className="hidden h-full w-[35%] md:flex md:flex-col">
          <CartPanel />
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
      />
    </AppShell>
  );
}
