// Types compartidos generados desde schema SQL
// Basilisk Car Shop App

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      branches: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          phone: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["branches"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["branches"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          name: string;
          slug: string | null;
          type: "product" | "service";
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          tax_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["customers"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };
      vehicles: {
        Row: {
          id: string;
          customer_id: string;
          plate: string;
          brand: string;
          model: string;
          year: number | null;
          color: string | null;
          current_km: number | null;
          vin: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["vehicles"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vehicles"]["Insert"]>;
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          contact_name: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          tax_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["suppliers"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["suppliers"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          description: string | null;
          brand: string | null;
          base_cost: number | null;
          base_sale_price: number | null;
          unit: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          barcode: string | null;
          variant_name: string;
          cost: number | null;
          sale_price: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_variants"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };
      product_suppliers: {
        Row: {
          product_id: string;
          supplier_id: string;
          supplier_sku: string | null;
          supplier_cost: number | null;
          lead_time_days: number | null;
          is_preferred: boolean;
        };
        Insert: Database["public"]["Tables"]["product_suppliers"]["Row"];
        Update: Partial<Database["public"]["Tables"]["product_suppliers"]["Insert"]>;
      };
      inventory: {
        Row: {
          id: string;
          branch_id: string;
          variant_id: string;
          quantity: number;
          min_stock_alert: number;
          location_aisle: string | null;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inventory"]["Row"], "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["inventory"]["Insert"]>;
      };
      services: {
        Row: {
          id: string;
          category_id: string | null;
          code: string | null;
          name: string;
          description: string | null;
          sale_price: number;
          estimated_minutes: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["services"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
      bundles: {
        Row: {
          id: string;
          name: string;
          sale_price: number;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bundles"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bundles"]["Insert"]>;
      };
      bundle_items: {
        Row: {
          id: string;
          bundle_id: string;
          variant_id: string | null;
          service_id: string | null;
          quantity: number;
        };
        Insert: Omit<Database["public"]["Tables"]["bundle_items"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bundle_items"]["Insert"]>;
      };
      sales: {
        Row: {
          id: string;
          branch_id: string;
          customer_id: string | null;
          vehicle_id: string | null;
          employee_id: string | null;
          status: "draft" | "confirmed" | "paid" | "cancelled";
          total_amount: number;
          discount_amount: number;
          notes: string | null;
          created_at: string;
          confirmed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["sales"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sales"]["Insert"]>;
      };
      sale_lines: {
        Row: {
          id: string;
          sale_id: string;
          line_type: "product" | "service" | "bundle";
          variant_id: string | null;
          service_id: string | null;
          bundle_id: string | null;
          description: string;
          quantity: number;
          unit_price: number;
          discount_amount: number;
          total_line: number;
          mechanic_id: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["sale_lines"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sale_lines"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          sale_id: string;
          method: "cash" | "card" | "transfer" | "check" | "credit";
          amount: number;
          reference_code: string | null;
          paid_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "paid_at"> & {
          id?: string;
          paid_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      invoices: {
        Row: {
          id: string;
          sale_id: string;
          invoice_type: "boleta" | "factura";
          folio: string;
          tax_amount: number;
          sii_status: string;
          issued_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["invoices"]["Row"], "id" | "issued_at"> & {
          id?: string;
          issued_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
      };
    };
  };
}
