export interface PosProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl?: string;
}

export interface PosCategory {
  id: string;
  name: string;
}

export interface CartItem {
  product: PosProduct;
  quantity: number;
}

export type PaymentMethod = "cash" | "debit" | "credit" | "transfer";
