import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItemType = "product" | "service" | "bundle";

export interface CartItem {
  id: string;
  type: CartItemType;
  name: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalLine: number;
}

export type CartStatus = "open" | "checking_out" | "paid" | "cancelled";

export interface PosState {
  items: CartItem[];
  customerId: string | null;
  vehicleId: string | null;
  discountAmount: number;
  status: CartStatus;
}

export interface PosActions {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setCustomer: (customerId: string | null, vehicleId?: string | null) => void;
  setDiscount: (amount: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

const initialState: PosState = {
  items: [],
  customerId: null,
  vehicleId: null,
  discountAmount: 0,
  status: "open",
};

function calculateLineTotal(item: CartItem): number {
  return item.quantity * item.unitPrice;
}

export const usePosStore = create<PosState & PosActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (item) => {
        const state = get();
        const existingIndex = state.items.findIndex(
          (i) => i.id === item.id && i.type === item.type
        );

        if (existingIndex >= 0) {
          const updatedItems = state.items.map((i, index) => {
            if (index === existingIndex) {
              const newQuantity = i.quantity + item.quantity;
              return {
                ...i,
                quantity: newQuantity,
                totalLine: newQuantity * i.unitPrice,
              };
            }
            return i;
          });
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            ...item,
            totalLine: calculateLineTotal(item),
          };
          set({ items: [...state.items, newItem] });
        }
      },

      removeItem: (id) => {
        const state = get();
        set({ items: state.items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        const state = get();
        const updatedItems = state.items.map((i) => {
          if (i.id === id) {
            return {
              ...i,
              quantity,
              totalLine: quantity * i.unitPrice,
            };
          }
          return i;
        });
        set({ items: updatedItems });
      },

      setCustomer: (customerId, vehicleId) => {
        set({ customerId, vehicleId: vehicleId ?? null });
      },

      setDiscount: (amount) => {
        set({ discountAmount: Math.max(0, amount) });
      },

      clearCart: () => {
        set(initialState);
      },

      getSubtotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.totalLine, 0);
      },

      getTotal: () => {
        const state = get();
        const subtotal = state.items.reduce(
          (sum, item) => sum + item.totalLine,
          0
        );
        return Math.max(0, subtotal - state.discountAmount);
      },
    }),
    {
      name: "basilisk-pos-cart",
    }
  )
);
