import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createSale, refund, closeDay, getPosStatus } from "./bridge";

function mockFetch(response: {
  ok: boolean;
  status?: number;
  statusText?: string;
  body?: unknown;
  bodyText?: string;
}) {
  return vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 500),
    statusText: response.statusText ?? "",
    json: async () => response.body,
    text: async () => response.bodyText ?? "",
  });
}

describe("bridge client api", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("createSale: posts JSON body and returns wrapped data on 200", async () => {
    const sdkResult = {
      operationId: 42,
      ticket: "T-1",
      amount: 5000,
      authorizationCode: "A1",
      cardLastDigits: "1234",
    };
    vi.stubGlobal(
      "fetch",
      mockFetch({ ok: true, body: sdkResult }) as unknown as typeof fetch
    );

    const res = await createSale(5000, "T-1");

    expect(res.success).toBe(true);
    expect(res.data).toEqual(sdkResult);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8090/api/pos/sale",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ amount: 5000, ticket: "T-1" }),
      })
    );
  });

  it("createSale: bridge offline (fetch throws) → success:false with error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch"))
    );

    const res = await createSale(100, "T-2");

    expect(res.success).toBe(false);
    expect(res.error).toBe("Failed to fetch");
  });

  it("createSale: bridge returns 503 → success:false with HTTP error", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
        bodyText: "POS no conectado",
      }) as unknown as typeof fetch
    );

    const res = await createSale(100, "T-3");

    expect(res.success).toBe(false);
    expect(res.error).toContain("503");
    expect(res.error).toContain("POS no conectado");
  });

  it("refund: posts operationId as number", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ ok: true, body: { ok: true } }) as unknown as typeof fetch
    );

    await refund(99);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8090/api/pos/refund",
      expect.objectContaining({
        body: JSON.stringify({ operationId: 99 }),
      })
    );
  });

  it("closeDay: posts to /api/pos/close-day endpoint (matches bridge route)", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ ok: true, body: { closed: true } }) as unknown as typeof fetch
    );

    const res = await closeDay();

    expect(res.success).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8090/api/pos/close-day",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("getPosStatus: GET returns wrapped status payload", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        ok: true,
        body: { connected: true, deviceName: "VeriFone" },
      }) as unknown as typeof fetch
    );

    const res = await getPosStatus();

    expect(res.data?.connected).toBe(true);
    expect(res.data?.deviceName).toBe("VeriFone");
  });
});
