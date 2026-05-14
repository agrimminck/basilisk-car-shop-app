import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp, type PosLike } from "./index";

// Mock the transbank-pos-sdk module so importing index.ts does not require hardware
vi.mock("transbank-pos-sdk", () => ({
  POSIntegrado: vi.fn().mockImplementation(() => buildMockPos()),
}));

function buildMockPos(overrides: Partial<PosLike> = {}): PosLike {
  return {
    autoconnect: vi.fn().mockResolvedValue({ path: "/dev/ttyUSB0" }),
    loadKeys: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    sale: vi.fn().mockResolvedValue({ responseCode: 0 }),
    refund: vi.fn().mockResolvedValue({ ok: true }),
    closeDay: vi.fn().mockResolvedValue({ closed: true }),
    getLastSale: vi.fn().mockResolvedValue({}),
    salesDetail: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

describe("bridge /api/pos/connect — autoconnect", () => {
  it("happy path: returns success + port path, calls loadKeys", async () => {
    const pos = buildMockPos();
    const app = createApp(pos);

    const res = await request(app).post("/api/pos/connect");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, port: "/dev/ttyUSB0" });
    expect(pos.autoconnect).toHaveBeenCalledOnce();
    expect(pos.loadKeys).toHaveBeenCalledOnce();
  });

  it("port not found: returns 404 and does NOT call loadKeys", async () => {
    const pos = buildMockPos({
      autoconnect: vi.fn().mockResolvedValue(null),
    });
    const app = createApp(pos);

    const res = await request(app).post("/api/pos/connect");

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/no se detectó/i);
    expect(pos.loadKeys).not.toHaveBeenCalled();
  });

  it("autoconnect throws (driver error): returns 500 with error message", async () => {
    const pos = buildMockPos({
      autoconnect: vi.fn().mockRejectedValue(new Error("USB driver missing")),
    });
    const app = createApp(pos);

    const res = await request(app).post("/api/pos/connect");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("USB driver missing");
  });

  it("status before connect: connected=false, port=null", async () => {
    const app = createApp(buildMockPos());

    const res = await request(app).get("/api/pos/status");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ connected: false, port: null });
  });

  it("status after successful connect: connected=true, port set", async () => {
    const app = createApp(buildMockPos());
    await request(app).post("/api/pos/connect");

    const res = await request(app).get("/api/pos/status");

    expect(res.body).toEqual({ connected: true, port: "/dev/ttyUSB0" });
  });
});
