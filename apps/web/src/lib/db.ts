import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

// Pool-based driver (drizzle-orm/neon-serverless) is required for
// db.transaction() — the HTTP single-shot driver (neon-http) does not
// support multi-statement transactions, which we need for atomic
// sale + sale_lines + inventory decrement writes (POST /api/sales).
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
