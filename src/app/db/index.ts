import env from "@/app/config/config";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.database.pgUrl,
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;
