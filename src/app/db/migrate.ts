import env from "@/app/config/config";
import { logger } from "@/app/utils/logger";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import config from "../../../drizzle.config";
const { Pool } = pg;

const pool = new Pool({
  connectionString: env.database.pgUrl,
});

const db = drizzle(pool);

async function main() {
  if (config.out) {
    await migrate(db, { migrationsFolder: config.out });
    logger.info("Migration done!");
  }
}

main()
  .catch((err) => {
    logger.error(err);
  })
  .finally(async () => {
    await pool.end();
  });
