import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { sql } from "drizzle-orm";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { userPOC } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { requestQuery } from "../../../../shared/adapter/driven/request-query.ts";
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
  ) {}

  read(
    data: PortDrivenUserPOCReadRequest,
  ): Promise<PortDrivenUserPOCReadResponse> {
    return tracer.startActiveSpan("user-poc-read.driven", async () => {
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

      return result;
    });
  }
}
