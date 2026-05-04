"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Car,
  Phone,
  Mail,
  Trash2,
} from "lucide-react";

type Vehicle = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  lastVisit: string;
};

type Customer = {
  id: string;
  name: string;
  rut: string;
  phone: string;
  email: string;
  lastVisit: string;
  vehicles: Vehicle[];
};

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Juan Pérez González",
    rut: "12.345.678-9",
    phone: "+56 9 5123 4567",
    email: "juan.perez@gmail.com",
    lastVisit: "2024-03-15",
    vehicles: [
      { id: "v1", plate: "ABCD-12", brand: "Toyota", model: "Corolla", year: 2018, km: 85000, lastVisit: "2024-03-15" },
      { id: "v2", plate: "BCDE-23", brand: "Nissan", model: "Versa", year: 2020, km: 45000, lastVisit: "2024-05-20" },
    ],
  },
  {
    id: "c2",
    name: "María Elena Rodríguez",
    rut: "13.456.789-0",
    phone: "+56 9 6234 5678",
    email: "maria.rodriguez@yahoo.com",
    lastVisit: "2024-01-10",
    vehicles: [
      { id: "v3", plate: "FGHI-34", brand: "Chevrolet", model: "Spark", year: 2015, km: 120000, lastVisit: "2024-01-10" },
    ],
  },
  {
    id: "c3",
    name: "Carlos Andrés Soto Muñoz",
    rut: "14.567.890-1",
    phone: "+56 9 7345 6789",
    email: "carlos.soto@outlook.cl",
    lastVisit: "2024-06-01",
    vehicles: [
      { id: "v4", plate: "JKLM-45", brand: "Hyundai", model: "Accent", year: 2019, km: 60000, lastVisit: "2024-06-01" },
      { id: "v5", plate: "AB-CD-12", brand: "Kia", model: "Rio", year: 2021, km: 25000, lastVisit: "2024-04-18" },
      { id: "v6", plate: "NOPQ-56", brand: "Suzuki", model: "Swift", year: 2017, km: 95000, lastVisit: "2023-12-05" },
    ],
  },
  {
    id: "c4",
    name: "Patricia Alejandra Fuentes",
    rut: "15.678.901-2",
    phone: "+56 9 8456 7890",
    email: "patricia.fuentes@empresa.cl",
    lastVisit: "2024-07-12",
    vehicles: [
      { id: "v7", plate: "CD-EF-34", brand: "Mazda", model: "3", year: 2022, km: 18000, lastVisit: "2024-07-12" },
    ],
  },
  {
    id: "c5",
    name: "Diego Alonso Herrera",
    rut: "16.789.012-3",
    phone: "+56 9 9567 8901",
    email: "diego.herrera@gmail.com",
    lastVisit: "2024-02-28",
    vehicles: [
      { id: "v8", plate: "GH-IJ-56", brand: "Ford", model: "Ranger", year: 2016, km: 110000, lastVisit: "2024-02-28" },
      { id: "v9", plate: "RSTU-78", brand: "Volkswagen", model: "Gol", year: 2014, km: 135000, lastVisit: "2023-11-15" },
    ],
  },
  {
    id: "c6",
    name: "Camila Andrea Rojas",
    rut: "17.890.123-4",
    phone: "+56 9 0678 9012",
    email: "camila.rojas@hotmail.com",
    lastVisit: "2024-08-05",
    vehicles: [
      { id: "v10", plate: "KL-MN-78", brand: "Peugeot", model: "208", year: 2023, km: 8000, lastVisit: "2024-08-05" },
    ],
  },
  {
    id: "c7",
    name: "Fernando José Valenzuela",
    rut: "18.901.234-5",
    phone: "+56 9 1789 0123",
    email: "fernando.valenzuela@gmail.com",
    lastVisit: "2024-05-30",
    vehicles: [
      { id: "v11", plate: "VWXY-90", brand: "Renault", model: "Clio", year: 2015, km: 105000, lastVisit: "2024-03-22" },
      { id: "v12", plate: "OP-QR-90", brand: "Citroën", model: "C3", year: 2018, km: 72000, lastVisit: "2024-05-30" },
    ],
  },
  {
    id: "c8",
    name: "Daniela Paz Morales",
    rut: "19.012.345-6",
    phone: "+56 9 2890 1234",
    email: "daniela.morales@live.cl",
    lastVisit: "2024-06-20",
    vehicles: [
      { id: "v13", plate: "ST-UV-01", brand: "Honda", model: "Civic", year: 2020, km: 38000, lastVisit: "2024-06-20" },
    ],
  },
  {
    id: "c9",
    name: "Ricardo Andrés Tapia",
    rut: "20.123.456-7",
    phone: "+56 9 3901 2345",
    email: "ricardo.tapia@outlook.com",
    lastVisit: "2024-07-01",
    vehicles: [
      { id: "v14", plate: "WXYZ-12", brand: "BMW", model: "118i", year: 2019, km: 55000, lastVisit: "2024-04-10" },
      { id: "v15", plate: "YZ-AB-23", brand: "Mercedes-Benz", model: "A200", year: 2021, km: 22000, lastVisit: "2024-07-01" },
    ],
  },
  {
    id: "c10",
    name: "Lorena Beatriz Castillo",
    rut: "21.234.567-8",
    phone: "+56 9 4012 3456",
    email: "lorena.castillo@gmail.com",
    lastVisit: "2024-05-15",
    vehicles: [
      { id: "v16", plate: "UV-WX-45", brand: "Subaru", model: "XV", year: 2017, km: 88000, lastVisit: "2024-05-15" },
    ],
  },
];

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function formatRutInput(value: string) {
  const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length <= 1) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedBody}-${dv}`;
}

type FlatVehicle = Vehicle & { ownerName: string };

export default function CustomersPage() {
  const [tab, setTab] = useState("customers");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formRut, setFormRut] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [newVehicles, setNewVehicles] = useState<
    Array<{ plate: string; brand: string; model: string; year: string; km: string }>
  >([]);

  const allVehicles: FlatVehicle[] = useMemo(
    () =>
      MOCK_CUSTOMERS.flatMap((c) =>
        c.vehicles.map((v) => ({ ...v, ownerName: c.name }))
      ),
    []
  );

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.rut.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredVehicles = useMemo(() => {
    const q = search.toLowerCase();
    return allVehicles.filter(
      (v) =>
        v.plate.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.ownerName.toLowerCase().includes(q)
    );
  }, [search, allVehicles]);

  function resetForm() {
    setFormName("");
    setFormRut("");
    setFormPhone("");
    setFormEmail("");
    setNewVehicles([]);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setDialogOpen(false);
    resetForm();
  }

  function addVehicleField() {
    setNewVehicles((prev) => [
      ...prev,
      { plate: "", brand: "", model: "", year: "", km: "" },
    ]);
  }

  function removeVehicleField(index: number) {
    setNewVehicles((prev) => prev.filter((_, i) => i !== index));
  }

  function updateVehicleField(
    index: number,
    field: keyof (typeof newVehicles)[number],
    value: string
  ) {
    setNewVehicles((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="pl-9 h-11"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              size="lg"
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-11">
            <TabsTrigger value="customers" className="text-sm px-5">
              Clientes
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="text-sm px-5">
              Vehículos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                          RUT
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden xl:table-cell">
                          Teléfono
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden xl:table-cell">
                          Email
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Vehículos
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                          Última visita
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider w-12" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <>
                          <tr
                            key={customer.id}
                            className="border-b border-border hover:bg-surface-hover transition-colors cursor-pointer"
                            onClick={() =>
                              setExpandedId(
                                expandedId === customer.id ? null : customer.id
                              )
                            }
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                  {customer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")}
                                </div>
                                <span className="font-medium text-sm">
                                  {customer.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-muted-foreground hidden lg:table-cell">
                              {customer.rut}
                            </td>
                            <td className="py-4 px-4 text-sm text-muted-foreground hidden xl:table-cell">
                              <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5" />
                                {customer.phone}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-muted-foreground hidden xl:table-cell">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5" />
                                {customer.email}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="secondary">
                                {customer.vehicles.length}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-sm text-muted-foreground hidden md:table-cell">
                              {formatDate(customer.lastVisit)}
                            </td>
                            <td className="py-4 px-4">
                              {expandedId === customer.id ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              )}
                            </td>
                          </tr>
                          {expandedId === customer.id && (
                            <tr className="border-b border-border bg-surface/40">
                              <td colSpan={7} className="py-4 px-4">
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Car className="h-4 w-4 text-primary" />
                                    Vehículos asociados
                                  </h4>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                      <thead>
                                        <tr className="border-b border-border/60">
                                          <th className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                                            Patente
                                          </th>
                                          <th className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                                            Marca
                                          </th>
                                          <th className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                                            Modelo
                                          </th>
                                          <th className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">
                                            Año
                                          </th>
                                          <th className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">
                                            Km
                                          </th>
                                          <th className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">
                                            Última visita
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {customer.vehicles.map((v) => (
                                          <tr
                                            key={v.id}
                                            className="border-b border-border/40 hover:bg-surface-hover/60 transition-colors"
                                          >
                                            <td className="py-3 px-3 text-sm font-medium">
                                              {v.plate}
                                            </td>
                                            <td className="py-3 px-3 text-sm text-muted-foreground">
                                              {v.brand}
                                            </td>
                                            <td className="py-3 px-3 text-sm text-muted-foreground">
                                              {v.model}
                                            </td>
                                            <td className="py-3 px-3 text-sm text-muted-foreground hidden sm:table-cell">
                                              {v.year}
                                            </td>
                                            <td className="py-3 px-3 text-sm text-muted-foreground hidden sm:table-cell">
                                              {v.km.toLocaleString("es-CL")}
                                            </td>
                                            <td className="py-3 px-3 text-sm text-muted-foreground hidden md:table-cell">
                                              {formatDate(v.lastVisit)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                      {filteredCustomers.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="py-8 text-center text-sm text-muted-foreground"
                          >
                            No se encontraron clientes.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Patente
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Marca
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Modelo
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                          Año
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                          Km actual
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Dueño
                        </th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                          Última visita
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVehicles.map((v) => (
                        <tr
                          key={v.id}
                          className="border-b border-border hover:bg-surface-hover transition-colors"
                        >
                          <td className="py-4 px-4">
                            <Badge variant="outline">{v.plate}</Badge>
                          </td>
                          <td className="py-4 px-4 text-sm">{v.brand}</td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">
                            {v.model}
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                            {v.year}
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                            {v.km.toLocaleString("es-CL")}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium">
                            {v.ownerName}
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground hidden md:table-cell">
                            {formatDate(v.lastVisit)}
                          </td>
                        </tr>
                      ))}
                      {filteredVehicles.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="py-8 text-center text-sm text-muted-foreground"
                          >
                            No se encontraron vehículos.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog Nuevo Cliente */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Ingresa los datos del cliente y sus vehículos asociados.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Nombre completo</label>
                <Input
                  placeholder="Ej: Juan Pérez"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">RUT</label>
                <Input
                  placeholder="12.345.678-9"
                  value={formRut}
                  onChange={(e) => setFormRut(formatRutInput(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  placeholder="+56 9 1234 5678"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="cliente@email.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Vehículos</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVehicleField}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar vehículo
                </Button>
              </div>

              {newVehicles.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay vehículos agregados.
                </p>
              )}

              <div className="space-y-3">
                {newVehicles.map((v, i) => (
                  <div
                    key={i}
                    className="grid gap-3 sm:grid-cols-6 items-end rounded-lg border border-border bg-background p-3"
                  >
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Patente
                      </label>
                      <Input
                        placeholder="ABCD-12"
                        value={v.plate}
                        onChange={(e) =>
                          updateVehicleField(i, "plate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Marca
                      </label>
                      <Input
                        placeholder="Toyota"
                        value={v.brand}
                        onChange={(e) =>
                          updateVehicleField(i, "brand", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Modelo
                      </label>
                      <Input
                        placeholder="Corolla"
                        value={v.model}
                        onChange={(e) =>
                          updateVehicleField(i, "model", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Año
                      </label>
                      <Input
                        type="number"
                        placeholder="2020"
                        value={v.year}
                        onChange={(e) =>
                          updateVehicleField(i, "year", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Km
                      </label>
                      <Input
                        type="number"
                        placeholder="45000"
                        value={v.km}
                        onChange={(e) =>
                          updateVehicleField(i, "km", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-danger hover:text-danger hover:bg-danger/10"
                        onClick={() => removeVehicleField(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar Cliente</Button>
          </DialogFooter>
        </form>
      </Dialog>
    </AppShell>
  );
}
