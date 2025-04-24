import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Logger } from "drizzle-orm";

import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";

export class DatabaseLogger implements Logger {
  constructor(
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
    // private readonly tracer: PortTracer,
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
