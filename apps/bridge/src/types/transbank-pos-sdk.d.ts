declare module "transbank-pos-sdk" {
  export class POSIntegrado {
    setDebug(debug: boolean): void;
    autoconnect(): Promise<{ path: string } | null>;
    loadKeys(): Promise<void>;
    disconnect(): Promise<void>;
    sale(amount: number, ticket: string): Promise<any>;
    refund(operationId: number): Promise<any>;
    closeDay(): Promise<any>;
    getLastSale(): Promise<any>;
    salesDetail(printOnPos: boolean): Promise<any>;
  }
}
