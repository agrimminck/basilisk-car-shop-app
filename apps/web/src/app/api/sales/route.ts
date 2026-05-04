import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sales } from "@/lib/schema";

export async function GET() {
  const allSales = await db.select().from(sales);
  return NextResponse.json(allSales);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [newSale] = await db.insert(sales).values(body).returning();
  return NextResponse.json(newSale, { status: 201 });
}
