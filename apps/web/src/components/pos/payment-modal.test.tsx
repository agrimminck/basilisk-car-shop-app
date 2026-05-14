import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaymentModal } from "./payment-modal";
import { usePosStore } from "../../hooks/use-pos-store";

// Stub framer-motion: motion.<tag> → real <tag>, drop framer-only props,
// AnimatePresence → passthrough. Keeps DOM assertions deterministic.
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const FRAMER_PROPS = new Set([
    "whileTap",
    "whileHover",
    "whileFocus",
    "initial",
    "animate",
    "exit",
    "transition",
    "variants",
    "layout",
  ]);
  const makeComp = (tag: string) =>
    ({ children, ...rest }: any) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(rest)) {
        if (!FRAMER_PROPS.has(k)) clean[k] = v;
      }
      return React.createElement(tag, clean, children);
    };
  return {
    motion: new Proxy(
      {},
      {
        get: (_t, tag: string) => makeComp(tag),
      }
    ),
    AnimatePresence: ({ children }: any) => children,
  };
});

function seedCart(total = 5000) {
  act(() => {
    usePosStore.setState({
      items: [
        {
          product: {
            id: "p1",
            name: "Test",
            price: total,
            stock: 10,
            categoryId: "filtros",
          },
          quantity: 1,
        },
      ],
      paymentMethod: "cash",
      bridgeStatus: "idle",
    });
  });
}

function setup(overrides: Partial<Parameters<typeof PaymentModal>[0]> = {}) {
  const onOpenChange = vi.fn();
  const utils = render(
    <PaymentModal open={true} onOpenChange={onOpenChange} {...overrides} />
  );
  return { ...utils, onOpenChange };
}

describe("PaymentModal — Zustand-driven state", () => {
  beforeEach(() => {
    act(() => {
      usePosStore.setState({
        items: [],
        paymentMethod: "cash",
        bridgeStatus: "idle",
      });
    });
  });

  it("renders total from store and cash selected by default (bridge hidden)", () => {
    seedCart(5000);
    setup();

    expect(screen.getByText("Pago")).toBeInTheDocument();
    expect(screen.getByText(/5\.?000/)).toBeInTheDocument();
    expect(screen.queryByText(/transbank/i)).not.toBeInTheDocument();
  });

  it("idle → connecting → connected when selecting debit", async () => {
    seedCart();
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: /débito/i }));

    expect(screen.getByText(/conectando/i)).toBeInTheDocument();

    await waitFor(
      () => expect(screen.getByText(/transbank conectado/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(screen.getByText("Listo")).toBeInTheDocument();
  });

  it("confirm button disabled while connecting, enabled when connected", async () => {
    seedCart();
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: /crédito/i }));
    const confirmBtn = screen.getByRole("button", { name: /confirmar pago/i });
    expect(confirmBtn).toBeDisabled();

    await waitFor(() => expect(confirmBtn).toBeEnabled(), { timeout: 3000 });
  });

  it("confirm with cash clears cart in store and closes modal", async () => {
    seedCart(5000);
    const user = userEvent.setup();
    const { onOpenChange } = setup();

    await user.click(screen.getByRole("button", { name: /confirmar pago/i }));

    expect(usePosStore.getState().items).toEqual([]);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("switching from debit back to cash hides bridge panel and re-enables confirm", async () => {
    seedCart();
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: /débito/i }));
    expect(screen.getByText(/conectando/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^efectivo$/i }));

    expect(screen.queryByText(/conectando/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar pago/i })).toBeEnabled();
  });

  it("cancel button triggers onOpenChange(false) without clearing cart", async () => {
    seedCart(5000);
    const user = userEvent.setup();
    const { onOpenChange } = setup();

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(usePosStore.getState().items.length).toBe(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
