import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2";

import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortDatabase } from "../../application/port/database/database.ts";
import * as schema from "../../application/port/database/schema/schema.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";
import { DatabaseLogger } from "./database-logger.ts";

export class Database2 implements PortDatabase {
  constructor(
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
  ) {}

  db(): MySql2Database<typeof schema> & {
    $client: Pool;
  } {
    return drizzle(this.pool(), {
      casing: "snake_case",
      logger: new DatabaseLogger(this.config, this.logger),
      mode: "default",
      schema,
    });
  }

  pool(): Pool {
    return createPool({
      // typeCast: (field, next) => {
      //   if (
      //     field.length === 1 &&
      //     field.name === "is_deleted" &&
      //     field.type === "TINY"
      //   ) {
      //     return field.string() === "1";
      //   } else {
      //     return next();
      //   }
      // },
      uri: this.config.database().uri(),
    });
  }
}

export const database = (config: PortConfig, logger: PortLogger) =>
  tracer.startActiveSpan(
    "database.infrastructure",
    () => new Database2(config, logger),
  );
