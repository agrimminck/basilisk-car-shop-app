const BRIDGE_BASE_URL = "http://localhost:8090";

export interface BridgeResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PosStatus {
  connected: boolean;
  deviceName?: string;
  lastError?: string;
}

export interface SaleResult {
  operationId: number;
  ticket: string;
  amount: number;
  authorizationCode?: string;
  cardLastDigits?: string;
}

async function bridgeFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<BridgeResponse<T>> {
  try {
    const response = await fetch(`${BRIDGE_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText || response.statusText}`,
      };
    }

    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function getPosStatus(): Promise<BridgeResponse<PosStatus>> {
  return bridgeFetch<PosStatus>("/api/pos/status", { method: "GET" });
}

export async function connectPos(): Promise<BridgeResponse<PosStatus>> {
  return bridgeFetch<PosStatus>("/api/pos/connect", { method: "POST" });
}

export async function disconnectPos(): Promise<BridgeResponse<PosStatus>> {
  return bridgeFetch<PosStatus>("/api/pos/disconnect", { method: "POST" });
}

export async function createSale(
  amount: number,
  ticket: string
): Promise<BridgeResponse<SaleResult>> {
  return bridgeFetch<SaleResult>("/api/pos/sale", {
    method: "POST",
    body: JSON.stringify({ amount, ticket }),
  });
}

export async function refund(
  operationId: number
): Promise<BridgeResponse<SaleResult>> {
  return bridgeFetch<SaleResult>("/api/pos/refund", {
    method: "POST",
    body: JSON.stringify({ operationId }),
  });
}

export async function closeDay(): Promise<BridgeResponse<{ closed: boolean }>> {
  return bridgeFetch<{ closed: boolean }>("/api/pos/close-day", {
    method: "POST",
  });
}
