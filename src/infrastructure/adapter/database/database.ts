import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Logger } from "drizzle-orm/logger";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2";

import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortDatabase } from "../../application/port/database/database.ts";
import * as schema from "../../application/port/database/schema/schema.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

export class Logger2 implements Logger {
  constructor(
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
  ) {}

  logQuery(query: string, params: unknown[]): void {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "logQuery-database.infrastructure",
      config: this.config,
      params,
      query,
    });
    this.logger.debug({});
  }
}

export class Database2 implements PortDatabase {
  constructor(
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
  ) {}

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

  db(): MySql2Database<typeof schema> & {
    $client: Pool;
  } {
    return drizzle(this.pool(), {
      casing: "snake_case",
      logger: new Logger2(this.config, this.logger),
      mode: "default",
      schema,
    });
  }
}

export const database = (config: PortConfig, logger: PortLogger) =>
  tracer.startActiveSpan(
    "database.infrastructure",
    () => new Database2(config, logger),
  );
