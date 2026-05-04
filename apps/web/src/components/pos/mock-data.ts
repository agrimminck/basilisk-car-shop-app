import { PosCategory, PosProduct } from "./types";

export const mockCategories: PosCategory[] = [
  { id: "all", name: "Todos" },
  { id: "aceites", name: "Aceites" },
  { id: "filtros", name: "Filtros" },
  { id: "frenos", name: "Frenos" },
  { id: "baterias", name: "Baterías" },
  { id: "neumaticos", name: "Neumáticos" },
  { id: "servicios", name: "Servicios" },
];

export const mockProducts: PosProduct[] = [
  { id: "p1", name: "Aceite Motor 5W-30 4L", price: 24990, stock: 24, categoryId: "aceites" },
  { id: "p2", name: "Aceite Motor 10W-40 1L", price: 8990, stock: 42, categoryId: "aceites" },
  { id: "p3", name: "Filtro de Aceite", price: 5990, stock: 18, categoryId: "filtros" },
  { id: "p4", name: "Filtro de Aire", price: 12990, stock: 12, categoryId: "filtros" },
  { id: "p5", name: "Pastillas de Freno Delanteras", price: 34990, stock: 8, categoryId: "frenos" },
  { id: "p6", name: "Disco de Freno", price: 45990, stock: 6, categoryId: "frenos" },
  { id: "p7", name: "Batería 55Ah", price: 89990, stock: 5, categoryId: "baterias" },
  { id: "p8", name: "Batería 75Ah", price: 119990, stock: 3, categoryId: "baterias" },
  { id: "p9", name: "Neumático 205/55 R16", price: 74990, stock: 16, categoryId: "neumaticos" },
  { id: "p10", name: "Neumático 195/65 R15", price: 65990, stock: 20, categoryId: "neumaticos" },
  { id: "p11", name: "Cambio de Aceite", price: 19990, stock: 99, categoryId: "servicios" },
  { id: "p12", name: "Alineación y Balanceo", price: 29990, stock: 99, categoryId: "servicios" },
  { id: "p13", name: "Revisión de Frenos", price: 14990, stock: 99, categoryId: "servicios" },
  { id: "p14", name: "Líquido de Frenos DOT-4", price: 6990, stock: 30, categoryId: "frenos" },
  { id: "p15", name: "Aceite Transmisión ATF", price: 15990, stock: 14, categoryId: "aceites" },
];
