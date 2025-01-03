import "dotenv/config";
import { Config, defineConfig } from "drizzle-kit";
import env from "./src/app/config/config";

export default defineConfig({
  schema: "./src/app/db/schema",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.database.pgUrl,
  },
  verbose: true,
  strict: true,
}) satisfies Config;
