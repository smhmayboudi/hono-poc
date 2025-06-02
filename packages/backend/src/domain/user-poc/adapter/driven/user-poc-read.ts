import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { count, sql } from "drizzle-orm";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { userPOC } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import {
  requestQuery,
  requestQueryCount,
} from "../../../../shared/adapter/driven/request-query.ts";
import type {
  PortDrivenUserPOCRead,
  PortDrivenUserPOCReadRequest,
  PortDrivenUserPOCReadResponse,
} from "../../application/port/driven/user-poc-read.ts";

export class AdapterDrivenUserPOCRead implements PortDrivenUserPOCRead {
  constructor(
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  read(
    data: PortDrivenUserPOCReadRequest,
  ): Promise<PortDrivenUserPOCReadResponse> {
    return this.tracer.startActiveSpan("user-poc-read.driven", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-read.driven",
        config: this.config,
        data,
      });
      this.logger.info({});
      const result = await requestQuery(
        data,
        (key) => sql`${userPOC[key as keyof typeof userPOC]}`,
        this.database.db().select().from(userPOC),
      ).execute();
      this.logger.debug({ result });
      const total = await requestQueryCount(
        data,
        (key) => sql`${userPOC[key as keyof typeof userPOC]}`,
        this.database.db().select({ count: count() }).from(userPOC),
      ).execute();
      this.logger.debug({ total });

      return { data: result, pagination: { total: total[0]?.count ?? 0 } };
    });
  }
}
