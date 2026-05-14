import { describe, it, expect, beforeEach } from "vitest";
import { usePosStore } from "./use-pos-store";
import type { PosProduct } from "../components/pos/types";

function makeProduct(overrides: Partial<PosProduct> = {}): PosProduct {
  return {
    id: "p1",
    name: "Filtro de aceite",
    price: 1500,
    stock: 10,
    categoryId: "filtros",
    ...overrides,
  };
}

function resetStore() {
  usePosStore.setState({
    items: [],
    customerId: null,
    vehicleId: null,
    branchId: null,
    paymentOpen: false,
    paymentMethod: "cash",
    bridgeStatus: "idle",
  });
}

describe("usePosStore — cart actions", () => {
  beforeEach(resetStore);

  it("addToCart inserts new product with quantity 1", () => {
    const product = makeProduct();
    usePosStore.getState().addToCart(product);

    const { items } = usePosStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({ product, quantity: 1 });
  });

  it("addToCart increments quantity for existing product", () => {
    const product = makeProduct();
    usePosStore.getState().addToCart(product);
    usePosStore.getState().addToCart(product);
    usePosStore.getState().addToCart(product);

    const { items } = usePosStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it("updateQuantity adds delta and removes when quantity drops to 0", () => {
    const product = makeProduct();
    usePosStore.getState().addToCart(product);
    usePosStore.getState().addToCart(product);

    usePosStore.getState().updateQuantity(product.id, 1);
    expect(usePosStore.getState().items[0].quantity).toBe(3);

    usePosStore.getState().updateQuantity(product.id, -3);
    expect(usePosStore.getState().items).toHaveLength(0);
  });

  it("removeItem drops product by id", () => {
    const a = makeProduct({ id: "a" });
    const b = makeProduct({ id: "b" });
    usePosStore.getState().addToCart(a);
    usePosStore.getState().addToCart(b);

    usePosStore.getState().removeItem("a");

    const { items } = usePosStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe("b");
  });

  it("getTotal sums product.price * quantity across items", () => {
    usePosStore.getState().addToCart(makeProduct({ id: "a", price: 1000 }));
    usePosStore.getState().addToCart(makeProduct({ id: "a", price: 1000 }));
    usePosStore.getState().addToCart(makeProduct({ id: "b", price: 2500 }));

    expect(usePosStore.getState().getTotal()).toBe(4500);
  });

  it("getItemCount sums quantities", () => {
    usePosStore.getState().addToCart(makeProduct({ id: "a" }));
    usePosStore.getState().addToCart(makeProduct({ id: "a" }));
    usePosStore.getState().addToCart(makeProduct({ id: "b" }));

    expect(usePosStore.getState().getItemCount()).toBe(3);
  });

  it("clearCart resets items, paymentMethod and bridgeStatus (post-sale)", () => {
    usePosStore.getState().addToCart(makeProduct());
    usePosStore.getState().setPaymentMethod("debit");
    usePosStore.getState().setBridgeStatus("connected");

    usePosStore.getState().clearCart();

    const state = usePosStore.getState();
    expect(state.items).toEqual([]);
    expect(state.paymentMethod).toBe("cash");
    expect(state.bridgeStatus).toBe("idle");
  });
});

describe("usePosStore — session slices", () => {
  beforeEach(resetStore);

  it("setCustomer sets customerId and vehicleId together", () => {
    usePosStore.getState().setCustomer("c1", "v1");
    expect(usePosStore.getState().customerId).toBe("c1");
    expect(usePosStore.getState().vehicleId).toBe("v1");
  });

  it("setCustomer with no vehicleId defaults to null", () => {
    usePosStore.getState().setCustomer("c1");
    expect(usePosStore.getState().vehicleId).toBeNull();
  });

  it("setBranch updates branchId", () => {
    usePosStore.getState().setBranch("br-001");
    expect(usePosStore.getState().branchId).toBe("br-001");
  });

  it("setPaymentOpen toggles modal flag", () => {
    usePosStore.getState().setPaymentOpen(true);
    expect(usePosStore.getState().paymentOpen).toBe(true);
    usePosStore.getState().setPaymentOpen(false);
    expect(usePosStore.getState().paymentOpen).toBe(false);
  });

  it("setPaymentMethod stores chosen method", () => {
    usePosStore.getState().setPaymentMethod("credit");
    expect(usePosStore.getState().paymentMethod).toBe("credit");
  });

  it("setBridgeStatus stores transition", () => {
    usePosStore.getState().setBridgeStatus("connecting");
    expect(usePosStore.getState().bridgeStatus).toBe("connecting");
    usePosStore.getState().setBridgeStatus("connected");
    expect(usePosStore.getState().bridgeStatus).toBe("connected");
  });
});
