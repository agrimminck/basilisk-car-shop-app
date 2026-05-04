"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Calendar,
  DollarSign,
  CreditCard,
  Banknote,
  Receipt,
  TrendingUp,
  ShoppingCart,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

type SaleStatus = "draft" | "confirmed" | "paid" | "cancelled";
type PaymentMethod = "cash" | "card" | "transfer";

interface SaleLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Payment {
  id: string;
  method: PaymentMethod;
  amount: number;
}

interface Sale {
  id: string;
  ticket: string;
  clientName: string;
  date: string;
  status: SaleStatus;
  total: number;
  lines: SaleLine[];
  payments: Payment[];
}

const MOCK_SALES: Sale[] = [
  {
    id: "1",
    ticket: "VT-20260501-001",
    clientName: "Juan Pérez González",
    date: "2026-05-01T10:30:00",
    status: "paid",
    total: 125990,
    lines: [
      { id: "l1", description: "Cambio de aceite 5W30", quantity: 1, unitPrice: 45990 },
      { id: "l2", description: "Filtro de aceite", quantity: 1, unitPrice: 15990 },
      { id: "l3", description: "Revisión frenos delanteros", quantity: 1, unitPrice: 64010 },
    ],
    payments: [{ id: "p1", method: "card", amount: 125990 }],
  },
  {
    id: "2",
    ticket: "VT-20260501-002",
    clientName: "María Fernanda Rojas",
    date: "2026-05-01T11:15:00",
    status: "confirmed",
    total: 89990,
    lines: [
      { id: "l1", description: "Alineación y balanceo", quantity: 1, unitPrice: 49990 },
      { id: "l2", description: "Rotación de neumáticos", quantity: 1, unitPrice: 40000 },
    ],
    payments: [{ id: "p1", method: "cash", amount: 89990 }],
  },
  {
    id: "3",
    ticket: "VT-20260430-003",
    clientName: "Pedro Andrés Soto",
    date: "2026-04-30T09:45:00",
    status: "paid",
    total: 245990,
    lines: [
      { id: "l1", description: "Kit de embrague", quantity: 1, unitPrice: 189990 },
      { id: "l2", description: "Mano de obra cambio embrague", quantity: 1, unitPrice: 56000 },
    ],
    payments: [
      { id: "p1", method: "card", amount: 145990 },
      { id: "p2", method: "cash", amount: 100000 },
    ],
  },
  {
    id: "4",
    ticket: "VT-20260430-004",
    clientName: "Carmen Luz Valenzuela",
    date: "2026-04-30T14:20:00",
    status: "cancelled",
    total: 32990,
    lines: [
      { id: "l1", description: "Lavado completo", quantity: 1, unitPrice: 32990 },
    ],
    payments: [],
  },
  {
    id: "5",
    ticket: "VT-20260429-005",
    clientName: "Diego Alejandro Figueroa",
    date: "2026-04-29T16:00:00",
    status: "paid",
    total: 156990,
    lines: [
      { id: "l1", description: "Bujías iridium x4", quantity: 1, unitPrice: 48990 },
      { id: "l2", description: "Cable de bujías", quantity: 1, unitPrice: 37990 },
      { id: "l3", description: "Diagnóstico computacional", quantity: 1, unitPrice: 70010 },
    ],
    payments: [{ id: "p1", method: "transfer", amount: 156990 }],
  },
  {
    id: "6",
    ticket: "VT-20260428-006",
    clientName: "Valentina Andrea Morales",
    date: "2026-04-28T08:30:00",
    status: "draft",
    total: 67990,
    lines: [
      { id: "l1", description: "Cambio amortiguadores traseros", quantity: 1, unitPrice: 67990 },
    ],
    payments: [],
  },
  {
    id: "7",
    ticket: "VT-20260428-007",
    clientName: "Roberto Carlos Henríquez",
    date: "2026-04-28T13:10:00",
    status: "paid",
    total: 98990,
    lines: [
      { id: "l1", description: "Servicio completo 40.000 km", quantity: 1, unitPrice: 98990 },
    ],
    payments: [{ id: "p1", method: "card", amount: 98990 }],
  },
  {
    id: "8",
    ticket: "VT-20260427-008",
    clientName: "Francisca Belén Álvarez",
    date: "2026-04-27T10:00:00",
    status: "confirmed",
    total: 189990,
    lines: [
      { id: "l1", description: "Neumático Michelin 205/55R16", quantity: 2, unitPrice: 94995 },
    ],
    payments: [{ id: "p1", method: "cash", amount: 189990 }],
  },
  {
    id: "9",
    ticket: "VT-20260426-009",
    clientName: "Matías Nicolás Castro",
    date: "2026-04-26T15:45:00",
    status: "paid",
    total: 45990,
    lines: [
      { id: "l1", description: "Carga de gas aire acondicionado", quantity: 1, unitPrice: 45990 },
    ],
    payments: [{ id: "p1", method: "card", amount: 45990 }],
  },
  {
    id: "10",
    ticket: "VT-20260425-010",
    clientName: "Daniela Paz Contreras",
    date: "2026-04-25T11:30:00",
    status: "paid",
    total: 112990,
    lines: [
      { id: "l1", description: "Pastillas de freno traseras", quantity: 1, unitPrice: 54990 },
      { id: "l2", description: "Rectificación de discos", quantity: 1, unitPrice: 58000 },
    ],
    payments: [
      { id: "p1", method: "cash", amount: 62990 },
      { id: "p2", method: "card", amount: 50000 },
    ],
  },
  {
    id: "11",
    ticket: "VT-20260424-011",
    clientName: "Alejandro Esteban Fuentes",
    date: "2026-04-24T09:00:00",
    status: "cancelled",
    total: 78990,
    lines: [
      { id: "l1", description: "Cambio de batería 60Ah", quantity: 1, unitPrice: 78990 },
    ],
    payments: [],
  },
  {
    id: "12",
    ticket: "VT-20260423-012",
    clientName: "Camila Antonia Reyes",
    date: "2026-04-23T17:15:00",
    status: "paid",
    total: 219990,
    lines: [
      { id: "l1", description: "Scanner automotriz multimarca", quantity: 1, unitPrice: 219990 },
    ],
    payments: [{ id: "p1", method: "transfer", amount: 219990 }],
  },
  {
    id: "13",
    ticket: "VT-20260422-013",
    clientName: "Felipe Ignacio Martínez",
    date: "2026-04-22T12:00:00",
    status: "draft",
    total: 34990,
    lines: [
      { id: "l1", description: "Limpieza de inyectores", quantity: 1, unitPrice: 34990 },
    ],
    payments: [],
  },
  {
    id: "14",
    ticket: "VT-20260421-014",
    clientName: "Javiera Soledad Tapia",
    date: "2026-04-21T14:30:00",
    status: "paid",
    total: 145990,
    lines: [
      { id: "l1", description: "Cambio de correa distribución", quantity: 1, unitPrice: 95990 },
      { id: "l2", description: "Bomba de agua", quantity: 1, unitPrice: 50000 },
    ],
    payments: [{ id: "p1", method: "card", amount: 145990 }],
  },
  {
    id: "15",
    ticket: "VT-20260420-015",
    clientName: "Sebastián Andrés Orellana",
    date: "2026-04-20T10:45:00",
    status: "confirmed",
    total: 59990,
    lines: [
      { id: "l1", description: "Cambio de aceite caja automática", quantity: 1, unitPrice: 59990 },
    ],
    payments: [{ id: "p1", method: "cash", amount: 59990 }],
  },
];

function formatCurrency(amount: number): string {
  return "$" + amount.toLocaleString("es-CL");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return (
    date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
  );
}

function statusLabel(status: SaleStatus): string {
  const labels: Record<SaleStatus, string> = {
    draft: "Borrador",
    confirmed: "Confirmada",
    paid: "Pagada",
    cancelled: "Anulada",
  };
  return labels[status];
}

function statusBadgeVariant(status: SaleStatus): "secondary" | "default" | "success" | "destructive" {
  switch (status) {
    case "draft":
      return "secondary";
    case "confirmed":
      return "default";
    case "paid":
      return "success";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

function paymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    cash: "Efectivo",
    card: "Tarjeta",
    transfer: "Transferencia",
  };
  return labels[method];
}

function paymentMethodIcon(method: PaymentMethod) {
  switch (method) {
    case "cash":
      return <Banknote className="h-4 w-4" />;
    case "card":
      return <CreditCard className="h-4 w-4" />;
    case "transfer":
      return <Receipt className="h-4 w-4" />;
  }
}

function mainPaymentMethod(sale: Sale): PaymentMethod | null {
  if (sale.payments.length === 0) return null;
  return sale.payments[0].method;
}

export default function SalesPage() {
  const [filterPeriod, setFilterPeriod] = useState<string>("today");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const now = new Date("2026-05-01T00:00:00");

  const filteredSales = useMemo(() => {
    let filtered = [...MOCK_SALES];

    if (filterPeriod === "today") {
      filtered = filtered.filter((s) => {
        const d = new Date(s.date);
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    } else if (filterPeriod === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      filtered = filtered.filter((s) => new Date(s.date) >= startOfWeek);
    } else if (filterPeriod === "month") {
      filtered = filtered.filter(
        (s) =>
          new Date(s.date).getMonth() === now.getMonth() &&
          new Date(s.date).getFullYear() === now.getFullYear()
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.ticket.toLowerCase().includes(term) ||
          s.clientName.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filterPeriod, searchTerm]);

  const stats = useMemo(() => {
    const totalSales = filteredSales
      .filter((s) => s.status === "paid")
      .reduce((sum, s) => sum + s.total, 0);
    const transactionCount = filteredSales.length;
    const paidTransactions = filteredSales.filter((s) => s.status === "paid").length;
    const averageTicket = paidTransactions > 0 ? totalSales / paidTransactions : 0;

    const cardTotal = filteredSales
      .filter((s) => s.status === "paid")
      .reduce((sum, s) => {
        const cardPayments = s.payments
          .filter((p) => p.method === "card")
          .reduce((pSum, p) => pSum + p.amount, 0);
        return sum + cardPayments;
      }, 0);

    const cashTotal = filteredSales
      .filter((s) => s.status === "paid")
      .reduce((sum, s) => {
        const cashPayments = s.payments
          .filter((p) => p.method === "cash")
          .reduce((pSum, p) => pSum + p.amount, 0);
        return sum + cashPayments;
      }, 0);

    return {
      totalSales,
      transactionCount,
      averageTicket,
      cardTotal,
      cashTotal,
    };
  }, [filteredSales]);

  function handleRowClick(sale: Sale): void {
    setSelectedSale(sale);
    setDialogOpen(true);
  }

  return (
    <AppShell>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Historial de Ventas
            </h1>
            <p className="text-sm text-muted-foreground">
              Revisa y filtra todas las transacciones del taller
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={filterPeriod} onValueChange={setFilterPeriod}>
              <TabsList>
                <TabsTrigger value="today">Hoy</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mes</TabsTrigger>
                <TabsTrigger value="all">Todo</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por ticket o cliente..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Ventas
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalSales)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transacciones
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.transactionCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ticket Promedio
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(Math.round(stats.averageTicket))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tarjeta vs Efectivo
              </CardTitle>
              <CreditCard className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {formatCurrency(stats.cardTotal)}
                <span className="mx-1 text-muted-foreground">/</span>
                {formatCurrency(stats.cashTotal)}
              </div>
              <p className="text-xs text-muted-foreground">Tarjeta / Efectivo</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="rounded-md border border-border">
              <div className="min-w-[640px]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left">
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Ticket
                      </th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Cliente
                      </th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Fecha
                      </th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Total
                      </th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Estado
                      </th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Método de Pago
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale) => {
                      const mainMethod = mainPaymentMethod(sale);
                      return (
                        <tr
                          key={sale.id}
                          onClick={() => handleRowClick(sale)}
                          className="cursor-pointer border-b border-border transition-colors hover:bg-surface-hover"
                        >
                          <td className="px-4 py-3 font-medium text-primary">
                            {sale.ticket}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {sale.clientName}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(sale.date)}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {formatCurrency(sale.total)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={statusBadgeVariant(sale.status)}>
                              {statusLabel(sale.status)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {mainMethod ? (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                {paymentMethodIcon(mainMethod)}
                                <span>{paymentMethodLabel(mainMethod)}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredSales.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-muted-foreground"
                        >
                          No se encontraron ventas para los filtros seleccionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedSale && (
          <div className="space-y-4">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle>{selectedSale.ticket}</DialogTitle>
                  <DialogDescription>
                    {formatDateTime(selectedSale.date)}
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cliente</span>
                <span className="font-medium">{selectedSale.clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado</span>
                <Badge variant={statusBadgeVariant(selectedSale.status)}>
                  {statusLabel(selectedSale.status)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                Líneas de venta
              </h4>
              <div className="rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left">
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        Descripción
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        Cant.
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        Unitario
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground text-right">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.lines.map((line) => (
                      <tr
                        key={line.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-3 py-2">{line.description}</td>
                        <td className="px-3 py-2">{line.quantity}</td>
                        <td className="px-3 py-2">
                          {formatCurrency(line.unitPrice)}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {formatCurrency(line.quantity * line.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Pagos</h4>
              {selectedSale.payments.length > 0 ? (
                <div className="space-y-2">
                  {selectedSale.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {paymentMethodIcon(payment.method)}
                        <span>{paymentMethodLabel(payment.method)}</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sin pagos registrados
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(selectedSale.total)}
              </span>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </AppShell>
  );
}
