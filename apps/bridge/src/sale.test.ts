import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp, type PosLike } from "./index";

vi.mock("transbank-pos-sdk", () => ({
  POSIntegrado: vi.fn().mockImplementation(() => ({})),
}));

function buildMockPos(overrides: Partial<PosLike> = {}): PosLike {
  return {
    autoconnect: vi.fn().mockResolvedValue({ path: "/dev/ttyUSB0" }),
    loadKeys: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    sale: vi.fn(),
    refund: vi.fn(),
    closeDay: vi.fn(),
    getLastSale: vi.fn(),
    salesDetail: vi.fn(),
    ...overrides,
  };
}

async function connectedApp(pos: PosLike) {
  const app = createApp(pos);
  await request(app).post("/api/pos/connect");
  return app;
}

describe("bridge /api/pos/sale", () => {
  it("success: SDK responseCode=0 → success:true + shape", async () => {
    const sdkSale = {
      responseCode: 0,
      authorizationCode: "ABC123",
      cardLastDigits: "1234",
      sharesNumber: 0,
      amount: 5000,
      ticket: "T-1",
    };
    const pos = buildMockPos({
      sale: vi.fn().mockResolvedValue(sdkSale),
    });
    const app = await connectedApp(pos);

    const res = await request(app)
      .post("/api/pos/sale")
      .send({ amount: 5000, ticket: "T-1" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.responseCode).toBe(0);
    expect(res.body.authorizationCode).toBe("ABC123");
    expect(res.body.cardLastDigits).toBe("1234");
    expect(res.body.raw).toEqual(sdkSale);
    expect(pos.sale).toHaveBeenCalledWith(5000, "T-1");
  });

  it("declined card: SDK responseCode!=0 → success:false but still 200", async () => {
    const pos = buildMockPos({
      sale: vi.fn().mockResolvedValue({ responseCode: -1, ticket: "T-2" }),
    });
    const app = await connectedApp(pos);

    const res = await request(app)
      .post("/api/pos/sale")
      .send({ amount: 1000, ticket: "T-2" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.responseCode).toBe(-1);
  });

  it("missing amount or ticket: 400 without calling SDK", async () => {
    const pos = buildMockPos({ sale: vi.fn() });
    const app = await connectedApp(pos);

    const res = await request(app).post("/api/pos/sale").send({ amount: 100 });

    expect(res.status).toBe(400);
    expect(pos.sale).not.toHaveBeenCalled();
  });

  it("POS not connected: 400 with informative message", async () => {
    const pos = buildMockPos({ sale: vi.fn() });
    const app = createApp(pos); // not connected

    const res = await request(app)
      .post("/api/pos/sale")
      .send({ amount: 100, ticket: "T-3" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/no conectado/i);
    expect(pos.sale).not.toHaveBeenCalled();
  });

  it("SDK throws (timeout): 500 with error message", async () => {
    const pos = buildMockPos({
      sale: vi.fn().mockRejectedValue(new Error("timeout waiting for card")),
    });
    const app = await connectedApp(pos);

    const res = await request(app)
      .post("/api/pos/sale")
      .send({ amount: 100, ticket: "T-4" });

    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/timeout/);
  });
});
