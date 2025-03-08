import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { sql } from "drizzle-orm";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { userPOCInformation } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { requestQuery } from "../../../../shared/adapter/driven/request-query.ts";
import type {
  PortDrivenUserPOCInformationRead,
  PortDrivenUserPOCInformationReadRequest,
  PortDrivenUserPOCInformationReadResponse,
} from "../../application/port/driven/user-poc-information-read.ts";

export class AdapterDrivenUserPOCInformationRead
  implements PortDrivenUserPOCInformationRead
{
  constructor(
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
  ) {}

  read(
    data: PortDrivenUserPOCInformationReadRequest,
  ): Promise<PortDrivenUserPOCInformationReadResponse> {
    return tracer.startActiveSpan(
      "user-poc-information-read.driven",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-read.driven",
          config: this.config,
          data,
        });
        this.logger.info({});
        const result = await requestQuery(
          data,
          (key) =>
            sql`${userPOCInformation[key as keyof typeof userPOCInformation]}`,
          this.database.db().select().from(userPOCInformation),
        ).execute();
        this.logger.debug({ result });

        return result;
      },
    );
  }
}
