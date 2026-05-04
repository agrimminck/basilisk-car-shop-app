"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Settings, Wifi, WifiOff, Printer, Monitor, Store } from "lucide-react";

export default function SettingsPage() {
  const [posConnected, setPosConnected] = useState(true);
  const [general, setGeneral] = useState({ name: "Taller Basilisk", address: "Av. Siempre Viva 742", phone: "+56 9 1234 5678" });
  const [autoPrint, setAutoPrint] = useState(true);
  const [printer, setPrinter] = useState("EPSON TM-T20X");
  const [darkMode, setDarkMode] = useState(true);

  return (
    <AppShell>
      <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Ajustes</h1>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {posConnected ? <Wifi className="h-5 w-5 text-success" /> : <WifiOff className="h-5 w-5 text-muted-foreground" />}
              <CardTitle className="text-lg">Transbank POS</CardTitle>
            </div>
            <CardDescription>Estado de la conexión con el terminal de pago.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Estado</p>
                <p className="text-sm text-muted-foreground">{posConnected ? "Conectado" : "Desconectado"}</p>
              </div>
              <Button variant={posConnected ? "outline" : "default"} onClick={() => setPosConnected(!posConnected)}>
                {posConnected ? "Desconectar" : "Conectar"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Última venta</p>
                <p className="text-sm text-muted-foreground">#V-1042 — $89.000 · hace 12 min</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary">Cierre de Caja</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">General</CardTitle>
            </div>
            <CardDescription>Información del taller.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del taller</label>
              <Input value={general.name} onChange={(e) => setGeneral((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <Input value={general.address} onChange={(e) => setGeneral((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono</label>
              <Input value={general.phone} onChange={(e) => setGeneral((p) => ({ ...p, phone: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Impresión</CardTitle>
            </div>
            <CardDescription>Configuración de impresora térmica.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Toggle label="Imprimir voucher automáticamente" checked={autoPrint} onChange={(e) => setAutoPrint((e.target as HTMLInputElement).checked)} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Impresora</label>
              <Input value={printer} onChange={(e) => setPrinter(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Apariencia</CardTitle>
            </div>
            <CardDescription>Preferencias visuales de la aplicación.</CardDescription>
          </CardHeader>
          <CardContent>
            <Toggle label="Modo oscuro" checked={darkMode} onChange={(e) => setDarkMode((e.target as HTMLInputElement).checked)} />
          </CardContent>
        </Card>
      </div>
      </div>
    </AppShell>
  );
}
