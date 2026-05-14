import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Drizzle db mock with transaction support ---
// The route uses db.transaction(cb) and inside passes a `tx` object exposing
// insert(...).values(...).returning() and update(...).set(...).where(...).returning().
// We build a fluent stub where each terminal call (`returning`) is a vi.fn()
// so each test can program success/failure per step.

const insertSaleReturning = vi.fn();
const insertSaleLinesReturning = vi.fn();
const updateInventoryReturning = vi.fn();
const selectFromMock = vi.fn();

// Track number of calls into each step so we can verify ordering / rollback.
const calls: { step: string; args?: unknown }[] = [];

function makeTx() {
  return {
    insert: (table: any) => ({
      values: (vals: any) => ({
        returning: (..._args: any[]) => {
          if (table.__table === "sales") {
            calls.push({ step: "insert.sales", args: vals });
            return insertSaleReturning(vals);
          }
          if (table.__table === "sale_lines") {
            calls.push({ step: "insert.sale_lines", args: vals });
            return insertSaleLinesReturning(vals);
          }
          throw new Error(`unexpected insert table: ${table.__table}`);
        },
      }),
    }),
    update: (table: any) => ({
      set: (_setVals: any) => ({
        where: (_whereExpr: any) => ({
          returning: (..._args: any[]) => {
            if (table.__table === "inventory") {
              calls.push({ step: "update.inventory" });
              return updateInventoryReturning();
            }
            throw new Error(`unexpected update table: ${table.__table}`);
          },
        }),
      }),
    }),
  };
}

// db.transaction(cb) executes the callback with a fresh tx; if cb throws,
// we re-throw (simulating Postgres rollback semantics).
vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({ from: selectFromMock }),
    transaction: async (cb: (tx: any) => Promise<any>) => {
      return cb(makeTx());
    },
  },
}));

vi.mock("../../../lib/db", () => ({
  db: {
    select: () => ({ from: selectFromMock }),
    transaction: async (cb: (tx: any) => Promise<any>) => {
      return cb(makeTx());
    },
  },
}));

vi.mock("@/lib/schema", () => ({
  sales: { __table: "sales" },
  saleLines: { __table: "sale_lines" },
  inventory: {
    __table: "inventory",
    branchId: { name: "branch_id" },
    variantId: { name: "variant_id" },
    quantity: { name: "quantity" },
    id: { name: "id" },
  },
}));

vi.mock("../../../lib/schema", () => ({
  sales: { __table: "sales" },
  saleLines: { __table: "sale_lines" },
  inventory: {
    __table: "inventory",
    branchId: { name: "branch_id" },
    variantId: { name: "variant_id" },
    quantity: { name: "quantity" },
    id: { name: "id" },
  },
}));

import { GET, POST } from "./route";

function jsonRequest(body: unknown): any {
  return { json: async () => body };
}

function validBody(overrides: Partial<any> = {}) {
  return {
    branchId: "branch-1",
    customerId: "cust-1",
    totalAmount: "15000.00",
    lines: [
      {
        variantId: "var-1",
        quantity: 2,
        unitPrice: "5000.00",
        totalLine: "10000.00",
      },
      {
        variantId: "var-2",
        quantity: 1,
        unitPrice: "5000.00",
        totalLine: "5000.00",
      },
    ],
    ...overrides,
  };
}

describe("/api/sales GET", () => {
  beforeEach(() => {
    selectFromMock.mockReset();
  });

  it("returns all sales rows", async () => {
    const rows = [{ id: "s1", totalAmount: "100.00" }];
    selectFromMock.mockResolvedValueOnce(rows);

    const res = await GET();
    expect(await res.json()).toEqual(rows);
  });
});

describe("/api/sales POST — validation", () => {
  beforeEach(() => {
    insertSaleReturning.mockReset();
    insertSaleLinesReturning.mockReset();
    updateInventoryReturning.mockReset();
    calls.length = 0;
  });

  it("400 when branchId missing", async () => {
    const res = await POST(jsonRequest({ totalAmount: "100", lines: [{}] }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/branchId/);
  });

  it("400 when lines is empty", async () => {
    const res = await POST(
      jsonRequest({ branchId: "b", totalAmount: "100", lines: [] })
    );
    expect(res.status).toBe(400);
  });

  it("400 when a line is missing variantId", async () => {
    const res = await POST(
      jsonRequest({
        branchId: "b",
        totalAmount: "100",
        lines: [{ quantity: 1, unitPrice: "10" }],
      })
    );
    expect(res.status).toBe(400);
  });
});

describe("/api/sales POST — happy path (atomic write)", () => {
  beforeEach(() => {
    insertSaleReturning.mockReset();
    insertSaleLinesReturning.mockReset();
    updateInventoryReturning.mockReset();
    calls.length = 0;
  });

  it("inserts sale, inserts sale_lines, decrements inventory once per line, returns 201", async () => {
    const inserted = { id: "sale-1", branchId: "branch-1" };
    insertSaleReturning.mockResolvedValueOnce([inserted]);
    insertSaleLinesReturning.mockResolvedValueOnce([
      { id: "sl-1" },
      { id: "sl-2" },
    ]);
    // Both inventory decrements succeed (1 row affected each).
    updateInventoryReturning.mockResolvedValueOnce([{ id: "inv-1" }]);
    updateInventoryReturning.mockResolvedValueOnce([{ id: "inv-2" }]);

    const res = await POST(jsonRequest(validBody()));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(inserted);

    // Ordering: sale → sale_lines → inventory updates (one per line).
    const steps = calls.map((c) => c.step);
    expect(steps).toEqual([
      "insert.sales",
      "insert.sale_lines",
      "update.inventory",
      "update.inventory",
    ]);
    expect(insertSaleLinesReturning).toHaveBeenCalledOnce();
    const lineArgs = insertSaleLinesReturning.mock.calls[0][0];
    expect(lineArgs).toHaveLength(2);
    expect(lineArgs[0]).toMatchObject({
      saleId: "sale-1",
      variantId: "var-1",
      quantity: "2",
    });
  });
});

describe("/api/sales POST — insufficient stock rollback", () => {
  beforeEach(() => {
    insertSaleReturning.mockReset();
    insertSaleLinesReturning.mockReset();
    updateInventoryReturning.mockReset();
    calls.length = 0;
  });

  it("returns 409 when first line has no stock (zero rows affected)", async () => {
    insertSaleReturning.mockResolvedValueOnce([{ id: "sale-2" }]);
    insertSaleLinesReturning.mockResolvedValueOnce([{ id: "sl" }]);
    // First decrement returns zero affected rows → stock insufficient.
    updateInventoryReturning.mockResolvedValueOnce([]);

    const res = await POST(jsonRequest(validBody()));

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/insufficient stock/);
    expect(body.variantId).toBe("var-1");

    // Second decrement must NOT have run (throw aborted the tx).
    expect(updateInventoryReturning).toHaveBeenCalledTimes(1);
  });

  it("returns 409 on partial failure (second line out of stock); tx aborts after first decrement", async () => {
    insertSaleReturning.mockResolvedValueOnce([{ id: "sale-3" }]);
    insertSaleLinesReturning.mockResolvedValueOnce([
      { id: "sl-a" },
      { id: "sl-b" },
    ]);
    updateInventoryReturning.mockResolvedValueOnce([{ id: "inv-ok" }]);
    updateInventoryReturning.mockResolvedValueOnce([]); // 2nd line: zero rows

    const res = await POST(jsonRequest(validBody()));

    expect(res.status).toBe(409);
    expect((await res.json()).variantId).toBe("var-2");
    // Exactly two inventory attempts (1st succeeds, 2nd fails → rollback).
    expect(updateInventoryReturning).toHaveBeenCalledTimes(2);
  });
});

describe("/api/sales POST — db error propagation", () => {
  beforeEach(() => {
    insertSaleReturning.mockReset();
    insertSaleLinesReturning.mockReset();
    updateInventoryReturning.mockReset();
    calls.length = 0;
  });

  it("propagates unexpected db errors (FK violations etc)", async () => {
    insertSaleReturning.mockRejectedValueOnce(new Error("FK violation"));

    await expect(POST(jsonRequest(validBody()))).rejects.toThrow("FK violation");
  });
});
