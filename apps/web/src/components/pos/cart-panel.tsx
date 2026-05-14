"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingCart, Zap } from "lucide-react";
import { usePosStore } from "@/hooks/use-pos-store";

export function CartPanel() {
  const items = usePosStore((s) => s.items);
  const updateQuantity = usePosStore((s) => s.updateQuantity);
  const removeItem = usePosStore((s) => s.removeItem);
  const setPaymentOpen = usePosStore((s) => s.setPaymentOpen);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex h-full flex-col border-l border-white/10 bg-surface/60 backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/10 p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
          <ShoppingCart className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Carrito</h2>
        <span className="ml-auto inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">
          {itemCount}
        </span>
      </div>

      <ScrollArea className="flex-1 p-4">
        <AnimatePresence initial={false}>
          {items.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-muted-foreground"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                <ShoppingCart className="h-8 w-8 opacity-40" />
              </div>
              <p className="text-sm font-medium">Carrito vacío</p>
              <p className="text-xs mt-1">Toca un producto para agregarlo</p>
            </motion.div>
          )}

          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${item.product.price.toLocaleString("es-CL")} c/u
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-danger/20 hover:text-danger"
                  aria-label="Eliminar item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.product.id, -1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground transition-colors hover:bg-white/10 active:scale-95"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[1.5rem] text-center text-base font-bold text-foreground">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.product.id, 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground transition-colors hover:bg-white/10 active:scale-95"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="ml-auto text-sm font-bold text-primary">
                  ${(item.product.price * item.quantity).toLocaleString("es-CL")}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>

      <div className="border-t border-white/10 p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <motion.span
            key={total}
            initial={{ scale: 1.1, color: "#38bdf8" }}
            animate={{ scale: 1, color: "#f3f4f6" }}
            className="text-2xl font-bold"
          >
            ${total.toLocaleString("es-CL")}
          </motion.span>
        </div>
        <Button
          onClick={() => setPaymentOpen(true)}
          disabled={items.length === 0}
          className="h-14 w-full rounded-xl bg-success text-base font-bold text-white hover:bg-success/90 disabled:opacity-40 shadow-lg shadow-success/20"
        >
          <Zap className="mr-2 h-5 w-5" />
          Pagar
        </Button>
      </div>
    </div>
  );
}
