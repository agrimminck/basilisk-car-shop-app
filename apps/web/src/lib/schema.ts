import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  decimal,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const saleStatusEnum = pgEnum("sale_status", [
  "draft",
  "confirmed",
  "paid",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "card",
  "transfer",
  "check",
  "credit",
]);

export const branches = pgTable("branches", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  parentId: uuid("parent_id"),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  type: text("type").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  taxId: text("tax_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  contactName: text("contact_name"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  taxId: text("tax_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id"),
  name: text("name").notNull(),
  description: text("description"),
  brand: text("brand"),
  baseCost: decimal("base_cost", { precision: 12, scale: 2 }),
  baseSalePrice: decimal("base_sale_price", { precision: 12, scale: 2 }),
  unit: text("unit").default("unidad"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull(),
  sku: text("sku").unique().notNull(),
  barcode: text("barcode"),
  variantName: text("variant_name").notNull(),
  cost: decimal("cost", { precision: 12, scale: 2 }),
  salePrice: decimal("sale_price", { precision: 12, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  branchId: uuid("branch_id").notNull(),
  variantId: uuid("variant_id").notNull(),
  quantity: decimal("quantity", { precision: 12, scale: 3 })
    .default("0")
    .notNull(),
  minStockAlert: decimal("min_stock_alert", { precision: 12, scale: 3 }).default(
    "0"
  ),
  locationAisle: text("location_aisle"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id"),
  code: text("code").unique(),
  name: text("name").notNull(),
  description: text("description"),
  salePrice: decimal("sale_price", { precision: 12, scale: 2 }).notNull(),
  estimatedMinutes: integer("estimated_minutes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const bundles = pgTable("bundles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  salePrice: decimal("sale_price", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const sales = pgTable("sales", {
  id: uuid("id").defaultRandom().primaryKey(),
  branchId: uuid("branch_id").notNull(),
  customerId: uuid("customer_id"),
  vehicleId: uuid("vehicle_id"),
  employeeId: uuid("employee_id"),
  status: text("status").default("draft").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).default(
    "0"
  ),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
});
