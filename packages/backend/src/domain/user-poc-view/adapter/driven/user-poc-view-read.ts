import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { count, sql } from "drizzle-orm";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { userPOCView } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import {
  requestQuery,
  requestQueryCount,
} from "../../../../shared/adapter/driven/request-query.ts";
import type {
  PortDrivenUserPOCViewRead,
  PortDrivenUserPOCViewReadRequest,
  PortDrivenUserPOCViewReadResponse,
} from "../../application/port/driven/user-poc-view-read.ts";

export class AdapterDrivenUserPOCViewRead implements PortDrivenUserPOCViewRead {
  constructor(
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  read(
    data: PortDrivenUserPOCViewReadRequest,
  ): Promise<PortDrivenUserPOCViewReadResponse> {
    return this.tracer.startActiveSpan(
      "user-poc-view-read.driven",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-read.driven",
          config: this.config,
          data,
        });
        this.logger.info({});
        const result = (
          await requestQuery(
            data,
            (key) => sql`${userPOCView[key as keyof typeof userPOCView]}`,
            this.database.db().select().from(userPOCView),
          ).execute()
        ).map((value) => ({
          address: String(value.user_poc_information_address),
          age: Number(value.user_poc_information_age),
          fullname: String(value.user_poc_fullname),
          id: String(value.user_poc_id),
        }));
        this.logger.debug({ result });
        const total = await requestQueryCount(
          data,
          (key) => sql`${userPOCView[key as keyof typeof userPOCView]}`,
          this.database.db().select({ count: count() }).from(userPOCView),
        ).execute();
        this.logger.debug({ total });

        return { data: result, pagination: { total: total[0]?.count ?? 0 } };
      },
    );
  }
}
