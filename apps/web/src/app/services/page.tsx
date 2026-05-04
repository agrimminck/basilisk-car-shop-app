"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Wrench, Plus, Clock, DollarSign, FileText } from "lucide-react";

interface Service {
  id: string;
  name: string;
  code: string;
  price: number;
  duration: string;
  description: string;
  active: boolean;
}

const initialServices: Service[] = [
  { id: "1", name: "Cambio de aceite", code: "SVC-001", price: 35000, duration: "30 min", description: "Cambio de aceite y filtro estándar", active: true },
  { id: "2", name: "Revisión de frenos", code: "SVC-002", price: 25000, duration: "45 min", description: "Inspección de pastillas, discos y líquido", active: true },
  { id: "3", name: "Alineación y balanceo", code: "SVC-003", price: 45000, duration: "60 min", description: "Alineación computarizada y balanceo de ruedas", active: true },
  { id: "4", name: "Diagnóstico computacional", code: "SVC-004", price: 28000, duration: "40 min", description: "Escaneo de fallas con equipo especializado", active: true },
  { id: "5", name: "Cambio de batería", code: "SVC-005", price: 18000, duration: "20 min", description: "Reemplazo de batería y verificación de carga", active: false },
  { id: "6", name: "Revisión suspensión", code: "SVC-006", price: 32000, duration: "50 min", description: "Chequeo de amortiguadores, resortes y bujes", active: true },
  { id: "7", name: "Limpieza de inyectores", code: "SVC-007", price: 55000, duration: "90 min", description: "Limpieza por ultrasonido y calibración", active: true },
  { id: "8", name: "Cambio de correa distribución", code: "SVC-008", price: 120000, duration: "3 hrs", description: "Reemplazo de correa, tensores y bomba de agua", active: true },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const openNew = () => {
    setEditingService({ id: String(Date.now()), name: "", code: "", price: 0, duration: "", description: "", active: true });
    setDialogOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService({ ...service });
    setDialogOpen(true);
  };

  const saveService = () => {
    if (!editingService) return;
    setServices((prev) => {
      const exists = prev.find((s) => s.id === editingService.id);
      if (exists) {
        return prev.map((s) => (s.id === editingService.id ? editingService : s));
      }
      return [...prev, editingService];
    });
    setDialogOpen(false);
    setEditingService(null);
  };

  const updateField = (field: keyof Service, value: string | number | boolean) => {
    setEditingService((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <AppShell>
      <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Servicios</h1>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Servicio
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className="cursor-pointer transition-colors hover:bg-surface-hover"
            onClick={() => openEdit(service)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <CardDescription className="mt-1 text-xs">{service.code}</CardDescription>
                </div>
                <Badge variant={service.active ? "success" : "secondary"}>
                  {service.active ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">${service.price.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-accent" />
                <span>{service.duration}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="line-clamp-2">{service.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle>{editingService && services.find((s) => s.id === editingService.id) ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
          <DialogDescription>Completa los datos del servicio.</DialogDescription>
        </DialogHeader>
        {editingService && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input value={editingService.name} onChange={(e) => updateField("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Código</label>
              <Input value={editingService.code} onChange={(e) => updateField("code", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio</label>
                <Input
                  type="number"
                  value={editingService.price}
                  onChange={(e) => updateField("price", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duración</label>
                <Input value={editingService.duration} onChange={(e) => updateField("duration", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Input value={editingService.description} onChange={(e) => updateField("description", e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active-toggle"
                className="h-4 w-4 rounded border-border bg-background text-primary"
                checked={editingService.active}
                onChange={(e) => updateField("active", e.target.checked)}
              />
              <label htmlFor="active-toggle" className="text-sm font-medium">Activo</label>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={saveService}>Guardar</Button>
        </DialogFooter>
      </Dialog>
      </div>
    </AppShell>
  );
}
