import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, PaymentMethod, PosProduct } from "../components/pos/types";

export type BridgeStatus = "idle" | "connecting" | "connected" | "error";

export interface PosState {
  items: CartItem[];
  customerId: string | null;
  vehicleId: string | null;
  branchId: string | null;
  paymentOpen: boolean;
  paymentMethod: PaymentMethod;
  bridgeStatus: BridgeStatus;
}

export interface PosActions {
  addToCart: (product: PosProduct) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setCustomer: (customerId: string | null, vehicleId?: string | null) => void;
  setBranch: (branchId: string | null) => void;
  setPaymentOpen: (open: boolean) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setBridgeStatus: (status: BridgeStatus) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const initialState: PosState = {
  items: [],
  customerId: null,
  vehicleId: null,
  branchId: null,
  paymentOpen: false,
  paymentMethod: "cash",
  bridgeStatus: "idle",
};

export const usePosStore = create<PosState & PosActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addToCart: (product) => {
        const { items } = get();
        const existing = items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },

      updateQuantity: (productId, delta) => {
        const { items } = get();
        set({
          items: items
            .map((i) =>
              i.product.id === productId
                ? { ...i, quantity: i.quantity + delta }
                : i
            )
            .filter((i) => i.quantity > 0),
        });
      },

      removeItem: (productId) => {
        const { items } = get();
        set({ items: items.filter((i) => i.product.id !== productId) });
      },

      clearCart: () => {
        set({
          items: [],
          paymentMethod: "cash",
          bridgeStatus: "idle",
        });
      },

      setCustomer: (customerId, vehicleId) => {
        set({ customerId, vehicleId: vehicleId ?? null });
      },

      setBranch: (branchId) => {
        set({ branchId });
      },

      setPaymentOpen: (open) => {
        set({ paymentOpen: open });
      },

      setPaymentMethod: (method) => {
        set({ paymentMethod: method });
      },

      setBridgeStatus: (status) => {
        set({ bridgeStatus: status });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "basilisk-pos-cart",
      partialize: (state) => ({
        items: state.items,
        customerId: state.customerId,
        vehicleId: state.vehicleId,
        branchId: state.branchId,
      }),
    }
  )
);
