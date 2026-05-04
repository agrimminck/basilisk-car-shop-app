"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentMethod } from "./types";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Banknote, CreditCard, Smartphone, Wifi, WifiOff, CheckCircle2, Loader2 } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onConfirm: (method: PaymentMethod) => void;
}

const methods: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { id: "cash", label: "Efectivo", icon: Banknote },
  { id: "debit", label: "Débito", icon: CreditCard },
  { id: "credit", label: "Crédito", icon: CreditCard },
  { id: "transfer", label: "Transferencia", icon: Smartphone },
];

export function PaymentModal({ open, onOpenChange, total, onConfirm }: PaymentModalProps) {
  const [selected, setSelected] = useState<PaymentMethod>("cash");
  const [bridgeStatus, setBridgeStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");

  const handleSelect = (method: PaymentMethod) => {
    setSelected(method);
    if (method === "debit" || method === "credit") {
      setBridgeStatus("connecting");
      setTimeout(() => {
        setBridgeStatus("connected");
      }, 1200);
    } else {
      setBridgeStatus("idle");
    }
  };

  const handleConfirm = () => {
    onConfirm(selected);
    setBridgeStatus("idle");
    onOpenChange(false);
  };

  const showBridge = selected === "debit" || selected === "credit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>Pago</DialogTitle>
          <DialogDescription>
            Total a pagar: {" "}
            <span className="text-lg font-bold text-foreground">
              ${total.toLocaleString("es-CL")}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          {methods.map((m) => {
            const active = selected === m.id;
            const Icon = m.icon;
            return (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(m.id)}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{m.label}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showBridge && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Separator className="mb-4" />
              <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  {bridgeStatus === "connecting" && (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Conectando con Transbank...</span>
                    </>
                  )}
                  {bridgeStatus === "connected" && (
                    <>
                      <Wifi className="h-5 w-5 text-success" />
                      <span className="text-sm text-success">Transbank conectado</span>
                    </>
                  )}
                  {bridgeStatus === "error" && (
                    <>
                      <WifiOff className="h-5 w-5 text-danger" />
                      <span className="text-sm text-danger">Error de conexión</span>
                    </>
                  )}
                  {bridgeStatus === "idle" && (
                    <>
                      <Wifi className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Esperando selección...</span>
                    </>
                  )}
                </div>
                {bridgeStatus === "connected" && (
                  <Badge variant="success">Listo</Badge>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={showBridge && bridgeStatus !== "connected"}
            className="bg-success text-white hover:bg-success/90"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirmar Pago
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
