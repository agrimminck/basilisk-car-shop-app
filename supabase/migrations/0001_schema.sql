-- Basilisk Car Shop App — Schema SQL (PostgreSQL / Supabase)
-- Modelo de datos para inventario, ventas y taller mecánico.
-- Diseñado para una sucursal hoy, listo para múltiples sucursales mañana.

-- 1. SUCURSALES (multi-tenant ready)
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CATEGORÍAS JERÁRQUICAS (productos y servicios)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('product', 'service')),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);

-- 3. CLIENTES Y VEHÍCULOS
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    tax_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    plate TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INT,
    color TEXT,
    current_km INT,
    vin TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(customer_id, plate)
);

CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);

-- 4. PROVEEDORES
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_name TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    tax_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. PRODUCTOS Y VARIANTES (SKU/barcode por variante)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    brand TEXT,
    base_cost DECIMAL(12,2),
    base_sale_price DECIMAL(12,2),
    unit TEXT DEFAULT 'unidad',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT,
    variant_name TEXT NOT NULL,
    cost DECIMAL(12,2),
    sale_price DECIMAL(12,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_barcode ON product_variants(barcode);

CREATE TABLE product_suppliers (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    supplier_sku TEXT,
    supplier_cost DECIMAL(12,2),
    lead_time_days INT,
    is_preferred BOOLEAN DEFAULT false,
    PRIMARY KEY (product_id, supplier_id)
);

-- 6. INVENTARIO POR SUCURSAL (stock con alerta mínima)
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity DECIMAL(12,3) NOT NULL DEFAULT 0,
    min_stock_alert DECIMAL(12,3) DEFAULT 0,
    location_aisle TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(branch_id, variant_id)
);

CREATE INDEX idx_inventory_branch ON inventory(branch_id);
CREATE INDEX idx_inventory_variant ON inventory(variant_id);

-- 7. SERVICIOS
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    code TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    sale_price DECIMAL(12,2) NOT NULL,
    estimated_minutes INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. COMBOS / PACKS
CREATE TABLE bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sale_price DECIMAL(12,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE bundle_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    quantity DECIMAL(12,3) NOT NULL DEFAULT 1,
    CHECK (
        (variant_id IS NOT NULL AND service_id IS NULL) OR
        (variant_id IS NULL AND service_id IS NOT NULL)
    )
);

-- 9. VENTAS
CREATE TYPE sale_status AS ENUM ('draft', 'confirmed', 'paid', 'cancelled');

CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    customer_id UUID REFERENCES customers(id),
    vehicle_id UUID REFERENCES vehicles(id),
    employee_id UUID,
    status sale_status NOT NULL DEFAULT 'draft',
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    confirmed_at TIMESTAMPTZ
);

CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_status ON sales(status);

CREATE TABLE sale_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    line_type TEXT NOT NULL CHECK (line_type IN ('product', 'service', 'bundle')),
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    bundle_id UUID REFERENCES bundles(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(12,3) NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_line DECIMAL(12,2) NOT NULL,
    mechanic_id UUID,
    CHECK (
        (line_type = 'product' AND variant_id IS NOT NULL) OR
        (line_type = 'service' AND service_id IS NOT NULL) OR
        (line_type = 'bundle' AND bundle_id IS NOT NULL)
    )
);

CREATE INDEX idx_sale_lines_sale ON sale_lines(sale_id);

-- 10. PAGOS (múltiples métodos por venta)
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'transfer', 'check', 'credit');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    method payment_method NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    reference_code TEXT,
    paid_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payments_sale ON payments(sale_id);

-- 11. FACTURACIÓN
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    invoice_type TEXT NOT NULL CHECK (invoice_type IN ('boleta', 'factura')),
    folio TEXT NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    sii_status TEXT DEFAULT 'pending',
    issued_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(invoice_type, folio)
);
