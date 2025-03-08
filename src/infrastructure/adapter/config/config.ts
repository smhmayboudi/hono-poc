import { z } from "zod";

import { getEnv } from "../../../app.env.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortDatabase } from "../../application/port/config/database.ts";
import type { PortFeature } from "../../application/port/config/feature.ts";
import type { PortServer } from "../../application/port/config/server.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";
import { Database } from "./database.ts";
import { Feature } from "./feature.ts";
import { Server } from "./server.ts";

export class Config implements PortConfig {
  constructor(
    private readonly _database: PortDatabase,
    private readonly _feature: PortFeature,
    private readonly _server: PortServer,
  ) {}

  database(): PortDatabase {
    return this._database;
  }

  feature(): PortFeature {
    return this._feature;
  }

  server(): PortServer {
    return this._server;
  }
}

const envSchema = z.object({
  CLIENT_DATABASE_URI: z
    .string()
    .default(
      "mysql://mysql_user:mysql_password@127.0.0.1:3306/hono-poc?charset=utf8mb4&connectionLimit=1",
    ),
  SERVER_PORT: z.coerce.number().int().nonnegative().lte(65535).default(8081),
});
const env = envSchema.parse(getEnv());

// TODO: service call to get feature flags

export const config = tracer.startActiveSpan(
  "config.infrastructure",
  () =>
    new Config(
      new Database(env.CLIENT_DATABASE_URI),
      new Feature(false),
      new Server(env.SERVER_PORT),
    ),
);
