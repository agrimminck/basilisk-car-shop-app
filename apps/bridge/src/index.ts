import express from "express";
import cors from "cors";
import { POSIntegrado } from "transbank-pos-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const pos = new POSIntegrado();
let connectedPort: { path: string } | null = null;

// Middleware para loggear requests
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Estado del POS
app.get("/api/pos/status", (_req, res) => {
  res.json({
    connected: connectedPort !== null,
    port: connectedPort?.path ?? null,
  });
});

// Conectar al POS (autodetectar puerto)
app.post("/api/pos/connect", async (_req, res) => {
  try {
    const port = await pos.autoconnect();
    if (!port) {
      res.status(404).json({ error: "No se detectó ningún POS. Verifique conexión USB y drivers." });
      return;
    }
    connectedPort = port;
    await pos.loadKeys();
    res.json({ success: true, port: port.path });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Desconectar
app.post("/api/pos/disconnect", async (_req, res) => {
  try {
    await pos.disconnect();
    connectedPort = null;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Realizar venta
app.post("/api/pos/sale", async (req, res) => {
  try {
    const { amount, ticket }: { amount: number; ticket: string } = req.body;
    if (!amount || !ticket) {
      res.status(400).json({ error: "amount y ticket son requeridos" });
      return;
    }
    if (!connectedPort) {
      res.status(400).json({ error: "POS no conectado. Llame a /api/pos/connect primero." });
      return;
    }
    const sale = await pos.sale(amount, ticket);
    res.json({
      success: sale.responseCode === 0,
      responseCode: sale.responseCode,
      authorizationCode: sale.authorizationCode,
      cardLastDigits: sale.cardLastDigits,
      sharesNumber: sale.sharesNumber,
      amount: sale.amount,
      ticket: sale.ticket,
      raw: sale,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Anular venta
app.post("/api/pos/refund", async (req, res) => {
  try {
    const { operationId }: { operationId: number } = req.body;
    if (!operationId) {
      res.status(400).json({ error: "operationId requerido" });
      return;
    }
    const result = await pos.refund(operationId);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Cierre de caja
app.post("/api/pos/close-day", async (_req, res) => {
  try {
    const result = await pos.closeDay();
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Última venta
app.get("/api/pos/last-sale", async (_req, res) => {
  try {
    const sale = await pos.getLastSale();
    res.json({ success: true, sale });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Detalle de ventas (cuadratura)
app.get("/api/pos/sales-detail", async (_req, res) => {
  try {
    const detail = await pos.salesDetail(false);
    res.json({ success: true, detail });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT ?? 8090;
app.listen(PORT, () => {
  console.log(`Basilisk Car Shop Bridge escuchando en http://localhost:${PORT}`);
  console.log("Endpoints disponibles:");
  console.log("  GET  /api/pos/status");
  console.log("  POST /api/pos/connect");
  console.log("  POST /api/pos/disconnect");
  console.log("  POST /api/pos/sale");
  console.log("  POST /api/pos/refund");
  console.log("  POST /api/pos/close-day");
  console.log("  GET  /api/pos/last-sale");
  console.log("  GET  /api/pos/sales-detail");
});
