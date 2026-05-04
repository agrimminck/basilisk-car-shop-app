import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  products,
  productVariants,
  categories,
  services,
  bundles,
  inventory,
} from "@/lib/schema";

export async function GET() {
  const [
    allProducts,
    allVariants,
    allServices,
    allBundles,
    allCategories,
    allInventory,
  ] = await Promise.all([
    db.select().from(products),
    db.select().from(productVariants),
    db.select().from(services),
    db.select().from(bundles),
    db.select().from(categories),
    db.select().from(inventory),
  ]);

  return NextResponse.json({
    products: allProducts,
    variants: allVariants,
    services: allServices,
    bundles: allBundles,
    categories: allCategories,
    inventory: allInventory,
  });
}
