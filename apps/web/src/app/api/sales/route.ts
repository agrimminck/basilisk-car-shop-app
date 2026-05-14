import { NextRequest, NextResponse } from "next/server";
import { sql, and, eq, gte } from "drizzle-orm";
import { db } from "../../../lib/db";
import { sales, saleLines, inventory } from "../../../lib/schema";

export async function GET() {
  const allSales = await db.select().from(sales);
  return NextResponse.json(allSales);
}

interface SaleLineInput {
  variantId: string;
  quantity: number | string;
  unitPrice: number | string;
  totalLine?: number | string;
  description?: string;
}

interface SalePostBody {
  branchId: string;
  customerId?: string | null;
  vehicleId?: string | null;
  employeeId?: string | null;
  status?: string;
  totalAmount: number | string;
  discountAmount?: number | string;
  notes?: string | null;
  lines: SaleLineInput[];
}

function validate(body: any): SalePostBody | { error: string } {
  if (!body || typeof body !== "object") return { error: "invalid body" };
  if (!body.branchId || typeof body.branchId !== "string")
    return { error: "branchId required" };
  if (body.totalAmount === undefined || body.totalAmount === null)
    return { error: "totalAmount required" };
  if (!Array.isArray(body.lines) || body.lines.length === 0)
    return { error: "lines required (non-empty array)" };
  for (const line of body.lines) {
    if (!line || typeof line !== "object")
      return { error: "invalid line entry" };
    if (!line.variantId || typeof line.variantId !== "string")
      return { error: "line.variantId required" };
    if (line.quantity === undefined || line.quantity === null)
      return { error: "line.quantity required" };
    if (line.unitPrice === undefined || line.unitPrice === null)
      return { error: "line.unitPrice required" };
  }
  return body as SalePostBody;
}

export async function POST(req: NextRequest) {
  const raw = await req.json();
  const parsed = validate(raw);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const body = parsed;

  try {
    const result = await db.transaction(async (tx) => {
      // 1. Insert sale header
      const [newSale] = await tx
        .insert(sales)
        .values({
          branchId: body.branchId,
          customerId: body.customerId ?? null,
          vehicleId: body.vehicleId ?? null,
          employeeId: body.employeeId ?? null,
          status: body.status ?? "confirmed",
          totalAmount: String(body.totalAmount),
          discountAmount:
            body.discountAmount !== undefined
              ? String(body.discountAmount)
              : "0",
          notes: body.notes ?? null,
        })
        .returning();

      // 2. Insert sale_lines bulk
      const linesToInsert = body.lines.map((line) => {
        const qty = String(line.quantity);
        const unit = String(line.unitPrice);
        const total =
          line.totalLine !== undefined
            ? String(line.totalLine)
            : String(Number(line.quantity) * Number(line.unitPrice));
        return {
          saleId: newSale.id,
          lineType: "product",
          variantId: line.variantId,
          description: line.description ?? "product",
          quantity: qty,
          unitPrice: unit,
          totalLine: total,
        };
      });

      const insertedLines = await tx
        .insert(saleLines)
        .values(linesToInsert)
        .returning();

      // 3. Decrement inventory atomically per line; verify each row updated
      for (const line of body.lines) {
        const updated = await tx
          .update(inventory)
          .set({
            quantity: sql`${inventory.quantity} - ${String(line.quantity)}`,
          })
          .where(
            and(
              eq(inventory.branchId, body.branchId),
              eq(inventory.variantId, line.variantId),
              gte(inventory.quantity, String(line.quantity))
            )
          )
          .returning({ id: inventory.id });

        if (updated.length !== 1) {
          // Triggers rollback of sale + sale_lines + any prior decrements
          throw new InsufficientStockError(line.variantId);
        }
      }

      return { sale: newSale, lines: insertedLines };
    });

    return NextResponse.json(result.sale, { status: 201 });
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return NextResponse.json(
        { error: "insufficient stock", variantId: err.variantId },
        { status: 409 }
      );
    }
    throw err;
  }
}

class InsufficientStockError extends Error {
  constructor(public variantId: string) {
    super(`insufficient stock for variant ${variantId}`);
    this.name = "InsufficientStockError";
  }
}
