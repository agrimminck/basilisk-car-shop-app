// Local type definitions (migrated from @basilisk/types Database schema)

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  brand: string | null;
  base_cost: number | null;
  base_sale_price: number | null;
  unit: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string;
  barcode: string | null;
  variant_name: string;
  cost: number | null;
  sale_price: number | null;
  is_active: boolean | null;
  created_at: string | null;
};

export type Service = {
  id: string;
  category_id: string | null;
  code: string | null;
  name: string;
  description: string | null;
  sale_price: number;
  estimated_minutes: number | null;
  is_active: boolean | null;
  created_at: string | null;
};

export type Bundle = {
  id: string;
  name: string;
  sale_price: number;
  description: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

export type Category = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string | null;
  type: string;
  sort_order: number | null;
  created_at: string | null;
};

export type Inventory = {
  id: string;
  branch_id: string;
  variant_id: string;
  quantity: number;
  min_stock_alert: number | null;
  location_aisle: string | null;
  updated_at: string | null;
};

export type Sale = {
  id: string;
  branch_id: string;
  customer_id: string | null;
  vehicle_id: string | null;
  employee_id: string | null;
  status: string;
  total_amount: number;
  discount_amount: number | null;
  notes: string | null;
  created_at: string | null;
  confirmed_at: string | null;
};

export type SaleInsert = Omit<Sale, "id" | "created_at">;

const BASE = "/api";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products`);
  const data = await res.json();
  return data.products ?? [];
}

export async function getProductVariants(): Promise<ProductVariant[]> {
  const res = await fetch(`${BASE}/products`);
  const data = await res.json();
  return data.variants ?? [];
}

export async function getServices(): Promise<Service[]> {
  const res = await fetch(`${BASE}/products`);
  const data = await res.json();
  return data.services ?? [];
}

export async function getBundles(): Promise<Bundle[]> {
  const res = await fetch(`${BASE}/products`);
  const data = await res.json();
  return data.bundles ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/products`);
  const data = await res.json();
  return data.categories ?? [];
}

export async function getInventory(): Promise<Inventory[]> {
  const res = await fetch(`${BASE}/products`);
  const data = await res.json();
  return data.inventory ?? [];
}

export async function createSale(saleData: SaleInsert): Promise<Sale> {
  const res = await fetch(`${BASE}/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(saleData),
  });
  return res.json();
}

export async function getSales(): Promise<Sale[]> {
  const res = await fetch(`${BASE}/sales`);
  return res.json();
}
