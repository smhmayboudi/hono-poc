import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";

import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortDatabase } from "../../application/port/database/database.ts";
import * as schema from "../../application/port/database/schema/schema.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import type { PortTracer } from "../../application/port/opentelemetry/opentelemetry.ts";
import { DatabaseLogger } from "./database-logger.ts";

export class Database2 implements PortDatabase {
  constructor(
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
    // private readonly tracer: PortTracer,
  ) {}

  db(): MySql2Database<typeof schema> {
    return drizzle({
      casing: "snake_case",
      connection: this.config.client().database().uri(),
      logger: new DatabaseLogger(this.config, this.logger),
      mode: "default",
      schema,
    });
  }
}

export const database = (
  config: PortConfig,
  logger: PortLogger,
  tracer: PortTracer,
) =>
  tracer.startActiveSpan(
    "database.infrastructure",
    () => new Database2(config, logger),
  );
