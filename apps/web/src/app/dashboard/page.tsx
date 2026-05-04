"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
  Wifi,
  AlertTriangle,
  Wrench,
  Car,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

const salesData = [
  { day: "Lun", amount: 320000 },
  { day: "Mar", amount: 450000 },
  { day: "Mié", amount: 280000 },
  { day: "Jue", amount: 510000 },
  { day: "Vie", amount: 620000 },
  { day: "Sáb", amount: 780000 },
  { day: "Dom", amount: 410000 },
];

const recentSales = [
  { id: "V-1042", customer: "Juan Pérez", total: 125000, time: "14:32" },
  { id: "V-1041", customer: "María González", total: 340000, time: "13:15" },
  { id: "V-1040", customer: "Carlos Soto", total: 89000, time: "11:50" },
  { id: "V-1039", customer: "Ana López", total: 210000, time: "10:22" },
  { id: "V-1038", customer: "Pedro Rojas", total: 175000, time: "09:45" },
];

const lowStock = [
  { name: "Filtro de aceite Mahle OC47", stock: 3, min: 10 },
  { name: "Pastillas de freno Brembo P3001", stock: 2, min: 8 },
  { name: "Aceite Mobil 1 5W-30 (1L)", stock: 5, min: 12 },
  { name: "Bujías NGK BKR6E", stock: 4, min: 10 },
  { name: "Correa distribución Gates", stock: 1, min: 5 },
];

const workshopServices = [
  { id: "OT-205", vehicle: "Toyota Corolla AB-CD-12", service: "Cambio de aceite y filtros", progress: 80, time: "30 min rest." },
  { id: "OT-204", vehicle: "Nissan Versa XY-ZW-34", service: "Revisión frenos delanteros", progress: 45, time: "1.5 hrs rest." },
  { id: "OT-203", vehicle: "Chevrolet Spark LM-NO-56", service: "Alineación y balanceo", progress: 20, time: "2 hrs rest." },
  { id: "OT-202", vehicle: "Hyundai Tucson PQ-RS-78", service: "Cambio correa distribución", progress: 60, time: "1 hr rest." },
];

function formatCLP(value: number) {
  return "$" + value.toLocaleString("es-CL");
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("ventas");
  const today = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 p-6"
      >
        {/* Header con imagen de fondo sutil */}
        <motion.div variants={item} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground text-glow">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground capitalize mt-1">{today}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="gap-1 bg-success/20 text-success border-success/30">
              <Wifi className="h-3 w-3" /> POS conectado
            </Badge>
            <Badge variant="destructive" className="gap-1 bg-danger/20 text-danger border-danger/30">
              <AlertTriangle className="h-3 w-3" /> 5 alertas stock
            </Badge>
          </div>
        </motion.div>

        {/* KPIs */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <Card className="overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardDescription>Ventas Hoy</CardDescription>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="relative">
              <CardTitle className="text-3xl">{formatCLP(1245000)}</CardTitle>
              <p className="mt-1 flex items-center text-xs text-success">
                <TrendingUp className="mr-1 h-3 w-3" /> +12.5% vs ayer
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardDescription>Órdenes Activas</CardDescription>
              <ShoppingCart className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent className="relative">
              <CardTitle className="text-3xl">8</CardTitle>
              <p className="mt-1 flex items-center text-xs text-success">
                <TrendingUp className="mr-1 h-3 w-3" /> +3 vs ayer
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-danger/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardDescription>Stock Bajo</CardDescription>
              <Package className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent className="relative">
              <CardTitle className="text-3xl text-danger">5</CardTitle>
              <p className="mt-1 flex items-center text-xs text-danger">
                <TrendingDown className="mr-1 h-3 w-3" /> Requiere atención
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardDescription>Ingresos del Mes</CardDescription>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent className="relative">
              <CardTitle className="text-3xl">{formatCLP(18450000)}</CardTitle>
              <p className="mt-1 flex items-center text-xs text-success">
                <TrendingUp className="mr-1 h-3 w-3" /> +8.2% vs mes ant.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={item}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="ventas">Ventas</TabsTrigger>
              <TabsTrigger value="inventario">Inventario</TabsTrigger>
              <TabsTrigger value="taller">Taller</TabsTrigger>
            </TabsList>

            <TabsContent value="ventas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ventas últimos 7 días</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" stroke="#94a3b8" />
                        <YAxis
                          stroke="#94a3b8"
                          tickFormatter={(v) => "$" + (v / 1000).toFixed(0) + "k"}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 17, 26, 0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "0.75rem",
                            backdropFilter: "blur(10px)",
                          }}
                          formatter={(value: number) => [formatCLP(value), "Monto"]}
                          labelStyle={{ color: "#94a3b8" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#38bdf8"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorSales)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Últimas ventas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-left text-muted-foreground">
                          <th className="pb-2 pr-4 font-medium">ID</th>
                          <th className="pb-2 pr-4 font-medium">Cliente</th>
                          <th className="pb-2 pr-4 font-medium">Hora</th>
                          <th className="pb-2 text-right font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSales.map((s) => (
                          <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="py-3 pr-4 text-primary font-medium">{s.id}</td>
                            <td className="py-3 pr-4">{s.customer}</td>
                            <td className="py-3 pr-4 text-muted-foreground">{s.time}</td>
                            <td className="py-3 text-right font-bold">{formatCLP(s.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventario">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-danger" />
                    Productos con stock bajo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStock.map((p) => (
                      <div
                        key={p.name}
                        className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Mínimo: {p.min} unidades
                          </p>
                        </div>
                        <Badge
                          variant={p.stock <= 2 ? "destructive" : "warning"}
                          className="shrink-0"
                        >
                          {p.stock} en stock
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="taller">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Servicios en curso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workshopServices.map((ws) => (
                      <div
                        key={ws.id}
                        className="rounded-xl bg-white/5 p-4 border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <Car className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">{ws.vehicle}</p>
                              <p className="text-xs text-muted-foreground">{ws.service}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {ws.time}
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${ws.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <p className="mt-1 text-right text-xs text-muted-foreground">
                            {ws.progress}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
