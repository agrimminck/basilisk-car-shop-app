import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaymentModal } from "./payment-modal";

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

function setup(overrides: Partial<Parameters<typeof PaymentModal>[0]> = {}) {
  const onConfirm = vi.fn();
  const onOpenChange = vi.fn();
  const utils = render(
    <PaymentModal
      open={true}
      total={5000}
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
      {...overrides}
    />
  );
  return { ...utils, onConfirm, onOpenChange };
}

describe("PaymentModal — state transitions", () => {
  it("renders total and cash selected by default (bridge hidden)", () => {
    setup();

    expect(screen.getByText("Pago")).toBeInTheDocument();
    expect(screen.getByText(/5\.?000/)).toBeInTheDocument();
    expect(screen.queryByText(/transbank/i)).not.toBeInTheDocument();
  });

  it("idle → connecting → connected when selecting debit", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: /débito/i }));

    expect(screen.getByText(/conectando/i)).toBeInTheDocument();

    // Real timer: setTimeout(1200) — waitFor polls up to 3s by default
    await waitFor(
      () => expect(screen.getByText(/transbank conectado/i)).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(screen.getByText("Listo")).toBeInTheDocument();
  });

  it("confirm button disabled while connecting, enabled when connected", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: /crédito/i }));
    const confirmBtn = screen.getByRole("button", { name: /confirmar pago/i });
    expect(confirmBtn).toBeDisabled();

    await waitFor(() => expect(confirmBtn).toBeEnabled(), { timeout: 3000 });
  });

  it("confirm with cash bypasses bridge; calls onConfirm + closes modal", async () => {
    const user = userEvent.setup();
    const { onConfirm, onOpenChange } = setup();

    await user.click(screen.getByRole("button", { name: /confirmar pago/i }));

    expect(onConfirm).toHaveBeenCalledWith("cash");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("switching from debit back to cash hides bridge panel and re-enables confirm", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: /débito/i }));
    expect(screen.getByText(/conectando/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^efectivo$/i }));

    expect(screen.queryByText(/conectando/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar pago/i })).toBeEnabled();
  });

  it("cancel button triggers onOpenChange(false) without onConfirm", async () => {
    const user = userEvent.setup();
    const { onConfirm, onOpenChange } = setup();

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
