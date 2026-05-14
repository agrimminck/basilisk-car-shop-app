import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the drizzle db client BEFORE importing the route handlers
const selectFromMock = vi.fn();
const insertReturningMock = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({ from: selectFromMock }),
    insert: () => ({
      values: () => ({ returning: insertReturningMock }),
    }),
  },
}));

vi.mock("@/lib/schema", () => ({
  sales: { __table: "sales" },
}));

import { GET, POST } from "./route";

function jsonRequest(body: unknown): any {
  return {
    json: async () => body,
  };
}

describe("/api/sales route", () => {
  beforeEach(() => {
    selectFromMock.mockReset();
    insertReturningMock.mockReset();
  });

  it("GET: returns all sales from db.select().from(sales)", async () => {
    const rows = [
      { id: "s1", totalAmount: "100.00" },
      { id: "s2", totalAmount: "200.00" },
    ];
    selectFromMock.mockResolvedValueOnce(rows);

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual(rows);
    expect(selectFromMock).toHaveBeenCalledOnce();
  });

  it("POST: inserts body and returns 201 with inserted row", async () => {
    const inputBody = {
      branchId: "b1",
      totalAmount: "5000.00",
      status: "paid",
    };
    const inserted = { id: "new-uuid", ...inputBody };
    insertReturningMock.mockResolvedValueOnce([inserted]);

    const res = await POST(jsonRequest(inputBody));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(inserted);
  });

  it("POST: propagates db errors (no try/catch wrapper currently)", async () => {
    insertReturningMock.mockRejectedValueOnce(new Error("FK violation"));

    await expect(POST(jsonRequest({ branchId: "x" }))).rejects.toThrow(
      "FK violation"
    );
  });
});

// FLAGGED BUG: POST does NOT decrement inventory or insert sale_lines.
// A real sale should atomically: insert sale + insert sale_lines + decrement inventory
// for each variant sold. See claude-docs/overview.md "Deuda técnica".
describe("/api/sales route — inventory decrement (FLAGGED MISSING)", () => {
  it.skip("POST should decrement inventory for each line (not implemented)", () => {
    // Skipped: implement once route supports sale_lines + inventory transaction.
  });
});
