"use client";

import { useState, useMemo } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Search, Plus, Pencil, Trash2, Package } from "lucide-react";
import { formatPrice } from "@/lib/format";

/* ───────── tipos ───────── */

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStockAlert: number;
  costPrice: number;
  salePrice: number;
  status: "activo" | "inactivo";
}

interface Service {
  id: string;
  code: string;
  name: string;
  price: number;
  estimatedDuration: string;
  status: "activo" | "inactivo";
}

interface Combo {
  id: string;
  name: string;
  price: number;
  items: string;
  status: "activo" | "inactivo";
}

/* ───────── mock data ───────── */

const CATEGORIES = [
  "Todas",
  "Frenos",
  "Motor",
  "Suspensión",
  "Eléctrico",
  "Filtración",
  "Transmisión",
  "Lubricantes",
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Pastillas de freno Delphi",
    sku: "FR-001",
    category: "Frenos",
    stock: 12,
    minStockAlert: 10,
    costPrice: 18500,
    salePrice: 32900,
    status: "activo",
  },
  {
    id: "p2",
    name: "Discos de freno ventilados",
    sku: "FR-002",
    category: "Frenos",
    stock: 8,
    minStockAlert: 10,
    costPrice: 42000,
    salePrice: 69900,
    status: "activo",
  },
  {
    id: "p3",
    name: "Bujías NGK Iridium",
    sku: "MT-001",
    category: "Motor",
    stock: 45,
    minStockAlert: 20,
    costPrice: 8900,
    salePrice: 15900,
    status: "activo",
  },
  {
    id: "p4",
    name: "Correa distribución Gates",
    sku: "MT-002",
    category: "Motor",
    stock: 6,
    minStockAlert: 5,
    costPrice: 55000,
    salePrice: 89900,
    status: "activo",
  },
  {
    id: "p5",
    name: "Amortiguador delantero Monroe",
    sku: "SP-001",
    category: "Suspensión",
    stock: 4,
    minStockAlert: 5,
    costPrice: 62000,
    salePrice: 105000,
    status: "activo",
  },
  {
    id: "p6",
    name: "Terminales de dirección MOOG",
    sku: "SP-002",
    category: "Suspensión",
    stock: 18,
    minStockAlert: 10,
    costPrice: 15500,
    salePrice: 27900,
    status: "activo",
  },
  {
    id: "p7",
    name: "Alternador Bosch 90A",
    sku: "EL-001",
    category: "Eléctrico",
    stock: 3,
    minStockAlert: 5,
    costPrice: 120000,
    salePrice: 189900,
    status: "activo",
  },
  {
    id: "p8",
    name: "Batería Bosch 60Ah",
    sku: "EL-002",
    category: "Eléctrico",
    stock: 14,
    minStockAlert: 8,
    costPrice: 75000,
    salePrice: 119900,
    status: "activo",
  },
  {
    id: "p9",
    name: "Filtro de aceite Mann",
    sku: "FL-001",
    category: "Filtración",
    stock: 60,
    minStockAlert: 25,
    costPrice: 4500,
    salePrice: 7900,
    status: "activo",
  },
  {
    id: "p10",
    name: "Filtro de aire Mahle",
    sku: "FL-002",
    category: "Filtración",
    stock: 22,
    minStockAlert: 15,
    costPrice: 8900,
    salePrice: 14900,
    status: "activo",
  },
  {
    id: "p11",
    name: "Kit embrague Valeo",
    sku: "TR-001",
    category: "Transmisión",
    stock: 5,
    minStockAlert: 5,
    costPrice: 145000,
    salePrice: 229900,
    status: "activo",
  },
  {
    id: "p12",
    name: "Aceite Mobil 1 5W-30",
    sku: "LU-001",
    category: "Lubricantes",
    stock: 30,
    minStockAlert: 20,
    costPrice: 12500,
    salePrice: 19900,
    status: "activo",
  },
];

const MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    code: "SRV-001",
    name: "Cambio de aceite y filtros",
    price: 45000,
    estimatedDuration: "45 min",
    status: "activo",
  },
  {
    id: "s2",
    code: "SRV-002",
    name: "Alineación y balanceo",
    price: 35000,
    estimatedDuration: "60 min",
    status: "activo",
  },
  {
    id: "s3",
    code: "SRV-003",
    name: "Revisión de frenos",
    price: 25000,
    estimatedDuration: "30 min",
    status: "activo",
  },
  {
    id: "s4",
    code: "SRV-004",
    name: "Diagnóstico computacional",
    price: 30000,
    estimatedDuration: "30 min",
    status: "activo",
  },
  {
    id: "s5",
    code: "SRV-005",
    name: "Cambio de pastillas de freno",
    price: 28000,
    estimatedDuration: "40 min",
    status: "activo",
  },
  {
    id: "s6",
    code: "SRV-006",
    name: "Revisión suspensión",
    price: 22000,
    estimatedDuration: "35 min",
    status: "activo",
  },
];

const MOCK_COMBOS: Combo[] = [
  {
    id: "c1",
    name: "Kit Mantención Completa",
    price: 89900,
    items: "Aceite + Filtro aceite + Filtro aire",
    status: "activo",
  },
  {
    id: "c2",
    name: "Combo Frenos Delanteros",
    price: 89900,
    items: "Pastillas + Discos",
    status: "activo",
  },
  {
    id: "c3",
    name: "Pack Suspensión",
    price: 129900,
    items: "Amortiguadores + Terminales",
    status: "activo",
  },
];

/* ───────── componente ───────── */

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<string>("productos");
  const [search, setSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todas");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [newProduct, setNewProduct] = useState<{
    name: string;
    category: string;
    costPrice: string;
    salePrice: string;
    stock: string;
  }>({
    name: "",
    category: "Frenos",
    costPrice: "",
    salePrice: "",
    stock: "",
  });

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "Todas" || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [search, categoryFilter]);

  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredCombos = useMemo(() => {
    return MOCK_COMBOS.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.items.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  function handleOpenDialog() {
    setNewProduct({
      name: "",
      category: "Frenos",
      costPrice: "",
      salePrice: "",
      stock: "",
    });
    setDialogOpen(true);
  }

  function handleSaveProduct() {
    // TODO: integrar con backend
    setDialogOpen(false);
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Inventario
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestiona productos, servicios y combos del taller.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, SKU o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleOpenDialog}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Agregar Producto</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="productos">
              <Package className="mr-2 h-4 w-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="servicios">Servicios</TabsTrigger>
            <TabsTrigger value="combos">Combos</TabsTrigger>
          </TabsList>

          {/* Productos */}
          <TabsContent value="productos" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="mb-4 flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat}
                      variant={
                        categoryFilter === cat ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          SKU
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Categoría
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Precio
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const lowStock = product.stock < product.minStockAlert;
                        return (
                          <tr
                            key={product.id}
                            className="border-b border-border transition-colors hover:bg-surface-hover/50"
                          >
                            <td className="px-4 py-3 font-medium text-foreground">
                              {product.name}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {product.sku}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="secondary">
                                {product.category}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-foreground">
                                  {product.stock}
                                </span>
                                {lowStock && (
                                  <Badge variant="destructive">
                                    Bajo
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-foreground">
                              {formatPrice(product.salePrice)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  product.status === "activo"
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {product.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Editar"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-4 w-4 text-danger" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
                            No se encontraron productos.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Servicios */}
          <TabsContent value="servicios" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Código
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Precio
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Duración
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.map((service) => (
                        <tr
                          key={service.id}
                          className="border-b border-border transition-colors hover:bg-surface-hover/50"
                        >
                          <td className="px-4 py-3 text-muted-foreground">
                            {service.code}
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">
                            {service.name}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {formatPrice(service.price)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {service.estimatedDuration}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                service.status === "activo"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {service.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Editar"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4 text-danger" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredServices.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
                            No se encontraron servicios.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Combos */}
          <TabsContent value="combos" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Precio
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Items incluidos
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCombos.map((combo) => (
                        <tr
                          key={combo.id}
                          className="border-b border-border transition-colors hover:bg-surface-hover/50"
                        >
                          <td className="px-4 py-3 font-medium text-foreground">
                            {combo.name}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {formatPrice(combo.price)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {combo.items}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                combo.status === "activo"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {combo.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Editar"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4 text-danger" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredCombos.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
                            No se encontraron combos.
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

      {/* Dialog Agregar Producto */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle>Agregar Producto</DialogTitle>
          <DialogDescription>
            Completa los datos del nuevo repuesto.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Nombre
            </label>
            <Input
              placeholder="Ej: Pastillas de freno Bosch"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Categoría
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            >
              {CATEGORIES.filter((c) => c !== "Todas").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Precio costo
              </label>
              <Input
                type="number"
                placeholder="0"
                value={newProduct.costPrice}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    costPrice: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Precio venta
              </label>
              <Input
                type="number"
                placeholder="0"
                value={newProduct.salePrice}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    salePrice: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Stock inicial
            </label>
            <Input
              type="number"
              placeholder="0"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, stock: e.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveProduct}>Guardar</Button>
        </DialogFooter>
      </Dialog>
    </AppShell>
  );
}
