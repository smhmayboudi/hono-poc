/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://orm.drizzle.team/kit-docs/conf
 */

import { z } from "@hono/zod-openapi";
import { defineConfig } from "drizzle-kit";

import { getEnv } from "./src/app.env.ts";

const envSchema = z.object({
  CLIENT_DATABASE_URI: z
    .string()
    .default(
      "mysql://mysql_user:mysql_password@mysql:3306/hono-poc?charset=utf8mb4&connectionLimit=1",
    ),
});
const env = envSchema.parse(getEnv());

export default defineConfig({
  casing: "snake_case",
  dbCredentials: { url: env.CLIENT_DATABASE_URI },
  dialect: "mysql",
  out: "./drizzle/",
  schema: "./src/infrastructure/application/port/database/schema/schema.ts",
  verbose: true,
});
