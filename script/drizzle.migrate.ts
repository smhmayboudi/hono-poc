import path from "node:path";

import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createConnection } from "mysql2";
import { z } from "zod";

import { getEnv } from "../src/app.env.ts";
import * as schema from "../src/infrastructure/application/port/database/schema/schema.ts";

const envSchema = z.object({
  CLIENT_DATABASE_URI: z
    .string()
    .default(
      "mysql://mysql_user:mysql_password@127.0.0.1:3306/hono-poc?charset=utf8mb4&connectionLimit=1",
    ),
});
const env = envSchema.parse(getEnv());
const connection = createConnection({
  uri: env.CLIENT_DATABASE_URI,
});
const db = drizzle(connection, {
  casing: "snake_case",
  logger: true,
  mode: "default",
  schema,
});
await migrate(db, {
  migrationsFolder: path.join(import.meta.dirname, "../drizzle/"),
});
await connection.end();
