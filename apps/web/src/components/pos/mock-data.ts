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
  { id: "p1", name: "Aceite Motor 5W-30 4L", price: 24990, stock: 24, categoryId: "aceites", imageUrl: "/images/products/p1_aceite_5w30.jpg" },
  { id: "p2", name: "Aceite Motor 10W-40 1L", price: 8990, stock: 42, categoryId: "aceites", imageUrl: "/images/products/p2_aceite_10w40.jpg" },
  { id: "p3", name: "Filtro de Aceite", price: 5990, stock: 18, categoryId: "filtros", imageUrl: "/images/products/p3_filtro_aceite.jpg" },
  { id: "p4", name: "Filtro de Aire", price: 12990, stock: 12, categoryId: "filtros", imageUrl: "/images/products/p4_filtro_aire.jpg" },
  { id: "p5", name: "Pastillas de Freno Delanteras", price: 34990, stock: 8, categoryId: "frenos", imageUrl: "/images/products/p5_pastillas_freno.jpg" },
  { id: "p6", name: "Disco de Freno", price: 45990, stock: 6, categoryId: "frenos", imageUrl: "/images/products/p6_disco_freno.jpg" },
  { id: "p7", name: "Batería 55Ah", price: 89990, stock: 5, categoryId: "baterias", imageUrl: "/images/products/p7_bateria_55ah.jpg" },
  { id: "p8", name: "Batería 75Ah", price: 119990, stock: 3, categoryId: "baterias", imageUrl: "/images/products/p8_bateria_75ah.jpg" },
  { id: "p9", name: "Neumático 205/55 R16", price: 74990, stock: 16, categoryId: "neumaticos", imageUrl: "/images/products/p9_neumatico_205.jpg" },
  { id: "p10", name: "Neumático 195/65 R15", price: 65990, stock: 20, categoryId: "neumaticos", imageUrl: "/images/products/p10_neumatico_195.jpg" },
  { id: "p11", name: "Cambio de Aceite", price: 19990, stock: 99, categoryId: "servicios", imageUrl: "/images/products/p11_cambio_aceite.jpg" },
  { id: "p12", name: "Alineación y Balanceo", price: 29990, stock: 99, categoryId: "servicios", imageUrl: "/images/products/p12_alineacion.jpg" },
  { id: "p13", name: "Revisión de Frenos", price: 14990, stock: 99, categoryId: "servicios", imageUrl: "/images/products/p13_revision_frenos.jpg" },
  { id: "p14", name: "Líquido de Frenos DOT-4", price: 6990, stock: 30, categoryId: "frenos", imageUrl: "/images/products/p14_liquido_frenos.jpg" },
  { id: "p15", name: "Aceite Transmisión ATF", price: 15990, stock: 14, categoryId: "aceites", imageUrl: "/images/products/p15_aceite_atf.jpg" },
];
