"use client";

import { useState, useCallback } from "react";
import { AppShell } from "@/components/app-shell";
import { ProductGrid } from "@/components/pos/product-grid";
import { CartPanel } from "@/components/pos/cart-panel";
import { PaymentModal } from "@/components/pos/payment-modal";
import { CartItem, PosProduct, PaymentMethod } from "@/components/pos/types";

export default function PosPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const addToCart = useCallback((product: PosProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const total = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handlePay = useCallback(() => {
    setPaymentOpen(true);
  }, []);

  const handleConfirmPayment = useCallback((_method: PaymentMethod) => {
    setCartItems([]);
  }, []);

  return (
    <AppShell>
      <div className="flex h-screen gap-0 overflow-hidden border border-white/10 bg-black/30 shadow-2xl backdrop-blur-md">
        <div className="flex h-full w-full flex-col md:w-[65%] p-4">
          <ProductGrid onAddToCart={addToCart} />
        </div>
        <div className="hidden h-full w-[35%] md:flex md:flex-col">
          <CartPanel
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
            onPay={handlePay}
          />
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        total={total}
        onConfirm={handleConfirmPayment}
      />
    </AppShell>
  );
}
